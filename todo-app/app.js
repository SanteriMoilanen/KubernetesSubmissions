const http = require('http');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.end(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Todo App</h1>
          <p>Application is running!</p>
        </body>
      </html>
    `);

    return;
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});