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

async function verifyTransaction(txId) {
  try {
    const transaction = await tronWeb.trx.getTransaction(txId);
    console.log('Transaction Details:', transaction);

    const receipt = await tronWeb.trx.getTransactionInfo(txId);
    console.log('Transaction Receipt:', receipt);

    // Extract sender & receiver addresses
    const contractData = transaction.raw_data.contract[0].parameter.value;
    console.log(contractData );
    
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

const txHash = 'aa4a0f36072569c5974ec7bfeecd4c8a720eb768148d1679b384b0e3872e8752';
verifyTransaction(txHash);
