const express = require('express');
const http = require('http');
const bodyparser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;

const userAuthen = require('./routes/AuthenRoutes');
const projectRoom = require('./routes/ProjectRoomRoute');
const database = require('./database/databaseSetup');

const app = express();
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);


// socketio setup:
// use to track which user got which socket id, so that each has different socket id 
const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    }); // map type
}

// socket connection - server side
// same hume client side banana h
io.on('connection', (socket)=>{
    // console.log('User Connected: ', socket.id);

    socket.on('join', ({roomId, username}) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);   // if room id is there, it will add the user in it, or will first create room then add

        // send notification to all clienets
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });


    // disconnection logic
    socket.on('disconnecting', ()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id]
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});


// Middlewares
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/userAuthen', userAuthen);
app.use('/projectRoom', projectRoom);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
server.listen(port, () => {
    console.log('Server is running on port 3000');
});
