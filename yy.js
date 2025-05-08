// // const TronWeb = require('tronweb');

// // // Connect using TronGrid endpoint
// // const tronWeb = new TronWeb({
// //   fullHost: 'https://api.trongrid.io'
// // });

// // async function verifyTransaction(txId) {
// //   try {
// //     // Fetch transaction data
// //     const transaction = await tronWeb.trx.getTransaction(txId);
// //     console.log('Transaction Details:', transaction);

// //     // Fetch additional transaction info (like status)
// //     const receipt = await tronWeb.trx.getTransactionInfo(txId);
// //     console.log('Transaction Receipt:', receipt);

// //     if (receipt && receipt.receipt && receipt.receipt.result === 'SUCCESS' ||rec) {
// //       console.log('Transaction is confirmed and successful.');
// //     } else {
// //       console.log('Transaction status is pending or failed.');
// //     }
// //   } catch (error) {
// //     console.error('Error verifying transaction:', error);
// //   }
// // }

// // const txHash = '8dd527267a3d229807ab83d143ca8c9f8908d6f24b637eba3a2c61e924feb436';
// // verifyTransaction(txHash);

// // const TronWeb = require('tronweb');
// // const axios = require('axios');

// // // Connect using TronGrid endpoint
// // const tronWeb = new TronWeb({
// //   fullHost: 'https://api.trongrid.io'
// // });

// // // Function to check confirmation status via TronGrid API
// // async function checkConfirmationStatus(txId) {
// //   try {
// //     const response = await axios.get(`https://api.trongrid.io/wallet/gettransactionbyid?value=${txId}`);
// //     console.log(response);
    
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching confirmation status:', error.message);
// //     return null;
// //   }
// // }

// // async function verifyTransaction(txId) {
// //   try {
// //     // Fetch transaction data
// //     const transaction = await tronWeb.trx.getTransaction(txId);
// //     console.log('Transaction Details:', transaction);

// //     // Fetch additional transaction info (like status)
// //     const receipt = await tronWeb.trx.getTransactionInfo(txId);
// //     console.log('Transaction Receipt:', receipt);

// //     if (receipt && receipt.receipt && receipt.receipt.result === 'SUCCESS') {
// //       console.log('✅ Transaction is confirmed and successful.');
// //     } else if (Object.keys(receipt).length === 0) {
// //       console.log('ℹ️ Receipt data is empty. Checking status via API...');

// //       const confirmationData = await checkConfirmationStatus(txId);
// //       if (confirmationData && confirmationData.ret && confirmationData.ret[0].contractRet === 'SUCCESS') {
// //         console.log('✅ Transaction confirmed successfully via API.');
// //       } else {
// //         console.log('❌ Transaction failed or is still pending.');
// //       }
// //     } else {
// //       console.log('❌ Transaction status is pending or failed.');
// //     }
// //   } catch (error) {
// //     console.error('❗ Error verifying transaction:', error.message);
// //   }
// // }

// // const txHash = '8dd527267a3d229807ab83d143ca8c9f8908d6f24b637eba3a2c61e924feb436';
// // verifyTransaction(txHash);

// const TronWeb = require('tronweb');
// const axios = require('axios');

// // Connect using TronGrid endpoint
// const tronWeb = new TronWeb({
//   fullHost: 'https://api.trongrid.io'
// });

// // Your wallet address (to check if funds were sent to you)
// const MY_WALLET_ADDRESS = '41a614f803b6fd780986a42c78ec9c7f77e6ded13c';

// async function checkConfirmationStatus(txId) {
//   try {
//     const response = await axios.get(`https://api.trongrid.io/wallet/gettransactionbyid?value=${txId}`);
//     // console.log("RRR",response);
    
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching confirmation status:', error.message);
//     return null;
//   }
// }

// async function verifyTransaction(txId) {
//   try {
//     const transaction = await tronWeb.trx.getTransaction(txId);
//     console.log('Transaction Details:', transaction);

//     const receipt = await tronWeb.trx.getTransactionInfo(txId);
//     console.log('Transaction Receipt:', receipt);

//     // Extract sender & receiver addresses
//     const contractData = transaction.raw_data.contract[0].parameter.value;
//     const fromAddress = tronWeb.address.fromHex(contractData.owner_address);
//     const toAddress = contractData.to_address
//     ? tronWeb.address.fromHex(contractData.to_address)
//     : tronWeb.address.fromHex(contractData.receiving_address);
//     // const toAddress = tronWeb.address.fromHex(contractData.contract_address);

