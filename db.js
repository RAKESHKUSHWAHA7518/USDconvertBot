// const mongoose = require('mongoose');

// // Connect to the MongoDB database for the trading bot
//   mongoose.connect("mongodb+srv://collegepdf7518:TuxtOtelZHNSDsLW@cluster0.uswk3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// // , {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true
// //   }
// // Define the schema for an order in the trading bot
// const OrderSchema = new mongoose.Schema({
//   buyer: String, // The buyer's identifier or name
//   amount: Number, // The amount of cryptocurrency being bought
//   price: Number, // The price of the cryptocurrency at the time of order
//   status: String, // The current status of the order (e.g., 'open', 'completed', 'cancelled')
//   createdAt: { type: Date, default: Date.now }, // The date when the order was created
//   // Additional fields can be added as needed for the bot's logic
// });

// // Create the Order model using the schema
// const Order = mongoose.model('Order', OrderSchema);

// // Function to save a new buy order to the database
// function saveBuyOrder(orderData) {
//   const order = new Order(orderData);
//   order.save(); // Save the new order to the database
//   return order._id; // Return the order's unique ID
// }

// // Function to find an open buy order with a matching amount
// // function getMatchingBuyOrder(amount) {
// //   // Find an open order with the exact amount (or implement your own business logic for partial matches)
// //   return Order.findOne({ amount, status: 'open' });
// // }

// // async function getMatchingBuyOrder(amount) {
// //     try {
// //       // Find all open orders with the exact amount
// //       const orders = await Order.find({ amount, status: 'open' });
// //       console.log("Matching orders:", orders);
// //       return orders;
// //     } catch (err) {
// //       console.error("Error fetching matching orders:", err);
// //     }
// //   }

// async function getMatchingBuyOrder(amount) {
//     try {
//       // Find all open orders with the exact amount
//       const orders = await Order.find({ amount, status: 'open' });
//       if (!orders || orders.length === 0) {
//         console.log("No matching orders found");
//         return null;
//       }
//       console.log("Matching orders:", orders);
//       return orders;
//     } catch (err) {
//       console.error("Error fetching matching orders:", err);
//       return null;
//     }
//   }
//   async function getOrderDetails(orderId) {
//     try {
//       const order = await Order.findById(orderId);
//       if (!order) {
//         return { error: "Order not found." };
//       }
  
//       return {
//         orderId: order._id,
//         amount: order.amount,
//         price: order.price
//       };
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//       return { error: "Failed to fetch order details." };
//     }
//   }
  
  
//   async function getOrderById(orderId) {
//     try {
//       return await Order.findById(orderId);
//     } catch (error) {
//       console.error("Error fetching order:", error.message);
//       return null;
//     }
//   }

// // Placeholder function to handle seller responses (you should implement this based on your bot's logic)
// function recordSellerResponse(orderId, sellerData) {
//   // Logic to record the seller's response, such as accepting an order
//   // You would likely update the status of the order or add data about the seller
// }

// // Placeholder function to get user history
// function getUserHistory(username) {
//   // Implement logic to retrieve a user's transaction or order history
//   return []; // Return an empty array for now as a placeholder
// }

// // Placeholder function to generate a daily report
// function generateDailyReport(date) {
//   // Implement logic to generate a daily report based on the given date
//   return null; // Return null as a placeholder
// }

// // Function to mark the progress of an order (e.g., 'pending', 'completed', etc.)
// //  async function markOrderStep(orderId, step) {
// //   // Update the order's status or progress based on the given step
// //  await Order.findByIdAndUpdate(orderId, { status: step }, (err, result) => {
// //     if (err) {
// //       console.error('Error updating order step:', err);
// //     } else {
// //       console.log('Order step updated:', result);
// //     }
// //   });
// // }

// //  async function createSellOrderInDB(orderData) {
// //   if (!ordersCollection) await connectDB();
// //   const result = await ordersCollection.insertOne(orderData);
// //   return { ...orderData, _id: result.insertedId };
// // }

// // async function updateSellOrderInDB(orderId, updateData) {
// //   if (!ordersCollection) await connectDB();
// //   await ordersCollection.updateOne({ _id: new ObjectId(orderId) }, { $set: updateData });
// // }

