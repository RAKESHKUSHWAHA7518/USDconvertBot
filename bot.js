// require('dotenv').config();
// const TelegramBot = require('node-telegram-bot-api');
// const token = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramBot(token, { polling: true });

// // Import required modules and handlers
// const Order = require('./db');
// const selectedOrders = require('./store'); // Update the path if needed

// const { 
//   startHandler, 
//   buyHandler, 
//   sellHandler, 
//   myHistoryHandler, 
//   reportHandler, 
//   confirmHandler, 
//   paidHandler, 
//   sellerConfirmHandler, 
//   upiHandler, 
//   setPriceHandler, 
//   bankHandler 
// } = require('./commands');

// // Register commands using regex patterns
// bot.onText(/\/start/, startHandler.bind(null, bot));
// // Example: uncomment if you want to support buy commands
// // bot.onText(/\/buy (.+)/, buyHandler.bind(null, bot));
// bot.onText(/\/sell (.+)/, sellHandler.bind(null, bot));
// bot.onText(/\/myhistory/, myHistoryHandler.bind(null, bot));
// bot.onText(/\/report (.+)/, reportHandler.bind(null, bot));
// // You can adjust or add more commands as required
// bot.onText(/\/paid/, confirmHandler.bind(null, bot));
// bot.onText(/\/confirm/, paidHandler.bind(null, bot));
// bot.onText(/\/done/, sellerConfirmHandler.bind(null, bot));
// bot.onText(/\/upi (.+)/, upiHandler.bind(null, bot));
// bot.onText(/\/bank (.+)/, bankHandler.bind(null, bot));
// bot.onText(/\/setprice\s+(\d+(\.\d+)?)/, setPriceHandler.bind(null, bot));

// // Log incoming messages
// bot.on('message', (msg) => {
//   console.log(`Message from ${msg.from.first_name} ${msg.from.last_name}: ${msg.text}`);
// });

// // Handle callback queries
// bot.on('callback_query', async (callbackQuery) => {
//   const msg = callbackQuery.message;
//   const data = callbackQuery.data;
  
//   if (data.startsWith("selectOrder_")) {
//     const orderId = data.split("_")[1];
//     const orderDetails = await Order.getOrderDetails(orderId);
  
//     if (orderDetails.error) {
//       bot.sendMessage(msg.chat.id, orderDetails.error);
//       return;
//     }
    
//     selectedOrders[orderId] = orderId;
//     const responseText = `
// Seller @${callbackQuery.from.username} accepted the order for ${orderDetails.amount} USDT at ₹${orderDetails.price} per USDT.
// Please transfer USDT to the buyer's wallet and send your transaction proof using /confirm.
//     `;
    
//     bot.sendMessage(msg.chat.id, responseText);
//     bot.answerCallbackQuery(callbackQuery.id);
//   }
// });

// // Start scheduled tasks if you have any
// require('./scheduler');

// console.log('Telegram Trading Bot is running...');

// // Export the bot instance if needed elsewhere in your app
// module.exports = bot;



// bot.js
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// load your command handlers, DB, store, scheduler, etc.
const Order = require('./db');
const selectedOrders = require('./store');
const {
  startHandler,
  buyHandler,
  sellHandler,
  myHistoryHandler,
  reportHandler,
  confirmHandler,
  paidHandler,
  sellerConfirmHandler,
  upiHandler,
  setPriceHandler,
  bankHandler
} = require('./commands');

module.exports = (app) => {
  const {
    TELEGRAM_BOT_TOKEN: token,
    WEBHOOK_URL,
    SECRET_TOKEN,
    SSL_KEY_PATH,
    SSL_CERT_PATH,
    PORT = 3000
  } = process.env;

  if (!token || !WEBHOOK_URL) {
    console.error('❌ TELEGRAM_BOT_TOKEN and WEBHOOK_URL are required in .env');
    process.exit(1);
  }

  // create bot in webhook mode
  const bot = new TelegramBot(token, {
    webHook: {
      port: PORT,
      // if you're using a self‑signed cert, uncomment:
      // key: fs.readFileSync(SSL_KEY_PATH),
      // cert: fs.readFileSync(SSL_CERT_PATH),
    }
  });
 

  // register the webhook endpoint with Telegram
  bot.setWebHook(`${WEBHOOK_URL}`, {
    secret_token: SECRET_TOKEN
  }).then(() => {
    console.log('✅ Telegram webhook set to:', `${WEBHOOK_URL}`);
  });

  // after bot.setWebHook(...)
  bot.getWebHookInfo()
  .then(info => {
    console.log('✅ Webhook info:', info);
  })
  .catch(err => {
    console.error('❌ Failed to get webhook info:', err);
  });


  // bind the webhook route to your express app
  app.post('/webhook', (req, res) => {
    bot.processUpdate(req.body);
    res.send('Welcome to the Trading Bot Homepage!');
    res.sendStatus(200); // must respond quickly
  });

  // register all your bot handlers exactly as before:
  bot.onText(/\/start/, startHandler.bind(null, bot));
  // bot.onText(/\/buy (.+)/, buyHandler.bind(null, bot));
  bot.onText(/\/sell (.+)/, sellHandler.bind(null, bot));
  bot.onText(/\/myhistory/, myHistoryHandler.bind(null, bot));
  bot.onText(/\/report (.+)/, reportHandler.bind(null, bot));
  bot.onText(/\/paid/, confirmHandler.bind(null, bot));
  bot.onText(/\/confirm/, paidHandler.bind(null, bot));
  bot.onText(/\/done/, sellerConfirmHandler.bind(null, bot));
  bot.onText(/\/upi (.+)/, upiHandler.bind(null, bot));
  bot.onText(/\/bank (.+)/, bankHandler.bind(null, bot));
  bot.onText(/\/setprice\s+(\d+(\.\d+)?)/, setPriceHandler.bind(null, bot));

  bot.on('message', (msg) => {
    console.log(`📩 ${msg.from.username || msg.from.id}: ${msg.text}`);
  });

  bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    if (data.startsWith('selectOrder_')) {
      const orderId = data.split('_')[1];
      const orderDetails = await Order.getOrderDetails(orderId);

      if (orderDetails.error) {
        await bot.sendMessage(msg.chat.id, orderDetails.error);
        return bot.answerCallbackQuery(callbackQuery.id);
      }

      selectedOrders[orderId] = orderId;
      const text = `
Seller @${callbackQuery.from.username} accepted the order for ${orderDetails.amount} USDT at ₹${orderDetails.price} per USDT.
Please transfer USDT to the buyer's wallet and send your transaction proof using /confirm.
      `;
      await bot.sendMessage(msg.chat.id, text);
      bot.answerCallbackQuery(callbackQuery.id);
    }
  });

  // if you have scheduled jobs
  require('./scheduler');

  return bot;
};
