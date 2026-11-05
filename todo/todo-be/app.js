const http = require('http');
const { Pool } = require('pg');

// connection settings come from PGHOST, PGUSER, PGPASSWORD, ... env variables
const pool = new Pool();

const init = async () => {
  await pool.query('CREATE TABLE IF NOT EXISTS todo (id SERIAL PRIMARY KEY, todo TEXT NOT NULL)');
  await pool.query('ALTER TABLE todo ADD COLUMN IF NOT EXISTS done BOOLEAN NOT NULL DEFAULT false');
};

const PORT = process.env.PORT;

http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);
  try {
    if (req.url === '/healthz') {
      await pool.query('SELECT 1');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok' }));
    }
    if (req.url === '/todos' && req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM todo ORDER BY id');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(rows));
    }
    if (req.url === '/todos' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { todo } = JSON.parse(body);
      if (typeof todo !== 'string' || todo.length === 0 || todo.length > 140) {
        console.error(`Rejected todo (${todo?.length} chars): ${todo}`);
        res.writeHead(400);
        return res.end('Todo must be 1-140 characters');
      }
      console.log(`New todo: ${todo}`);
      const { rows } = await pool.query('INSERT INTO todo (todo) VALUES ($1) RETURNING *', [todo]);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(rows[0]));
    }
    const match = req.url.match(/^\/todos\/(\d+)$/);
    if (match && req.method === 'PUT') {
      const { rows } = await pool.query('UPDATE todo SET done = true WHERE id = $1 RETURNING *', [match[1]]);
      if (rows.length === 0) {
        res.writeHead(404);
        return res.end('Todo not found');
      }
      console.log(`Todo ${match[1]} done`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(rows[0]));
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    return res.end('Server error');
  }
  res.writeHead(404);
  res.end();
}).listen(PORT);

// db not ready yet -> crash, Kubernetes restarts the pod and we retry
init().catch((err) => {
  console.error('Database init failed:', err.message);
  process.exit(1);
});
