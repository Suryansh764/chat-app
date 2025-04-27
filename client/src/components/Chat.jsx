import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

function Chat() {
  const { messages, users, currentUser, typingUsers, isConnected, sendMessage, setTyping, logout } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

 
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    sendMessage(messageInput);
    setMessageInput('');
    setTyping(false);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    
    
    if (!typingTimeoutRef.current) {
      setTyping(true);
    }
    
    
    clearTimeout(typingTimeoutRef.current);
    
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Room</h1>
        <div className="user-info">
          <span>Logged in as: <strong>{currentUser}</strong></span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-sidebar">
          <h2>Online Users ({users.length})</h2>
          <ul className="user-list">
            {users.map((user, index) => (
              <li key={index} className={user === currentUser ? 'current-user' : ''}>
                {user} {user === currentUser && '(You)'}
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-messages-container">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender === currentUser ? 'my-message' : 'other-message'}`}
                >
                  <div className="message-header">
                    <span className="message-sender">{msg.sender === currentUser ? 'You' : msg.sender}</span>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="message-content">{msg.text}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="typing-indicator">
            {Object.values(typingUsers).length > 0 && (
              <p>{Object.values(typingUsers).join(', ')} {Object.values(typingUsers).length === 1 ? 'is' : 'are'} typing...</p>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={messageInput}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={!isConnected}
              required
            />
            <button type="submit" disabled={!isConnected}>Send</button>
          </form>
        </div>
      </div>

      {!isConnected && (
        <div className="connection-status">
          <p>Disconnected from server. Attempting to reconnect...</p>
        </div>
      )}
    </div>
  );
}

export default Chat;