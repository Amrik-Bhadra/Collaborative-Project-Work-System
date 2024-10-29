const mongoose = require('mongoose');
const projectRoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    projectDomain: {
        type: String,
        required: true
    },
    roomPassword: {
        type: String,
        required: true
    },
    members: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['creator', 'collaborator'], default: 'collaborator' }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    roomCode: {
        type: String,
        unique: true,
    },
});

const ProjectRoomSchema = mongoose.model('ProjectRoomSchema', projectRoomSchema);
module.exports = ProjectRoomSchema;