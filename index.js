require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
// const token = '7596897956:AAF61ybdT5B6BMHdWbCnxqygVUQ4Xt5BolI'; // Replace with your actual token
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const Order = require('./db');
const selectedOrders = require('./store'); // Update the path if needed

const { startHandler, buyHandler, sellHandler, myHistoryHandler, reportHandler, confirmHandler, paidHandler, sellerConfirmHandler, upiHandler, setPriceHandler, banklHandler, bankHandler } = require('./commands');

// Register commands using regex patterns
bot.onText(/\/start/, startHandler.bind(null, bot));
// bot.onText(/\/buy (.+)/, buyHandler.bind(null, bot));
bot.onText(/\/sell (.+)/, sellHandler.bind(null, bot));
bot.onText(/\/myhistory/, myHistoryHandler.bind(null, bot));
bot.onText(/\/report (.+)/, reportHandler.bind(null, bot));
// bot.onText(/\/confirm/, confirmHandler.bind(null, bot));
bot.onText(/\/paid/, confirmHandler.bind(null, bot));
bot.onText(/\/confirm/,paidHandler.bind(null, bot));
bot.onText(/\/done/, sellerConfirmHandler.bind(null, bot));
bot.onText(/\/upi (.+)/, upiHandler.bind(null, bot));
bot.onText(/\/bank (.+)/, bankHandler.bind(null, bot));
// This example assumes you are using a command parser that supports regex matching
bot.onText(/\/setprice\s+(\d+(\.\d+)?)/, setPriceHandler.bind(null, bot));

// bot.on('photo', confirmHandler.bind(null, bot));

// bot.on('photo', (msg) => {
//     bot.sendMessage(msg.chat.id, "Photo received!");
//   });
// Optionally, log incoming messages
bot.on('message', (msg) => {
    // console.log( msg );
//   console.log(`Message from ${msg.from.first_name}: ${msg.text}`);
console.log(`Message from ${msg.from.first_name} ${msg.from.last_name}: ${msg.text}`);

});

bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    if (data.startsWith("selectOrder_")) {
        const orderId = data.split("_")[1];
        
        const orderDetails = await Order.getOrderDetails(orderId);
      
        if (orderDetails.error) {
          bot.sendMessage(msg.chat.id, orderDetails.error);
          return;
        }
        selectedOrders[orderId] = orderId;
        const responseText = `
      Seller @${callbackQuery.from.username} accepted the order for ${orderDetails.amount} USDT at ₹${orderDetails.price} per USDT.
      Please transfer USDT to the buyer's wallet and send your transaction proof using /confirm.
        `;
      
        bot.sendMessage(msg.chat.id, responseText);
        bot.answerCallbackQuery(callbackQuery.id);
      }
      
    
  });

// Start the scheduled tasks
require('./scheduler');

console.log('Telegram Trading Bot is running...');
