import React from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';

function GameStatus({ gameMode }) {
  const { gameData, connectionStatus } = useWebSocket();

  if (gameMode === 'solo') {
    return (
      <div className="game-status">
        <div className="status-info">Single Player Mode</div>
      </div>
    );
  }

  if (connectionStatus !== 'connected') {
    return (
      <div className="game-status">
        <div className="status-info connecting">Connecting...</div>
      </div>
    );
  }

  if (!gameData?.room) {
    return (
      <div className="game-status">
        <div className="status-info">Waiting for room data...</div>
      </div>
    );
  }

  const { room } = gameData;

  return (
    <div className="game-status">
      <div className="room-info">
        <span className="room-code">Room: {room.code}</span>
        <span className="player-count">
          {room.players?.length || 0}/{gameMode === 'solo' ? 1 : 2} Players
        </span>
      </div>
      
      {room.gameState === 'waiting' && (
        <div className="status-info">Waiting for players...</div>
      )}
      
      {room.gameState === 'playing' && gameMode.includes('competitive') && (
        <div className="opponent-status">
          {room.players?.map(player => (
            <div key={player.id} className="player-progress">
              <span>{player.username}</span>
              <div className="progress-dots">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`dot ${i < player.guessCount ? 'filled' : ''}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {room.gameState === 'finished' && (
        <div className="status-info game-over">
          {room.winner ? 
            `${room.players?.find(p => p.id === room.winner)?.username || 'Someone'} wins!` :
            'Game Over!'
          }
        </div>
      )}
    </div>
  );
}

export default GameStatus;