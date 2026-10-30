const http = require('http');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3000;
// connection settings come from PGHOST, PGUSER, PGPASSWORD, ... env variables
const pool = new Pool();

const init = async () => {
  await pool.query('CREATE TABLE IF NOT EXISTS pings (id INT PRIMARY KEY, count INT NOT NULL)');
  await pool.query('INSERT INTO pings (id, count) VALUES (1, 0) ON CONFLICT DO NOTHING');
};

http.createServer(async (req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(404);
    return res.end();
  }
  // GKE Ingress health check hits / and needs a 200
  if (req.url === '/') {
    res.writeHead(200);
    return res.end('ok');
  }
  try {
    if (req.url === '/pingpong') {
      // returns the value before increment: pong 0, pong 1, ...
      const { rows } = await pool.query('UPDATE pings SET count = count + 1 WHERE id = 1 RETURNING count - 1 AS count');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(`pong ${rows[0].count}`);
    }
    if (req.url === '/pings') {
      const { rows } = await pool.query('SELECT count FROM pings WHERE id = 1');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(String(rows[0].count));
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    return res.end('Database error');
  }
  res.writeHead(404);
  res.end();
}).listen(PORT);

// db not ready yet -> crash, Kubernetes restarts the pod and we retry
init().catch((err) => {
  console.error('Database init failed:', err.message);
  process.exit(1);
});
