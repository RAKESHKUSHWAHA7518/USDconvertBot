 

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import the Telegram Bot module (this will run the bot)
require('./bot');

app.get('/', (req, res) => {
  res.send('Welcome to the Trading Bot Homepage!');
});

// You can add more endpoints here as needed
// For example: app.get('/status', (req, res) => { ... });

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
