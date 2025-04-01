// const { saveBuyOrder, getMatchingBuyOrder, recordSellerResponse, getUserHistory, generateDailyReport, markOrderStep, getTransactionDetails, getOrderDetails, updateSellOrderInDB, createSellOrderInDB,   } = require('./db');
// const axios = require('axios');
// const { verifyTronTransaction } = require('./tron');
// const { getOrderById } = require('./db');
// const Tesseract = require('tesseract.js');
// const selectedOrders = require('./store');
// const orders = require('./store');

// function createOrder(orderId, totalAmount, chatId) {
//   // Initialize the order with totalAmount and start with 0 paid
//   orders[orderId] = {
//     totalAmount: totalAmount,
//     amountPaid: 0,
//     status: "created" // optional status field
//   };

//   // Link the order to the user's chat
//   selectedOrders[chatId] = orderId;
// }
// function startHandler(bot, msg) {
//   const welcomeText = `
// Welcome to the USDT-INR Exchange Bot!
// Available commands:
 
// /sell <amount> - Accept a buy order
// /paid hash id and Screenshot USDT transfer
// /confirm - Mark INR payment as complete
// /myhistory - Show your transaction history
// /report <YYYY-MM-DD> - Get the daily report
// /upi  - upi id
// /bank -/bank <account_number> <IFSC> <branch> <name>

 
//   `;
//   bot.sendMessage(msg.chat.id, welcomeText);
// }

 

// async function setPriceHandler(bot, msg, match) {
//   // Replace 'BOT_ADMIN' with the actual bot admin's username, or check against a list of admin IDs.
//   const allowedUser = 'Mukesh760796';
//   console.log(msg);
//   console.log(match);
  
//   if (msg.from.username !== allowedUser) {
//     bot.sendMessage(msg.chat.id, "Unauthorized: This command is restricted.");
//     return;
//   }

//   // match[1] will capture the price value provided by the admin.
//   const newPrice = match[1];
//   if (isNaN(newPrice)) {
//     bot.sendMessage(msg.chat.id, "Usage: /setprice <price_value>\nExample: /setprice 50");
//     return;
//   }
  
//   try {
//     // Assume setPriceInDB is a function that updates the price in your database or configuration storage.
//     const orderId = saveBuyOrder({
      
     
//       price:newPrice,
      
//       createdAt: new Date()
//     });
//     console.log(orderId);
    
//     // await setPriceInDB({ jsdtPriceINR: newPrice });
//     bot.sendMessage(msg.chat.id, `Price updated: 1 JSDT is now set to ₹${newPrice} INR.`);
//   } catch (error) {
//     console.error("Error updating price:", error);
//     bot.sendMessage(msg.chat.id, "Failed to update the price. Please try again later.");
//   }
// }


// async function sellHandler(bot, msg, match) {
//   const amount = parseFloat(match[1]);
//   if (isNaN(amount)) {
//     bot.sendMessage(msg.chat.id, "Usage: /sell <amount>");
//     return;
//   }

//   const price =await getMatchingBuyOrder()
//   // console.log(price);
//   const lastvalue = price[price.length - 1];
//   console.log(lastvalue);
  
//   // Check if the order amount is between $10 and $10,000
//   if (amount < 10 || amount > 10000) {
//     bot.sendMessage(msg.chat.id, "Please specify an order amount between $10 and $10,000.");
//     return;
//   }

//   // Create a new sell order with initial details and a sequential order number
//   const sellOrderData = {
//     seller: msg.from.username,
//     amount,
//     createdAt: new Date(),
//     status: 'pending'
//   };

//   const newSellOrder = await createSellOrderInDB(sellOrderData);
//   console.log("New sell order created:", newSellOrder);
 
   

//     await updateSellOrderInDB(newSellOrder._id, {
//       // matchedBuyOrder: order._id,
//       price: lastvalue.price,
//       matchedAt: new Date(),
//       status: 'matched'
//     });

//     selectedOrders[msg.chat.id] = newSellOrder._id;

//     recordSellerResponse(newSellOrder._id, {
//       seller: msg.from.username,
//       amount,
//       respondedAt: new Date()
//     });

//     const responseText = `
// ✅ Order #${newSellOrder.orderNumber}
// Seller @${msg.from.username} accepted your  order for ${amount} USDT at ₹${lastvalue.price} per USDT. INR: ₹${amount*lastvalue.price} 
// Please transfer USDT to the buyer's wallet (USDT TRC20) and Address:TUwxkYU7hJZCnqi1rCgZeBuDxQvuzC2Leq send your transaction proof using /paid.
//     `;
//     bot.sendMessage(msg.chat.id, responseText);
//   // } else {
//   //   // If multiple matching orders exist, provide an inline keyboard for selection.
//   //   const inlineKeyboard = matchingOrders.map(order => ([{
//   //     text: `Order #${newSellOrder.orderNumber} at ₹${order.price}`,
//   //     callback_data: `selectOrder_${order._id}`
//   //   }]));

// //     const responseText = `
// // ✅ Order #${newSellOrder.orderNumber}
// // Multiple matching orders found. Please select one:
// //     `;
// //     bot.sendMessage(msg.chat.id, responseText, {
// //       reply_markup: {
// //         inline_keyboard: inlineKeyboard
// //       }
// //     });
//   // }
// }


// async function confirmHandler(bot, msg) {
//   // Use the text from the incoming message
//   const text = msg.text;
//   const match = text.match(/\/paid\s+(\w+)/);
// console.log(match);

//   if (!match || !match[1]) {
//     bot.sendMessage(msg.chat.id, "Usage: /confirm <transaction_token>");
//     return;
//   }
  
//   const token = match[1];
//   console.log("Transaction token:", token);

//   // Retrieve the stored order ID for this chat
//   const orderId = selectedOrders[msg.chat.id];
//   console.log("Stored orderId:", orderId);
  
//   if (!orderId) {
//     bot.sendMessage(msg.chat.id, "No order selected for confirmation. Please select an order first.");
//     return;
//   }

