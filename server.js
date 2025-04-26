const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const players = {}; // { playerID: { name: '', score: 0 } }

app.use(express.static('public'));
app.use(express.json()); // Needed to parse JSON in POST requests

app.post('/create', (req, res) => {
  const { name } = req.body;
  const playerID = uuidv4();
  players[playerID] = { name, score: 0 };
  res.json({ playerID });
});

app.get('/controller/:playerID', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve leaderboard at /leaderboard
app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/ticker.html'));
});

io.on('connection', (socket) => {
  socket.on('joinPlayerRoom', (playerID) => {
    socket.join(playerID);
  });

  socket.on('updateScore', ({ playerID, score }) => {
    if (players[playerID]) {
      players[playerID].score = score;
      io.emit('updateLeaderboard', players);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});