const fs = require('fs');
const file = 'gui/backend/server.js';
let code = fs.readFileSync(file, 'utf8');

// There are probably setIntervals calling old constants
code = code.replace(/MCP_CCXT/g, "mcpUrls.MCP_CCXT");
code = code.replace(/MCP_PORTFOLIO/g, "mcpUrls.MCP_PORTFOLIO");

// But wait, mcpUrls.mcpUrls.MCP_CCXT if I over-replace:
code = code.replace(/mcpUrls\.mcpUrls\.MCP_CCXT/g, "mcpUrls.MCP_CCXT");
code = code.replace(/mcpUrls\.mcpUrls\.MCP_PORTFOLIO/g, "mcpUrls.MCP_PORTFOLIO");

// Make sure mcpUrls is defined above
fs.writeFileSync(file, code, 'utf8');
