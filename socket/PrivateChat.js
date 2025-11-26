const { saveMessage, getPendingMessages, markDelivered } = require('../model/ChatDB');

module.exports = async (io, sessionMiddleware) => {
  const onlineUsers = new Map(); // userId => { socketId, username }

  // Session middleware
 

  // Check session
  io.use((socket, next) => {
    const req = socket.request;
    if (req.session && req.session.user) {
      console.log("yes session");
      return next();
    }
    console.log("no session");
  });

  // Connection
  io.on("connection", async (socket) => {
    const session = socket.request.session;
    const userId = session.user.id;
    const username = session.user.username;

    // Online user set
    onlineUsers.set(String(userId), { socketId: socket.id, username, userid:  userId});

    // Active user list তৈরি
    const activeUsers = Array.from(onlineUsers.values()).map(u => ({
      username: u.username, userid: u.userid
    }));

    // সবাইকে active list পাঠানো হবে
    io.emit("active_users", activeUsers);

    // Send pending offline messages
    const pending = await getPendingMessages(userId);
    pending.forEach(msg => {
      socket.emit('private_message', msg);
      markDelivered(msg.id);
    });

    // Private message handle
    socket.on('private_message', async ({ fromUser, sendid, message }) => {
      const delivered = onlineUsers.has(String(sendid)) ? 1 : 0;

      await saveMessage(userId, sendid, message, delivered);

      // Send to receiver if online
      const receiver = onlineUsers.get(String(sendid));
      if (receiver) {
        io.to(receiver.socketId).emit('private_message', { fromUser, message });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(String(userId));
      console.log(`${username} disconnected`);

      // Disconnect হলে নতুন active list পাঠানো হবে
      const activeUsers = Array.from(onlineUsers.values()).map(u => ({
        username: u.username
      }));

      io.emit("active_users", activeUsers);
    });
  });
};