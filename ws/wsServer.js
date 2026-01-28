const clients = new Map();      // online users
const messages = [];           // all messages (memory)
const chatUsers = new Map();   // recent chat users (online + offline)
const lastSeen = new Map();    // 🔥 last active time

/*
messages = [
  { from, to, message, time, readBy: [] }
]

chatUsers = {
  userId: { id, name }
}
*/

module.exports = function initWebSocket(wss) {

  wss.on("connection", (ws, req) => {

    const user = req.session?.user || null;
    const userId = user ? user.id : `guest_${Date.now()}`;

    ws.userId = userId;
    ws.username = user ? user.username : "guest";

    /* ===== ONLINE ADD ===== */
    clients.set(userId, ws);

    chatUsers.set(userId, {
      id: userId,
      name: ws.username
    });

    // 🔥 user just active now
    lastSeen.set(userId, Date.now());

    /* ===== INIT ===== */
    ws.send(JSON.stringify({
      type: "init",
      selfId: ws.userId
    }));

    sendUsersToAll();

    console.log("✅ Connected:", ws.username);

    ws.on("close", () => {
      clients.delete(ws.userId);

      // 🔥 save last active time
      lastSeen.set(ws.userId, Date.now());

      sendUsersToAll();
      console.log("❌ Disconnected:", ws.username);
    });

    /* =========================
       MESSAGE HANDLER
    ========================= */
    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data);

        /* 🔹 CHAT HISTORY (MARK READ) */
        if (msg.type === "chat_history") {

          const withUser = msg.with;

          // 🔥 mark unread → read
          messages.forEach(m => {
            if (
              m.from === withUser &&
              m.to === ws.userId &&
              !m.readBy.includes(ws.userId)
            ) {
              m.readBy.push(ws.userId);
            }
          });

          const history = messages.filter(m =>
            (m.from === ws.userId && m.to === withUser) ||
            (m.from === withUser && m.to === ws.userId)
          );

          ws.send(JSON.stringify({
            type: "chat_history",
            with: withUser,
            messages: history
          }));

          sendUsersToAll(); // 🔄 refresh unread + last active
          return;
        }

        /* 🔒 PRIVATE MESSAGE */
        if (msg.type === "private_message") {

          const messageObj = {
            from: ws.userId,
            to: msg.to,
            message: msg.message,
            time: Date.now(),
            readBy: [ws.userId]
          };

          messages.push(messageObj);

          // 🔹 recent chat list update
          chatUsers.set(ws.userId, {
            id: ws.userId,
            name: ws.username
          });

          if (!chatUsers.has(msg.to)) {
            chatUsers.set(msg.to, {
              id: msg.to,
              name: "Unknown"
            });
          }

          const toWs = clients.get(msg.to);

          // 🔹 realtime send if online
          if (toWs && toWs.readyState === 1) {
            toWs.send(JSON.stringify({
              type: "private_message",
              from: ws.userId,
              fromName: ws.username,
              message: msg.message,
              time: messageObj.time
            }));
          }

          sendUsersToAll();
          return;
        }

      } catch (err) {
        console.error("WS message error", err);
      }
    });
  });

  /* =========================
     HELPERS
  ========================= */

  function getUserList(forUserId) {

    return Array.from(chatUsers.values())
      .filter(u => u.id !== forUserId)
      .map(u => {

        const lastMsg = [...messages]
          .reverse()
          .find(m =>
            (m.from === forUserId && m.to === u.id) ||
            (m.from === u.id && m.to === forUserId)
          );

        const unreadCount = messages.filter(m =>
          m.from === u.id &&
          m.to === forUserId &&
          !m.readBy.includes(forUserId)
        ).length;

        return {
          id: u.id,
          name: u.name,
          online: clients.has(u.id),
          lastSeen: lastSeen.get(u.id) || null,   // 🔥 NEW
          lastText: lastMsg ? lastMsg.message : "",
          lastTime: lastMsg ? lastMsg.time : 0,
          unread: unreadCount
        };
      })
      .sort((a, b) => b.lastTime - a.lastTime);
  }

  function sendUsersToAll() {
    for (const client of clients.values()) {
      if (client.readyState === 1) {
        client.send(JSON.stringify({
          type: "users",
          users: getUserList(client.userId)
        }));
      }
    }
  }
};