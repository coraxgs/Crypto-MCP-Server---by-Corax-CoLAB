const fs = require('fs');
const file = 'gui/frontend/src/components/features/OracleCopilot.tsx';
let code = fs.readFileSync(file, 'utf8');

const hookImport = `import React, { useState, useEffect, useRef } from 'react';\nimport { Mic, MicOff, Terminal, X, BrainCircuit } from 'lucide-react';\nimport { callMcpEndpoint } from '../../api_mcp';`;
code = code.replace("import { Mic, MicOff, Terminal, X, BrainCircuit } from 'lucide-react';", hookImport);

const mockFunctionRegex = /const simulateAIResponse = \(command: string\) => \{[\s\S]*?\/\/ Add fake response[\s\S]*?setLogs\(prev => \[\.\.\.prev, \{ id: Date\.now\(\), text: randomResponse, type: 'ai' \}\]\);\n    \}, 1500\);\n  \};/;

const newFunction = `
  const simulateAIResponse = async (command: string) => {
    // Show typing state
    setLogs(prev => [...prev, { id: Date.now(), text: "Analyzing command...", type: 'system' }]);
    try {
      // Connect to LLM MCP
      const result = await callMcpEndpoint('MCP_LLM', 'analyze_crypto_data', {
        data_json: "{}",
        user_question: command
      });
      const responseText = result.analysis || JSON.stringify(result);
      setLogs(prev => [...prev.filter(l => l.text !== "Analyzing command..."), { id: Date.now(), text: responseText, type: 'ai' }]);
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev.filter(l => l.text !== "Analyzing command..."), { id: Date.now(), text: "NEURAL LINK FAILURE: Could not connect to LLM MCP.", type: 'system' }]);
    }
  };
`;

code = code.replace(mockFunctionRegex, newFunction);
fs.writeFileSync(file, code, 'utf8');
