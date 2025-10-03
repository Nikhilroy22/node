// game/crashGame.js

let gameState = {
    isRunning: false,
    currentMultiplier: 1.00,
    crashPoint: 0,
    players: [],
    history: [],
    gameId: 1
};

// 🎯 Crash Point Generator
function generateCrashPoint() {
    const rand = Math.random();
    let crashPoint;

    if (rand < 0.80) {
        crashPoint = 1 + (Math.random() * 9);
    } else if (rand < 0.95) {
        crashPoint = 10 + (Math.random() * 20);
    } else if (rand < 0.99) {
        crashPoint = 30 + (Math.random() * 20);
    } else {
        crashPoint = 50 + (Math.random() * 50);
    }

    crashPoint = parseFloat(crashPoint.toFixed(2));

    // extra control
    const extraControl = Math.random();
    if (extraControl < 0.85 && crashPoint > 30) {
        crashPoint = 10 + (Math.random() * 20);
    }

    console.log(`🎯 Generated Crash Point: ${crashPoint}x`);
    return crashPoint;
}

function getMultiplierCategory(multiplier) {
    if (multiplier < 2) return 'instant';
    if (multiplier < 5) return 'low';
    if (multiplier < 10) return 'medium';
    if (multiplier < 30) return 'high';
    if (multiplier < 50) return 'very-high';
    return 'mega';
}

// 🎮 গেম শুরু
function startGame(io) {
    gameState.isRunning = true;
    gameState.currentMultiplier = 1.00;
    gameState.crashPoint = generateCrashPoint();
    gameState.players = [];

    console.log(`🎮 Game ${gameState.gameId} Started`);
    console.log(`📊 Crash Point: ${gameState.crashPoint}x`);

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
        gameState.currentMultiplier = Math.min(
            parseFloat((1 + (elapsedTime * 0.08)).toFixed(2)),
            gameState.crashPoint
        );

        io.emit('gameUpdate', {
            multiplier: gameState.currentMultiplier,
            isRunning: true,
            players: gameState.players,
            elapsedTime
        });

        if (gameState.currentMultiplier >= gameState.crashPoint) {
            clearInterval(gameInterval);
            endGame(io);
        }
    }, 100);
}

// 🔥 গেম শেষ
function endGame(io) {
    gameState.isRunning = false;
    const category = getMultiplierCategory(gameState.crashPoint);

    gameState.history.unshift({
        gameId: gameState.gameId,
        crashPoint: gameState.crashPoint,
        category,
        timestamp: new Date()
    });

    if (gameState.history.length > 50) {
        gameState.history = gameState.history.slice(0, 50);
    }

    console.log(`💥 Game ${gameState.gameId} Crashed at ${gameState.crashPoint}x`);

    io.emit('gameCrash', {
        crashPoint: gameState.crashPoint,
        gameId: gameState.gameId,
        category,
        history: gameState.history.slice(0, 10)
    });

    gameState.gameId++;
    setTimeout(() => startGame(io), 5000);
}

module.exports = { gameState, startGame };