//     console.log(`🔍 From: ${fromAddress}`);
//     console.log(`📩 To: ${toAddress}`);

//     // Verify transaction status
//     if (receipt && receipt.receipt && receipt.receipt.result === 'SUCCESS') {
//       console.log('✅ Transaction is confirmed and successful.');

//       // Check if the transaction is for your account
//       if (toAddress === tronWeb.address.fromHex(MY_WALLET_ADDRESS)) {
//         console.log('✅ Funds are sent to your account.');
//       } else {
//         console.log('⚠️ Funds were NOT sent to your account.');
//       }

//     } else if (Object.keys(receipt).length === 0) {
//       console.log('ℹ️ Receipt data is empty. Checking status via API...');

//       const confirmationData = await checkConfirmationStatus(txId);
//       if (
//         confirmationData &&
//         confirmationData.ret &&
//         confirmationData.ret[0].contractRet === 'SUCCESS'
//       ) {
//         console.log('✅ Transaction confirmed successfully via API.');

//         // Check account match via API data
//         const apiContractData = confirmationData.raw_data.contract[0].parameter.value;
//         const apiToAddress = tronWeb.address.fromHex(apiContractData.to_address);

//         if (apiToAddress === tronWeb.address.fromHex(MY_WALLET_ADDRESS)) {
//           console.log('✅ Funds are sent to your account.');
//         } else {
//           console.log('⚠️ Funds were NOT sent to your account.');
//         }

//       } else {
//         console.log('❌ Transaction failed or is still pending.');
//       }
//     } else {
//       console.log('❌ Transaction status is pending or failed.');
//     }
//   } catch (error) {
//     console.error('❗ Error verifying transaction:', error.message);
//   }
// }

// const txHash = '5ba8f2df2817b6ebb4e4ab883390a65bf31b64c5197fc5c0e6efffb97ea7e478';
// verifyTransaction(txHash);

const TronWeb = require('tronweb');
const axios = require('axios');

// Connect using TronGrid endpoint
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io'
});
const USDT_DECIMALS = 6;
// Your wallet address (to check if funds were sent to you)
const MY_WALLET_ADDRESS = '41a614f803b6fd780986a42c78ec9c7f77e6ded13c';

