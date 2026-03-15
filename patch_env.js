const fs = require('fs');

const envExample = 'gui/backend/.env.example';
let content = fs.readFileSync(envExample, 'utf8');

const additionalEnvs = `
MCP_COINGECKO=http://127.0.0.1:7010/mcp
MCP_FREQTRADE=http://127.0.0.1:7002/mcp
MCP_HUMMINGBOT=http://127.0.0.1:7014/mcp
MCP_LLM=http://127.0.0.1:7015/mcp
MCP_NOTIFIER=http://127.0.0.1:7016/mcp
MCP_OCTOBOT=http://127.0.0.1:7003/mcp
MCP_ONCHAIN=http://127.0.0.1:7007/mcp
MCP_SUPERALGOS=http://127.0.0.1:7006/mcp
MCP_TA=http://127.0.0.1:7005/mcp
`;

if (!content.includes('MCP_COINGECKO')) {
  fs.appendFileSync(envExample, additionalEnvs);
  if (fs.existsSync('gui/backend/.env')) {
     fs.appendFileSync('gui/backend/.env', additionalEnvs);
  }
  console.log("Patched env files with all MCPs");
} else {
  console.log("env files already patched");
}
