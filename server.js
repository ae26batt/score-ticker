const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

// Store player sessions
const players = {};

app.use(express.static('public'));

// Route: Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Create a new controller with unique ID
app.get('/create', (req, res) => {
  const playerID = uuidv4();
  players[playerID] = { score: 0 };
  res.redirect(`/controller/${playerID}`);
});

// Route: Controller page
app.get('/controller/:playerID', (req, res) => {
  const { playerID } = req.params;
  if (!players[playerID]) {
    return res.status(404).send('Invalid or expired controller link.');
  }
  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

// Route: Viewer/scoreboard page
app.get('/view/:playerID', (req, res) => {
  const { playerID } = req.params;
  if (!players[playerID]) {
    return res.status(404).send('Invalid or expired viewer link.');
  }
  res.sendFile(path.join(__dirname, 'public', 'viewer.html'));
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('updateScore', ({ playerID, score }) => {
    if (players[playerID]) {
      players[playerID].score = score;
      io.to(playerID).emit('scoreUpdated', { score }); // Emit only to that room
    }
  });

  socket.on('joinPlayerRoom', (playerID) => {
    socket.join(playerID); // Join socket room by player ID
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});