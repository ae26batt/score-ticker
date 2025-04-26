const express = require('express');
const { v4: uuidv4 } = require('uuid'); // For generating random IDs
const path = require('path');

const app = express();
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
  const playerID = uuidv4(); // Generate a random unique ID
  players[playerID] = { score: 0 }; // Initialize player state (optional)

  res.redirect(`/controller/${playerID}`);
});

// Route: Controller for a specific player
app.get('/controller/:playerID', (req, res) => {
  const { playerID } = req.params;

  if (!players[playerID]) {
    return res.status(404).send('Invalid or expired controller link.');
  }

  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

// (Optional) Route: API to get a player's score
app.get('/api/score/:playerID', (req, res) => {
  const { playerID } = req.params;

  if (!players[playerID]) {
    return res.status(404).json({ error: 'Player not found' });
  }

  res.json({ score: players[playerID].score });
});

// (Optional) Route: API to update a player's score
app.post('/api/score/:playerID', express.json(), (req, res) => {
  const { playerID } = req.params;
  const { score } = req.body;

  if (!players[playerID]) {
    return res.status(404).json({ error: 'Player not found' });
  }

  players[playerID].score = score;
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});