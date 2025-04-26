const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

// In-memory player scores
let players = {
    "Alice": 0,
    "Bob": 0,
    "Charlie": 0
};

app.use(express.json());
app.use(express.static('public'));

// ➡️ New dynamic player page route (PUT THIS HERE, AFTER app is created)
app.get('/player/:name', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Player Score Control</title>
        <script>
            const player = "${req.params.name}";
            async function updateScore(delta) {
                await fetch('/api/score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ player, delta })
                });
                loadScore();
            }

            async function loadScore() {
                const res = await fetch('/api/scores');
                const scores = await res.json();
                const score = scores[player];
                document.getElementById('score').innerText = score !== undefined ? score : 'N/A';
            }

            setInterval(loadScore, 3000);
            window.onload = loadScore;
        </script>
    </head>
    <body>
        <h1>Score Control for <span id="playerName">${req.params.name}</span></h1>
        <h2>Score: <span id="score">0</span></h2>
        <button onclick="updateScore(1)">➕</button>
        <button onclick="updateScore(-1)">➖</button>
    </body>
    </html>
    `);
});

// ➡️ Keep your API routes after that
app.get('/api/scores', (req, res) => {
    res.json(players);
});

app.post('/api/score', (req, res) => {
    const { player, delta } = req.body;
    if (players[player] !== undefined) {
        players[player] += delta;
        res.json({ success: true, players });
    } else {
        res.status(404).json({ success: false, message: "Player not found" });
    }
});

// Start server
http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
