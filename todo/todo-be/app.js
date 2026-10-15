const http = require('http');

const PORT = process.env.PORT;

let todos = [];

http.createServer((req, res) => {
  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(todos));
  }
  else if (req.url === '/todos' && req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const todo = JSON.parse(body);
      todos.push(todo);
      return res.end(JSON.stringify(todo));
    });
    return;
  }
  res.writeHead(404);
  res.end();
}).listen(PORT);
