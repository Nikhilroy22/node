const WebSocket = require("ws");

const {
  saveMessage,
  getPendingMessages,
  markDelivered,
  getRecentChats
} = require("../model/ChatDB");

module.exports = (wss) => {

  

  // userId => { ws, username, userid }
  const onlineUsers = new Map();

  

  /* =====================
     CONNECTION
  ====================== */
  wss.on("connection", async (ws, req) => {

    const { id: userId, username } = req.session.user;
    const uid = String(userId);

    console.log(`✅ ${username} connected`);

    // save online user
    onlineUsers.set(uid, {
      ws,
      username,
      userid: userId
    });

    broadcastActiveUsers();

    /* =====================
       SEND RECENT CHATS
    ====================== */
    try {
      const recentChats = await getRecentChats(userId);
      ws.send(JSON.stringify({
        type: "recent_chats",
        chats: recentChats
      }));
    } catch (err) {
      console.error("Recent chat error:", err);
    }

    /* =====================
       SEND OFFLINE MSG
    ====================== */
    try {
      const pending = await getPendingMessages(userId);

      for (const msg of pending) {
        ws.send(JSON.stringify({
          type: "private_message",
          fromUser: msg.from_user,
          message: msg.message,
          offline: true
        }));

        await markDelivered(msg.id);
      }
    } catch (err) {
      console.error("Pending message error:", err);
    }

    /* =====================
       MESSAGE HANDLER
    ====================== */
    ws.on("message", async (data) => {
      let payload;
      try {
        payload = JSON.parse(data);
      } catch {
        return;
      }

      if (payload.type !== "private_message") return;

      const { sendid, message } = payload;
      if (!sendid || !message) return;

      const receiverId = String(sendid);
      const receiver = onlineUsers.get(receiverId);
      const delivered = receiver ? 1 : 0;

      // save message
      await saveMessage(userId, sendid, message, delivered);

      // send to receiver if online
      if (receiver) {
        receiver.ws.send(JSON.stringify({
          type: "private_message",
          fromUser: userId,
          message
        }));

        // update receiver recent chats
        const rChats = await getRecentChats(sendid);
        receiver.ws.send(JSON.stringify({
          type: "recent_chats",
          chats: rChats
        }));
      }

      // update sender recent chats
      const sChats = await getRecentChats(userId);
      ws.send(JSON.stringify({
        type: "recent_chats",
        chats: sChats
      }));
    });

    /* =====================
       DISCONNECT
    ====================== */
    ws.on("close", () => {
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

      const msg = JSON.stringify({
        type: "active_users",
        users
      });

      onlineUsers.forEach(u => {
        if (u.ws.readyState === WebSocket.OPEN) {
          u.ws.send(msg);
        }
      });
    }
  });
};