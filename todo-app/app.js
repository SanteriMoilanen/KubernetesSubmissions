const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end('OK');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
