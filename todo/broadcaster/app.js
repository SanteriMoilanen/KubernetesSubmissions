const { connect, StringCodec } = require('nats');

const sc = StringCodec();

const send = async (message) => {
  const res = await fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: 'bot', message }),
  });
  console.log(`Sent "${message}" -> ${res.status}`);
};

(async () => {
  const nc = await connect({ servers: process.env.NATS_URL, waitOnFirstConnect: true });
  console.log('Connected to NATS');
  // queue group: NATS hands each message to exactly one replica, so scaling doesn't duplicate
  for await (const m of nc.subscribe('todos', { queue: 'broadcaster' })) {
    send(sc.decode(m.data)).catch((err) => console.error('Send failed:', err.message));
  }
})();
