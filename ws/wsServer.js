// ws/wsServer.js
const WebSocket = require("ws");

module.exports = function initWebSocket(server, sessionMiddleware) {

  const wss = new WebSocket.Server({ noServer: true });

  /* =====================
     HTTP → WS UPGRADE
  ====================== */
 /* server.on("upgrade", (req, socket, head) => {

    sessionMiddleware(req, {}, () => {
      // ❗ এখানে আর reject করবো না
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    });

  }); */

  /* =====================
     WS CONNECTION
  ====================== */
  wss.on("connection", (ws, req) => {

    // ✅ session থাকলে user, না থাকলে guest
    const user = req.session?.user || null;

    if (user) {
      console.log("✅ WS Connected (User):", user.username);
    } else {
      console.log("🟡 WS Connected (Guest)");
    }

    ws.send(JSON.stringify({
      type: "welcome",
      user: user ? user.username : "guest"
    }));

    ws.on("message", (data) => {
      const msg = data.toString();
      console.log("📩", msg);

      ws.send(JSON.stringify({
        type: "echo",
        from: user ? user.username : "guest",
        message: msg
      }));
    });

    ws.on("close", () => {
      console.log("❌ WS Disconnected:", user ? user.username : "guest");
    });
  });

};