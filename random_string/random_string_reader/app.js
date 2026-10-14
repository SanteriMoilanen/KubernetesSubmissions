const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const PINGPONG_URL = process.env.PINGPONG_URL || 'http://ping-pong-svc:2345/pings';

http.createServer(async (req, res) => {
  let logEntry = 'No logs yet';
  try {
    logEntry = fs.readFileSync('/usr/src/app/files/log.txt', 'utf-8');
  } catch {}

  let pongs = 'unavailable';
  try {
    pongs = await (await fetch(PINGPONG_URL)).text();
  } catch {}

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`${logEntry}\nPing / Pongs: ${pongs}`);
}).listen(PORT);
