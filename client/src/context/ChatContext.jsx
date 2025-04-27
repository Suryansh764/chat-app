import React, { createContext, useState, useEffect, useContext } from 'react';
import socket from '../utils/socket';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMessageHistory(messageHistory) {
      setMessages(messageHistory);
    }

    function onNewMessage(message) {
      setMessages((prevMessages) => [...prevMessages, message]);
    }

    function onUserList(userList) {
      setUsers(userList);
    }

    function onUserConnected(user) {
      console.log(`${user.username} connected`);
    }

    function onUserDisconnected(user) {
      console.log(`${user.username} disconnected`);
    }

    function onUserTyping({ userId, username, isTyping }) {
      setTypingUsers((prev) => {
        if (isTyping) {
          return { ...prev, [userId]: username };
        } else {
          const newTypingUsers = { ...prev };
          delete newTypingUsers[userId];
          return newTypingUsers;
        }
      });
    }


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message_history', onMessageHistory);
    socket.on('new_message', onNewMessage);
    socket.on('user_list', onUserList);
    socket.on('user_connected', onUserConnected);
    socket.on('user_disconnected', onUserDisconnected);
    socket.on('user_typing', onUserTyping);


    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message_history', onMessageHistory);
      socket.off('new_message', onNewMessage);
      socket.off('user_list', onUserList);
      socket.off('user_connected', onUserConnected);
      socket.off('user_disconnected', onUserDisconnected);
      socket.off('user_typing', onUserTyping);
    };
  }, []);


  const login = (username) => {
    if (!username.trim()) return;
    

    socket.connect();
    

    setCurrentUser(username);
    

    socket.on('connect', () => {
      socket.emit('login', username);
    });
    
    if (socket.connected) {
      socket.emit('login', username);
    }
  };


  const sendMessage = (text) => {
    if (!text.trim() || !currentUser) return;
    
    socket.emit('send_message', {
      text,
      sender: currentUser
    });
  };


  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };


  const logout = () => {
    socket.disconnect();
    setCurrentUser(null);
    setMessages([]);
    setUsers([]);
    setTypingUsers({});
    setIsConnected(false);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        currentUser,
        typingUsers,
        isConnected,
        login,
        sendMessage,
        setTyping,
        logout
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};