class RoomManager {
    constructor() {
        this.rooms = new Map();
        this.playerConnections = new Map();
    }

    createRoom(roomData) {
        const room = {
            ...roomData,
            players: [],
            gameState: 'waiting',
            currentTurn: 0,
            maxPlayers: roomData.gameMode === 'solo' ? 1 : 2,
            playerGuesses: {},
            turnTimer: null,
            gameStartTime: null
        };
        
        this.rooms.set(roomData.code, room);
        return room;
    }

    joinRoom(ws, roomCode, username, password = null) {
        const room = this.rooms.get(roomCode);
        
        if (!room) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Room not found' }));
            return;
        }

        if (room.hasPassword && room.password !== password) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Wrong password' }));
            return;
        }

        if (room.players.length >= room.maxPlayers) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Room full' }));
            return;
        }

        const playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        ws.playerId = playerId;
        ws.roomCode = roomCode;
        ws.username = username;
        
        room.players.push({
            id: playerId,
            username,
            ws,
            guesses: [],
            isReady: false
        });

        this.playerConnections.set(ws, { roomCode, playerId });

        ws.send(JSON.stringify({
            type: 'JOINED_ROOM',
            room: this.sanitizeRoomForClient(room),
            playerId
        }));

        this.broadcastToRoom(roomCode, {
            type: 'PLAYER_JOINED',
            username,
            playerId,
            playerCount: room.players.length
        });

        if (room.players.length === room.maxPlayers) {
            this.startGame(roomCode);
        }
    }

    startGame(roomCode) {
        const room = this.rooms.get(roomCode);
        if (!room) return;

        room.gameState = 'playing';
        room.gameStartTime = Date.now();
        
        this.broadcastToRoom(roomCode, {
            type: 'GAME_STARTED',
            gameMode: room.gameMode,
            word: room.gameMode === 'cooperative' ? room.word : undefined
        });

        if (room.gameMode.includes('turn-based')) {
            this.startTurnTimer(roomCode);
        }
    }

    processGuess(roomCode, playerId, word, result) {
        const room = this.rooms.get(roomCode);
        if (!room) return null;

        const player = room.players.find(p => p.id === playerId);
        if (!player) return null;

        player.guesses.push({ word, result: result.result });

        if (result.isWin) {
            room.gameState = 'finished';
            room.winner = playerId;
        } else if (player.guesses.length >= 6) {
            if (room.gameMode === 'competitive' || room.gameMode === 'competitive-turnbased') {
                const otherPlayer = room.players.find(p => p.id !== playerId);
                if (otherPlayer && otherPlayer.guesses.length >= 6) {
                    room.gameState = 'finished';
                    room.winner = null;
                }
            } else {
                room.gameState = 'finished';
                room.winner = null;
            }
        }

        return this.sanitizeRoomForClient(room);
    }

    startTurnTimer(roomCode) {
        const room = this.rooms.get(roomCode);
        if (!room || room.gameState !== 'playing') return;

        room.turnStartTime = Date.now();
        room.turnTimeLimit = 30000;

        this.broadcastToRoom(roomCode, {
            type: 'TURN_STARTED',
            timeLimit: 30000,
            currentTurn: room.currentTurn
        });

        setTimeout(() => {
            this.handleTurnTimeout(roomCode, false);
        }, 30000);

        setTimeout(() => {
            this.handleTurnTimeout(roomCode, true);
        }, 40000);
    }

    handleTurnTimeout(roomCode, isFinal) {
        const room = this.rooms.get(roomCode);
        if (!room || room.gameState !== 'playing') return;

        if (!isFinal) {
            this.broadcastToRoom(roomCode, {
                type: 'TURN_WARNING',
                timeLeft: 10000
            });
        } else {
            room.players.forEach(player => {
                if (!player.hasSubmittedThisTurn) {
                    player.guesses.push({ 
                        word: '     ', 
                        result: ['absent', 'absent', 'absent', 'absent', 'absent'] 
                    });
                }
                player.hasSubmittedThisTurn = false;
            });

            room.currentTurn++;
            
            if (room.currentTurn < 6) {
                this.startTurnTimer(roomCode);
            } else {
                room.gameState = 'finished';
                this.broadcastToRoom(roomCode, {
                    type: 'GAME_FINISHED',
                    reason: 'max_turns_reached'
                });
            }
        }
    }

    getPublicRooms() {
        const publicRooms = [];
        this.rooms.forEach(room => {
            if (!room.hasPassword && room.gameState === 'waiting') {
                publicRooms.push({
                    code: room.code,
                    name: room.name,
                    gameMode: room.gameMode,
                    playerCount: room.players.length,
                    maxPlayers: room.maxPlayers
                });
            }
        });
        return publicRooms;
    }

    handlePlayerDisconnect(ws) {
        const connection = this.playerConnections.get(ws);
        if (!connection) return;

        const room = this.rooms.get(connection.roomCode);
        if (!room) return;

        room.players = room.players.filter(p => p.id !== connection.playerId);

        if (room.players.length === 0) {
            this.rooms.delete(connection.roomCode);
        } else {
            if (room.gameState === 'playing' && room.gameMode !== 'cooperative') {
                room.gameState = 'finished';
                room.winner = room.players[0].id;
                this.broadcastToRoom(connection.roomCode, {
                    type: 'PLAYER_DISCONNECTED',
                    winner: room.players[0].id
                });
            } else if (room.gameMode === 'cooperative') {
                this.broadcastToRoom(connection.roomCode, {
                    type: 'PLAYER_DISCONNECTED',
                    message: 'Continue playing solo!'
                });
            }
        }

        this.playerConnections.delete(ws);
    }

    broadcastToRoom(roomCode, message) {
        const room = this.rooms.get(roomCode);
        if (!room) return;

        room.players.forEach(player => {
            if (player.ws && player.ws.readyState === 1) {
                player.ws.send(JSON.stringify(message));
            }
        });
    }

    sanitizeRoomForClient(room) {
        return {
            code: room.code,
            name: room.name,
            gameMode: room.gameMode,
            gameState: room.gameState,
            players: room.players.map(p => ({
                id: p.id,
                username: p.username,
                guessCount: p.guesses.length,
                hasWon: room.winner === p.id
            })),
            currentTurn: room.currentTurn,
            winner: room.winner
        };
    }

    getRoom(roomCode) {
        return this.rooms.get(roomCode);
    }
}

module.exports = RoomManager;