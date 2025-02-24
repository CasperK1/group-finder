const jwt = require('jsonwebtoken');
const socketIO = require('socket.io');
const {corsOptions} = require("../config/config.js");
const Message = require('../models/Message');
const User = require('../models/User');
const Group = require('../models/Group');

const usersOnline = new Map()

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: corsOptions
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication failed'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.isVerified) {
        return next(new Error('User not found or not verified'));
      }

      socket.user = {
        id: user._id,
        username: user.username
      };
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.user.username}`);
    io.emit('message:bot', `Client connected: ${socket.user.username}`);


    // Send group chat message
    socket.on('message:group', (data) => {
      try{

      let message = new Message(

      )
      io.emit('message:group', {

      })
      } catch (error) {
        socket.emit('error', 'Error sending message');
      }
    });


    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.user.username}`);
    })
  })

  return io;
}

module.exports = initializeSocket;