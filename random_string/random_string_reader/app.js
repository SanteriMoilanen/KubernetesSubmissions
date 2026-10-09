const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const read = (file, fallback) => {
  try {
    return fs.readFileSync(file, 'utf-8');
  } catch {
    return fallback;
  }
};

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  const logEntry = read('/usr/src/app/files/log.txt', 'No logs yet');
  const pongs = read('/usr/src/app/files/pingpong.txt', '0');

  res.end(`${logEntry}\nPing / Pongs: ${pongs}`);
}).listen(PORT);
