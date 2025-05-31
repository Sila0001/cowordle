const STATS_KEY = 'cowordle_stats';

export function getStats() {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load stats:', error);
    return {};
  }
}

export function saveGameResult(result) {
  const stats = getStats();
  const { gameMode, won, guesses, targetWord } = result;
  
  if (!stats[gameMode]) {
    stats[gameMode] = {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: {}
    };
  }

  const modeStats = stats[gameMode];
  
  modeStats.gamesPlayed++;
  
  if (won) {
    modeStats.gamesWon++;
    modeStats.currentStreak++;
    modeStats.maxStreak = Math.max(modeStats.maxStreak, modeStats.currentStreak);
    
    if (guesses >= 1 && guesses <= 6) {
      modeStats.guessDistribution[guesses] = (modeStats.guessDistribution[guesses] || 0) + 1;
    }
  } else {
    modeStats.currentStreak = 0;
  }

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

export function resetStats() {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    console.error('Failed to reset stats:', error);
  }
}