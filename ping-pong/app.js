const http = require('http');

const PORT = process.env.PORT || 3000;
let counter = 0;

http.createServer((req, res) => {
  if (req.method !== 'GET' || req.url !== '/pingpong') {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`pong ${counter++}`);
}).listen(PORT);
