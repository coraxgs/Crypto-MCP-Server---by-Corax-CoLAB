#!/bin/bash
sed -i 's/timeout: 20000/timeout: parseInt(process.env.MCP_TIMEOUT) || 8000/' gui/backend/server.js