// async function getNextSequenceValue(sequenceName) {
//   if (!countersCollection) await connectDB();
//   const sequenceDocument = await countersCollection.findOneAndUpdate(
//     { _id: sequenceName },
//     { $inc: { sequence_value: 1 } },
//     { returnDocument: "after", upsert: true }
//   );
//   return sequenceDocument.value.sequence_value;
// }

// // Create a new sell order in the database with a sequential order id
// async function createSellOrderInDB(orderData) {
//   // if (!ordersCollection) await connectDB();
//   // Get the next order number (e.g., 1, 2, 3, ...)
//   const orderNumber = await getNextSequenceValue('sellOrderId');
//   orderData.orderNumber = orderNumber;
  
//   const result = await ordersCollection.insertOne(orderData);
//   return { ...orderData, _id: result.insertedId };
// }

// // Update an existing sell order in the database
// async function updateSellOrderInDB(orderId, updateData) {
//   if (!ordersCollection) await connectDB();
//   await ordersCollection.updateOne({ _id: new ObjectId(orderId) }, { $set: updateData });
// }

// async function markOrderStep(orderId, step) {
//   console.log(orderId, step);
  
//   try {
//     const result = await Order.findByIdAndUpdate(
//       orderId, 
//       { status: step },
//       { new: true } // Option to return the updated document
//     );
//     console.log('Order step updated:', result);
//   } catch (err) {
//     console.error('Error updating order step:', err);
//   }
// }


// // Placeholder function to extract transaction details from a message
// function getTransactionDetails(msg) {
//   // Implement logic to extract transaction details from the incoming message
//   return {}; // Return an empty object as a placeholder
// }

// // Placeholder function to verify a Tron transaction
// function verifyTronTransaction(txDetails) {
//   // Implement logic to verify the Tron transaction, such as checking the transaction hash
//   return true; // Return true for now as a placeholder
// }

// // Function to clean up old records, like expired or completed orders
// function cleanupOldRecords() {
//   // Implement logic to delete or archive old orders from the database
//   Order.deleteMany({ createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }) // Deletes orders older than 1 day
//     .then(() => {
//       console.log('Old records cleaned up successfully');
//     })
//     .catch((err) => {
//       console.error('Error cleaning up old records:', err);
//     });
// }

// // Export the functions so they can be used in other parts of the bot
// module.exports = {
//   saveBuyOrder,
//   getMatchingBuyOrder,
//   recordSellerResponse,
//   getUserHistory,
//   generateDailyReport,
//   markOrderStep,
//   getTransactionDetails,
//   verifyTronTransaction,
//   cleanupOldRecords,
//   getOrderDetails,
//   getOrderById,
//   updateSellOrderInDB,
//   createSellOrderInDB
// };



const mongoose = require('mongoose');
// const { getCompositeKey } = require('./commands');
require('dotenv').config();
console.log(process.env.DATABASE);
const mongoUri = process.env.DATABASE;
if (!mongoUri) {
  throw new Error("DATABASE is not defined in environment variables.");
}
// Connect to the MongoDB database for the trading bot
mongoose.connect("mongodb+srv://collegepdf7518:TuxtOtelZHNSDsLW@cluster0.uswk3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// --------------------
// Order (Buy Order) Model
// --------------------
const OrderSchema = new mongoose.Schema({
        // The buyer's identifier or name
     // The amount of cryptocurrency being bought
  price: Number,       // The price of the cryptocurrency at the time of order
      // The current status of the order (e.g., 'open', 'completed', 'cancelled')
  createdAt: { type: Date, default: Date.now } // The date when the order was created
});

const Order = mongoose.model('Order', OrderSchema);

// --------------------
// Sell Order Model
// --------------------
const SellOrderSchema = new mongoose.Schema({
  seller: String,      // The seller's identifier or name
  amount: Number,      // The amount of cryptocurrency being sold
  price: Number,       // The price at which the cryptocurrency is sold
  status: String,
  // username:String,      // The current status (e.g., 'open', 'completed', 'cancelled')
  orderNumber: Number, // A sequential order number for sell orders
  createdAt: { type: Date, default: Date.now }
});

const SellOrder = mongoose.model('SellOrder', SellOrderSchema);

// --------------------
// Counter Model for sequential IDs
// --------------------
const CounterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

const OrderDetailsSchemas = new mongoose.Schema({
  // orderId: { type: String, required: true, unique: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellOrder', required: true, unique: true },
  compositeKey: { type: String, required: true, unique: true },
  orderNumber: { type: String }, // if applicable
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  status: { type: String, default: 'created' },
  createdAt: { type: Date, default: Date.now },
});

const Ordersdetails = mongoose.model('Ordersdetails', OrderDetailsSchemas);


const SelectedOrderSchema = new mongoose.Schema({
  compositeKey: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
});

const SelectedOrder = mongoose.model('SelectedOrder', SelectedOrderSchema);

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
})
const Transaction = mongoose.model('Transaction', transactionSchema);