async function checkConfirmationStatus(txId) {
  try {
    const response = await axios.get(`https://api.trongrid.io/wallet/gettransactionbyid?value=${txId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching confirmation status:', error.message);
    return null;
  }
}

async function verifyTransaction(txId, expectedAmount) {
  try {
    const transaction = await tronWeb.trx.getTransaction(txId);
    console.log('Transaction Details:', transaction);
    console.log('Transaction Details:', JSON.stringify(transaction, null, 2));
    const receipt = await tronWeb.trx.getTransactionInfo(txId);
    console.log('Transaction Receipt:', receipt);
    console.log('Transaction Details:', JSON.stringify(receipt, null, 2));
    // Extract sender & receiver addresses
    const contractData = transaction.raw_data.contract[0].parameter.value;
    console.log("gg",contractData );
    
  const amount= await axios.get(`https://api.trongrid.io/v1/transactions/${txId}/events`)
    console.log("amount",  JSON.stringify(amount?.data, null, 2) );
    
    const value=amount.data.data[0].result.value;
console.log(value);

    console.log(`🔢 Raw on-chain amount: ${value}`);
    const usdt = Number(value) / 1e6;
    console.log(`💱 Human-readable amount:  ${usdt} USDT`);

    // 3. Verify amount matches expectation
    // if (usdt === expectedAmount) {
    //   console.log(`✅ Amount matches expected ${expectedAmount} USDT.`);
    // } else {
    //   console.log(`❌ Amount mismatch: expected ${expectedAmount} USDT but got ${usdt} USDT.`);
    // }

    if (usdt !== expectedAmount) {
      console.log(`❌ Amount mismatch: expected ${expectedAmount} USDT but got ${usdt} USDT.`);
      console.log('❌ Payment not successful due to amount mismatch.');
      return;
    } else {
      console.log(`✅ Amount matches expected ${expectedAmount} USDT.`);
    }
    const fromAddress = tronWeb.address.fromHex(contractData.owner_address);

    const toAddress = contractData.receiver_address
      ? tronWeb.address.fromHex(contractData.receiver_address)
      : tronWeb.address.fromHex(contractData.contract_address);

    console.log(`🔍 From: ${fromAddress}`);
    console.log(`📩 To: ${toAddress}`);

    // Enhanced Transaction Status Check
    const isSuccessful =
      (receipt.receipt && receipt.receipt.result === 'SUCCESS') || 
      (receipt.contractResult && receipt.contractResult[0] === '');

    if (isSuccessful) {
      console.log('✅ Transaction is confirmed and successful.');

      // Check if the transaction is for your account
      if (toAddress === tronWeb.address.fromHex(MY_WALLET_ADDRESS)) {
        console.log('✅ Funds are sent to your account.');
      } else {
        console.log('⚠️ Funds were NOT sent to your account.');
      }

    } else if (Object.keys(receipt).length === 0) {
      console.log('ℹ️ Receipt data is empty. Checking status via API...');

      const confirmationData = await checkConfirmationStatus(txId);
      if (
        confirmationData &&
        confirmationData.ret &&
        confirmationData.ret[0].contractRet === 'SUCCESS'
      ) {
        console.log('✅ Transaction confirmed successfully via API.');

        const apiContractData = confirmationData.raw_data.contract[0].parameter.value;
        const apiToAddress = apiContractData.to_address
          ? tronWeb.address.fromHex(apiContractData.to_address)
          : tronWeb.address.fromHex(apiContractData);

        if (apiToAddress === tronWeb.address.fromHex(MY_WALLET_ADDRESS)) {
          console.log('✅ Funds are sent to your account.');
        } else {
          console.log('⚠️ Funds were NOT sent to your account.');
        }

      } else {
        console.log('❌ Transaction failed or is still pending.');
      }
    } else {
      console.log('❌ Transaction status is pending or failed.');
    }
  } catch (error) {
    console.error('❗ Error verifying transaction:', error.message);
  }
}

const txHash = '7657092be043434e151a98f5bc37652e023ba4400ad7a6bcf98d618892d3ea82';
verifyTransaction(txHash,57.73);



// // botHandlers.js
// const {
//   saveBuyOrder,
//   getMatchingBuyOrder,
//   recordSellerResponse,
//   getUserHistory,
//   generateDailyReport,
//   markOrderStep,
//   getTransactionDetails,
//   getOrderDetails,
//   updateSellOrderInDB,
//   createSellOrderInDB,
// } = require('./db'); // Replace with your actual DB functions.
// const { verifyTronTransaction } = require('./tron'); // Replace with your actual Tron verification.

// const {
//   createOrder,
//   getCompositeKey,
//   getOrderByCompositeKey,
// } = require('./orderService');

// // In-memory mapping for selected orders is now replaced by DB storage.
// // However, if you need temporary in-memory mapping in addition to the DB,
// // you can still use a similar object. Here we assume mapping is stored in the DB.

// // Sends the welcome message.
// function startHandler(bot, msg) {
//   const welcomeText = `
// Welcome to the USDT-INR Exchange Bot!
// Available commands:

// /sell <amount>       - Accept a buy order
// /paid <hash>         - Provide transaction proof after USDT transfer
// /confirm            - Mark INR payment as complete
// /myhistory          - Show your transaction history
// /report <YYYY-MM-DD> - Get the daily report
// /upi <upi_id>        - Submit your UPI ID
// /bank <account_number> <IFSC> <branch> <name> - Submit your bank details
//   `;
//   bot.sendMessage(msg.chat.id, welcomeText);
// }

// // Handler for the admin to set price.
// async function setPriceHandler(bot, msg, match) {
//   const allowedUser = 'Mukesh760796';
//   if (msg.from.username !== allowedUser) {
//     bot.sendMessage(msg.chat.id, "Unauthorized: This command is restricted.");
//     return;
//   }

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
//     console.log("Price updated, orderId:", orderId);
//     bot.sendMessage(
//       msg.chat.id,
//       `Price updated: 1 USDT is now set to ₹${newPrice} INR.`
//     );
//   } catch (error) {
//     console.error("Error updating price:", error);
//     bot.sendMessage(msg.chat.id, "Failed to update the price. Please try again later.");
//   }
// }

// // Handler for users to sell USDT.
// async function sellHandler(bot, msg, match) {
//   const amount = parseFloat(match[1]);
//   if (isNaN(amount)) {
//     bot.sendMessage(msg.chat.id, "Usage: /sell <amount>");
//     return;
//   }

//   const priceList = await getMatchingBuyOrder();
//   if (!priceList || priceList.length === 0) {
//     bot.sendMessage(msg.chat.id, "No matching buy orders available.");
//     return;
//   }
//   const lastValue = priceList[priceList.length - 1];

//   if (amount < 10 || amount > 10000) {
//     bot.sendMessage(msg.chat.id, "Please specify an order amount between $10 and $10,000.");
//     return;
//   }

//   // Create a new sell order.
//   const sellOrderData = {
//     seller: msg.from.username,
//     amount,
//     createdAt: new Date(),
//     status: 'pending',
//   };

//   const newSellOrder = await createSellOrderInDB(sellOrderData);
//   console.log("New sell order created:", newSellOrder);

//   await updateSellOrderInDB(newSellOrder._id, {
//     price: lastValue.price,
//     matchedAt: new Date(),
//     status: 'matched',
//   });

//   // Record seller response and save order in the database.
//   recordSellerResponse(newSellOrder._id, {
//     seller: msg.from.username,
//     amount,
//     respondedAt: new Date(),
//   });

//   const responseText = `
// ✅ Order #${newSellOrder.orderNumber}
// Seller @${msg.from.username} accepted your order for ${amount} USDT at ₹${lastValue.price} per USDT. INR: ₹${amount * lastValue.price} 
// Please transfer USDT to the buyer's wallet (USDT TRC20) and Address: TUwxkYU7hJZCnqi1rCgZeBuDxQvuzC2Leq and then send your transaction proof using /paid.
//   `;
//   bot.sendMessage(msg.chat.id, responseText);
// }
  
// // Handler to confirm USDT transaction and trigger INR payment.
// async function confirmHandler(bot, msg) {
//   // Expecting a message like: "/paid <transaction_token>"
//   const text = msg.text;
//   const match = text.match(/\/paid\s+(\w+)/);
//   if (!match || !match[1]) {
//     bot.sendMessage(msg.chat.id, "Usage: /confirm <transaction_token>");
//     return;
//   }
  
//   const token = match[1];
//   // Retrieve the order based on the composite key stored in the DB.
//   const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id);
//   if (!orderDetails) {
//     bot.sendMessage(msg.chat.id, "No order found for confirmation. Please select an order first.");
//     return;
//   }

//   const verification = await verifyTronTransaction(token);
//   if (verification) {
//     const totalINR = orderDetails.totalAmount; // Assuming totalAmount here represents the INR amount.
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} ${orderDetails.totalAmount} USDT TRC20 transaction verified.
// I will pay ₹${totalINR} INR.
// Please share your UPI ID or Bank details with /upi or /bank.`
//     );
//     await updateSellOrderInDB(orderDetails.orderId, { status: 'confirmed' });
//     // Save order into the database using the orderService (if not already done).
//     // If your order was created in the DB earlier, you may update it here instead.
//     // Otherwise, uncomment the next line if you need to create it.
//     // await createOrder(orderDetails.orderId, totalINR, msg.chat.id, msg.from.id, orderDetails.orderNumber);
//   } else {
//     bot.sendMessage(msg.chat.id, `Order #${orderDetails.orderNumber} Transaction verification failed. Please try again.`);
//   }
// }

