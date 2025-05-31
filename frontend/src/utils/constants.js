export const GAME_MODES = {
  SOLO: 'solo',
  COOPERATIVE: 'cooperative', 
  COMPETITIVE: 'competitive',
  COMPETITIVE_TURNBASED: 'competitive-turnbased'
};

export const GAME_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished'
};

export const LETTER_STATUS = {
  CORRECT: 'correct',
  PRESENT: 'present',
  ABSENT: 'absent'
};

export const WS_MESSAGE_TYPES = {
  JOIN_ROOM: 'JOIN_ROOM',
  MAKE_GUESS: 'MAKE_GUESS',
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  READY_FOR_NEXT_TURN: 'READY_FOR_NEXT_TURN'
};

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;
export const TURN_TIME_LIMIT = 30000;
export const TURN_WARNING_TIME = 10000;