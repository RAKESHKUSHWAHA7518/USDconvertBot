 

// require('dotenv').config();
// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3000;

// // Import the Telegram Bot module (this will run the bot)
// require('./bot');

// app.get('/', (req, res) => {
//   res.send('Welcome to the Trading Bot Homepage!');
// });

// // You can add more endpoints here as needed
// // For example: app.get('/status', (req, res) => { ... });

// app.listen(port, () => {
//   console.log(`Express server is listening on port ${port}`);
// });


// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// parse JSON bodies (needed for Telegram webhook)
app.use(express.json());

// import & initialize the bot, passing in your express app
require('./bot')(app);

// simple homepage
app.get('/', (req, res) => {
  res.send('Welcome to the Trading Bot Homepage ii!');
});

// example status endpoint
app.get('/status', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
