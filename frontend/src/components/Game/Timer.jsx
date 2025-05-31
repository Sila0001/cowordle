import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';

function Timer() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isWarning, setIsWarning] = useState(false);
  const { gameData } = useWebSocket();

  useEffect(() => {
    if (gameData?.turnStartTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - gameData.turnStartTime;
        const remaining = Math.max(0, 30000 - elapsed);
        const secondsLeft = Math.ceil(remaining / 1000);
        
        setTimeLeft(secondsLeft);
        setIsWarning(secondsLeft <= 10);
        
        if (secondsLeft === 0) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameData?.turnStartTime]);

  if (!gameData?.turnStartTime) return null;

  return (
    <div className={`timer ${isWarning ? 'warning' : ''}`}>
      <div className="timer-circle">
        <div className="timer-text">{timeLeft}s</div>
      </div>
    </div>
  );
}

export default Timer;