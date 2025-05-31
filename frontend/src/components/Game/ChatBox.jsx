import React, { useState, useRef, useEffect } from 'react';

function ChatBox({ onSendMessage, messages, onToggle }) {
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`chat-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <span>Chat</span>
        <div className="chat-controls">
          <button onClick={toggleMinimize} className="minimize-btn">
            {isMinimized ? '↑' : '↓'}
          </button>
          {onToggle && (
            <button onClick={onToggle} className="close-btn">×</button>
          )}
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <span className="username">{msg.username}:</span>
                <span className="message">{msg.message}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              maxLength={200}
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default ChatBox;