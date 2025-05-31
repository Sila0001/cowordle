import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/Menus/MainMenu';
import GameBoard from './components/Game/GameBoard';
import RoomLobby from './components/Menus/RoomLobby';
import Statistics from './components/Menus/Statistics';
import CreateRoom from './components/Menus/CreateRoom';
import { GameProvider } from './hooks/useGameState';
import { WebSocketProvider } from './hooks/useWebSocket';
import './styles/glassmorphism.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');
  const [gameMode, setGameMode] = useState(null);

  const navigateTo = (view, mode = null) => {
    setCurrentView(view);
    if (mode) setGameMode(mode);
  };

  return (
    <WebSocketProvider>
      <GameProvider>
        <div className="app">
          <div className="app-container">
            {currentView === 'menu' && (
              <MainMenu onNavigate={navigateTo} />
            )}
            
            {currentView === 'game' && (
              <GameBoard 
                gameMode={gameMode} 
                onBack={() => navigateTo('menu')}
              />
            )}
            
            {currentView === 'lobby' && (
              <RoomLobby 
                onBack={() => navigateTo('menu')}
                onJoinGame={(mode) => navigateTo('game', mode)}
              />
            )}
            
            {currentView === 'create-room' && (
              <CreateRoom 
                onBack={() => navigateTo('menu')}
                onRoomCreated={() => navigateTo('lobby')}
              />
            )}
            
            {currentView === 'stats' && (
              <Statistics onBack={() => navigateTo('menu')} />
            )}
          </div>
        </div>
      </GameProvider>
    </WebSocketProvider>
  );
}

export default App;