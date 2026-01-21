const {
  saveMessage,
  getPendingMessages,
  markDelivered
} = require('../model/ChatDB');

module.exports = (io) => {

  // userId => { socketId, username, userid }
  const onlineUsers = new Map();

  /* =====================
     SESSION CHECK
  ====================== */
  io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.user) {
      return next();
    }
    return next(new Error("Unauthorized"));
  });

  /* =====================
     CONNECTION
  ====================== */
  io.on("connection", async (socket) => {
    const { id: userId, username } = socket.request.session.user;
    const uid = String(userId);

    console.log(`✅ ${username} connected`);

    // Save online user
    onlineUsers.set(uid, {
      socketId: socket.id,
      username,
      userid: userId
    });

    // Broadcast active users
    broadcastActiveUsers();

    /* =====================
       SEND OFFLINE MESSAGES
    ====================== */
    try {
      const pending = await getPendingMessages(userId);

      for (const msg of pending) {
        socket.emit("private_message", {
          fromUser: msg.from_user,
          message: msg.message,
          offline: true
        });

        await markDelivered(msg.id);
      }
    } catch (err) {
      console.error("Pending message error:", err);
    }

    /* =====================
       PRIVATE MESSAGE
    ====================== */
    socket.on("private_message", async ({ sendid, message }) => {
      if (!sendid || !message) return;

      const receiverId = String(sendid);
      const receiver = onlineUsers.get(receiverId);
      const delivered = receiver ? 1 : 0;

      // Save message
      await saveMessage(userId, sendid, message, delivered);

      // Send to receiver if online
      if (receiver) {
        io.to(receiver.socketId).emit("private_message", {
          fromUser: userId,
          message
        });
      }
    });

    /* =====================
       DISCONNECT
    ====================== */
    socket.on("disconnect", () => {
      onlineUsers.delete(uid);
      console.log(`❌ ${username} disconnected`);
      broadcastActiveUsers();
    });

    /* =====================
       HELPERS
    ====================== */
    function broadcastActiveUsers() {
      const users = Array.from(onlineUsers.values()).map(u => ({
        username: u.username,
        userid: u.userid
      }));
      io.emit("active_users", users);
    }
  });
};