// const axios = require('axios');
// const { response } = require('express');

// const TronWeb = require('tronweb');

// // Connect using TronGrid endpoint
// const tronWeb = new TronWeb({
//   fullHost: 'https://api.trongrid.io'
// });

// async function verifyTronTransaction(txId) {
//   try {
//     // Fetch transaction data
//     const transaction = await tronWeb.trx.getTransaction(txId);
//     console.log('Transaction Details:', transaction);

//     // Fetch additional transaction info (like status)
//     const receipt = await tronWeb.trx.getTransactionInfo(txId);
//     console.log('Transaction Receipt:', receipt);

//     if (receipt && receipt.receipt && receipt.receipt.result === 'SUCCESS') {
//       console.log('Transaction is confirmed and successful.');
//     } else {
//       console.log('Transaction status is pending or failed.');
//     }
//   } catch (error) {
//     console.error('Error verifying transaction:', error);
//   }
// }

// async function verifyTronTransaction(txHash) {
//   try {
//     console.log(txHash);
    
//     const apiUrl = `https://api.trongrid.io/v1/transaction/TWqF5bpc1aZ7MMxDqGficXCefwxmTeVp7x`;
//     const response = await axios.get(apiUrl);
// console.log(response);
//   if(txHash=='4599f7d50fbf566e788ce6e6451e848bfbe1c569'){
//     return true;
//   }
//     // Ensure data exists and is not empty
//     // if (
//     //   response.status === 200 &&
//     //   response.data.data &&
//     //   response.data.data.length > 0 &&
//     //   response.data.data[0].ret &&
//     //   response.data.data[0].ret.length > 0 &&
//     //   response.data.data[0].ret[0].contractRet === "SUCCESS"
//     // ) {
//     //   return response.data.data;
//     // }
//     // return response.data.data;
//   } catch (error) {
//     // console.log(error.response);
//     // console.log(JSON.stringify(response, null, 2));

//     // Check if the error is due to a 404 response
//     // if (error.response && error.response.status === 404) {
//     //   return null;
//     // }
//     console.error("Error verifying transaction:", error);
//     // return null;
//   }
// }

// async function verifyTronTransaction(txHash) {
//   try {
//     const apiUrl = `https://api.trongrid.io/v1/transaction/${txHash}`;
//     const response = await axios.get(apiUrl);
//     if (response.status === 200 && response.data.data[0].ret[0].contractRet === "SUCCESS") {
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error("Error verifying transaction:", error);
//     return false;
//   }
// }
//  const TronWeb = require('tronweb');
//  const axios = require('axios');
 
//  // Connect using TronGrid endpoint
//  const tronWeb = new TronWeb({
//    fullHost: 'https://api.trongrid.io'
//  });
 
//  // Your wallet address (to check if funds were sent to you)
//  const MY_WALLET_ADDRESS = '41a614f803b6fd780986a42c78ec9c7f77e6ded13c';
 
//  async function checkConfirmationStatus(txId) {
//    try {
//      const response = await axios.get(`https://api.trongrid.io/wallet/gettransactionbyid?value=${txId}`);
//      return response.data;
//    } catch (error) {
//      console.error('Error fetching confirmation status:', error.message);
//      return null;
//    }
//  }
 
//  async function verifyTronTransaction(txId) {
//    try {
//      const transaction = await tronWeb.trx.getTransaction(txId);
//      console.log('Transaction Details:', transaction);
 
//      const receipt = await tronWeb.trx.getTransactionInfo(txId);
//      console.log('Transaction Receipt:', receipt);
 
//      // Extract sender & receiver addresses
//      const contractData = transaction.raw_data.contract[0].parameter.value;
//      console.log(contractData );
     
//      const fromAddress = tronWeb.address.fromHex(contractData.owner_address);
 
//      const toAddress = contractData.receiver_address
//        ? tronWeb.address.fromHex(contractData.receiver_address)
//        : tronWeb.address.fromHex(contractData.contract_address);
 
//      console.log(`🔍 From: ${fromAddress}`);
//      console.log(`📩 To: ${toAddress}`);
 
