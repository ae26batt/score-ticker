const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const players = {}; // Store players: { playerID: { name: 'Name', score: 0 } }

app.use(express.static('public'));
app.use(express.json());

// Serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create a new player
app.post('/create-player', (req, res) => {
  const playerId = uuidv4();
  const playerName = req.body.name || 'Unnamed Player';
  players[playerId] = { name: playerName, score: 0 };
  res.json({ playerId });
});

// Serve the controller page
app.get('/controller/:playerID', (req, res) => {
  const playerID = req.params.playerID;
  if (!players[playerID]) {
    return res.status(404).send('Player not found.');
  }
  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

// Serve the leaderboard page
app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ticker.html'));
});

// Serve the players and scores (for the leaderboard)
app.get('/api/players', (req, res) => {
  res.json(players);
});

// Update a player's score
app.post('/update-score', (req, res) => {
  const { playerId, score } = req.body;
  if (!players[playerId]) {
    return res.status(404).json({ success: false, message: 'Player not found' });
  }
  players[playerId].score = score;
  res.json({ success: true });
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});