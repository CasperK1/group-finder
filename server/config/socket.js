const jwt = require("jsonwebtoken");
const socketIO = require("socket.io");
const { corsOptions } = require("../config/config.js");
const Message = require("../models/Message");
const User = require("../models/User");
const Group = require("../models/Group");

const usersOnline = new Map();

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: corsOptions,
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication failed"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.isVerified) {
        return next(new Error("User not found or not verified"));
      }

      socket.user = {
        id: user._id,
        username: user.username,
      };
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    // Add user to online users map
    usersOnline.set(userId.toString(), {
      socketId: socket.id,
      username: socket.user.username,
      lastActive: new Date(),
    });
    console.log(`User connected: ${socket.user.username}`);

    socket.on("chat:join", async ({ groupId }) => {
      try {
        // Verify user is a member of the group
        const group = await Group.findOne({
          _id: groupId,
          members: userId,
        });
        if (!group) {
          return socket.emit("error", "You are not a member of this group");
        }

        const roomId = `group:${groupId}`;
        const groupName = group.information.name;

        // Join the room
        socket.join(roomId);
        console.log(`${socket.user.username} joined room: ${roomId}`);

        // Notify room members
        socket.to(roomId).emit("message:bot", {
          message: `${socket.user.username} joined the room`,
          user: { id: userId, username: socket.user.username },
        });

        // Send confirmation to the user
        socket.emit("chat:joined", { groupId, groupName });

        // Auto-load recent messages
        const recentMessages = await Message.find({ groupId })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        socket.emit("messages:history", {
          groupId,
          messages: recentMessages.reverse(),
        });

        // Mark messages as read
        if (recentMessages.length > 0) {
          await Message.updateMany(
            {
              groupId,
              "readBy.user": { $ne: userId },
            },
            {
              $push: {
                readBy: {
                  user: userId,
                  readAt: new Date(),
                },
              },
            }
          );

          // Notify others that messages were read
          socket.to(roomId).emit("messages:read", {
            groupId,
            userId,
            username: socket.user.username,
            readAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("error", "Failed to join chat room");
      }
    });

    // Leave chat room
    socket.on("chat:leave", ({ groupId }) => {
      const roomId = `group:${groupId}`;

      socket.to(roomId).emit("message:bot", {
        message: `${socket.user.username} left the room`,
        user: { id: userId, username: socket.user.username },
      });

      socket.leave(roomId);
      console.log(`${socket.user.username} left room: ${roomId}`);
    });

    // Send group chat message
    socket.on("message:group", async (data) => {
      try {
        let message = new Message();
        io.emit("message:group", {});
      } catch (error) {
        socket.emit("error", "Error sending message");
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.user.username}`);
    });
  });

  return io;
};

module.exports = initializeSocket;
