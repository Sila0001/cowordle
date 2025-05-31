# Cowordle

Budget multiplayer wordle

## Game Modes

- **Solo:** Regular Wordle
- **Cooperative:** Work together to solve
- **Competitive:** Race to solve first
- **Turn-Based Competitive:** Race to solve first, both guesses same time

## File Structure

### Backend Files:
- `server.js` - Main websocket server
- `game-logic.js` - Validation logic (needs word lists)
- `room-manager.js` - Multiplayer room handling

### Frontend Files:
- `src/App.jsx` - Main application component
- `src/components/Game/` - Game related components
- `src/components/Menus/` - Menu components
- `src/hooks/` - React hooks for state management
- `src/utils/stats.js` - Statistics tracking
- `src/styles/` - Styling

## Word Lists Required

You need to add two arrays to `backend/game-logic.js`:

1. **Possible Words**  - Words that can be the answer
2. **Allowed Guesses** - All valid guesses including uncommon words

Allows for guesses such as "Adieu" to be made, and not letting words like "phpht" be the solution

Replace the placeholder arrays in the `loadWordLists()` method
