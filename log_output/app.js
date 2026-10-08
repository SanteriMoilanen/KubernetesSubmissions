const crypto = require('crypto');

const randUUID = crypto.randomUUID();

setInterval(() => {
   console.log(`${new Date().toISOString()}: ${randUUID}`) 
}, 5 * 1000);
