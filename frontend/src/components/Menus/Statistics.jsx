import React from 'react';
import GlassButton from '../UI/GlassButton';
import { useStats } from '../../hooks/useStats';

function Statistics({ onBack }) {
  const { stats, getStatsForMode } = useStats();

  const gameModes = [
    { key: 'solo', label: 'Solo' },
    { key: 'cooperative', label: 'Cooperative' },
    { key: 'competitive', label: 'Competitive' },
    { key: 'competitive-turnbased', label: 'Turn-Based' }
  ];

  const renderStatsForMode = (mode) => {
    const modeStats = getStatsForMode(mode.key);
    
    if (modeStats.gamesPlayed === 0) {
      return (
        <div className="no-stats">No games played yet</div>
      );
    }

    return (
      <div className="stats-data">
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-value">{modeStats.gamesPlayed}</div>
            <div className="stat-label">Games Played</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{Math.round(modeStats.winPercentage)}%</div>
            <div className="stat-label">Win Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{modeStats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{modeStats.maxStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
        </div>

        <div className="guess-distribution">
          <h4>Guess Distribution</h4>
          {[1, 2, 3, 4, 5, 6].map(guessCount => {
            const count = modeStats.guessDistribution[guessCount] || 0;
            const percentage = modeStats.gamesWon > 0 ? (count / modeStats.gamesWon) * 100 : 0;
            
            return (
              <div key={guessCount} className="distribution-row">
                <div className="guess-number">{guessCount}</div>
                <div className="distribution-bar">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  />
                  <div className="bar-count">{count}</div>
                </div>
              </div>
            );
          })}
        </div>

        {modeStats.averageGuesses > 0 && (
          <div className="average-guesses">
            Average Guesses: {modeStats.averageGuesses.toFixed(1)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="statistics">
      <div className="stats-header">
        <button className="back-btn glass-btn" onClick={onBack}>← Back</button>
        <h2>Statistics</h2>
      </div>

      <div className="stats-content">
        {gameModes.map(mode => (
          <div key={mode.key} className="stats-section glass-card">
            <h3>{mode.label}</h3>
            {renderStatsForMode(mode)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Statistics;