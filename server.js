const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const players = {}; // { playerId: { name: '...', score: 0 } }

app.use(express.static('public'));
app.use(express.json());

// Serve the main controller page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to create a new player ID
app.post('/create-player', (req, res) => {
  const playerId = uuidv4();
  players[playerId] = { name: req.body.name || 'Unnamed Player', score: 0 };
  res.json({ playerId });
});

// API to update a player's score
app.post('/update-score', (req, res) => {
  const { playerId, score } = req.body;
  if (players[playerId]) {
    players[playerId].score = score;
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Player not found' });
  }
});

// API to serve all players and scores
app.get('/api/players', (req, res) => {
  res.json(players);
});

// Serve the leaderboard page
app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ticker.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});