//   // Verify the transaction using the extracted token
//   const verification = await verifyTronTransaction(token);
//   console.log(verification);
//   const orderDetails = await getOrderDetails(orderId);
//   if (verification) {
//     // Mark the order step as "USDT_sent"
//     // await markOrderStep(orderId, "USDT_sent");

//     // Retrieve the order details to calculate the total INR amount the buyer has to pay
//     // Assume Order.getOrderDetails(orderId) returns an object with 'amount' and 'price' fields
//     const orderDetails = await getOrderDetails(orderId);
//     console.log("RRR ",orderDetails);
    
//     if (orderDetails && !orderDetails.error) {
//       // Calculate total in INR: (USDT amount) * (price in INR per USDT)
//       const totalINR = orderDetails.amount * orderDetails.price;
//       bot.sendMessage(
//         msg.chat.id, 
//         `✅ Order #${orderDetails.orderNumber}  ${orderDetails.amount} USDT TRC20 transaction verified. I will pay ₹${totalINR} INR. Share your  upi Id or Bank detail  /upi upi or /bank  bank details`
//       );
//       await updateSellOrderInDB(orderId, {
//         // For example, you could update the status or add other details
//         status: 'confirmed'
//       });
//       createOrder(orderId, totalINR, msg.chat.id);
//     } else {
//       // Fallback message if order details could not be retrieved
//       bot.sendMessage(msg.chat.id, `Order #${orderDetails.orderNumber} USDT transaction verified. Waiting for buyer confirmation.`);
//     }
//     // await markOrderStep(orderId, "USDT_sent");
//   } else {
//     bot.sendMessage(msg.chat.id, `Order #${orderDetails.orderNumber} Transaction verification failed. Please try again.`);
//   }
// }

  
  
 

// async function paidHandler(bot, msg, match) {
//   console.log(match);
//   ;
  
//   // Extract payment amount from the command
//   const paidAmount = match.input.split(' ')[1];
//   console.log(paidAmount);
//   const orderId = selectedOrders[msg.chat.id];
//   console.log(orderId)
//   const orderDetails = await getOrderDetails(orderId);
//   if (isNaN(paidAmount) || paidAmount <= 0) {
//     bot.sendMessage(msg.chat.id, ` Order #${orderDetails.orderNumber} Please enter a valid amount. Example: /paid 5000`);
//     return;
//   }

//   // Retrieve the order using the chat ID from the global mapping
//   ;
  
//   if (!orderId || !orders[orderId]) {
//     bot.sendMessage(msg.chat.id, "Order not found.");
//     return;
//   }
  
//   const order = orders[orderId];

//   // Update the order's paid amount (initialize to 0 if undefined)
//   // order.amountPaid = (order.amountPaid || 0) + paidAmount;
//   order.amountPaid = (Number(order.amountPaid) || 0) + Number(paidAmount);

// console.log(order.amountPaid);

//   // Check the payment status and notify the user accordingly
//   if (order.amountPaid < order.totalAmount) {
//     const remaining = order.totalAmount - order.amountPaid;
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Partial payment detected.\nYou have paid ₹${order.amountPaid} out of ₹${order.totalAmount}.\nPlease pay the remaining ₹${remaining}.`
//     );
//   } else if (order.amountPaid === order.totalAmount) {
//     markOrderStep(orderId, "INR_paid");
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Payment complete. Waiting for seller confirmation of INR receipt. /done`
//     );
//   } else {
//     const extra = order.amountPaid - order.totalAmount;
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Payment complete with ₹${extra} extra paid. Waiting for seller confirmation. /done`
//     );
//   }
// }


// async function sellerConfirmHandler(bot, msg) {
//   // Retrieve the stored order ID using the chat id
//   const orderId = selectedOrders[msg.chat.id];
//   const orderDetails = await getOrderDetails(orderId);
//   if (!orderId) {
//     bot.sendMessage(msg.chat.id, `  Order #${orderDetails.orderNumber} No order associated with this chat. Please select an order first.`);
//     return;
//   }
  
//   try {
//     // Update the order status to "transaction_done"
//     // await markOrderStep(orderId, "transaction_done");
    
//     // Send a confirmation message with a thumbs-up and confirmation text
//     bot.sendMessage(msg.chat.id, `✅ Order #${orderDetails.orderNumber} 👍 Good done! Transaction completed successfully.`);
    
//     // Optionally, remove the order from the global store after confirmation
//     delete selectedOrders[msg.chat.id];
//   } catch (error) {
//     console.error("Error finalizing seller confirmation:", error);
//     bot.sendMessage(msg.chat.id, ` Order #${orderDetails.orderNumber} Error finalizing the transaction. Please try again.`);
//   }
// }

 


// function myHistoryHandler(bot, msg) {
//   const history = getUserHistory(msg.from.username);
//   if (!history || history.length === 0) {
//     bot.sendMessage(msg.chat.id, "No transaction history found.");
//     return;
//   }
//   const historyText = history.map((t) => `${t.date}: ${t.details}`).join('\n');
//   bot.sendMessage(msg.chat.id, historyText);
// }

// async function upiHandler(bot, msg, match) {
//   const orderId = selectedOrders[msg.chat.id];
//   console.log(orderId)
//   console.log(match);
  
//   const orderDetails = await getOrderDetails(orderId);
//   const upiId = match[1].trim();
//    // Extract and trim the UPI ID
//   // Here you can add your custom logic to handle the UPI ID.
//   // For example, store it in a database or verify its format.
//   bot.sendMessage(msg.chat.id, `✅ Order #${orderDetails.orderNumber} Received your UPI ID: ${upiId}`);
// }

// async function banklHandler(bot, msg, match) {
//   const orderId = selectedOrders[msg.chat.id];
//   console.log(orderId)
//   console.log(match);
  
//   const orderDetails = await getOrderDetails(orderId);

