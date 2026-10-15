const http = require('http');
const fs = require('fs');

const PICTURE_PATH = process.env.PICTURE_PATH;
const MAX_AGE_MS = Number(process.env.PICTURE_MAX_AGE_MS);

const PORT = process.env.PORT;

let downloading = null;

const downloadPicture = () => {
  downloading ??= (async () => {
    const response = await fetch(process.env.PICTURE_URL);
    const data = Buffer.from(await response.arrayBuffer());
    // write then rename so a half-written file is never served
    fs.writeFileSync(`${PICTURE_PATH}.tmp`, data);
    fs.renameSync(`${PICTURE_PATH}.tmp`, PICTURE_PATH);
    console.log('Downloaded new picture');
  })().finally(() => {
    downloading = null;
  });
  return downloading;
};

const getPicture = async () => {
  let stat;
  try {
    stat = fs.statSync(PICTURE_PATH);
  } catch {
    await downloadPicture();
    return fs.readFileSync(PICTURE_PATH);
  }
  // stale: serve the old picture once more, next request gets the new one
  if (Date.now() - stat.mtimeMs > MAX_AGE_MS) {
    downloadPicture().catch((err) => console.error('Picture download failed:', err));
  }
  return fs.readFileSync(PICTURE_PATH);
};

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    const todos = await fetch(process.env.BACKEND_URL).then(r => r.json());

    res.end(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Todo App</h1>
          <img src="/image" alt="Todo App" width="600">
          <form onsubmit="event.preventDefault(); fetch('/todos', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ todo: this.todo.value }) }).then(() => location.reload())">
            <input type="text" name="todo" maxlength="140" required>
            <button type="submit">Send</button>
          </form>
          <ul>
            ${todos.map(todo => `<li>${todo.todo}</li>`).join('')}
          </ul>
        </body>
      </html>
    `);

    return;
  }

  if (req.url === '/image') {
    try {
      const data = await getPicture();
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    } catch (err) {
      console.error(err);
      res.statusCode = 502;
      res.end('Could not get picture');
    }
    return;
  }

  // for testing: kill the container, Kubernetes restarts it
  if (req.url === '/shutdown') {
    res.end('Shutting down');
    process.exit(1);
  }

  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
