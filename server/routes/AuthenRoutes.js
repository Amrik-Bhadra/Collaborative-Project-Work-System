const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../database/databaseSetup');
const User = require('../model/UserSchema');
const{jwtAuthMiddleware, generateToken} = require('../middleware/jwtSetup');

// Registration submission route
router.post('/registrationSubmission', async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword 
        });

        console.log(`name: ${name}, username: ${username}, email: ${email}, password: (hashed)`);

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        console.log('User successfully registered');
    } catch (err) {
        res.status(500).send(`Error occurred: ${err}`);
        console.error('Error during registration:', err);
    }
});

// login route
router.post('/loginSubmission', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate a JWT token
        const userData = {
            id: user._id,
            email: user.email
        };

        const token = generateToken(userData);

        // Send the token and user data to the client
        return res.status(200).json({ message: 'Login successful', token, id: userData.id });
    } catch (err) {
        res.status(500).send(`Error occurred: ${err}`);
        console.error('Error during login:', err);
    }
});

// Export the router
module.exports = router;
