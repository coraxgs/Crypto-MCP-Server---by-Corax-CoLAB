const fs = require('fs');
const file = 'gui/backend/server.js';
let code = fs.readFileSync(file, 'utf8');

const newCode = `
const MCP_CCXT = process.env.MCP_CCXT || 'http://127.0.0.1:7001/mcp';
const MCP_PORTFOLIO = process.env.MCP_PORTFOLIO || 'http://127.0.0.1:7004/mcp';
const MCP_LLM = process.env.MCP_LLM || 'http://127.0.0.1:7015/mcp';
const MCP_COINGECKO = process.env.MCP_COINGECKO || 'http://127.0.0.1:7010/mcp';
const MCP_FREQTRADE = process.env.MCP_FREQTRADE || 'http://127.0.0.1:7002/mcp';
const MCP_OCTOBOT = process.env.MCP_OCTOBOT || 'http://127.0.0.1:7003/mcp';
const MCP_ONCHAIN = process.env.MCP_ONCHAIN || 'http://127.0.0.1:7007/mcp';
const MCP_TA = process.env.MCP_TA || 'http://127.0.0.1:7005/mcp';
const MCP_SUPERALGOS = process.env.MCP_SUPERALGOS || 'http://127.0.0.1:7006/mcp';
const MCP_HUMMINGBOT = process.env.MCP_HUMMINGBOT || 'http://127.0.0.1:7014/mcp';
const MCP_NOTIFIER = process.env.MCP_NOTIFIER || 'http://127.0.0.1:7016/mcp';

const mcpUrls = {
  MCP_CCXT,
  MCP_PORTFOLIO,
  MCP_LLM,
  MCP_COINGECKO,
  MCP_FREQTRADE,
  MCP_OCTOBOT,
  MCP_ONCHAIN,
  MCP_TA,
  MCP_SUPERALGOS,
  MCP_HUMMINGBOT,
  MCP_NOTIFIER
};
const PORT = parseInt(process.env.PORT || '4000', 10);
`;

code = code.replace("const PORT = parseInt(process.env.PORT || '4000', 10);", newCode);
fs.writeFileSync(file, code, 'utf8');
