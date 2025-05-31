import React, { createContext, useContext, useReducer } from 'react';
import { saveGameResult } from '../utils/stats';

const GameStateContext = createContext();

const initialState = {
  guesses: [],
  currentRow: 0,
  gameStatus: 'playing',
  currentGuess: '',
  targetWord: '',
  gameMode: 'solo'
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_TARGET_WORD':
      return { ...state, targetWord: action.word };
    
    case 'SET_CURRENT_GUESS':
      return { ...state, currentGuess: action.guess };
    
    case 'ADD_GUESS':
      const newGuesses = [...state.guesses, action.guess];
      const isWin = action.guess.result.every(r => r === 'correct');
      const isGameOver = isWin || newGuesses.length >= 6;
      
      return {
        ...state,
        guesses: newGuesses,
        currentRow: state.currentRow + 1,
        gameStatus: isWin ? 'won' : isGameOver ? 'lost' : 'playing',
        currentGuess: ''
      };
    
    case 'RESET_GAME':
      return { ...initialState, gameMode: action.gameMode };
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const setCurrentGuess = (guess) => {
    dispatch({ type: 'SET_CURRENT_GUESS', guess });
  };

  const makeGuess = (word, isInitializing = false) => {
    if (isInitializing) {
      const randomWords = ['SLATE', 'CRANE', 'AUDIO', 'MEDIA', 'RAISE'];
      const targetWord = randomWords[Math.floor(Math.random() * randomWords.length)];
      dispatch({ type: 'SET_TARGET_WORD', word: targetWord });
      return;
    }

    if (!word || word.length !== 5) return;

    const result = checkWordAgainstTarget(word, gameState.targetWord);
    const guessData = { word: word.toUpperCase(), result };
    
    dispatch({ type: 'ADD_GUESS', guess: guessData });

    const isWin = result.every(r => r === 'correct');
    if (isWin || gameState.guesses.length >= 5) {
      saveGameResult({
        gameMode: gameState.gameMode,
        won: isWin,
        guesses: gameState.guesses.length + 1,
        targetWord: gameState.targetWord
      });
    }
  };

  const resetGame = (gameMode = 'solo') => {
    dispatch({ type: 'RESET_GAME', gameMode });
  };

  return (
    <GameStateContext.Provider value={{
      gameState,
      currentGuess: gameState.currentGuess,
      setCurrentGuess,
      makeGuess,
      resetGame
    }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameProvider');
  }
  return context;
}

function checkWordAgainstTarget(guess, target) {
  const result = [];
  const targetArray = target.split('');
  const guessArray = guess.toUpperCase().split('');
  const targetCounts = {};

  targetArray.forEach(letter => {
    targetCounts[letter] = (targetCounts[letter] || 0) + 1;
  });

  guessArray.forEach((letter, index) => {
    if (letter === targetArray[index]) {
      result[index] = 'correct';
      targetCounts[letter]--;
    } else {
      result[index] = 'absent';
    }
  });

  guessArray.forEach((letter, index) => {
    if (result[index] === 'absent' && targetCounts[letter] > 0) {
      result[index] = 'present';
      targetCounts[letter]--;
    }
  });

  return result;
}