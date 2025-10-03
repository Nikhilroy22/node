const socket = io();

let currentMultiplier = 1.00;
let hasPlacedBet = false;
let gameRunning = false;
let userBalance = 10000;
let autoCashoutValue = null;

// DOM elements
const elements = {
    multiplier: document.getElementById('multiplier'),
    status: document.getElementById('status'),
    betAmount: document.getElementById('betAmount'),
    playerName: document.getElementById('playerName'),
    placeBetBtn: document.getElementById('placeBetBtn'),
    cashOutBtn: document.getElementById('cashOutBtn'),
    playersList: document.getElementById('playersList'),
    historyList: document.getElementById('historyList'),
    message: document.getElementById('message'),
    balance: document.getElementById('balance'),
    gameId: document.getElementById('gameId'),
    totalPlayers: document.getElementById('totalPlayers'),
    totalBets: document.getElementById('totalBets'),
    highestMultiplier: document.getElementById('highestMultiplier'),
    autoCashoutInput: document.getElementById('autoCashout'),
    setAutoCashoutBtn: document.getElementById('setAutoCashoutBtn'),
    currentAutoCashout: document.getElementById('currentAutoCashout')
};

// Quick bet buttons
const quickBets = [10, 50, 100, 500, 1000, 5000];
const autoCashoutPresets = [2, 5, 10, 20, 30, 50];

// Initialize quick bets
function initializeQuickBets() {
    const quickBetsContainer = document.getElementById('quickBets');
    quickBets.forEach(amount => {
        const button = document.createElement('div');
        button.className = 'quick-bet';
        button.textContent = amount;
        button.addEventListener('click', () => {
            elements.betAmount.value = amount;
        });
        quickBetsContainer.appendChild(button);
    });
    
    const autoCashoutContainer = document.getElementById('autoCashoutPresets');
    autoCashoutPresets.forEach(multiplier => {
        const button = document.createElement('div');
        button.className = 'quick-bet';
        button.textContent = multiplier + 'x';
        button.addEventListener('click', () => {
            elements.autoCashoutInput.value = multiplier;
            setAutoCashout();
        });
        autoCashoutContainer.appendChild(button);
    });
}

// Update balance display
function updateBalance() {
    elements.balance.textContent = '৳' + userBalance.toLocaleString();
}

// Set auto cashout
function setAutoCashout() {
    const multiplier = parseFloat(elements.autoCashoutInput.value);
    if (multiplier && multiplier > 1) {
        autoCashoutValue = multiplier;
        socket.emit('setAutoCashout', { multiplier: multiplier });
        elements.currentAutoCashout.textContent = multiplier + 'x';
        showMessage(`Auto cashout set at ${multiplier}x`, 'info');
    }
}

// Game update handler
socket.on('gameUpdate', (data) => {
    gameRunning = true;
    currentMultiplier = data.multiplier;
    
    elements.multiplier.textContent = currentMultiplier.toFixed(2) + 'x';
    elements.multiplier.className = 'multiplier rising';
    
    // Multiplier color based on value
    if (currentMultiplier < 2) {
        elements.multiplier.style.color = 'var(--danger)';
    } else if (currentMultiplier < 10) {
        elements.multiplier.style.color = 'var(--warning)';
    } else if (currentMultiplier < 30) {
        elements.multiplier.style.color = 'var(--info)';
    } else {
        elements.multiplier.style.color = 'var(--accent)';
    }
    
    elements.status.textContent = 'Game Running...';
    elements.status.style.color = 'var(--accent)';
    
    updatePlayersList(data.players);
    updateStats(data.players);
    
    // Auto cashout warning
    if (autoCashoutValue && currentMultiplier >= autoCashoutValue * 0.8) {
        elements.status.textContent = `Auto cashout soon! (${autoCashoutValue}x)`;
        elements.status.style.color = 'var(--warning)';
    }
});

socket.on('gameStart', (data) => {
    gameRunning = true;
    hasPlacedBet = false;
    autoCashoutValue = null;
    elements.currentAutoCashout.textContent = 'None';
    
    elements.multiplier.textContent = '1.00x';
    elements.multiplier.className = 'multiplier';
    elements.multiplier.style.color = 'var(--text)';
    
    elements.status.textContent = `Game #${data.gameId} - Place Your Bets!`;
    elements.status.style.color = 'var(--warning)';
    
    elements.gameId.textContent = data.gameId;
    
    showMessage(`Game #${data.gameId} has started! Most games crash below 50x.`, 'info');
    resetBettingUI();
});

