import { useState, useEffect } from 'react';
import { getStats, saveGameResult } from '../utils/stats';

export function useStats() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const currentStats = getStats();
    setStats(currentStats);
  };

  const recordGame = (gameResult) => {
    saveGameResult(gameResult);
    loadStats();
  };

  const getStatsForMode = (gameMode) => {
    const modeStats = stats[gameMode] || {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {}
    };

    const winPercentage = modeStats.gamesPlayed > 0 ? 
      (modeStats.gamesWon / modeStats.gamesPlayed) * 100 : 0;

    const totalGuesses = Object.keys(modeStats.guessDistribution)
      .reduce((sum, key) => sum + (modeStats.guessDistribution[key] * parseInt(key)), 0);
    
    const averageGuesses = modeStats.gamesWon > 0 ? totalGuesses / modeStats.gamesWon : 0;

    return {
      ...modeStats,
      winPercentage,
      averageGuesses
    };
  };

  return {
    stats,
    getStatsForMode,
    recordGame,
    refresh: loadStats
  };
}