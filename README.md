


# Real-Time Chat Application

This is a real-time chat application built with Node.js, Express, Socket.IO, and React. The application allows users to send and receive messages in real-time, view chat history, and see who is online.

## Features

- Real-time messaging using Socket.IO
- User login (basic implementation without authentication)
- Display of chat history
- Responsive design for mobile and desktop views
- Typing indicators
- Online user status

## Project Structure

```
chat-app/
├── client/             
│   ├── public/
│   └── src/
│       ├── components/ 
│       ├── context/   

https://github.com/user-attachments/assets/18680608-ece2-4481-b067-4844a7011808


│       ├── utils/      
│       └── App.js      
├── server/             
│   ├── .env            
│   ├── package.json    
│   └── server.js       
└── README.md           
```

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation & Setup

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5001
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   The server will start on port 5000, or the port specified in the .env file.

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The client will start on port 3000 and open in your default browser.

## How to Use

1. Open your browser and navigate to `http://localhost:](http://localhost:5174`
2. Enter a username to join the chat
3. Start sending and receiving messages in real-time

## Application Architecture

### Backend Architecture

The backend is built with Node.js and Express, using Socket.IO for real-time communication. The server handles:

- WebSocket connections via Socket.IO
- User management (connection/disconnection)
- Message broadcasting
- Typing indicators
- Online status updates

### Frontend Architecture

The frontend is built with React, using React Router for navigation and Socket.IO client for real-time communication. The main components are:

- App.jsx: Main component that sets up routing
- ChatContext.jsx: Context provider for state management
- Login.jsx: Component for user login
- Chat.jsx: Main chat interface component

## Future Improvements

- User authentication with JWT
- Persistent message storage with database




- Private messaging
- User profiles
- Read receipts
- Message search functionality