//   // const upiId = match[1].trim();
//   const args = match[1].split(' ');
//   if (args.length < 5) {
//     bot.sendMessage(msg.chat.id, 'Usage: /bank <account_number> <IFSC> <branch> <name>');
//     return;
//   }
//   const bankDetails = {
//     account_number: args[0],
//     // bank_name: args[1],
//     IFSC: args[1],
//     branch: args[2],
//     name: args.slice(3).join(' ') // Joins remaining arguments as the name
//   };
//   console.log(bankDetails);
  
//    // Extract and trim the UPI ID
//   // Here you can add your custom logic to handle the UPI ID.
//   // For example, store it in a database or verify its format.
//   // bot.sendMessage(msg.chat.id, `✅ Order #${orderDetails.orderNumber} Bank details received successfully! : Account Number: ${bankDetails?.account_number},Bank Name:${bankDetails.bank_name},IFSC Code: ${bankDetails?.IFSC},Branch Name: ${bankDetails.branch},Account holder ${bankDetails.name}, `);
//   bot.sendMessage(msg.chat.id, `✅ Order #${orderDetails.orderNumber} Bank details received successfully!
//     Account Number: ${bankDetails?.account_number}
//     IFSC Code: ${bankDetails?.IFSC}
//     Branch Name: ${bankDetails.branch}
//     Account Holder: ${bankDetails.name}`);
    
// }


// function reportHandler(bot, msg, match) {
//   const reportDate = match[1].trim();
//   const reportData = generateDailyReport(reportDate);
//   if (reportData) {
//     const reportText = `
// USDT-INR Report for ${reportDate}
// Total Trades: ${reportData.totalTrades}
// Total USDT Traded: ${reportData.totalUSDT} USDT
// Exchange Price: ₹${reportData.exchangePrice}
// INR Received: ₹${reportData.inrReceived}
// INR Pending: ₹${reportData.inrPending}
//     `;
//     bot.sendMessage(msg.chat.id, reportText);
//   } else {
//     bot.sendMessage(msg.chat.id, "No data available for this date.");
//   }
// }



// module.exports = {
//   startHandler,
//   setPriceHandler,
//   sellHandler,
//   myHistoryHandler,
//   reportHandler,
//   confirmHandler,
//   paidHandler,
//   sellerConfirmHandler,
//   upiHandler,
//   banklHandler
// };


// multiple user

// const { saveBuyOrder, getMatchingBuyOrder, recordSellerResponse, getUserHistory, generateDailyReport, markOrderStep, getTransactionDetails, getOrderDetails, updateSellOrderInDB, createSellOrderInDB, getOrderIdByNumber, getOrdersByUsername } = require('./db');
// const axios = require('axios');
// const { verifyTronTransaction } = require('./tron');
// const { getOrderById } = require('./db');
// const Tesseract = require('tesseract.js');
// const selectedOrders = {};
// const orders = {};

// // Utility function to check if a message is from a group chat
// function isGroupChat(msg) {
//   return msg.chat.type === 'group' || msg.chat.type === 'supergroup';
// }

// // Utility function to get the appropriate key for tracking orders
// function getOrderKey(msg) {
//   return isGroupChat(msg) ? `${msg.from.id}_${msg.chat.id}` : msg.chat.id;
// }

// function createOrder(orderId, totalAmount, msg) {
//   // Initialize the order with totalAmount and start with 0 paid
//   orders[orderId] = {
//     totalAmount: totalAmount,
//     amountPaid: 0,
//     status: "created", // optional status field
//     userId: msg.from.id,
//     username: msg.from.username
//   };

//   // Link the order to the user's chat using the appropriate key
//   selectedOrders[getOrderKey(msg)] = orderId;
// }

// function startHandler(bot, msg) {
//   const welcomeText = `
// Welcome to the USDT-INR Exchange Bot!
// Available commands:
 
// /sell <amount> - Accept a buy order
// /paid <amount> [orderNumber] - Report payment made
// /confirm <hash> - Confirm USDT transaction
// /done - Mark INR payment as complete
// /myhistory - Show your transaction history
// /myorders - List your active orders
// /report <YYYY-MM-DD> - Get the daily report
// /upi <upi_id> - Share your UPI ID
// /bank <account_number> <IFSC> <branch> <name> - Share bank details
 
//   `;
//   bot.sendMessage(msg.chat.id, welcomeText);
// }

// async function setPriceHandler(bot, msg, match) {
//   // Replace 'BOT_ADMIN' with the actual bot admin's username
//   const allowedUser = 'Mukesh760796';
  
//   if (msg.from.username !== allowedUser) {
//     bot.sendMessage(msg.chat.id, "Unauthorized: This command is restricted.");
//     return;
//   }

//   // match[1] will capture the price value provided by the admin.
//   const newPrice = match[1];
//   if (isNaN(newPrice)) {
//     bot.sendMessage(msg.chat.id, "Usage: /setprice <price_value>\nExample: /setprice 50");
//     return;
//   }
  
//   try {
//     const orderId = saveBuyOrder({
//       price: newPrice,
//       createdAt: new Date()
//     });
    
//     const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Price updated: 1 USDT is now set to ₹${newPrice} INR.`);
//   } catch (error) {
//     console.error("Error updating price:", error);
//     const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Failed to update the price. Please try again later.`);
//   }
// }

// async function sellHandler(bot, msg, match) {
//   const amount = parseFloat(match[1]);
//   if (isNaN(amount)) {
//     const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Usage: /sell <amount>`);
//     return;
//   }

//   const price = await getMatchingBuyOrder();
//   const lastvalue = price[price.length - 1];
  
//   // Check if the order amount is between $10 and $10,000
//   if (amount < 10 || amount > 10000) {
//     const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Please specify an order amount between $10 and $10,000.`);
//     return;
//   }

//   // Create a new sell order with initial details
//   const sellOrderData = {
//     seller: msg.from.username,
//     sellerId: msg.from.id,
//     amount,
//     createdAt: new Date(),
//     status: 'pending',
//     chatType: isGroupChat(msg) ? 'group' : 'private',
//     chatId: msg.chat.id
//   };

