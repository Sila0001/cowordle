import React, { useState, useEffect } from 'react';
import WordleBoard from './WordleBoard';
import Keyboard from './Keyboard';
import ChatBox from './ChatBox';
import Timer from './Timer';
import GameStatus from './GameStatus';
import { useGameState } from '../../hooks/useGameState';
import { useWebSocket } from '../../hooks/useWebSocket';

function GameBoard({ gameMode, onBack }) {
  const { gameState, makeGuess, currentGuess, setCurrentGuess } = useGameState();
  const { sendMessage, gameData } = useWebSocket();
  const [showChat, setShowChat] = useState(gameMode === 'cooperative');

  useEffect(() => {
    if (gameMode === 'solo') {
      startSoloGame();
    }
  }, [gameMode]);

  const startSoloGame = () => {
    makeGuess(null, true);
  };

  const handleKeyPress = (key) => {
    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        if (gameMode === 'solo') {
          makeGuess(currentGuess);
        } else {
          sendMessage({
            type: 'MAKE_GUESS',
            word: currentGuess
          });
        }
        setCurrentGuess('');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const handleChatMessage = (message) => {
    sendMessage({
      type: 'CHAT_MESSAGE',
      message
    });
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-btn glass-btn" onClick={onBack}>← Back</button>
        <h2>{gameMode === 'solo' ? 'Wordle' : 'Cowordle'}</h2>
        {gameMode.includes('turnbased') && <Timer />}
      </div>

      <div className="game-content">
        <div className="game-area">
          <GameStatus gameMode={gameMode} />
          <WordleBoard 
            guesses={gameState.guesses} 
            currentGuess={currentGuess}
            currentRow={gameState.currentRow}
          />
          <Keyboard 
            onKeyPress={handleKeyPress}
            guessHistory={gameState.guesses}
          />
        </div>

        {(gameMode === 'cooperative' || showChat) && (
          <div className="chat-area">
            <ChatBox 
              onSendMessage={handleChatMessage}
              messages={gameData?.chatMessages || []}
              onToggle={() => setShowChat(!showChat)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;