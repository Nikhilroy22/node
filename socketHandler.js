// socketHandler.js
const { gameState, startGame } = require('./crashGame');

module.exports = (io, sessionMiddleware) => {
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.use((socket, next) => {
    const req = socket.request;
    if (!req.session.user) {
      console.log("❌ Unauthorized socket connection");
      socket.login = "Not";
      //return next(new Error("Authentication required"));
      return next();
      
    }
    
    socket.username = req.session.user.username;
    console.log("✅ User connected:", socket.username);
   // console.log(req.session)
    
  return  next();
  });

  const activeUsers = new Map();

  io.on("connection", (socket) => {
    activeUsers.set(socket.id, socket.username);
    console.log(socket.login);
    io.emit("activeUsers", Array.from(activeUsers.values()));

    socket.on("chat message", (msg) => {
      io.emit("chat message", { user: socket.username, text: msg });
    });
    
    

    socket.on("placeBet", (data) => {
      if (!gameState.isRunning) {
        return socket.emit('error', { message: 'গেম চলমান নেই!' });
      }

      const existingPlayer = gameState.players.find(p => p.id === socket.id);
      if (existingPlayer) {
        return socket.emit('error', { message: 'আপনি ইতিমধ্যে বেট করেছেন!' });
      }

      const player = {
        id: socket.id,
        name: socket.username || "nikhil",
        amount: parseFloat(data.amount),
        betTime: new Date(),
        cashOutMultiplier: null,
        hasCashedOut: false,
        autoCashout: data.autoCashout || null
      };

      gameState.players.push(player);
      console.log(`💰 Bet placed: ${player.name} - ${player.amount} টাকা`);

      io.emit('playerJoined', { player, totalPlayers: gameState.players.length });
      socket.emit('betSuccess', { message: `বেট সফল! ${player.amount} টাকা` });
    });

    socket.on("cashOut", () => {
      const player = gameState.players.find(p => p.id === socket.id);
      if (!player || player.hasCashedOut) return;

      player.cashOutMultiplier = gameState.currentMultiplier;
      player.hasCashedOut = true;
      const winAmount = parseFloat((player.amount * gameState.currentMultiplier).toFixed(2));

      socket.emit('cashOutSuccess', { amount: winAmount, multiplier: gameState.currentMultiplier });
      io.emit('playerCashedOut', { player, winAmount, multiplier: gameState.currentMultiplier });
    });

    socket.on("getGameState", () => {
      socket.emit('gameState', {
        isRunning: gameState.isRunning,
        currentMultiplier: gameState.currentMultiplier,
        players: gameState.players,
        history: gameState.history.slice(0, 10),
        gameId: gameState.gameId
      });
    });

    socket.on("disconnect", () => {
      activeUsers.delete(socket.id);
      io.emit("activeUsers", Array.from(activeUsers.values()));
      console.log("❌ User disconnected:", socket.username || "null");
    });
  });

  // প্রথম গেম শুরু
  setTimeout(() => startGame(io), 1000);
};