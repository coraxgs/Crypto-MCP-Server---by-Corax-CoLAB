const fs = require('fs');

const serverFile = 'gui/backend/server.js';
let content = fs.readFileSync(serverFile, 'utf8');

const newEndpoints = `
// GET /api/mcp
app.post('/api/mcp', async (req, res) => {
  const { mcp, method, params } = req.body;
  if (!mcp || !method) return res.status(400).json({ ok: false, error: 'Missing mcp or method' });

  const mcpUrl = process.env[mcp];
  if (!mcpUrl) return res.status(400).json({ ok: false, error: 'Unknown MCP endpoint' });

  try {
    const result = await callMCP(mcpUrl, method, params || {});
    res.json({ ok: true, data: result });
  } catch (err) {
    console.error('mcp error', err.message || err);
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});
`;

if (!content.includes('/api/mcp')) {
  content = content.replace("app.get('/api/ticker'", newEndpoints + "\napp.get('/api/ticker'");
  fs.writeFileSync(serverFile, content, 'utf8');
  console.log("Patched server.js with generic MCP endpoint");
} else {
  console.log("server.js already patched");
}
