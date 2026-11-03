const crypto = require('crypto');
const fs = require('fs');

const randomString = crypto.randomUUID();

setInterval(() => {
  const logEntry = `${new Date().toISOString()}: ${randomString}\n`;
  console.log(logEntry);
  fs.appendFile('/usr/src/app/files/log.txt', logEntry, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
}, 5000);