socket.on('gameCrash', (data) => {
    gameRunning = false;
    
    elements.multiplier.textContent = data.crashPoint.toFixed(2) + 'x';
    elements.multiplier.className = 'multiplier crashed';
    
    let statusMessage = `Crashed at ${data.crashPoint.toFixed(2)}x!`;
    if (data.crashPoint < 10) {
        statusMessage += " (Low)";
    } else if (data.crashPoint < 30) {
        statusMessage += " (Medium)";
    } else if (data.crashPoint < 50) {
        statusMessage += " (High)";
    } else {
        statusMessage += " (RARE!)";
    }
    
    elements.status.textContent = statusMessage;
    elements.status.style.color = 'var(--danger)';
    
    showMessage(`Game crashed at ${data.crashPoint.toFixed(2)}x!`, 'error');
    updateHistory(data.history);
    
    setTimeout(() => {
        elements.playersList.innerHTML = '<div class="player-item"><div class="player-info"><div class="player-avatar">?</div><span>No active players</span></div></div>';
    }, 3000);
});

socket.on('betSuccess', (data) => {
    hasPlacedBet = true;
    userBalance -= parseFloat(elements.betAmount.value);
    updateBalance();
    
    let message = `Bet placed! ${elements.betAmount.value} টাকা`;
    if (data.autoCashout) {
        message += ` | Auto cashout: ${data.autoCashout}x`;
    }
    
    showMessage(message, 'success');
    updateBettingUI();
});

socket.on('cashOutSuccess', (data) => {
    const winAmount = parseFloat(data.amount);
    userBalance += winAmount;
    updateBalance();
    showMessage(`Success! You won ৳${winAmount.toLocaleString()}! (${data.multiplier}x)`, 'success');
    hasPlacedBet = false;
    autoCashoutValue = null;
    elements.currentAutoCashout.textContent = 'None';
    updateBettingUI();
});

socket.on('autoCashoutTriggered', (data) => {
    const winAmount = parseFloat(data.amount);
    userBalance += winAmount;
    updateBalance();
    showMessage(`Auto cashout! Won ৳${winAmount.toLocaleString()} at ${data.multiplier}x!`, 'success');
    hasPlacedBet = false;
    autoCashoutValue = null;
    elements.currentAutoCashout.textContent = 'None';
    updateBettingUI();
});

socket.on('autoCashoutSet', (data) => {
    showMessage(`Auto cashout set at ${data.multiplier}x`, 'info');
});

socket.on('playerJoined', (data) => {
    showMessage(`${data.player.name} placed a bet of ৳${data.player.amount}!`, 'info');
});

socket.on('playerCashedOut', (data) => {
    const message = data.auto ? 
        `🤖 ${data.player.name} auto-cashed out ৳${data.winAmount.toLocaleString()}!` :
        `🎉 ${data.player.name} won ৳${data.winAmount.toLocaleString()}!`;
    showMessage(message, 'success');
});

socket.on('error', (data) => {
    showMessage(data.message, 'error');
});

socket.on('gameState', (data) => {
    gameRunning = data.isRunning;
    currentMultiplier = data.currentMultiplier;
    
    elements.multiplier.textContent = currentMultiplier.toFixed(2) + 'x';
    updatePlayersList(data.players);
    updateHistory(data.history);
    updateStats(data.players);
    elements.gameId.textContent = data.gameId;
    
    if (!gameRunning) {
        elements.status.textContent = 'New game starting soon...';
        elements.status.style.color = 'var(--warning)';
    }
});

// Enhanced placeBet function
function placeBet() {
    const amount = parseFloat(elements.betAmount.value);
    const name = elements.playerName.value || 'Anonymous';
    
    if (!amount || amount < 10) {
        showMessage('Minimum bet amount is ৳10!', 'error');
        return;
    }
    
    if (amount > userBalance) {
        showMessage('Insufficient balance!', 'error');
        return;
    }
    
    if (!gameRunning) {
        showMessage('Game not running! Please wait...', 'error');
        return;
    }
    
    socket.emit('placeBet', {
        amount: amount,
        name: name,
        autoCashout: autoCashoutValue
    });
}

// Enhanced cashOut function
function cashOut() {
    if (!hasPlacedBet) {
        showMessage('You haven\'t placed a bet!', 'error');
        return;
    }
    
    socket.emit('cashOut');
}