//   const newSellOrder = await createSellOrderInDB(sellOrderData);
  
//   await updateSellOrderInDB(newSellOrder._id, {
//     price: lastvalue.price,
//     matchedAt: new Date(),
//     status: 'matched'
//   });

//   selectedOrders[getOrderKey(msg)] = newSellOrder._id;

//   recordSellerResponse(newSellOrder._id, {
//     seller: msg.from.username,
//     sellerId: msg.from.id,
//     amount,
//     respondedAt: new Date()
//   });

//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
//   const responseText = `
// ${replyPrefix}✅ Order #${newSellOrder.orderNumber}
// Seller @${msg.from.username} accepted your order for ${amount} USDT at ₹${lastvalue.price} per USDT. 
// Total INR: ₹${amount*lastvalue.price} 
// Please transfer USDT to the buyer's wallet (USDT TRC20) and Address: TUwxkYU7hJZCnqi1rCgZeBuDxQvuzC2Leq
// Send your transaction proof using /confirm <hash>.
//   `;
//   bot.sendMessage(msg.chat.id, responseText);
// }

// async function confirmHandler(bot, msg, match) {
//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
//   console.log(match);
//   console.log(match[1]);
  
//   if (!match || !match[1]) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Usage: /confirm <transaction_hash> [orderNumber]`);
//     return;
//   }
  
//   const hash = match[1];
//   const orderNumber = match[2]; // Optional order number for group chats
  
//   let orderId;
  
//   if (isGroupChat(msg) && orderNumber) {
//     // If in group chat and order number is provided, look up by order number
//     orderId = await getOrderIdByNumber(orderNumber);
//     if (!orderId) {
//       bot.sendMessage(msg.chat.id, `${replyPrefix}Order #${orderNumber} not found.`);
//       return;
//     }
//   } else {
//     // Use the stored order ID for this user/chat
//     orderId = selectedOrders[getOrderKey(msg)];
//   }
  
//   if (!orderId) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}No order selected for confirmation. Please select an order first or specify the order number.`);
//     return;
//   }

//   // Verify the transaction using the extracted hash
//   const verification = await verifyTronTransaction(hash);
//   const orderDetails = await getOrderDetails(orderId);
  
//   if (!orderDetails) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Order details not found.`);
//     return;
//   }
  
//   if (verification) {
//     if (orderDetails && !orderDetails.error) {
//       // Calculate total in INR: (USDT amount) * (price in INR per USDT)
//       const totalINR = orderDetails.amount * orderDetails.price;
//       bot.sendMessage(
//         msg.chat.id, 
//         `${replyPrefix}✅ Order #${orderDetails.orderNumber}: ${orderDetails.amount} USDT TRC20 transaction verified. I will pay ₹${totalINR} INR. Share your UPI ID (/upi <upi_id>) or bank details (/bank <account_number> <IFSC> <branch> <name>)`
//       );
      
//       await updateSellOrderInDB(orderId, {
//         status: 'confirmed',
//         transactionHash: hash
//       });
      
//       createOrder(orderId, totalINR, msg);
//     } else {
//       // Fallback message if order details could not be retrieved
//       bot.sendMessage(msg.chat.id, `${replyPrefix}Order #${orderDetails.orderNumber} USDT transaction verified. Waiting for buyer confirmation.`);
//     }
//   } else {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Order #${orderDetails.orderNumber} Transaction verification failed. Please try again.`);
//   }
// }

// async function paidHandler(bot, msg, match) {
//   // Extract payment amount and optional order number from the command
//   const parts = match.input.split(' ').slice(1);
//   const paidAmount = parseFloat(parts[0]);
//   const orderNumber = parts.length > 1 ? parts[1] : null;
  
//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
  
//   if (isNaN(paidAmount) || paidAmount <= 0) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Please enter a valid amount. Example: /paid 5000 [orderNumber]`);
//     return;
//   }

//   // Retrieve the order using either the order number (for groups) or chat ID
//   let orderId;
  
//   if (isGroupChat(msg) && orderNumber) {
//     orderId = await getOrderIdByNumber(orderNumber);
//     if (!orderId) {
//       bot.sendMessage(msg.chat.id, `${replyPrefix}Order #${orderNumber} not found.`);
//       return;
//     }
//   } else {
//     orderId = selectedOrders[getOrderKey(msg)];
//   }
  
//   if (!orderId || !orders[orderId]) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Order not found.`);
//     return;
//   }
  
//   const order = orders[orderId];
//   const orderDetails = await getOrderDetails(orderId);
  
//   // Verify this is the buyer trying to mark payment
//   if (order.userId !== msg.from.id) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Only the buyer for this order can mark payments.`);
//     return;
//   }

//   // Update the order's paid amount
//   order.amountPaid = (Number(order.amountPaid) || 0) + Number(paidAmount);

//   // Check the payment status and notify the user accordingly
//   if (order.amountPaid < order.totalAmount) {
//     const remaining = order.totalAmount - order.amountPaid;
//     bot.sendMessage(
//       msg.chat.id,
//       `${replyPrefix}✅ Order #${orderDetails.orderNumber} Partial payment detected.\nYou have paid ₹${order.amountPaid} out of ₹${order.totalAmount}.\nPlease pay the remaining ₹${remaining}.`
//     );
//   } else if (order.amountPaid === order.totalAmount) {
//     await markOrderStep(orderId, "INR_paid");
//     await updateSellOrderInDB(orderId, {
//       status: 'paid',
//       amountPaid: order.amountPaid
//     });
    
//     bot.sendMessage(
//       msg.chat.id,
//       `${replyPrefix}✅ Order #${orderDetails.orderNumber} Payment complete. Waiting for seller confirmation of INR receipt. Seller can confirm using /done [orderNumber]`
//     );
//   } else {
//     const extra = order.amountPaid - order.totalAmount;
//     await markOrderStep(orderId, "INR_paid");
//     await updateSellOrderInDB(orderId, {
//       status: 'paid',
//       amountPaid: order.amountPaid,
//       extraPaid: extra
//     });
    
