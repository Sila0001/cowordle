import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [gameData, setGameData] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = () => {
    try {
      const ws = new WebSocket('ws://localhost:3001');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setSocket(ws);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnectionStatus('disconnected');
        setSocket(null);
        attemptReconnect();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionStatus('error');
      attemptReconnect();
    }
  };

  const attemptReconnect = () => {
    if (reconnectAttemptsRef.current < 5) {
      const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current++;
        setConnectionStatus('reconnecting');
        connect();
      }, timeout);
    }
  };

  const handleMessage = (data) => {
    switch (data.type) {
      case 'JOINED_ROOM':
        setGameData(prev => ({
          ...prev,
          room: data.room,
          playerId: data.playerId,
          chatMessages: []
        }));
        break;
      
      case 'GAME_STARTED':
        setGameData(prev => ({
          ...prev,
          gameStarted: true,
          gameMode: data.gameMode
        }));
        break;
      
      case 'GAME_UPDATE':
        setGameData(prev => ({
          ...prev,
          gameState: data.gameState,
          lastGuess: {
            playerId: data.playerId,
            word: data.guess,
            result: data.result
          }
        }));
        break;
      
      case 'CHAT_MESSAGE':
        setGameData(prev => ({
          ...prev,
          chatMessages: [...(prev?.chatMessages || []), {
            username: data.username,
            message: data.message,
            timestamp: Date.now()
          }]
        }));
        break;
      
      case 'TURN_STARTED':
        setGameData(prev => ({
          ...prev,
          turnStartTime: Date.now(),
          timeLimit: data.timeLimit
        }));
        break;
      
      case 'TURN_WARNING':
        setGameData(prev => ({
          ...prev,
          warningTime: Date.now()
        }));
        break;
      
      case 'PLAYER_DISCONNECTED':
        if (data.winner) {
          setGameData(prev => ({
            ...prev,
            gameFinished: true,
            winner: data.winner
          }));
        }
        break;
      
      case 'ERROR':
        alert(data.message);
        break;
    }
  };

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  const joinRoom = (roomCode, username, password = null) => {
    return new Promise((resolve, reject) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        connect();
        
        const checkConnection = () => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            sendMessage({
              type: 'JOIN_ROOM',
              roomCode,
              username,
              password
            });
            resolve();
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      } else {
        sendMessage({
          type: 'JOIN_ROOM',
          roomCode,
          username,
          password
        });
        resolve();
      }
    });
  };

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{
      socket,
      connectionStatus,
      gameData,
      sendMessage,
      joinRoom,
      connect
    }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}