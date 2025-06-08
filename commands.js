 



// Assume these functions interact with your database or external services.
const {
  saveBuyOrder,
  // getMatchingBuyOrder,
  recordSellerResponse,
  getUserHistory,
  generateDailyReport,
  markOrderStep,
  getTransactionDetails,
  getOrderDetails,
  updateSellOrderInDB,
  createSellOrderInDB,
  getMatchingBuyOrder,
  getMatchingBuyOrders,
  getCompositeKey,
  createOrder,
  getOrderByCompositeKey,
  storeSelectedOrderMapping,
  getOrder,
  updateOrder,
  createandUpdateUsdtAddress,
  getUsdtAddress,
} = require('./db');
const generatePdfReport = require('./pdfgenerate');
const { verifyTronTransaction } = require('./tron');

// In-memory stores for demonstration
const orders = {}; // Maps orderId to order details.
const selectedOrders = {}; // Maps composite key "chatId_userId" to orderId.

// Helper: generate a composite key based on group chat id and user id.
// function getCompositeKey(chatId, userId) {
//   return `${chatId}_${userId}`;
// }



// Create an order and map it to the composite key.
// function createOrder(orderId, totalAmount, chatId, userId,orderNumber) {
//   console.log(userId);
  
//   orders[orderId] = {
//     totalAmount: totalAmount,
//     amountPaid: 0,
//     status: "created", // optional status field
//   };
//   orders[orderNumber] = {
//     totalAmount: totalAmount,
//     amountPaid: 0,
//     status: "created", // optional status field
//   };

//   // Map the order using the composite key.
//   selectedOrders[getCompositeKey(chatId, userId)] = orderId;
// }

// Sends the welcome message.
function startHandler(bot, msg) {
  const welcomeText = `
Welcome to the USDT-INR Exchange Bot!
Available commands:

/sell <amount>       - Accept a buy order
/paid <hash>         - Provide transaction proof after USDT transfer
 
 
 
/upi <upi_id>        - Submit your UPI ID
/bank <account_number> <IFSC> <branch> <name> - Submit your bank details
/done  done with  <ordernumber >  for conformation payment 
/support  support commond under working`;
  bot.sendMessage(msg.chat.id, welcomeText);
}

