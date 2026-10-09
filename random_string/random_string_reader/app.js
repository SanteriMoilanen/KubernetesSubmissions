const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  let logEntry = 'No logs yet';
  try {
    logEntry = fs.readFileSync('/usr/src/app/files/log.txt', 'utf-8');
  } catch {}

  res.end(
    `${logEntry}`
  );
}).listen(PORT);