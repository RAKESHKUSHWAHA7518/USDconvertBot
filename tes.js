// //  function star(){
// //     let star='';

// //  for(let i=5;i>=1;i--){
// //     for(let j=0;j<=i;j++){
// //         star+='*';
// //     }
// //     star+='\n';

// //  }
 
// //     return star;
// // }
// // console.log(star(5));


// // function star(n) {
// //     let output = '';
  
// //     for (let i = n; i >= 1; i--) {
// //       // j goes from 1 to i inclusive → i stars
// //       for (let j = 1; j <= i; j++) {
// //         output += '*';
// //       }
// //       output += '\n';
// //     }
  
// //     return output;
// //   }
  
// //   console.log(star(5));
  
// const crypto = require('crypto');
// const algorithm = 'aes-128-cbc';
// const secret = "75f2bd1131870721df8eb57d322e8adb'";
// const password = 'NY7dahgN9di';
// var till = Math.floor(new Date()/1000)+3600;
 
// function encrypt(text){
//     console.log(text);
    
//     var iv = crypto.randomBytes(16);
//     var cipher = crypto.createCipheriv(algorithm, Buffer.from(secret, 'hex'), iv);
//     var encryptedText = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
//     return iv.toString('hex') + '.' + encryptedText;
// }
//  console.log(till);
 
// var hash = encrypt(till + '.' + password);
// console.log(hash);


// hash.js

const crypto = require('crypto');
const algorithm = 'aes-128-cbc';
const secret = '75f2bd1131870721df8eb57d322e8adb'; // 32 hex characters (16 bytes)
const password = '92hf83jsba&1';
// Optionally, you could generate 'till' dynamically with:
const till = Math.floor(new Date()/1000) + 3600;
// const till = 1745236822;

function encrypt(text) {
    // Generate a 16-byte random initialization vector (IV)
    const iv = crypto.randomBytes(16);
    
    // Create a cipher using the secret key and the IV in AES-128-CBC mode
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secret, 'hex'), iv);
    
    // Encrypt the text (with padding) and combine output parts
    const encryptedText = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    
    // Return a string in the format "iv_hex.encryptedText_hex"
    return iv.toString('hex') + '.' + encryptedText;
}

// Create plaintext in the format "till.password"
const plaintext = till + '.' + password;
console.log(till);

// Generate the hash and output it
const hash = encrypt(plaintext);
console.log(hash);


// finds “ct” in document.cookie
// const ct = document.cookie
//   .split('; ')
//   .find(pair => pair.startsWith('ct='))
//   ?.split('=')[1];
// console.log('ct:', ct);
// tes.js
// const express      = require('express');
// const cookieParser = require('cookie-parser');

// const app = express();
// app.use(cookieParser());

// app.get('/', (req, res) => {
//   const ct = req.cookies;
//   console.log('ct:', ct);
//   res.send(`Your ct token is ${ct}`);
// });

// app.listen(3000, () => console.log('Listening on port 3000'));
