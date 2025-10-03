const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Static files সার্ভ করা
app.use(express.static(path.join(__dirname, 'public')));

// গেম স্টেট
let gameState = {
    isRunning: false,
    currentMultiplier: 1.00,
    crashPoint: 0,
    players: [],
    history: [],
    gameId: 1
};

// মডিফাইড ক্র্যাশ পয়েন্ট জেনারেটর - 50x এর নিচেই বেশি আসবে
function generateCrashPoint() {
    const rand = Math.random();
    
    // প্রোবাবিলিটি ডিস্ট্রিবিউশন:
    // 80% chance: 1x - 10x
    // 15% chance: 10x - 30x  
    // 4% chance: 30x - 50x
    // 1% chance: 50x - 100x
    
    let crashPoint;
    
    if (rand < 0.80) {
        // 80% - Low multipliers (1x - 10x)
        crashPoint = 1 + (Math.random() * 9);
    } else if (rand < 0.95) {
        // 15% - Medium multipliers (10x - 30x)
        crashPoint = 10 + (Math.random() * 20);
    } else if (rand < 0.99) {
        // 4% - High multipliers (30x - 50x)
        crashPoint = 30 + (Math.random() * 20);
    } else {
        // 1% - Very high multipliers (50x - 100x)
        crashPoint = 50 + (Math.random() * 50);
    }
    
    crashPoint = parseFloat(crashPoint.toFixed(2));
    
    // Additional control to ensure most games crash below 50x
    const extraControl = Math.random();
    if (extraControl < 0.85 && crashPoint > 30) {
        crashPoint = 10 + (Math.random() * 20); // Force back to medium range
    }
    
    console.log(`🎯 Generated Crash Point: ${crashPoint}x`);
    return crashPoint;
}

// গেম শুরু
function startGame() {
    gameState.isRunning = true;
    gameState.currentMultiplier = 1.00;
    gameState.crashPoint = generateCrashPoint();
    gameState.players = [];
    
    console.log(`🎮 Game ${gameState.gameId} Started`);
    console.log(`📊 Crash Point: ${gameState.crashPoint}x`);
    console.log(`📈 Category: ${getMultiplierCategory(gameState.crashPoint)}`);
    
    io.emit('gameStart', {
        gameId: gameState.gameId,
        crashPoint: gameState.crashPoint,
        category: getMultiplierCategory(gameState.crashPoint)
    });

    let gameStartTime = Date.now();
    
    const gameInterval = setInterval(() => {
        if (!gameState.isRunning) {
            clearInterval(gameInterval);
            return;
        }
        
        const elapsedTime = (Date.now() - gameStartTime) / 1000;
        
        // মাল্টিপ্লায়ার ইনক্রিমেন্ট (একটু স্লো করে দিলাম)
        gameState.currentMultiplier = Math.min(
            parseFloat((1 + (elapsedTime * 0.08)).toFixed(2)), // Speed reduced
            gameState.crashPoint
        );
        
        // সব ক্লায়েন্টকে আপডেট পাঠানো
        io.emit('gameUpdate', {
            multiplier: gameState.currentMultiplier,
            isRunning: true,
            players: gameState.players,
            elapsedTime: elapsedTime
        });
        
        // ক্র্যাশ চেক
        if (gameState.currentMultiplier >= gameState.crashPoint) {
            clearInterval(gameInterval);
            endGame();
        }
        
    }, 100);
}

// মাল্টিপ্লায়ার ক্যাটাগরি
function getMultiplierCategory(multiplier) {
    if (multiplier < 2) return 'instant';
    if (multiplier < 5) return 'low';
    if (multiplier < 10) return 'medium';
    if (multiplier < 30) return 'high';
    if (multiplier < 50) return 'very-high';
    return 'mega';
}

function endGame() {
    gameState.isRunning = false;
    const category = getMultiplierCategory(gameState.crashPoint);
    
    // হিস্টোরি সেভ করা
    gameState.history.unshift({
        gameId: gameState.gameId,
        crashPoint: gameState.crashPoint,
        category: category,
        timestamp: new Date()
    });
    
    // হিস্টোরি লিমিট করা
    if (gameState.history.length > 50) {
        gameState.history = gameState.history.slice(0, 50);
    }
    
    console.log(`💥 Game ${gameState.gameId} Crashed at ${gameState.crashPoint}x (${category})`);
    
    io.emit('gameCrash', {
        crashPoint: gameState.crashPoint,
        gameId: gameState.gameId,
        category: category,
        history: gameState.history.slice(0, 10)
    });
    
    gameState.gameId++;
    
    // ৫ সেকেন্ড পর নতুন গেম শুরু
    setTimeout(startGame, 5000);
}

