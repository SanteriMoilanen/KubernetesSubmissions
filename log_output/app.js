const http = require('http');
const crypto = require('crypto');

const randomString = crypto.randomUUID();
const PORT = process.env.PORT || 3000;

setInterval(() => {
  console.log(`${new Date().toISOString()}: ${randomString}`);
}, 5000);

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  res.end(
    `${new Date().toISOString()}: ${randomString}`
  );
}).listen(PORT);