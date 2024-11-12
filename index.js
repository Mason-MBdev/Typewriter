import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));

const welcomeMessage = `Home/Server: 
Hello, welcome to terminal messenger,
You are now connected.
Type 'help' to see commands.`;

const rooms = {};

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Handle: user connection (loaded index.html page)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('chat message', welcomeMessage);

  let isListeningToMessages = false;

  // Handle: user join room
  socket.on('join room', (room_code) => {
    // Leave any room the user is currently in
    const currentRooms = Object.keys(socket.rooms);
    currentRooms.forEach((room) => {
      if (room !== socket.id) {
        console.log(`${socket.id} is leaving room: ${room}`);
        socket.leave(room);
        io.to(room).emit('chat message', `${socket.id} has left the room`);
      }
    });

    // Join the new room
    socket.join(room_code);
    console.log(`${socket.id} joined room: ${room_code}`);

    // Emit history of room chat for new user
    if (rooms[room_code] && rooms[room_code].messages) {
      socket.emit('chat history', rooms[room_code].messages);
    }

    // Initialize room if it doesn't exist
    if (!rooms[room_code]) {
      rooms[room_code] = { messages: [], users_connected: [] };
    }
    rooms[room_code].users_connected.push(socket.id);

    // Once joined, emit join message to other users
    io.to(room_code).emit('chat message', `${room_code}/Server: "${socket.id} joined room: ${room_code}"`);

    // Set up message listener once per socket
    if (!isListeningToMessages) {
      socket.on('chat message', (msg) => {
        console.log(`Message received from ${socket.id} in ${room_code}: ${msg}`);

        // Store the message in the room's message log
        rooms[room_code].messages.push(msg);

        // Emit the new message to everyone in the room
        io.to(room_code).emit('chat message', msg);
        console.log(rooms[room_code].messages);
      });
      isListeningToMessages = true; // Now listening to messages
    }

    // Handle: user disconnect from room
    socket.on('leave room', () => {
      console.log(`${socket.id} is leaving room: ${room_code}`);
      io.to(room_code).emit('chat message', `${socket.id} has left the room`);
      rooms[room_code].users_connected = rooms[room_code].users_connected.filter(userId => userId !== socket.id);
      socket.leave(room_code);
    });
  });
  
  // Handle file sending from client
  socket.on('send file', (file) => {
      console.log(`${socket.id} sending file: ${file.fileName}`);

      // Find the room the user is in (excluding the socket ID)
      const room = Array.from(socket.rooms).find(room => room !== socket.id);
      if (room) {
          // Broadcast the file to all users in the same room
          io.to(room).emit('receive file', file);
      }
  });

  // Handle: 'ls' - list all rooms
  socket.on('list rooms', () => {
      console.log("user requesting list");
      let roomsList = "Rooms avaliable:\n";

      for (const [roomName, roomAttributes] of Object.entries(rooms)) {
          const userCount = roomAttributes.users_connected.length;
          roomsList += `${roomName} - connected users (${userCount})\n`;
      }

      console.log(roomsList);
      socket.emit('chat message', roomsList);
  });

  // Handle: disconnect user from server
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    for (const room of Object.keys(rooms)) {
      rooms[room].users_connected = rooms[room].users_connected.filter(userId => userId !== socket.id);
    }
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