function getCompositeKey(chatId, userId,orderNumber) {
  return `${chatId}_${userId}_${orderNumber}`;
}

/**
 * Save an order and the selected order mapping into the database.
 *
* @param {string} orderId - Unique ID of the order.
 * @param {number} totalAmount - Total amount for the order.
 * @param {string|number} chatId - Chat ID.
 * @param {string|number} userId - User ID.
 * @param {string} orderNumber - Order number (optional).
 */
async function createOrder(orderId, totalAmount, chatId, userId, orderNumber) {
  console.log(orderId);
  const compositeKey = getCompositeKey(chatId, userId,orderNumber);
//  const sellOrder = await SellOrder.findOne({ orderNumber: Number(identifier) });
const sellOrder = await SellOrder.findById(orderId);
console.log(sellOrder);

 if (!sellOrder) {
  throw new Error('SellOrder not found');
}

  try {
    // Create and save the order document.
    const ordersdetails = new Ordersdetails({
      orderId:orderId,
      orderNumber,
      totalAmount,
      amountPaid: 0,
      status: 'created',
      compositeKey
    });
    console.log(ordersdetails);
    
    await ordersdetails.save();
    console.log('Order saved:', ordersdetails);

    // Create and save the selected order mapping.
    // const compositeKey = getCompositeKey(chatId, userId,orderNumber);
    // const selectedOrder = new SelectedOrder({
    //   compositeKey,
    //   orderId,
    // });
    // await selectedOrder.save();
    // console.log('Selected order mapping saved:', selectedOrder);
  } catch (error) {
    console.error('Error saving order:', error);
  }
}

