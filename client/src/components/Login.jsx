import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const { login } = useChat();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    login(username);
    navigate('/chat');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Chat App</h1>
        <p>Enter a username to start chatting</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    </div>
  );
}

export default Login;