//     bot.sendMessage(
//       msg.chat.id,
//       `${replyPrefix}✅ Order #${orderDetails.orderNumber} Payment complete with ₹${extra} extra paid. Waiting for seller confirmation. Seller can confirm using /done [orderNumber]`
//     );
//   }
// }

// async function sellerConfirmHandler(bot, msg, match) {
//   const parts = match.input.split(' ').slice(1);
//   const orderNumber = parts.length > 0 ? parts[0] : null;
  
//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
  
//   // Retrieve the stored order ID
//   let orderId;
  
//   if (isGroupChat(msg) && orderNumber) {
//     orderId = await getOrderIdByNumber(orderNumber);
//     if (!orderId) {
//       bot.sendMessage(msg.chat.id, `${replyPrefix}Order #${orderNumber} not found.`);
//       return;
//     }
//   } else {
//     orderId = selectedOrders[getOrderKey(msg)];
//   }
  
//   if (!orderId) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}No order associated with this chat. Please select an order first or specify order number.`);
//     return;
//   }
  
//   const orderDetails = await getOrderDetails(orderId);
  
//   // Verify this is the seller trying to confirm
//   if (orderDetails.seller !== msg.from.username) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Only the seller (@${orderDetails.seller}) can confirm this order.`);
//     return;
//   }
  
//   try {
//     // Update the order status to "transaction_done"
//     await markOrderStep(orderId, "transaction_done");
//     await updateSellOrderInDB(orderId, {
//       status: 'completed',
//       completedAt: new Date()
//     });
    
//     // Send a confirmation message
//     bot.sendMessage(msg.chat.id, `${replyPrefix}✅ Order #${orderDetails.orderNumber} 👍 Good done! Transaction completed successfully.`);
    
//     // Remove the order from the tracking objects
//     delete selectedOrders[getOrderKey(msg)];
//     delete orders[orderId];
//   } catch (error) {
//     console.error("Error finalizing seller confirmation:", error);
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Error finalizing the transaction. Please try again.`);
//   }
// }

// async function myHistoryHandler(bot, msg) {
//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
  
//   const history = await getUserHistory(msg.from.username);
//   if (!history || history.length === 0) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}No transaction history found.`);
//     return;
//   }
  
//   const historyText = history.map((t) => `${t.date}: ${t.details}`).join('\n');
//   bot.sendMessage(msg.chat.id, `${replyPrefix}Your transaction history:\n${historyText}`);
// }

// async function myOrdersHandler(bot, msg) {
//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
  
//   const userOrders = await getOrdersByUsername(msg.from.username);
//   if (!userOrders || userOrders.length === 0) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}You have no active orders.`);
//     return;
//   }
  
//   const ordersList = userOrders.map(order => 
//     `Order #${order.orderNumber}: ${order.amount} USDT at ₹${order.price} - Status: ${order.status}`
//   ).join('\n');
  
//   bot.sendMessage(msg.chat.id, `${replyPrefix}Your active orders:\n${ordersList}`);
// }

// async function upiHandler(bot, msg, match) {
//   const parts = match.input.split(' ').slice(1);
//   const upiId = parts[0];
//   const orderNumber = parts.length > 1 ? parts[1] : null;
  
//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
  
//   if (!upiId) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Usage: /upi <upi_id> [orderNumber]`);
//     return;
//   }
  
//   // Retrieve the stored order ID
//   let orderId;
  
//   if (isGroupChat(msg) && orderNumber) {
//     orderId = await getOrderIdByNumber(orderNumber);
//     if (!orderId) {
//       bot.sendMessage(msg.chat.id, `${replyPrefix}Order #${orderNumber} not found.`);
//       return;
//     }
//   } else {
//     orderId = selectedOrders[getOrderKey(msg)];
//   }
  
//   if (!orderId) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}No order associated with this chat. Please select an order first or specify order number.`);
//     return;
//   }
  
//   const orderDetails = await getOrderDetails(orderId);
  
//   // Update the order with UPI details
//   await updateSellOrderInDB(orderId, {
//     paymentMethod: 'UPI',
//     upiId: upiId
//   });
  
//   bot.sendMessage(msg.chat.id, `${replyPrefix}✅ Order #${orderDetails.orderNumber} Received your UPI ID: ${upiId}`);
// }

// async function bankHandler(bot, msg, match) {
//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
  
//   const inputText = match.input.slice(match.input.indexOf(' ') + 1);
//   const parts = inputText.split(' ');
  
//   // Check if there's enough arguments for bank details
//   if (parts.length < 4) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}Usage: /bank <account_number> <IFSC> <branch> <name> [orderNumber]`);
//     return;
//   }
  
//   // The last part could be an order number if it starts with '#'
//   let orderNumber = null;
//   let nameEndIndex = parts.length;
  
//   if (parts[parts.length - 1].startsWith('#')) {
//     orderNumber = parts[parts.length - 1].substring(1);
//     nameEndIndex = parts.length - 1;
//   }
  
//   const bankDetails = {
//     account_number: parts[0],
//     IFSC: parts[1],
//     branch: parts[2],
//     name: parts.slice(3, nameEndIndex).join(' ')
//   };
  
//   // Retrieve the stored order ID
//   let orderId;
  
//   if (isGroupChat(msg) && orderNumber) {
//     orderId = await getOrderIdByNumber(orderNumber);
//     if (!orderId) {
//       bot.sendMessage(msg.chat.id, `${replyPrefix}Order #${orderNumber} not found.`);
//       return;
//     }
//   } else {
//     orderId = selectedOrders[getOrderKey(msg)];
//   }
  
//   if (!orderId) {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}No order associated with this chat. Please select an order first or specify order number.`);
//     return;
//   }
  
//   const orderDetails = await getOrderDetails(orderId);
  
