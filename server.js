const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Data storage for players
const players = {};

// Serve the controller page (optional setup)
app.get('/controller/:id', (req, res) => {
  res.sendFile(__dirname + '/public/controller.html');
});

// ✅ THIS is the missing POST /create handler
app.post('/create', (req, res) => {
  const name = req.body.name;
  const id = uuidv4();

  players[id] = { name: name, score: 0 };
  res.redirect(`/controller/${id}`);
});

// API to get all players (for leaderboard)
app.get('/api/players', (req, res) => {
  res.json(players);
});

// API to update score
app.post('/api/score/:id', (req, res) => {
  const id = req.params.id;
  const delta = parseInt(req.body.delta, 10);

  if (players[id]) {
    players[id].score += delta;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});