// Handler for the admin to set price.
async function setPriceHandler(bot, msg, match) {
  // Replace with your own admin username or IDs.
  const allowedUser = 'cabal_leader';
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
  // console.log(bot);
  console.log(msg);
  console.log(match);
  const amount = parseFloat(match[1]);
  if (isNaN(amount)) {
    bot.sendMessage(msg.chat.id, "Usage: /sell <amount>");
    return;
  }

  // Get the matching buy order(s) and use the latest one.
  
  const priceList = await  getMatchingBuyOrder();
  console.log(priceList);
  
  if (!priceList || priceList.length === 0) {
    bot.sendMessage(msg.chat.id, "No matching buy orders available.");
    return;
  }
  const lastValue = priceList[priceList.length - 1];
console.log("fddg",lastValue);

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
await storeSelectedOrderMapping(msg.chat.id, msg.from.id,newSellOrder._id,newSellOrder.orderNumber)
  recordSellerResponse(newSellOrder._id, {
    seller: msg.from.username,
    amount,
    respondedAt: new Date(),
  });

  const USDTAddress= await getUsdtAddress();
console.log("USDT Address:", USDTAddress);
  // if (!USDTAddress) {

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
Please transfer USDT to the buyer's wallet (USDT TRC20) and Address: ${USDTAddress?.usdtAddress} send your transaction proof using /paid.
    `;
    bot.sendMessage(msg.chat.id, responseText);
}
  
// Handler to confirm USDT transaction and trigger INR payment.
// async function confirmHandler(bot, msg) {
//   // Expecting a message like: "/paid <transaction_token>"
//   const text = msg.text;
//   const match = text.match(/\/paid\s+(\w+)/);
//   if (!match || !match[1]) {
//     bot.sendMessage(msg.chat.id, "Usage: /confirm <transaction_token>");
//     return;
//   }
  
//   console.log("yyu",selectedOrders);
  
//   const token = match[1];
//   // const compositeKey = getCompositeKey(msg.chat.id, msg.from.id);
//   // const orderId = selectedOrders[compositeKey];
//   const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id);
// console.log("ttt",orderDetails);

//   if (!orderDetails) {
//     bot.sendMessage(msg.chat.id, "No order selected for confirmation. Please select an order first.");
//     return;
//   }

//   // Verify the transaction using the provided token.
//   const verification = await verifyTronTransaction(token);
//   // const orderDetails = await getOrderDetails(orderId);
//   if (verification) {
//     const totalINR = orderDetails.amount * orderDetails.price;
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} ${orderDetails.amount} USDT TRC20 transaction verified.
// I will pay ₹${totalINR} INR.
// Please share your UPI ID or Bank details with /upi or /bank.`
//     );
//     await updateSellOrderInDB(orderDetails.orderId, { status: 'confirmed' });
//     createOrder(orderDetails.orderId, totalINR, msg.chat.id, msg.from.id,orderDetails.orderNumber);
//   } else {
//     bot.sendMessage(msg.chat.id, `Order #${orderDetails.orderNumber} Transaction verification failed. Please try again.`);
//   }
// }
async function confirmHandler(bot, msg) {
  try {
      // Expecting a message like: "/paid <orderNumber> <transaction_token>"
      console.log("yyy",msg);
      const user= msg.from.username;
console.log(user);

      const text = msg.text;
      const match = text.match(/\/paid\s+(\d+)\s+(\w+)/);
console.log(match);

      if (!match || !match[1] || !match[2]) {
          bot.sendMessage(msg.chat.id, "Usage: /paid <orderNumber> <transaction_token>");
          return;
      }



      const orderNumber = match[1];
      const token = match[2];

      console.log("Received orderNumber:", orderNumber);
      console.log("Received transaction token:", token);

      // Fetch order details using orderNumber and chatId, userId
      const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id, orderNumber);
      console.log("Order Details:", orderDetails);
     console.log(orderDetails._id);
     
      if (!orderDetails) {
          bot.sendMessage(msg.chat.id, `No order found with Order Number: ${orderNumber}. Please check it your order Number and try again.`);
          return;
      }
    console.log(!user==orderDetails.seller);
    
      if (!user==orderDetails.seller) {
        bot.sendMessage(msg.chat.id, `You are not the seller of this order. Please use /paid <orderNumber>  < to confirm the transaction.`);
        // bot.sendMessage(msg.chat.id, `No order found with Order Number: ${orderNumber}. Please check and try again.`);
        return;
    }
      // Verify the transaction using the provided token
      const verification = await verifyTronTransaction(token,orderDetails.amount);

      if (verification) {
          const totalINR = orderDetails.amount * orderDetails.price;
          await updateSellOrderInDB(orderDetails._id, { status: "confirmed" });

          // Create a new order record
          await createOrder(orderDetails._id, totalINR, msg.chat.id, msg.from.id, orderDetails.orderNumber);
          bot.sendMessage(
              msg.chat.id,
              `✅ Order #${orderDetails.orderNumber} for ${orderDetails.amount} USDT TRC20 verified.
I will pay ₹${totalINR} INR.
Please share your UPI ID or Bank details using /upi or /bank.`
          );
          bot.sendMessage(
            1182302915,
            `✅ Order #${orderDetails.orderNumber} for ${orderDetails.amount} USDT TRC20 verified.
I will pay ₹${totalINR} INR.
Please share your UPI ID or Bank details using /upi or /bank.`
        );
        bot.sendMessage(
          1074526287,
          `✅ Order #${orderDetails.orderNumber} for ${orderDetails.amount} USDT TRC20 verified.
you will pay ₹${totalINR} INR.
Please share your UPI ID or Bank details using /upi or /bank.`
      );

          // Update the order status in the database
         
      } else {
          bot.sendMessage(
              msg.chat.id,
              `❌ Order #${orderDetails.orderNumber} Transaction verification failed. Please try again.`
          );
      }
  } catch (error) {
      console.error("Error in confirmHandler:", error);
      bot.sendMessage(msg.chat.id, "An error occurred while processing your request. Please try again.");
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
  // console.log(msg);
  
  let orderId, paidAmount, orderDetails;
  orderId = tokens[1];
  paidAmount = parseFloat(tokens[2]);
  // If two parameters are provided: "/paid <order_id> <amount>"
  if (tokens.length === 3) {
    // Only allow admin to use explicit order IDs.
    const adminUser = "cabal_leader";
    const developer="mukeshkushwaha1000" // Adjust as needed
    // if (msg.from.username !== adminUser ) {
    //   bot.sendMessage(msg.chat.id, "Unauthorized: Only admin do the payment in INR.");
    //   return;
    // }
    if (msg.from.username !== adminUser && msg.from.username !== developer) {
      bot.sendMessage(msg.chat.id, "Unauthorized: Only admin do the payment in INR.");
      return;
    }
    orderId = tokens[1];
    paidAmount = parseFloat(tokens[2]);
  } else if (tokens.length === 2) {
    // Non-admin users (or admin not specifying an order id) use the composite key mapping.
    paidAmount = parseFloat(tokens[1]);
    // Build the composite key from the group chat and the sender's ID.
    // orderId = selectedOrders[ getCompositeKey(msg.chat.id, msg.from.id,orderId) ];
    // const orderDetails = await getOrder(msg.chat.id, msg.from.id, orderId);
  } else {
    bot.sendMessage(msg.chat.id, "Usage: /paid <order_id> <amount> (admin) OR /paid <amount> (user)");
    return;
  }
console.log("sffg",orderId);
 console.log(paidAmount);
 
  // Retrieve order details using the orderId.
  // const orderDetails = await getOrderDetails(orderId);
  const order = await getOrder(msg.chat.id, msg.from.id, orderId);
console.log("ttt",order);
 const number = order?.compositeKey.split('_')[0]
if(!order) {
  bot.sendMessage(msg.chat.id, `Order #${orderId} not found.`);
  return;
}

  if (isNaN(paidAmount) || paidAmount <= 0) {
    bot.sendMessage(
      msg.chat.id,
      `Order #${order.orderNumber} - Please enter a valid amount. Example: /confirm 5000`
    );
    return;
  }
console.log(orders);


  // if already fully paid or over‑paid, refuse any further /paid commands
  if (order.status === 'completed' || order.status === 'Extra') {
    return bot.sendMessage(
      msg.chat.id,
      `⚠️ Order #${order.orderNumber} is already ${order.status}. No further payments can be accepted.`
    );
  }

  // if (!orderId || !orders[orderId]) {
  //   bot.sendMessage(msg.chat.id, "Order not found.");
  //   return;
  // }

  // Update the order’s paid amount.
  // const order = orders[orderId];
  order.amountPaid = (Number(order?.amountPaid) || 0) + Number(paidAmount);
console.log(order.amountPaid);

  // Provide appropriate feedback.
  if (order?.amountPaid < order?.totalAmount) {
    const remaining = order?.totalAmount - order?.amountPaid;
    const updateFields = { status: 'Incompleted', amountPaid:order.amountPaid };
  const rr=  await  updateOrder(msg.chat.id,msg.from.id,orderId, updateFields)
   console.log("yy",rr);
   
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${order.orderNumber} Partial payment detected.
You have paid ₹${order.amountPaid} out of ₹${order.totalAmount}.
Please pay the remaining ₹${remaining}.`
    );
    bot.sendMessage(
      number,
      `✅ Order #${order.orderNumber} Partial payment detected.
I have paid ₹${order.amountPaid} out of ₹${order.totalAmount}.
I will pay the remaining ₹${remaining}.`
    );
     
  } else if (order.amountPaid === order.totalAmount) {
    // markOrderStep(orderId, "INR_paid");
    const updateFields = { status: 'completed', amountPaid:order.amountPaid };
    await  updateOrder(msg.chat.id,msg.from.id,orderId, updateFields)
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${order.orderNumber} Payment complete. Waiting for seller confirmation of INR receipt. /done`
    );
    bot.sendMessage(
      number,
      `✅ Order #${order.orderNumber} Payment complete. Waiting for your confirmation of INR receipt. /done`
    );
  } else {
    const extra = order.amountPaid - order.totalAmount;
    const updateFields = { status: 'Extra', amountPaid:order.amountPaid };
    await  updateOrder(msg.chat.id,msg.from.id,orderId, updateFields)
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${order.orderNumber} Payment complete with ₹${extra} extra paid. Waiting for seller confirmation. /done`
    );
    bot.sendMessage(
      number,
      `✅ Order #${order.orderNumber} Payment complete with ₹${extra} extra paid. Waiting for your confirmation. /done`
    );
  }
}