//   // Update the order with bank details
//   await updateSellOrderInDB(orderId, {
//     paymentMethod: 'Bank Transfer',
//     bankDetails: bankDetails
//   });
  
//   bot.sendMessage(msg.chat.id, `${replyPrefix}✅ Order #${orderDetails.orderNumber} Bank details received successfully!
// Account Number: ${bankDetails.account_number}
// IFSC Code: ${bankDetails.IFSC}
// Branch Name: ${bankDetails.branch}
// Account Holder: ${bankDetails.name}`);
// }

// async function reportHandler(bot, msg, match) {
//   const replyPrefix = isGroupChat(msg) ? `@${msg.from.username}, ` : '';
  
//   const reportDate = match[1].trim();
//   const reportData = await generateDailyReport(reportDate);
  
//   if (reportData) {
//     const reportText = `
// ${replyPrefix}USDT-INR Report for ${reportDate}
// Total Trades: ${reportData.totalTrades}
// Total USDT Traded: ${reportData.totalUSDT} USDT
// Exchange Price: ₹${reportData.exchangePrice}
// INR Received: ₹${reportData.inrReceived}
// INR Pending: ₹${reportData.inrPending}
//     `;
//     bot.sendMessage(msg.chat.id, reportText);
//   } else {
//     bot.sendMessage(msg.chat.id, `${replyPrefix}No data available for this date.`);
//   }
// }

// // This function should be added to register all the handlers with the bot
// // function registerHandlers(bot) {
// //   bot.onText(/\/start/, (msg) => startHandler(bot, msg));
// //   bot.onText(/\/setprice (.+)/, (msg, match) => setPriceHandler(bot, msg, match));
// //   bot.onText(/\/sell (.+)/, (msg, match) => sellHandler(bot, msg, match));
// //   bot.onText(/\/confirm (.+)/, (msg, match) => confirmHandler(bot, msg, match));
// //   bot.onText(/\/paid (.+)/, (msg, match) => paidHandler(bot, msg, match));
// //   bot.onText(/\/done(.*)/, (msg, match) => sellerConfirmHandler(bot, msg, match));
// //   bot.onText(/\/myhistory/, (msg) => myHistoryHandler(bot, msg));
// //   bot.onText(/\/myorders/, (msg) => myOrdersHandler(bot, msg));
// //   bot.onText(/\/upi (.+)/, (msg, match) => upiHandler(bot, msg, match));
// //   bot.onText(/\/bank (.+)/, (msg, match) => bankHandler(bot, msg, match));
// //   bot.onText(/\/report (.+)/, (msg, match) => reportHandler(bot, msg, match));
// // }

// module.exports = {
//   startHandler,
//   setPriceHandler,
//   sellHandler,
//   myHistoryHandler,
//   myOrdersHandler,
//   reportHandler,
//   confirmHandler,
//   paidHandler,
//   sellerConfirmHandler,
//   upiHandler,
//   bankHandler,
//   // registerHandlers
// };



// Assume these functions interact with your database or external services.
const {
  saveBuyOrder,
  getMatchingBuyOrder,
  recordSellerResponse,
  getUserHistory,
  generateDailyReport,
  markOrderStep,
  getTransactionDetails,
  getOrderDetails,
  updateSellOrderInDB,
  createSellOrderInDB,
} = require('./db');
const { verifyTronTransaction } = require('./tron');

// In-memory stores for demonstration
const orders = {}; // Maps orderId to order details.
const selectedOrders = {}; // Maps composite key "chatId_userId" to orderId.

// Helper: generate a composite key based on group chat id and user id.
function getCompositeKey(chatId, userId) {
  return `${chatId}_${userId}`;
}

// Create an order and map it to the composite key.
function createOrder(orderId, totalAmount, chatId, userId,orderNumber) {
  console.log(userId);
  
  orders[orderId] = {
    totalAmount: totalAmount,
    amountPaid: 0,
    status: "created", // optional status field
  };
  orders[orderNumber] = {
    totalAmount: totalAmount,
    amountPaid: 0,
    status: "created", // optional status field
  };

  // Map the order using the composite key.
  selectedOrders[getCompositeKey(chatId, userId)] = orderId;
}

// Sends the welcome message.
function startHandler(bot, msg) {
  const welcomeText = `
Welcome to the USDT-INR Exchange Bot!
Available commands:

/sell <amount>       - Accept a buy order
/paid <hash>         - Provide transaction proof after USDT transfer
/confirm            - Mark INR payment as complete
/myhistory          - Show your transaction history
/report <YYYY-MM-DD> - Get the daily report
/upi <upi_id>        - Submit your UPI ID
/bank <account_number> <IFSC> <branch> <name> - Submit your bank details
  `;
  bot.sendMessage(msg.chat.id, welcomeText);
}

// Handler for the admin to set price.
async function setPriceHandler(bot, msg, match) {
  // Replace with your own admin username or IDs.
  const allowedUser = 'Mukesh760796';
  if (msg.from.username !== allowedUser) {
    bot.sendMessage(msg.chat.id, "Unauthorized: This command is restricted.");
    return;
  }

  const newPrice = match[1];
  if (isNaN(newPrice)) {
    bot.sendMessage(msg.chat.id, "Usage: /setprice <price_value>\nExample: /setprice 50");
    return;
  }

  try {
    const orderId = saveBuyOrder({
      price: newPrice,
      createdAt: new Date()
    });
    console.log("Price updated, orderId:", orderId);
    bot.sendMessage(
      msg.chat.id,
      `Price updated: 1 JSDT is now set to ₹${newPrice} INR.`
    );
  } catch (error) {
    console.error("Error updating price:", error);
    bot.sendMessage(msg.chat.id, "Failed to update the price. Please try again later.");
  }
}

