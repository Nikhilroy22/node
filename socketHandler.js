// socketHandler.js
module.exports = (io, sessionMiddleware) => {
  
  // socket.io তে session share করা
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  // Session থেকে ইউজার validate
  io.use((socket, next) => {
    const req = socket.request;

    if (!req.session.user) {
      console.log("❌ Unauthorized socket connection");
      return next(new Error("Authentication required"));
    }

    socket.username = req.session.user.username; // session থেকে attach
    console.log("✅ User connected:", socket.username);

    next();
  });
  
  
  const activeUsers = new Map();

  // Connection events
  io.on("connection", (socket) => {
    
    // ইউজারকে active list এ যোগ করা
  activeUsers.set(socket.id, socket.username);
    
    console.log("📡 Real-time chat connection established");
    
    
    // নতুন active list সব client কে পাঠানো
  io.emit("activeUsers", Array.from(activeUsers.values()));
    

    socket.on("chat message", (msg) => {
      io.emit("chat message", {
        user: socket.username,
        text: msg
      });
    });

    socket.on("disconnect", () => {
      
      
      console.log("❌ User disconnected:", socket.username);
      
      activeUsers.delete(socket.id, socket.username);
    console.log("❌ User disconnected:", socket.username);
    io.emit("activeUsers", Array.from(activeUsers.values()));
      
    });
  });
};