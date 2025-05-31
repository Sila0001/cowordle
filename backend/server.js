const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const GameLogic = require('./game-logic');
const RoomManager = require('./room-manager');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

const roomManager = new RoomManager();
const gameLogic = new GameLogic();

app.get('/api/rooms', (req, res) => {
    const publicRooms = roomManager.getPublicRooms();
    res.json(publicRooms);
});

app.post('/api/rooms', (req, res) => {
    const { roomName, hasPassword, password, gameMode } = req.body;
    const roomCode = generateRoomCode();
    
    const room = roomManager.createRoom({
        code: roomCode,
        name: roomName,
        hasPassword,
        password,
        gameMode,
        word: gameLogic.getRandomWord()
    });
    
    res.json({ roomCode, room });
});

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(ws, data);
        } catch (error) {
            console.error('Invalid message:', error);
        }
    });

    ws.on('close', () => {
        roomManager.handlePlayerDisconnect(ws);
    });
});

function handleWebSocketMessage(ws, data) {
    switch(data.type) {
        case 'JOIN_ROOM':
            roomManager.joinRoom(ws, data.roomCode, data.username, data.password);
            break;
        case 'MAKE_GUESS':
            handleGuess(ws, data);
            break;
        case 'CHAT_MESSAGE':
            roomManager.broadcastToRoom(ws.roomCode, {
                type: 'CHAT_MESSAGE',
                username: ws.username,
                message: data.message
            });
            break;
        case 'READY_FOR_NEXT_TURN':
            roomManager.handleTurnReady(ws);
            break;
    }
}

function handleGuess(ws, data) {
    const room = roomManager.getRoom(ws.roomCode);
    if (!room) return;
    
    const result = gameLogic.checkGuess(data.word, room.word);
    const gameState = roomManager.processGuess(ws.roomCode, ws.playerId, data.word, result);
    
    roomManager.broadcastToRoom(ws.roomCode, {
        type: 'GAME_UPDATE',
        gameState,
        playerId: ws.playerId,
        guess: data.word,
        result
    });
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});