// Handler for users to sell USDT.
// Uses composite keys to track orders per user in a group chat.
async function sellHandler(bot, msg, match) {
  const amount = parseFloat(match[1]);
  if (isNaN(amount)) {
    bot.sendMessage(msg.chat.id, "Usage: /sell <amount>");
    return;
  }

  // Get the matching buy order(s) and use the latest one.
  const priceList = await getMatchingBuyOrder();
  if (!priceList || priceList.length === 0) {
    bot.sendMessage(msg.chat.id, "No matching buy orders available.");
    return;
  }
  const lastValue = priceList[priceList.length - 1];

  // Check if the order amount is within allowed limits.
  if (amount < 10 || amount > 10000) {
    bot.sendMessage(msg.chat.id, "Please specify an order amount between $10 and $10,000.");
    return;
  }

  // Create a new sell order.
  const sellOrderData = {
    seller: msg.from.username,
    amount,
    createdAt: new Date(),
    status: 'pending',
  };

  const newSellOrder = await createSellOrderInDB(sellOrderData);
  console.log("New sell order created:", newSellOrder);

  // Update the sell order details.
  await updateSellOrderInDB(newSellOrder._id, {
    price: lastValue.price,
    matchedAt: new Date(),
    status: 'matched',
  });

  // Store the order using the composite key.
  const compositeKey = getCompositeKey(msg.chat.id, msg.from.id);
  selectedOrders[compositeKey] = newSellOrder._id;

  recordSellerResponse(newSellOrder._id, {
    seller: msg.from.username,
    amount,
    respondedAt: new Date(),
  });

//   const responseText = `
// ✅ Order #${newSellOrder.orderNumber}
// Seller @${msg.from.username} accepted your order for ${amount} USDT at ₹${lastValue.price} per USDT.
// INR: ₹${amount * lastValue.price}
// Please transfer USDT to the buyer's wallet and send your transaction proof using /paid <transaction_token>.
//   `;
//   bot.sendMessage(msg.chat.id, responseText);
const responseText = `
✅ Order #${newSellOrder.orderNumber}
Seller @${msg.from.username} accepted your  order for ${amount} USDT at ₹${lastValue.price} per USDT. INR: ₹${amount*lastValue.price} 
Please transfer USDT to the buyer's wallet (USDT TRC20) and Address:TUwxkYU7hJZCnqi1rCgZeBuDxQvuzC2Leq send your transaction proof using /paid.
    `;
    bot.sendMessage(msg.chat.id, responseText);
}
  
// Handler to confirm USDT transaction and trigger INR payment.
async function confirmHandler(bot, msg) {
  // Expecting a message like: "/paid <transaction_token>"
  const text = msg.text;
  const match = text.match(/\/paid\s+(\w+)/);
  if (!match || !match[1]) {
    bot.sendMessage(msg.chat.id, "Usage: /confirm <transaction_token>");
    return;
  }
  
  
  const token = match[1];
  const compositeKey = getCompositeKey(msg.chat.id, msg.from.id);
  const orderId = selectedOrders[compositeKey];

  if (!orderId) {
    bot.sendMessage(msg.chat.id, "No order selected for confirmation. Please select an order first.");
    return;
  }

  // Verify the transaction using the provided token.
  const verification = await verifyTronTransaction(token);
  const orderDetails = await getOrderDetails(orderId);
  if (verification) {
    const totalINR = orderDetails.amount * orderDetails.price;
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${orderDetails.orderNumber} ${orderDetails.amount} USDT TRC20 transaction verified.
I will pay ₹${totalINR} INR.
Please share your UPI ID or Bank details with /upi or /bank.`
    );
    await updateSellOrderInDB(orderId, { status: 'confirmed' });
    createOrder(orderId, totalINR, msg.chat.id, msg.from.id,orderDetails.orderNumber);
  } else {
    bot.sendMessage(msg.chat.id, `Order #${orderDetails.orderNumber} Transaction verification failed. Please try again.`);
  }
}

// Handler for when the buyer makes a payment.
// This uses the composite key to update the correct order.
// async function paidHandler(bot, msg, match) {
//   // Expecting a message like: "/paid <amount>"
//   const paidAmount = parseFloat(match.input.split(' ')[1]);
//   const compositeKey = getCompositeKey(msg.chat.id, msg.from.id);
//   const orderId = selectedOrders[compositeKey];
//   console.log(orderId);
  
//   const orderDetails = await getOrderDetails(orderId);
// console.log(orderDetails);

//   if (isNaN(paidAmount) || paidAmount <= 0) {
//     bot.sendMessage(
//       msg.chat.id,
//       `Order #${orderDetails.orderNumber} - Please enter a valid amount. Example: /paid 5000`
//     );
//     return;
//   }

//   if (!orderId || !orders[orderId]) {
//     bot.sendMessage(msg.chat.id, "Order not found.");
//     return;
//   }

//   // Update the order’s paid amount.
//   const order = orders[orderId];
//   order.amountPaid = (Number(order.amountPaid) || 0) + Number(paidAmount);

//   // Provide appropriate feedback.
//   if (order.amountPaid < order.totalAmount) {
//     const remaining = order.totalAmount - order.amountPaid;
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Partial payment detected.
// You have paid ₹${order.amountPaid} out of ₹${order.totalAmount}.
// Please pay the remaining ₹${remaining}.`
//     );
//   } else if (order.amountPaid === order.totalAmount) {
//     markOrderStep(orderId, "INR_paid");
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Payment complete. Waiting for seller confirmation of INR receipt. /done`
//     );
//   } else {
//     const extra = order.amountPaid - order.totalAmount;
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Payment complete with ₹${extra} extra paid. Waiting for seller confirmation. /done`
//     );
//   }
// }

