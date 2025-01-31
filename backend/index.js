require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/Chat');
const socketHandler = require('./socketHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

/* for deployment later */
app.use(cors({
    origin: 'https://chattidong.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// Routes
app.use('/chatapp', chatRoutes);

// Database Connection
connectDB();

// Start HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "https://chattidong.netlify.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
