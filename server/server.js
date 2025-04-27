const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


const server = http.createServer(app);


const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5174", // Update this to match your Vite server port
      methods: ["GET", "POST"],
      credentials: true
    }
  });


let messages = [];
const users = {};


io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  

  socket.emit('message_history', messages);
  

  socket.on('login', (username) => {
    users[socket.id] = username;
    io.emit('user_list', Object.values(users));
    io.emit('user_connected', { id: socket.id, username });
    console.log(`${username} logged in`);
  });
  

  socket.on('send_message', (message) => {
    const messageWithDetails = {
      id: Date.now(),
      text: message.text,
      sender: users[socket.id],
      senderId: socket.id,
      timestamp: new Date().toISOString()
    };
    

    messages.push(messageWithDetails);
    

    if (messages.length > 100) {
      messages = messages.slice(-100);
    }
    

    io.emit('new_message', messageWithDetails);
  });
  

  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('user_typing', {
      userId: socket.id,
      username: users[socket.id],
      isTyping
    });
  });
  

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    const username = users[socket.id];
    if (username) {
      io.emit('user_disconnected', { id: socket.id, username });
      delete users[socket.id];
      io.emit('user_list', Object.values(users));
    }
  });
});


app.get('/', (req, res) => {
  res.send('Chat Server Running');
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});