//      // Enhanced Transaction Status Check
//      const isSuccessful =
//        (receipt.receipt && receipt.receipt.result === 'SUCCESS') || 
//        (receipt.contractResult && receipt.contractResult[0] === '');
 
//      if (isSuccessful) {
//        console.log('✅ Transaction is confirmed and successful.');
 
//        // Check if the transaction is for your account
//        if (toAddress === tronWeb.address.fromHex(MY_WALLET_ADDRESS)) {
//          console.log('✅ Funds are sent to your account.');
//        } else {
//          console.log('⚠️ Funds were NOT sent to your account.');
//        }
 
//      } else if (Object.keys(receipt).length === 0) {
//        console.log('ℹ️ Receipt data is empty. Checking status via API...');
 
//        const confirmationData = await checkConfirmationStatus(txId);
//        if (
//          confirmationData &&
//          confirmationData.ret &&
//          confirmationData.ret[0].contractRet === 'SUCCESS'
//        ) {
//          console.log('✅ Transaction confirmed successfully via API.');
 
//          const apiContractData = confirmationData.raw_data.contract[0].parameter.value;
//          const apiToAddress = apiContractData.to_address
//            ? tronWeb.address.fromHex(apiContractData.to_address)
//            : tronWeb.address.fromHex(apiContractData);
 
//          if (apiToAddress === tronWeb.address.fromHex(MY_WALLET_ADDRESS)) {
//            console.log('✅ Funds are sent to your account.');
//            return true;
//          } else {
//            console.log('⚠️ Funds were NOT sent to your account.');
//            return true
//          }
 
//        } else {
//          console.log('❌ Transaction failed or is still pending.');
//        }
//      } else {
//        console.log('❌ Transaction status is pending or failed.');
//      }
//    } catch (error) {
//      console.error('❗ Error verifying transaction:', error.message);
//    }
//  }
 

// module.exports = {
//   verifyTronTransaction,
// };

const TronWeb = require('tronweb');
const axios = require('axios');

// Connect using TronGrid endpoint
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io'
});

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

async function verifyTronTransaction(txId) {
  try {
    const transaction = await tronWeb.trx.getTransaction(txId);
    console.log('Transaction Details:', transaction);

    const receipt = await tronWeb.trx.getTransactionInfo(txId);
    console.log('Transaction Receipt:', receipt);

    // Extract sender & receiver addresses from transaction data
    const contractData = transaction.raw_data.contract[0].parameter.value;
    console.log('Contract Data:', contractData);

    const fromAddress = tronWeb.address.fromHex(contractData.owner_address);
    // Check both "receiver_address" and "contract_address"
    const toAddress = contractData.receiver_address
      ? tronWeb.address.fromHex(contractData.receiver_address)
      : tronWeb.address.fromHex(contractData.contract_address);

    console.log(`🔍 From: ${fromAddress}`);
    console.log(`📩 To: ${toAddress}`);

    // Check transaction status from receipt
    const isSuccessful =
      (receipt.receipt && receipt.receipt.result === 'SUCCESS') ||
      (receipt.contractResult && receipt.contractResult[0] === '');

    if (isSuccessful) {
      console.log('✅ Transaction is confirmed and successful.');
      // Check if funds are sent to your account
      if (toAddress === tronWeb.address.fromHex(MY_WALLET_ADDRESS)) {
        console.log('✅ Funds are sent to your account.');
        return true;
      } else {
        console.log('⚠️ Funds were NOT sent to your account.');
        return false;
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
          : tronWeb.address.fromHex(apiContractData.contract_address);
        if (apiToAddress === tronWeb.address.fromHex(MY_WALLET_ADDRESS)) {
          console.log('✅ Funds are sent to your account.');
          return true;
        } else {
          console.log('⚠️ Funds were NOT sent to your account.');
          return false;
        }
      } else {
        console.log('❌ Transaction failed or is still pending.');
        return false;
      }
    } else {
      console.log('❌ Transaction status is pending or failed.');
      return false;
    }
  } catch (error) {
    console.error('❗ Error verifying transaction:', error.message);
    return false;
  }
}

module.exports = {
  verifyTronTransaction,
};
