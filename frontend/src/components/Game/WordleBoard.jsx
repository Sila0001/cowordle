import React from 'react';

function WordleBoard({ guesses, currentGuess, currentRow }) {
  const renderRow = (rowIndex) => {
    const guess = guesses[rowIndex];
    const isCurrentRow = rowIndex === currentRow;
    
    return (
      <div key={rowIndex} className="wordle-row">
        {[0, 1, 2, 3, 4].map(colIndex => {
          let letter = '';
          let status = '';
          
          if (guess) {
            letter = guess.word[colIndex] || '';
            status = guess.result[colIndex] || '';
          } else if (isCurrentRow && currentGuess) {
            letter = currentGuess[colIndex] || '';
          }
          
          return (
            <div 
              key={colIndex}
              className={`wordle-cell ${status} ${letter ? 'filled' : ''}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="wordle-board">
      {[0, 1, 2, 3, 4, 5].map(renderRow)}
    </div>
  );
}

export default WordleBoard;