// Handler for seller confirmation once INR is received.

async function sellerConfirmHandler(bot, msg,match) {
  console.log(match);
  const user= msg.from.username;
console.log(user);
  const tokens = match.input.split(' ').filter(token => token.trim() !== '');
  console.log(tokens[1]);
 const  orderNumber =tokens[1]
 console.log(orderNumber);
 
  const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id,orderNumber);
  console.log(orderDetails);
  
   
  if (!orderNumber) {
    bot.sendMessage(
      msg.chat.id,
      `Order #${ orderNumber} - No order associated with this chat. Please select an order first.`
    );
    return;
  }

  if (!orderDetails) {
    bot.sendMessage(
      msg.chat.id,
      `Order #${ orderNumber} -  it not your order. Please select an your.`
    );
    return;
  }

  console.log("ertreere",user==orderDetails.seller);
  
   // const orderDetails = await getOrderDetails(orderId);
   if (!user==orderDetails.seller) {
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
    // delete selectedOrders[compositeKey];
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
  const tokens = match.input.split(' ').filter(token => token.trim() !== '');
  console.log(tokens);
  const orderNumber = tokens[1];
  const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id,orderNumber);
  // const orderId = selectedOrders[compositeKey];
  // const orderDetails = await getOrderDetails(orderId);
  console.log(orderDetails);

  const order = await getOrder(msg.chat.id, msg.from.id, orderNumber);
