const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Array to hold active rooms
let rooms = [];

// Socket.io connections
io.on("connection", (socket) => {
  console.log("a user connected");

  // Show rooms
  socket.on("ShowRooms", () => {
    socket.emit("roomListUpdate", rooms);
  });

  // Create a new room
  socket.on("createRoom", (roomName, username) => {
    if (roomName && username) {
      socket.join(roomName);
      socket.room = roomName;
      socket.username = username;
      rooms.push({
        name: roomName,
        players: [{ name: socket.username, id: socket.id }],
      });
      console.log(`${socket.username} created and joined ${roomName}`);
      updateRoomList();
      socket.emit("roomCreated", roomName);
    } else {
      console.log("Room name or username is missing.");
    }
    console.log(rooms);
  });

  // Join an existing room
  socket.on("joinRoom", ({ roomName, username }) => {
    if (roomName && username) {
      socket.join(roomName);
      socket.room = roomName;
      socket.username = username;
      const room = rooms.find((r) => r.name === roomName);
      if (room) {
        room.players.push({ name: username, id: socket.id });
      } else {
        rooms.push({
          name: roomName,
          players: [{ name: username, id: socket.id }],
        });
      }
      console.log(`${username} joined ${roomName}`);
      updateRoomList();
      if (room && room.players.length === 2) {
        io.to(roomName).emit("roomReady", roomName, room.players);
      }
      socket.emit("ShowRooms"); // Emit ShowRooms event after joining a room
    } else {
      console.log("Room name or username is missing.");
    }
  });

  // Start game in a room
  socket.on("startGame", (roomName) => {
    io.to(roomName).emit("gameStart", roomName);
  });

  // Handle game actions
  socket.on("gameAction", (roomName, action, data) => {
    io.to(roomName).emit(action, data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
    if (socket.room) {
      const room = rooms.find((r) => r.name === socket.room);
      if (room) {
        room.players = room.players.filter((p) => p.name !== socket.username);
        if (room.players.length === 0) {
          rooms = rooms.filter((r) => r.name !== socket.room);
        }
        updateRoomList();
      }
    }
  });

  // Update room list for all clients
  function updateRoomList() {
    io.emit("roomListUpdate", rooms);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
