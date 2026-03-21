#!/bin/bash
sed -i 's/timeout: parseInt(process.env.MCP_TIMEOUT) || 8000/timeout: parseInt(process.env.MCP_TIMEOUT) || 8000,\n    signal: AbortSignal.timeout(parseInt(process.env.MCP_TIMEOUT) || 8000)/' gui/backend/server.js
