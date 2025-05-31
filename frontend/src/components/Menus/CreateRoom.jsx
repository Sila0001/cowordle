import React, { useState } from 'react';
import GlassButton from '../UI/GlassButton';

function CreateRoom({ onBack, onRoomCreated }) {
  const [roomName, setRoomName] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [gameMode, setGameMode] = useState('cooperative');
  const [loading, setLoading] = useState(false);

  const gameModes = [
    { value: 'cooperative', label: 'Cooperative' },
    { value: 'competitive', label: 'Competitive' },
    { value: 'competitive-turnbased', label: 'Competitive Turn-Based' }
  ];

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      alert('Please enter a room name');
      return;
    }

    if (hasPassword && !password.trim()) {
      alert('Please enter a password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: roomName.trim(),
          hasPassword,
          password: hasPassword ? password : null,
          gameMode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const { roomCode } = await response.json();
      alert(`Room created! Code: ${roomCode}`);
      onRoomCreated();
    } catch (error) {
      alert('Failed to create room: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="create-room">
      <div className="create-header">
        <button className="back-btn glass-btn" onClick={onBack}>← Back</button>
        <h2>Create Room</h2>
      </div>

      <form onSubmit={handleCreateRoom} className="create-form">
        <div className="form-group">
          <label>Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="glass-input"
            placeholder="Enter room name"
            maxLength={30}
          />
        </div>

        <div className="form-group">
          <label>Game Mode</label>
          <select 
            value={gameMode} 
            onChange={(e) => setGameMode(e.target.value)}
            className="glass-select"
          >
            {gameModes.map(mode => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={hasPassword}
              onChange={(e) => setHasPassword(e.target.checked)}
            />
            Require Password
          </label>
        </div>

        {hasPassword && (
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input"
              placeholder="Enter password"
              maxLength={20}
            />
          </div>
        )}

        <GlassButton type="submit" disabled={loading} variant="primary">
          {loading ? 'Creating...' : 'Create Room'}
        </GlassButton>
      </form>
    </div>
  );
}

export default CreateRoom;