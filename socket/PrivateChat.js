const { saveMessage, getPendingMessages, markDelivered} = require('../model/ChatDB');


module.exports = async (io, sessionMiddleware) => {
  
  const onlineUsers = new Map();
  let active = [];
  
  // Session 
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });
  
  //middleware
 io.use((socket, next) => {
    const req = socket.request;
    if (req.session.user) {
      
  console.log("yes session");
      return next()
      
    }
   
  console.log("no session");
  }); 
  
  
  // Socket.io connection
  io.on("connection", async (socket) => {
    const session = socket.request.session;
    const userId = session.user.id;
    const username = session.user.username;
    //console.log("session", username);
    //console.log(onlineUsers)
    //setonline
    onlineUsers.set(String(userId), socket.id);
    active = [];
    active.push({name: username});
   // active
   
   io.emit("active", active)
    
    // Send pending offline messages
  const pending = await getPendingMessages(userId);
  pending.forEach(msg => {
    socket.emit('private_message', msg);
    markDelivered(msg.id);
  });
    
    
    
    socket.on('private_message', async ({ fromUser, sendid, message }) => {
      const jj = await getPendingMessages(sendid);
      console.log(" msdd", jj);
    // Save message
  const delivered = onlineUsers.has(String(sendid)) ? 1 : 0;

   await saveMessage(userId, sendid, message, delivered);  


    // Send to receiver if online
    const socketId = onlineUsers.get(String(sendid));
    
    
    if (socketId) {
      io.to(socketId).emit('private_message', { fromUser, message });
      
    }
  });
    
    
    socket.on("disconnect", () => {
    for (let [userId, sId] of onlineUsers) {
      if (sId === socket.id) onlineUsers.delete(userId);
    }
    console.log("user delete", );
  }); 
    
    
  })
  
  



  
}