console.log("ttt",order);

if (order.status === 'completed' || order.status === 'Extra') {
  return bot.sendMessage(
    msg.chat.id,
    `⚠️ Order #${order.orderNumber} is already ${order.status}. No further upi can be changed.`
  );
}
  
  const upiId = tokens[2];
 console.log(upiId);
 
  if (!orderDetails){
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${orderNumber} not your order Number  Received your UPI ID: ${upiId}`
    );
    return;
  }
  const totalINR = orderDetails.amount * orderDetails.price;
  // Process and store the UPI ID as needed.
  bot.sendMessage(
    msg.chat.id,
    `✅ Order #${orderDetails.orderNumber} Received your UPI ID: ${upiId}`
  );
  bot.sendMessage(
    1182302915,
    `✅ Order #${orderDetails.orderNumber} for ${orderDetails.amount} USDT TRC20 verified.
You will pay ₹${totalINR} INR.
The   UPI ID is ${upiId} `
);
bot.sendMessage(
  1074526287,
  `✅ Order #${orderDetails.orderNumber} for ${orderDetails.amount} USDT TRC20 verified.
you will pay ₹${totalINR} INR.
 The   UPI ID is ${upiId} `
);
}

// Handler for processing bank details.
async function bankHandler(bot, msg, match) {
  const tokens = match.input.split(' ').filter(token => token.trim() !== '');
  const orderNumber = tokens[1];
  const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id,orderNumber);
   
  
  if(!orderDetails) {
    bot.sendMessage(
      msg.chat.id,
      `✅ Order #${orderNumber} not your order Number   Enter Your Order Number and bank details`
    );
    return;
  }

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
 

async function reportHandler(bot, msg, match) {
  // Assume the user sends a date in "DD-MM-YYYY" format as the first capture group
  const reportDate = match[1].trim();
  const user= msg.from.username;
  const tokens = match.input.split(' ').filter(token => token.trim() !== '');
  const orderNumber = tokens[1];
   

  const allowedUser = 'cabal_leader';
  if (msg.from.username !== allowedUser) {
    bot.sendMessage(msg.chat.id, "Unauthorized: This command is restricted.");
    return;
  }
  const reportData = await generateDailyReport(reportDate);
  console.log("Report Data:", reportData);
  
  if (reportData && reportData.length > 0) {
    try {
      // Generate PDF from the report data
      const pdfBuffer = await generatePdfReport(reportData);

      // Send the PDF document via your bot
      bot.sendDocument(msg.chat.id, pdfBuffer, {}, { 
        filename: 'daily_report.pdf', 
        contentType: 'application/pdf'
      });
    } catch (error) {
      console.error("Error generating PDF report:", error);
      bot.sendMessage(msg.chat.id, "Error generating PDF report.");
    }
  } else {
    bot.sendMessage(msg.chat.id, "No data available for this date.");
  }
}


const usdtHandler = async (bot, msg, match) => {
  const chatId = msg.chat.id;
  const usdtAddress = match[1]; // captured group
console.log(usdtAddress);
console.log(chatId);
 bot.sendMessage(chatId, '❌ Please provide a valid USDT TRC20 address.\nExample:\n`/usdt TAbc123...`', { parse_mode: 'Markdown' });

  if (!usdtAddress) {
     bot.sendMessage(chatId, '❌ Please provide a valid USDT TRC20 address.\nExample:\n`/usdt TAbc123...`', { parse_mode: 'Markdown' });
      return;
  }

  try {

    const updated = await  createandUpdateUsdtAddress(usdtAddress);
    // const updated = await usdtAddress.findOneAndUpdate(
    //   {},
    //   { usdtAddress },
    //   { upsert: true, new: true }
    // );
     bot.sendMessage(chatId, ' Updated USDT Address:', { parse_mode: 'Markdown' });
console.log("Updated USDT Address:", updated);
    if (!updated) {
       bot.sendMessage(chatId, '❌ Failed to update USDT address. Please try again later.');
       return;
    }
bot.sendMessage(chatId, ' Updated USDT Address:1', { parse_mode: 'Markdown' });
    bot.sendMessage(chatId, `✅ USDT address updated:\n\`${updated?.data?.usdtAddress}\``, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '❌ Failed to update USDT address. Please try again later.');
  }
};

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
  // createOrder,
  getCompositeKey,
  usdtHandler
};
