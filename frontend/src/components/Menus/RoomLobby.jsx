import React, { useState, useEffect } from 'react';
import GlassButton from '../UI/GlassButton';
import { useWebSocket } from '../../hooks/useWebSocket';

function RoomLobby({ onBack, onJoinGame }) {
  const [publicRooms, setPublicRooms] = useState([]);
  const [roomCode, setRoomCode] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinRoom, connectionStatus } = useWebSocket();

  useEffect(() => {
    fetchPublicRooms();
    const interval = setInterval(fetchPublicRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchPublicRooms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/rooms');
      const rooms = await response.json();
      setPublicRooms(rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const handleJoinRoom = async (code, requiredPassword = null) => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      await joinRoom(code, username, requiredPassword || password);
      onJoinGame('multiplayer');
    } catch (error) {
      alert('Failed to join room: ' + error.message);
    }
    setLoading(false);
  };

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      alert('Please enter a room code');
      return;
    }
    handleJoinRoom(roomCode.toUpperCase());
  };

  return (
    <div className="room-lobby">
      <div className="lobby-header">
        <button className="back-btn glass-btn" onClick={onBack}>← Back</button>
        <h2>Join Room</h2>
      </div>

      <div className="username-section">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="glass-input"
          maxLength={20}
        />
      </div>

      <div className="join-by-code">
        <h3>Join by Room Code</h3>
        <form onSubmit={handleJoinByCode}>
          <div className="input-row">
            <input
              type="text"
              placeholder="Room Code (6 chars)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="glass-input"
              maxLength={6}
            />
            <input
              type="password"
              placeholder="Password (if needed)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input"
            />
          </div>
          <GlassButton type="submit" disabled={loading}>
            {loading ? 'Joining...' : 'Join Room'}
          </GlassButton>
        </form>
      </div>

      <div className="public-rooms">
        <h3>Public Rooms</h3>
        {publicRooms.length === 0 ? (
          <div className="no-rooms">No public rooms available</div>
        ) : (
          <div className="rooms-list">
            {publicRooms.map(room => (
              <div key={room.code} className="room-card glass-card">
                <div className="room-info">
                  <div className="room-name">{room.name}</div>
                  <div className="room-details">
                    <span className="room-mode">{room.gameMode}</span>
                    <span className="room-players">{room.playerCount}/{room.maxPlayers}</span>
                  </div>
                  <div className="room-code">Code: {room.code}</div>
                </div>
                <GlassButton 
                  onClick={() => handleJoinRoom(room.code)}
                  variant="small"
                  disabled={loading || !username.trim()}
                >
                  Join
                </GlassButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomLobby;