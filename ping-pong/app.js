const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const FILE = '/usr/src/app/files/pingpong.txt';

let counter = 0;
try {
  counter = Number(fs.readFileSync(FILE, 'utf-8')) || 0;
} catch {}

http.createServer((req, res) => {
  if (req.method !== 'GET' || req.url !== '/pingpong') {
    res.writeHead(404);
    return res.end();
  }
  const current = counter++;
  fs.writeFileSync(FILE, String(counter));
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`pong ${current}`);
}).listen(PORT);