// Enhanced UI update functions
function updateBettingUI() {
    if (hasPlacedBet) {
        elements.placeBetBtn.disabled = true;
        elements.placeBetBtn.textContent = 'BET PLACED';
        elements.cashOutBtn.disabled = false;
        elements.setAutoCashoutBtn.disabled = true;
    } else {
        elements.placeBetBtn.disabled = !gameRunning || userBalance < 10;
        elements.placeBetBtn.textContent = 'PLACE BET';
        elements.cashOutBtn.disabled = true;
        elements.setAutoCashoutBtn.disabled = !gameRunning;
    }
    
    elements.betAmount.disabled = hasPlacedBet || !gameRunning;
    elements.playerName.disabled = hasPlacedBet || !gameRunning;
    elements.autoCashoutInput.disabled = hasPlacedBet || !gameRunning;
}

function resetBettingUI() {
    hasPlacedBet = false;
    updateBettingUI();
}

function updatePlayersList(players) {
    elements.playersList.innerHTML = '';
    
    if (players.length === 0) {
        elements.playersList.innerHTML = `
            <div class="player-item">
                <div class="player-info">
                    <div class="player-avatar">?</div>
                    <span>No active players</span>
                </div>
            </div>
        `;
        return;
    }
    
    players.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        
        const avatarText = player.name.charAt(0).toUpperCase();
        let status = 'Playing';
        let amountInfo = `৳${player.amount}`;
        let multiplierInfo = currentMultiplier.toFixed(2) + 'x';
        
        if (player.hasCashedOut) {
            status = 'Cashed Out';
            amountInfo = `৳${(player.amount * player.cashOutMultiplier).toLocaleString()}`;
            multiplierInfo = player.cashOutMultiplier.toFixed(2) + 'x';
        }
        
        playerItem.innerHTML = `
            <div class="player-info">
                <div class="player-avatar">${avatarText}</div>
                <div>
                    <div>${player.name}</div>
                    <div style="font-size: 0.8em; color: var(--text-secondary);">
                        ${status} ${player.autoCashout ? `| Auto: ${player.autoCashout}x` : ''}
                    </div>
                </div>
            </div>
            <div class="player-stats">
                <div class="player-amount">${amountInfo}</div>
                <div class="player-multiplier">${multiplierInfo}</div>
            </div>
        `;
        
        elements.playersList.appendChild(playerItem);
    });
}

function updateHistory(history) {
    elements.historyList.innerHTML = '';
    
    history.forEach(game => {
        const historyItem = document.createElement('div');
        
        let className = 'history-item ';
        if (game.crashPoint < 2) className += 'low';
        else if (game.crashPoint < 5) className += 'medium';
        else if (game.crashPoint < 10) className += 'high';
        else if (game.crashPoint < 30) className += 'very-high';
        else className += 'mega';
        
        historyItem.className = className;
        
        const date = new Date(game.timestamp);
        const time = date.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        historyItem.innerHTML = `
            <div class="history-multiplier">${game.crashPoint.toFixed(2)}x</div>
            <div class="history-time">${time}</div>
            <div class="history-category">${game.category}</div>
        `;
        
        elements.historyList.appendChild(historyItem);
    });
}

function updateStats(players) {
    elements.totalPlayers.textContent = players.length;
    elements.totalBets.textContent = '৳' + players.reduce((sum, player) => sum + player.amount, 0).toLocaleString();
    
    const activePlayers = players.filter(p => !p.hasCashedOut);
    if (activePlayers.length > 0) {
        elements.highestMultiplier.textContent = currentMultiplier.toFixed(2) + 'x';
    }
}

function showMessage(message, type) {
    elements.message.textContent = message;
    elements.message.className = `message ${type}`;
    
    setTimeout(() => {
        elements.message.textContent = '';
        elements.message.className = 'message';
    }, 5000);
}

// Event listeners
elements.placeBetBtn.addEventListener('click', placeBet);
elements.cashOutBtn.addEventListener('click', cashOut);
elements.setAutoCashoutBtn.addEventListener('click', setAutoCashout);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && hasPlacedBet) {
        e.preventDefault();
        cashOut();
    }
    
    // Quick bet number keys (1-6)
    if (e.code >= 'Digit1' && e.code <= 'Digit6' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const index = parseInt(e.code.replace('Digit', '')) - 1;
        if (quickBets[index]) {
            elements.betAmount.value = quickBets[index];
        }
    }
    
    // Auto cashout presets (7-0)
    if (e.code >= 'Digit7' && e.code <= 'Digit0' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const index = parseInt(e.code.replace('Digit', '')) - 7;
        if (autoCashoutPresets[index]) {
            elements.autoCashoutInput.value = autoCashoutPresets[index];
            setAutoCashout();
        }
    }
});

// Auto-focus bet amount
elements.betAmount.focus();

// Initialize
socket.emit('getGameState');
initializeQuickBets();
updateBalance();
updateBettingUI();