// // Handler for when the buyer makes a payment.
// async function paidHandler(bot, msg, match) {
//   const tokens = match.input.split(' ').filter(token => token.trim() !== '');
  
//   let orderId, paidAmount;

//   // If two parameters are provided: "/paid <order_id> <amount>"
//   if (tokens.length === 3) {
//     const adminUser = "Mukesh760796";
//     if (msg.from.username !== adminUser) {
//       bot.sendMessage(msg.chat.id, "Unauthorized: Only admin can specify an order ID.");
//       return;
//     }
//     orderId = tokens[1];
//     paidAmount = parseFloat(tokens[2]);
//   } else if (tokens.length === 2) {
//     paidAmount = parseFloat(tokens[1]);
//     // Get order details based on composite key.
//     const orderData = await getOrderByCompositeKey(msg.chat.id, msg.from.id);
//     if (!orderData) {
//       bot.sendMessage(msg.chat.id, "Order not found for payment.");
//       return;
//     }
//     orderId = orderData.orderId;
//   } else {
//     bot.sendMessage(msg.chat.id, "Usage: /paid <order_id> <amount> (admin) OR /paid <amount> (user)");
//     return;
//   }

//   const orderDetails = await getOrderById(orderId);
//   if (!orderDetails) {
//     bot.sendMessage(msg.chat.id, "Order not found.");
//     return;
//   }

