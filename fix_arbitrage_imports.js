const fs = require('fs');
const file = 'gui/frontend/src/components/features/ArbitrageWormhole.tsx';
let code = fs.readFileSync(file, 'utf8');

// The replacement above accidentally duplicated some imports
code = code.replace("import React, { useRef, useMemo, useState, useEffect } from 'react';\nimport React, { useRef, useMemo, useState, useEffect } from 'react';\nimport { Canvas, useFrame } from '@react-three/fiber';\nimport { OrbitControls, Text, Line } from '@react-three/drei';\nimport * as THREE from 'three';\nimport { callMcpEndpoint } from '../../api_mcp';\nimport { OrbitControls, Text, Html } from '@react-three/drei';\nimport * as THREE from 'three';",
`import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { callMcpEndpoint } from '../../api_mcp';`);

fs.writeFileSync(file, code, 'utf8');
