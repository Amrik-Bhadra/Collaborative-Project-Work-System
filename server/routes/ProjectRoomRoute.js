const express = require('express');
const router = express.Router();
const mailSetup = require('../functions/mailer.js');
const crypto = require('crypto');
const { jwtAuthMiddleware } = require('../middleware/jwtSetup.js');

// const db = require('../database/databaseSetup.js');
// database schemas
const ProjectRoomSchema = require('../model/ProjectRoomSchema');
const User = require('../model/UserSchema.js');

// Generate a random room code
const generateRoomCode = () => {
    return crypto.randomBytes(4).toString('hex');
};

// Check if room code already exists in the database
const isRoomCodeUnique = async (roomCode) => {
    const existingRoom = await ProjectRoomSchema.findOne({ roomCode });
    return !existingRoom;
};

// Protect the route with JWT middleware
router.post('/createProject', jwtAuthMiddleware, async (req, res) => {
    const { projectTitle, projectDescription, projectDomain, members, roomPassword } = req.body;
    const userId = req.user.id;

    console.log('user id: ', userId);

    // Generate a unique room code
    let roomCode;
    do {
        roomCode = generateRoomCode();
    } while (!(await isRoomCodeUnique(roomCode)));

    console.log('room code is: ', roomCode);

    const projectRoom = new ProjectRoomSchema({
        title: projectTitle,
        description: projectDescription,
        projectDomain: projectDomain,
        roomPassword: roomPassword,
        members: [{ userId, role: 'creator' }],
        createdAt: new Date(),
        updatedAt: new Date(),
        roomCode: roomCode
    });

    try {
        await projectRoom.save();
        console.log('Success in creating project');

        // Add the created room's ID to the user's createdRooms array
        await User.findByIdAndUpdate(userId, {
            $push: { createdRooms: projectRoom._id }
        });

        // Send emails to members
        try {
            await mailSetup.sendRoomCodeAndPassword(members, roomCode, roomPassword, projectTitle);
        } catch (error) {
            console.error('Failed to send email to members:', error);
        }
        
        res.status(201).json({ message: 'Successfully created' }); // Changed status code to 201 for resource creation
    } catch (err) {
        console.error('Error in creating project:', err); // Use console.error for errors
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// route to get projects created/joined by user
router.get('/getProjectRooms', jwtAuthMiddleware, async (req, res) => {
    const userId = req.user.id;
    console.log(`User ID: ${userId}`);

    try {
        const projectRooms = await ProjectRoomSchema.find({
            members: { $elemMatch: { userId: userId } }
        });

        console.log('Project Rooms:', projectRooms);

        if (!projectRooms.length) {
            return res.status(404).json({ message: 'No project rooms found for this user.' });
        }

        const userInfo = await User.findOne({_id: userId});

        res.status(200).json({projectRooms, userInfo});
    } catch (err) {
        console.error('Error fetching project rooms:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// route to get detail information of any project room
router.get('/getProjectRoomDetail/:roomCode', jwtAuthMiddleware, async (req, res) => {
    const roomCode = req.params.roomCode;  
    const userId = req.user.userId;  

    try {
        if (!roomCode) {
            return res.status(400).json({ message: "Invalid room code" });
        }

        const projectDetails = await ProjectRoomSchema.findOne({ roomCode: roomCode });
        // console.log('project detail: ',projectDetails);

        if (!projectDetails) {
            return res.status(404).json({ message: "Project room not found" });
        }

        console.log('project members: ',projectDetails.members);
        const memberIds = [];
        projectDetails.members.forEach(member => {
            memberIds.push(member.userId);
        });
        console.log('members id: ', memberIds);
        const membersInfo = await User.find({ _id: { $in: memberIds } });

        console.log('membersInfo: ', membersInfo);

        res.json({ projectDetails, membersInfo });
        
    } catch (error) {
        console.error("Error fetching project room details:", error);
        res.status(500).json({ message: "Error fetching project room details" });
    }
});


// Route to join a project room
router.post('/joinProjectRoom', jwtAuthMiddleware, async (req, res) => {
    try {
        const { roomCode, roomPassword } = req.body;
        const userId = req.user.id; 
        const projectRoom = await ProjectRoomSchema.findOne({ roomCode });

        if (!projectRoom) {
            console.log('project room not found')
            return res.status(404).json({ message: "Project room not found" });
        }

        if (projectRoom.roomPassword !== roomPassword) {
            console.log('incorrect password');
            return res.status(401).json({ message: "Incorrect password" });
        }

        if (projectRoom.members.includes(userId)) {
            console.log('User already a member');
            return res.status(400).json({ message: "User is already a member of this project room" });
        }

        projectRoom.members.push({ userId, role: 'collaborator' });
        
        // Save the updated project room document
        await projectRoom.save();

        // Return success message
        res.status(200).json({ message: "Joined project room successfully" });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
