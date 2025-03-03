const jwt = require("jsonwebtoken");
const socketIO = require("socket.io");
const {corsOptions} = require("../config/config.js");
const Message = require("../models/Message");
const User = require("../models/User");
const Group = require("../models/Group");
const mongoose = require("mongoose");
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

    /*
      Join group chat room
     */
    socket.on("chat:join", async ({groupId}) => {
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
          user: {id: userId, username: socket.user.username},
        });

        // Send confirmation to the user
        socket.emit("chat:joined", {groupId, groupName});

        // Auto-load recent messages
        const recentMessages = await Message.find({groupId})
          .sort({createdAt: -1})
          .limit(150)
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
              "readBy.user": {$ne: userId},
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

    /*
      Leave chat room
     */
    socket.on("chat:leave", ({groupId}) => {
      const roomId = `group:${groupId}`;

      socket.to(roomId).emit("message:bot", {
        message: `${socket.user.username} left the room`,
        user: {id: userId, username: socket.user.username},
      });

      socket.leave(roomId);
    });

    // Send group chat message
    socket.on("message:group", async (data) => {
      try {
        const {
          groupId,
          text,
          mentions = [],
          formatting = {},
          attachments = [],
        } = data;

        if (!mongoose.Types.ObjectId.isValid(groupId)) {
          return socket.emit("error", "Invalid group ID");
        }
        if (!text && attachments.length === 0) {
          return socket.emit("error", "Message cannot be empty");
        }
        // Verify user is a member of the group
        const group = await Group.findOne({
          _id: groupId,
          members: userId,
        });
        if (!group) {
          return socket.emit("error", "You are not a member of this group");
        }
        const roomId = `group:${groupId}`;

        // Process mentions and notify mentioned users
        const processedMentions = [];
        if (mentions && mentions.length > 0) {
          for (const mention of mentions) {
            if (mongoose.Types.ObjectId.isValid(mention.userId)) {
              processedMentions.push({
                user: mention.userId,
                username: mention.username,
              });
            }
          }
        }
        const message = new Message({
          sender: {
            userId: userId,
            username: socket.user.username,
          },
          groupId: groupId,
          content: {
            text: text,
            mentions: processedMentions,
            formatting: formatting,
          },
          attachments: attachments,
          readBy: [{user: userId, readAt: new Date()}],
        });
        await message.save();

        // Broadcast message to all users in the room
        io.to(roomId).emit("message:new", {
          message: {
            _id: message._id,
            sender: {
              userId: userId,
              username: socket.user.username,
            },
            groupId: groupId,
            content: {
              text: text,
              mentions: processedMentions,
              formatting: formatting,
            },
            attachments: attachments,
            createdAt: message.createdAt,
            readBy: message.readBy,
          },
        });

        // Send notifications to mentioned users
        if (processedMentions.length > 0) {
          notifyMentionedUsers(io, processedMentions, {
            messageId: message._id,
            groupId: groupId,
            senderName: socket.user.username,
            text: text,
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Error sending message");
      }
    });

    /*
      Edit message
     */
    socket.on("message:edit", async ({ messageId, text, formatting }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(messageId)) {
          return socket.emit("error", "Invalid message ID");
        }

        const message = await Message.findById(messageId);

        if (!message) {
          return socket.emit("error", "Message not found");
        }

        // Check if user is the message sender
        if (message.sender.userId.toString() !== userId.toString()) {
          return socket.emit("error", "You can only edit your own messages");
        }

        // Update message
        message.content.text = text;
        if (formatting) {
          message.content.formatting = formatting;
        }
        message.edited = true;
        message.editedAt = new Date();

        await message.save();

        // Broadcast edited message
        io.to(`group:${message.groupId}`).emit("message:edited", {
          messageId: message._id,
          text: text,
          formatting: message.content.formatting,
          editedAt: message.editedAt
        });
      } catch (error) {
        console.error("Error editing message:", error);
        socket.emit("error", "Failed to edit message");
      }
    });

    /*
      Delete message
     */
    socket.on("message:delete", async ({messageId}) => {
      if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return socket.emit("error", "Invalid  ID");
      }

      try {
        const message = await Message.findById(messageId);

        if (!message) {
          return socket.emit("error", "Message not found");
        }

        // Check if user is the message sender
        if (message.sender.userId.toString() !== userId.toString()) {
          return socket.emit("error", "You can only delete your own messages");
        }

        message.deleted = true;
        message.deletedAt = new Date();
        message.content.text = "This message has been deleted";

        await message.save();

        // Broadcast deleted message
        io.to(`group:${message.groupId}`).emit("message:deleted", {
          messageId: message._id,
          deletedAt: message.deletedAt,
        });
      } catch (error) {
        console.error("Error deleting message:", error);
        socket.emit("error", "Error deleting message");
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.user.username}`);
      // Remove user from online users map
      usersOnline.delete(userId.toString());

    });
  });

  return io;
};

function notifyMentionedUsers(io, mentions, messageInfo) {
  mentions.forEach((mention) => {
    const mentionedUserId = mention.user.toString();

    // Check if mentioned user is online
    if (usersOnline.has(mentionedUserId)) {
      const socketId = usersOnline.get(mentionedUserId).socketId;

      // Send notification to mentioned user
      io.to(socketId).emit("user:mentioned", {
        messageId: messageInfo.messageId,
        groupId: messageInfo.groupId,
        senderName: messageInfo.senderName,
        text: messageInfo.text,
      });
    }
  });
}

module.exports = initializeSocket;
