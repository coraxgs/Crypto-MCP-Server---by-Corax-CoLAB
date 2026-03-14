const fs = require('fs');

let content = fs.readFileSync('gui/backend/server.js', 'utf8');

const old_middleware = `// Basic auth middleware for all /api routes
app.use('/api', (req, res, next) => {
  if (req.path === '/order/pending' || req.path === '/order/reasoning') {
    // Restrict AI-only endpoints to localhost for defense-in-depth
    const clientIp = req.ip || req.connection.remoteAddress;
    if (clientIp !== '127.0.0.1' && clientIp !== '::1' && clientIp !== '::ffff:127.0.0.1') {
      return res.status(403).json({ ok: false, error: 'Forbidden: Localhost only' });
    }
    return next();
  }`;

const new_middleware = `// Basic auth middleware for all /api routes
app.use('/api', (req, res, next) => {`;

content = content.replace(old_middleware, new_middleware);

const old_exec = `      const orderArgs = {
        exchange: order.exchange,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        amount: Number(order.amount),
        price: order.price !== null ? Number(order.price) : null,
        params: {}
      };`;

const new_exec = `      const orderArgs = {
        exchange: order.exchange,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        amount: Number(order.amount),
        price: order.price !== null ? Number(order.price) : null,
        params: { approval_token: DASHBOARD_PASSWORD }
      };`;

content = content.replace(old_exec, new_exec);

fs.writeFileSync('gui/backend/server.js', content);