async function paidHandler(bot, msg, match) {
  // Split command by spaces and remove any empty tokens.
  const tokens = match.input.split(' ').filter(token => token.trim() !== '');
  
  let orderId, paidAmount;

  // If two parameters are provided: "/paid <order_id> <amount>"
  if (tokens.length === 3) {
    // Only allow admin to use explicit order IDs.
    const adminUser = "Mukesh760796"; // Adjust as needed
    if (msg.from.username !== adminUser) {
      bot.sendMessage(msg.chat.id, "Unauthorized: Only admin can specify an order ID.");
      return;
    }
    orderId = tokens[1];
    paidAmount = parseFloat(tokens[2]);
  } else if (tokens.length === 2) {
    // Non-admin users (or admin not specifying an order id) use the composite key mapping.
    paidAmount = parseFloat(tokens[1]);
    // Build the composite key from the group chat and the sender's ID.
    orderId = selectedOrders[ getCompositeKey(msg.chat.id, msg.from.id) ];
  } else {
    bot.sendMessage(msg.chat.id, "Usage: /paid <order_id> <amount> (admin) OR /paid <amount> (user)");
    return;
  }
console.log(orderId);

  // Retrieve order details using the orderId.
  const orderDetails = await getOrderDetails(orderId);

  if (isNaN(paidAmount) || paidAmount <= 0) {
    bot.sendMessage(
      msg.chat.id,
      `Order #${orderDetails.orderNumber} - Please enter a valid amount. Example: /confirm 5000`
    );
    return;
  }
console.log(orders);

  if (!orderId || !orders[orderId]) {
    bot.sendMessage(msg.chat.id, "Order not found.");
    return;
  }

  // Update the order’s paid amount.
  const order = orders[orderId];
  order.amountPaid = (Number(order.amountPaid) || 0) + Number(paidAmount);

  // Provide appropriate feedback.
  if (order.amountPaid < order.totalAmount) {
    const remaining = order.totalAmount - order.amountPaid;
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${orderDetails.orderNumber} Partial payment detected.
You have paid ₹${order.amountPaid} out of ₹${order.totalAmount}.
Please pay the remaining ₹${remaining}.`
    );
  } else if (order.amountPaid === order.totalAmount) {
    markOrderStep(orderId, "INR_paid");
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${orderDetails.orderNumber} Payment complete. Waiting for seller confirmation of INR receipt. /done`
    );
  } else {
    const extra = order.amountPaid - order.totalAmount;
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${orderDetails.orderNumber} Payment complete with ₹${extra} extra paid. Waiting for seller confirmation. /done`
    );
  }
}

// Handler for seller confirmation once INR is received.

async function sellerConfirmHandler(bot, msg) {
  const compositeKey = getCompositeKey(msg.chat.id, msg.from.id);
  const orderId = selectedOrders[compositeKey];
  const orderDetails = await getOrderDetails(orderId);
  if (!orderId) {
    bot.sendMessage(
      msg.chat.id,
      `Order #${orderDetails.orderNumber} - No order associated with this chat. Please select an order first.`
    );
    return;
  }
  
  try {
    // Optionally, update order state in the DB.
    // await markOrderStep(orderId, "transaction_done");
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${orderDetails.orderNumber} 👍 Transaction completed successfully.`
    );
    // Remove the order from the mapping once completed.
    delete selectedOrders[compositeKey];
  } catch (error) {
    console.error("Error finalizing seller confirmation:", error);
    bot.sendMessage(
      msg.chat.id,
      `Order #${orderDetails.orderNumber} - Error finalizing the transaction. Please try again.`
    );
  }
}

// Handler for retrieving user transaction history.
function myHistoryHandler(bot, msg) {
  const history = getUserHistory(msg.from.username);
  if (!history || history.length === 0) {
    bot.sendMessage(msg.chat.id, "No transaction history found.");
    return;
  }
  const historyText = history.map((t) => `${t.date}: ${t.details}`).join('\n');
  bot.sendMessage(msg.chat.id, historyText);
}

// Handler for processing UPI details.
async function upiHandler(bot, msg, match) {
  const compositeKey = getCompositeKey(msg.chat.id, msg.from.id);
  const orderId = selectedOrders[compositeKey];
  const orderDetails = await getOrderDetails(orderId);
  const upiId = match[1].trim();
  // Process and store the UPI ID as needed.
  bot.sendMessage(
    msg.chat.id,
    `✅ Order #${orderDetails.orderNumber} Received your UPI ID: ${upiId}`
  );
}

// Handler for processing bank details.
async function bankHandler(bot, msg, match) {
  const compositeKey = getCompositeKey(msg.chat.id, msg.from.id);
  const orderId = selectedOrders[compositeKey];
  const orderDetails = await getOrderDetails(orderId);

  const args = match[1].split(' ');
  if (args.length < 5) {
    bot.sendMessage(msg.chat.id, 'Usage: /bank <account_number> <IFSC> <branch> <name>');
    return;
  }
  const bankDetails = {
    account_number: args[0],
    IFSC: args[1],
    branch: args[2],
    name: args.slice(3).join(' ') // Joins remaining arguments as the name.
  };

  bot.sendMessage(
    msg.chat.id,
    `✅ Order #${orderDetails.orderNumber} Bank details received successfully!
Account Number: ${bankDetails.account_number}
IFSC Code: ${bankDetails.IFSC}
Branch Name: ${bankDetails.branch}
Account Holder: ${bankDetails.name}`
  );
}
// i have to work
// Handler for generating a daily report.
function reportHandler(bot, msg, match) {
  const reportDate = match[1].trim();
  const reportData = generateDailyReport(reportDate);
  if (reportData) {
    const reportText = `
USDT-INR Report for ${reportDate}
Total Trades: ${reportData.totalTrades}
Total USDT Traded: ${reportData.totalUSDT} USDT
Exchange Price: ₹${reportData.exchangePrice}
INR Received: ₹${reportData.inrReceived}
INR Pending: ₹${reportData.inrPending}
    `;
    bot.sendMessage(msg.chat.id, reportText);
  } else {
    bot.sendMessage(msg.chat.id, "No data available for this date.");
  }
}

// this export section
module.exports = {
  startHandler,
  setPriceHandler,
  sellHandler,
  myHistoryHandler,
  reportHandler,
  confirmHandler,
  paidHandler,
  sellerConfirmHandler,
  upiHandler,
  bankHandler,
  createOrder,
  getCompositeKey
};
