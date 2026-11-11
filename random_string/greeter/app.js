const http = require('http');

const GREETING = process.env.GREETING || 'hello';

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(GREETING);
}).listen(process.env.PORT || 3000);