// সকেট কানেকশন হ্যান্ডলিং
io.on('connection', (socket) => {
    console.log('👤 User connected:', socket.id);
    
    // বেট প্লেস
    socket.on('placeBet', (data) => {
        if (!gameState.isRunning) {
            socket.emit('error', { message: 'গেম চলমান নেই!' });
            return;
        }
        
        const existingPlayer = gameState.players.find(p => p.id === socket.id);
        if (existingPlayer) {
            socket.emit('error', { message: 'আপনি ইতিমধ্যে বেট করেছেন!' });
            return;
        }
        
        const player = {
            id: socket.id,
            name: data.name || 'Player',
            amount: parseFloat(data.amount),
            betTime: new Date(),
            cashOutMultiplier: null,
            hasCashedOut: false,
            autoCashout: data.autoCashout || null
        };
        
        gameState.players.push(player);
        
        console.log(`💰 Bet placed: ${player.name} - ${player.amount} টাকা`);
        
        io.emit('playerJoined', {
            player: player,
            totalPlayers: gameState.players.length
        });
        
        socket.emit('betSuccess', { 
            message: `বেট সফল! ${player.amount} টাকা`,
            autoCashout: player.autoCashout
        });
    });
    
    // অটো ক্যাশ আউট সেট
    socket.on('setAutoCashout', (data) => {
        const player = gameState.players.find(p => p.id === socket.id);
        if (player && !player.hasCashedOut) {
            player.autoCashout = parseFloat(data.multiplier);
            socket.emit('autoCashoutSet', { multiplier: player.autoCashout });
        }
    });
    
    // ক্যাশ আউট
    socket.on('cashOut', () => {
        const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
        
        if (playerIndex === -1) {
            socket.emit('error', { message: 'আপনি কোনো বেট করেননি!' });
            return;
        }
        
        const player = gameState.players[playerIndex];
        
        if (player.hasCashedOut) {
            socket.emit('error', { message: 'আপনি ইতিমধ্যে ক্যাশ আউট করেছেন!' });
            return;
        }
        
        player.cashOutMultiplier = gameState.currentMultiplier;
        player.hasCashedOut = true;
        const winAmount = parseFloat((player.amount * gameState.currentMultiplier).toFixed(2));
        
        console.log(`🎯 Cash out: ${player.name} - ${winAmount} টাকা (${gameState.currentMultiplier}x)`);
        
        socket.emit('cashOutSuccess', { 
            amount: winAmount,
            multiplier: gameState.currentMultiplier
        });
        
        io.emit('playerCashedOut', {
            player: player,
            winAmount: winAmount,
            multiplier: gameState.currentMultiplier
        });
    });
    
    // গেম স্টেট রিকুয়েস্ট
    socket.on('getGameState', () => {
        socket.emit('gameState', {
            isRunning: gameState.isRunning,
            currentMultiplier: gameState.currentMultiplier,
            players: gameState.players,
            history: gameState.history.slice(0, 10),
            gameId: gameState.gameId
        });
    });
    
    // অটো ক্যাশ আউট চেক
    setInterval(() => {
        if (gameState.isRunning) {
            gameState.players.forEach(player => {
                if (!player.hasCashedOut && player.autoCashout && 
                    gameState.currentMultiplier >= player.autoCashout) {
                    // অটো ক্যাশ আউট ট্রিগার
                    const winAmount = parseFloat((player.amount * gameState.currentMultiplier).toFixed(2));
                    player.cashOutMultiplier = gameState.currentMultiplier;
                    player.hasCashedOut = true;
                    
                    io.to(player.id).emit('autoCashoutTriggered', {
                        amount: winAmount,
                        multiplier: gameState.currentMultiplier
                    });
                    
                    io.emit('playerCashedOut', {
                        player: player,
                        winAmount: winAmount,
                        multiplier: gameState.currentMultiplier,
                        auto: true
                    });
                }
            });
        }
    }, 100);
    
    socket.on('disconnect', () => {
        console.log('👤 User disconnected:', socket.id);
    });
});

// প্রথম গেম শুরু
setTimeout(startGame, 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} to play the game`);
    console.log(`🎯 Game configured for more crashes below 50x`);
});