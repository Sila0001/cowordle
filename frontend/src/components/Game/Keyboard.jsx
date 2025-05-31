import React from 'react';

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

function Keyboard({ onKeyPress, guessHistory }) {
  const getKeyStatus = (key) => {
    if (key === 'ENTER' || key === 'BACKSPACE') return '';
    
    for (const guess of guessHistory) {
      if (!guess.word || !guess.result) continue;
      
      const letterIndex = guess.word.indexOf(key);
      if (letterIndex !== -1) {
        const status = guess.result[letterIndex];
        if (status === 'correct') return 'correct';
        if (status === 'present') return 'present';
        if (status === 'absent') return 'absent';
      }
    }
    return '';
  };

  return (
    <div className="keyboard">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              className={`key ${getKeyStatus(key)} ${key === 'ENTER' || key === 'BACKSPACE' ? 'wide' : ''}`}
              onClick={() => onKeyPress(key)}
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;