async function updateOrder(chatId, userId,orderNumber, updateFields) {
  console.log(updateFields);
  const compositeKey = getCompositeKey(chatId, userId,orderNumber);
  try {
    const updatedOrder = await Ordersdetails.findOneAndUpdate(
      { orderNumber },
      { $set: updateFields },
      { new: true } // returns the updated document
    );
    if (!updatedOrder) {
      console.log(`Order with ID ${compositeKey} not found.`);
      return null;
    }
    console.log('Order updated:', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

async function getOrder(chatId, userId, orderNumber ) {
  const compositeKey = getCompositeKey(chatId, userId,orderNumber);
  try {
    const order = await Ordersdetails.findOne({ orderNumber });
    console.log(order);
    
    if (!order) {
      console.log(`Order with ID ${compositeKey} not found.`);
      return false;
    }
    console.log('Order retrieved:', order);
    return order;
  } catch (error) {
    console.error('Error retrieving order:', error);
    throw error;
  }
}

async function transactionid( transactionId) {
  try {
    // const compositeKey = getCompositeKey(chatId, userId,orderNumber);
    const transaction = new Transaction({transactionId});

    await transaction.save();
    return transaction;
  } catch (error) {
    console.error('Error retrieving order by composite key:', error);
    return null;
  }
}

async function getTransaction(transactionId) {
  try {
    return await Transaction.findOne({ transactionId });

  } catch (error) {
    console.error('Error retrieving order:', error);
    return false;
  }
}

async function storeSelectedOrderMapping(chatId, userId, orderId,orderNumber) {
  console.log(orderId);
  
  try {
    const compositeKey = getCompositeKey(chatId, userId,orderNumber);

    // Check if an entry with the same compositeKey and orderId already exists
    const existingOrder = await SelectedOrder.findOne({ compositeKey, orderId });

    if (existingOrder) {
      console.log(`Duplicate order detected: User ${userId} already sold Order ${orderId}`);
      return { error: "You cannot sell the same order multiple times." };
    }

    // If no duplicate, save the new order mapping
    const selectedOrder = new SelectedOrder({
      compositeKey,
      orderId,
    });

    await selectedOrder.save();
    console.log('Selected order mapping saved:', selectedOrder);
    return selectedOrder;
  } catch (error) {
    console.error('Error saving selected order mapping:', error);
    return { error: "Failed to save order mapping." };
  }
}


/**
 * Retrieve an order by its orderId.
 */
async function getOrderById(orderId) {
  try {
    return await Order.findOne({ orderId });
  } catch (error) {
    console.error('Error retrieving order:', error);
    return null;
  }
}

async function getOrderByIdDetails(orderId) {
  try {
    return await Orders.findOne({ orderId });
  } catch (error) {
    console.error('Error retrieving order:', error);
    return null;
  }
}
/**
 * Retrieve an order based on the composite key.
 */
async function getOrderByCompositeKey(chatId, userId,orderNumber) {
  try {
    const compositeKey = getCompositeKey(chatId, userId,orderNumber);
    const selectedOrder = await SelectedOrder.findOne({ compositeKey });
    console.log("Rakesh",selectedOrder);
    
    if (selectedOrder) {
      return await getOrderDetails(selectedOrder.orderId);
    }
    return false;
  } catch (error) {
    console.error('Error retrieving order by composite key:', error);
    return false;
  }
}
// --------------------
// Functions for Buy Orders
// --------------------

// Save a new buy order to the database
function saveBuyOrder(orderData) {
  const order = new Order(orderData);
  order.save();
  return order._id; // Return the order's unique ID
}

// Find open buy orders with a matching amount
async function getMatchingBuyOrder() {
  try {
    const orders = await Order.find({});
    console.log(orders);
    
    if (!orders || orders.length === 0) {
      console.log("No matching orders found");
      return null;
    }
    console.log("Matching orders:", orders);
    return orders;
  } catch (err) {
    console.error("Error fetching matching orders:", err);
    return null;
  }
}

// async function getOrderDetails(orderId) {
//   try {
//     const order = await SellOrder.findById(orderId);
//     if (!order) {
//       return { error: "Order not found." };
//     }
//     return  order
//   } catch (error) {
//     console.error("Error fetching order details:", error);
//     return { error: "Failed to fetch order details." };
//   }
// }

async function getOrderDetails(identifier) {
  try {
    let order;
    // Check if identifier is a valid MongoDB ObjectId.
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      order = await SellOrder.findById(identifier);
      console.log(order);
      
    } else if (!isNaN(identifier)) {
      // If it's numeric, convert to a number and use it to find by orderNumber.
      order = await SellOrder.findOne({ orderNumber: Number(identifier) });
      console.log( order);
      
    } else {
      return { error: "Invalid order identifier." };
    }
    
    if (!order) {
      return { error: "Order not found." };
    }
    return order;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return { error: "Failed to fetch order details." };
  }
}

async function getOrderById(orderId) {
  try {
    return await Order.findById(orderId);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    return null;
  }
}

// --------------------
// Functions for Sell Orders
// --------------------

// Get the next sequence value for a given counter name (e.g., 'sellOrderId')
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
}

// Create a new sell order with a sequential order number
async function createSellOrderInDB(orderData) {
  const orderNumber = await getNextSequenceValue('sellOrderId');
  orderData.orderNumber = orderNumber;
  
  const sellOrder = new SellOrder(orderData);
  await sellOrder.save();
  return sellOrder;
}

// Update an existing sell order in the database
async function updateSellOrderInDB(orderId, updateData) {
  try {
    const updatedOrder = await SellOrder.findByIdAndUpdate(
      orderId, 
      { $set: updateData },
      { new: true }
    );
    console.log(updatedOrder);
    return updatedOrder;
     
  } catch (error) {
    console.error("Error updating sell order:", error.message);
    return null;
  }
}

// --------------------
// Additional Utility Functions
// --------------------

// Placeholder function to handle seller responses (update order status or add seller details)
function recordSellerResponse(orderId, sellerData) {
  // Implement your logic here
}

// Placeholder function to get user history (transaction or order history)
function getUserHistory(username) {
  // Implement logic to retrieve a user's history
  return []; // Placeholder return
}

// Placeholder function to generate a daily report based on the date
// async function generateDailyReport(date) {
//   // async function getOrderDetailsWithSellOrder(orderDetailsId) {
//     try {
//       const orderDetails = await Ordersdetails.findById(orderDetailsId).populate('orderId');
//       console.log('OrderDetails with populated SellOrder:', orderDetails);
//       return orderDetails;
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//       return null
//     }
  
//   ; // Placeholder return
// }

// Mark the progress of an order (e.g., update status to 'pending', 'completed', etc.)
// async function markOrderStep(orderId, step) {
//   console.log("Marking order", orderId, "as", step);
//   try {
//     const result = await Order.findByIdAndUpdate(
//       orderId, 
//       { status: step },
//       { new: true }
//     );
//     console.log('Order step updated:', result);
//   } catch (err) {
//     console.error('Error updating order step:', err);
//   }
// }

// async function generateDailyReport(date = new Date()) {
//   console.log(date);
  
//   try {
//     // Get the start and end of the day for the provided date
//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     // Query for OrderDetails created within today's range
//     const dailyOrders = await Ordersdetails.find({
//       createdAt: { $gte: startOfDay, $lte: endOfDay }
//     }).populate('orderId'); // Populate the associated SellOrder

//     console.log("Today's Order Details with populated SellOrder:", dailyOrders);
//     return dailyOrders;
//   } catch (error) {
//     console.error("Error fetching daily report:", error);
//     return null;
//   }
// }

// Placeholder function to extract transaction details from a message

async function generateDailyReport(dateInput = new Date()) {
  let date;
  if (typeof dateInput === "string") {
    const parts = dateInput.split("-");
    if (parts.length !== 3) {
      console.error("Invalid date format. Use DD-MM-YYYY.");
      return [];
    }
    // Note: Month in JavaScript Date is 0-indexed
    date = new Date(parts[2], parts[1] - 1, parts[0]);
  } else {
    date = new Date(dateInput);
  }

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Use find (instead of findOne) to retrieve all orders for that day
    const dailyOrders = await Ordersdetails.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('orderId'); // Populates the associated SellOrder

    console.log("Daily Orders:", dailyOrders);
    return dailyOrders;
  } catch (error) {
    console.error("Error fetching daily report:", error);
    return [];
  }
}

function getTransactionDetails(msg) {
  // Implement logic to extract transaction details from the message
  return {}; // Placeholder return
}

// Placeholder function to verify a Tron transaction
function verifyTronTransaction(txDetails) {
  // Implement logic to verify the Tron transaction, e.g., check transaction hash
  return true; // Placeholder return
}

// Clean up old records (delete orders older than 1 day)
function cleanupOldRecords() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  Order.deleteMany({ createdAt: { $lt: oneDayAgo } })
    .then(() => {
      console.log('Old records cleaned up successfully');
    })
    .catch((err) => {
      console.error('Error cleaning up old records:', err);
    });
}

// --------------------
// Export Functions
// --------------------
module.exports = {
  saveBuyOrder,
  getMatchingBuyOrder,
  recordSellerResponse,
  getUserHistory,
  generateDailyReport,
   
  getTransactionDetails,
  verifyTronTransaction,
  cleanupOldRecords,
  getOrderDetails,
  getOrderById,
  updateSellOrderInDB,
  createSellOrderInDB,
  getCompositeKey,
  createOrder,
  getOrderById,
  getOrderByCompositeKey,
  storeSelectedOrderMapping,
  updateOrder,
  getOrder,
  transactionid,
  getTransaction
};
