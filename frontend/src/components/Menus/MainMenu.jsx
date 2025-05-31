import React from 'react';
import GlassButton from '../UI/GlassButton';

function MainMenu({ onNavigate }) {
  return (
    <div className="main-menu">
      <div className="title-container">
        <h1 className="game-title">Cowordle</h1>
        <p className="subtitle">Multiplayer Wordle Experience</p>
      </div>
      
      <div className="menu-buttons">
        <GlassButton 
          onClick={() => onNavigate('game', 'solo')}
          variant="primary"
        >
          Wordle
        </GlassButton>
        
        <GlassButton 
          onClick={() => onNavigate('create-room', 'cooperative')}
          variant="secondary"
        >
          Cowordle
        </GlassButton>
        
        <GlassButton 
          onClick={() => onNavigate('create-room', 'competitive')}
          variant="secondary"
        >
          Cowordle Competitive
        </GlassButton>
        
        <GlassButton 
          onClick={() => onNavigate('create-room', 'competitive-turnbased')}
          variant="secondary"
        >
          Cowordle Competitive Turn-Based
        </GlassButton>
        
        <div className="menu-row">
          <GlassButton 
            onClick={() => onNavigate('lobby')}
            variant="outline"
          >
            Join Room
          </GlassButton>
          
          <GlassButton 
            onClick={() => onNavigate('stats')}
            variant="outline"
          >
            Statistics
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;