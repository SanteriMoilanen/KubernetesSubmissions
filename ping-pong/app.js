const http = require('http');

const PORT = process.env.PORT || 3000;
let counter = 0;

http.createServer((req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(404);
    return res.end();
  }
  if (req.url === '/pingpong') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end(`pong ${counter++}`);
  }
  if (req.url === '/pings') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end(String(counter));
  }
  res.writeHead(404);
  res.end();
}).listen(PORT);
