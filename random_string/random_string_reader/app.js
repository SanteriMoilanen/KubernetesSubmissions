const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const PINGPONG_URL = process.env.PINGPONG_URL || 'http://ping-pong-svc:2345/pings';

http.createServer(async (req, res) => {
  // readiness: ready only when ping-pong answers
  if (req.url === '/healthz') {
    try {
      res.writeHead((await fetch(PINGPONG_URL)).ok ? 200 : 500);
    } catch {
      res.writeHead(500);
    }
    return res.end();
  }

  let logEntry = 'No logs yet';
  try {
    logEntry = fs.readFileSync('/usr/src/app/files/log.txt', 'utf-8');
  } catch {}

  let info = '';
  try {
    info = fs.readFileSync('/usr/src/app/config/information.txt', 'utf-8').trim();
  } catch {}

  let pongs = 'unavailable';
  try {
    pongs = await (await fetch(PINGPONG_URL)).text();
  } catch {}

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`file content: ${info}\nenv variable: MESSAGE=${process.env.MESSAGE}\n${logEntry}\nPing / Pongs: ${pongs}`);
}).listen(PORT);
