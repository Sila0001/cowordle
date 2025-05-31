# Cowordle

Multiplayer Wordle game with glassmorphism design.

## Setup Instructions

1. **Install Backend Dependencies:**
   ```bash
   cd cowordle/backend
   npm install
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

3. **Add Word Lists:**
   - Edit `backend/game-logic.js`
   - Replace `PLACEHOLDER_POSSIBLE_WORDS_ARRAY` with actual possible words
   - Replace `PLACEHOLDER_ALLOWED_GUESSES_ARRAY` with allowed guesses

## Running the Application

1. **Start Backend Server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the game at:** http://localhost:3000

## Game Modes

- **Solo:** Traditional Wordle
- **Cooperative:** Work together to solve
- **Competitive:** Race to solve first
- **Turn-Based Competitive:** Take turns, same pace

## File Structure

### Backend Files:
- `server.js` - Main WebSocket server
- `game-logic.js` - Wordle validation logic (needs word lists)
- `room-manager.js` - Multiplayer room handling

### Frontend Files:
- `src/App.jsx` - Main application component
- `src/components/Game/` - Game-related components
- `src/components/Menus/` - Menu components
- `src/hooks/` - React hooks for state management
- `src/utils/stats.js` - Statistics tracking
- `src/styles/` - Glassmorphism styling

## Building for Production

```bash
cd frontend
npm run build
```

## Word Lists Required

You need to add two arrays to `backend/game-logic.js`:

1. **Possible Words** (~2,300 words) - Words that can be the answer
2. **Allowed Guesses** (~13,000 words) - All valid guesses including uncommon words

Replace the placeholder arrays in the `loadWordLists()` method.