//   if (isNaN(paidAmount) || paidAmount <= 0) {
//     bot.sendMessage(
//       msg.chat.id,
//       `Order #${orderDetails.orderNumber} - Please enter a valid amount. Example: /paid 5000`
//     );
//     return;
//   }

//   // Update the order’s paid amount.
//   orderDetails.amountPaid = (Number(orderDetails.amountPaid) || 0) + Number(paidAmount);
//   await orderDetails.save();

//   if (orderDetails.amountPaid < orderDetails.totalAmount) {
//     const remaining = orderDetails.totalAmount - orderDetails.amountPaid;
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Partial payment detected.
// You have paid ₹${orderDetails.amountPaid} out of ₹${orderDetails.totalAmount}.
// Please pay the remaining ₹${remaining}.`
//     );
//   } else if (orderDetails.amountPaid === orderDetails.totalAmount) {
//     markOrderStep(orderId, "INR_paid");
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Payment complete. Waiting for seller confirmation of INR receipt. /done`
//     );
//   } else {
//     const extra = orderDetails.amountPaid - orderDetails.totalAmount;
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} Payment complete with ₹${extra} extra paid. Waiting for seller confirmation. /done`
//     );
//   }
// }

// // Handler for seller confirmation once INR is received.
// async function sellerConfirmHandler(bot, msg) {
//   const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id);
//   if (!orderDetails) {
//     bot.sendMessage(msg.chat.id, "No order associated with this chat. Please select an order first.");
//     return;
//   }
  
//   try {
//     bot.sendMessage(
//       msg.chat.id,
//       `✅ Order #${orderDetails.orderNumber} 👍 Transaction completed successfully.`
//     );
//     // Optionally, remove the selected order mapping from the DB.
//     const compositeKey = getCompositeKey(msg.chat.id, msg.from.id);
//     // Remove the mapping:
//     const SelectedOrder = require('./models/SelectedOrder');
//     await SelectedOrder.deleteOne({ compositeKey });
//   } catch (error) {
//     console.error("Error finalizing seller confirmation:", error);
//     bot.sendMessage(
//       msg.chat.id,
//       `Order #${orderDetails.orderNumber} - Error finalizing the transaction. Please try again.`
//     );
//   }
// }

// // Handler for retrieving user transaction history.
// function myHistoryHandler(bot, msg) {
//   const history = getUserHistory(msg.from.username);
//   if (!history || history.length === 0) {
//     bot.sendMessage(msg.chat.id, "No transaction history found.");
//     return;
//   }
//   const historyText = history.map((t) => `${t.date}: ${t.details}`).join('\n');
//   bot.sendMessage(msg.chat.id, historyText);
// }

// // Handler for processing UPI details.
// async function upiHandler(bot, msg, match) {
//   const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id);
//   if (!orderDetails) {
//     bot.sendMessage(msg.chat.id, "Order not found.");
//     return;
//   }
//   const upiId = match[1].trim();
//   // Process and store the UPI ID as needed.
//   bot.sendMessage(
//     msg.chat.id,
//     `✅ Order #${orderDetails.orderNumber} Received your UPI ID: ${upiId}`
//   );
// }

// // Handler for processing bank details.
// async function bankHandler(bot, msg, match) {
//   const orderDetails = await getOrderByCompositeKey(msg.chat.id, msg.from.id);
//   if (!orderDetails) {
//     bot.sendMessage(msg.chat.id, "Order not found.");
//     return;
//   }
//   const args = match[1].split(' ');
//   if (args.length < 5) {
//     bot.sendMessage(msg.chat.id, 'Usage: /bank <account_number> <IFSC> <branch> <name>');
//     return;
//   }
//   const bankDetails = {
//     account_number: args[0],
//     IFSC: args[1],
//     branch: args[2],
//     name: args.slice(3).join(' ')
//   };

//   bot.sendMessage(
//     msg.chat.id,
//     `✅ Order #${orderDetails.orderNumber} Bank details received successfully!
// Account Number: ${bankDetails.account_number}
// IFSC Code: ${bankDetails.IFSC}
// Branch Name: ${bankDetails.branch}
// Account Holder: ${bankDetails.name}`
//   );
// }

// // Handler for generating a daily report.
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
//   bankHandler,
// };
