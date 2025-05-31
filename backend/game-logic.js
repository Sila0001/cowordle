const fs = require('fs');
const path = require('path');

class GameLogic {
    constructor() {
        this.possibleWords = [];
        this.allowedGuesses = [];
        this.loadWordLists();
    }

    loadWordLists() {
        try {
            const wordsPath = path.join(__dirname, 'words.txt');
            const allowedPath = path.join(__dirname, 'allowed_guesses.txt');
            
            const wordsData = fs.readFileSync(wordsPath, 'utf8');
            this.possibleWords = wordsData
                .split('\n')
                .map(word => word.trim().toUpperCase())
                .filter(word => word.length === 5);
            
            const allowedData = fs.readFileSync(allowedPath, 'utf8');
            this.allowedGuesses = allowedData
                .split('\n')
                .map(word => word.trim().toUpperCase())
                .filter(word => word.length === 5);
            
            console.log(`Loaded ${this.possibleWords.length} possible words`);
            console.log(`Loaded ${this.allowedGuesses.length} allowed guesses`);
            
            if (this.possibleWords.length === 0 || this.allowedGuesses.length === 0) {
                throw new Error('Word lists are empty');
            }
            
        } catch (error) {
            console.error('Failed to load word lists:', error.message);
            console.log('Make sure words.txt and allowed_guesses.txt are in the backend directory');
            
            this.possibleWords = ['SLATE', 'CRANE', 'AUDIO', 'MEDIA', 'RAISE'];
            this.allowedGuesses = ['SLATE', 'CRANE', 'AUDIO', 'MEDIA', 'RAISE', 'HELLO', 'WORLD'];
            console.log('Using fallback word lists for testing');
        }
    }

    getRandomWord() {
        const randomIndex = Math.floor(Math.random() * this.possibleWords.length);
        return this.possibleWords[randomIndex];
    }

    isValidGuess(word) {
        if (word.length !== 5) return false;
        const upperWord = word.toUpperCase();
        return this.allowedGuesses.includes(upperWord) || 
               this.possibleWords.includes(upperWord);
    }

    checkGuess(guess, targetWord) {
        if (!this.isValidGuess(guess)) {
            return { valid: false, error: 'Not a valid word' };
        }

        const result = [];
        const target = targetWord.toUpperCase().split('');
        const guessArray = guess.toUpperCase().split('');
        const targetCounts = {};

        target.forEach(letter => {
            targetCounts[letter] = (targetCounts[letter] || 0) + 1;
        });

        guessArray.forEach((letter, index) => {
            if (letter === target[index]) {
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

        return { 
            valid: true, 
            result,
            isWin: guessArray.join('') === target.join(''),
            word: guess.toUpperCase()
        };
    }
}

module.exports = GameLogic;