## 2026-03-14 - [Auth Bypasses in MCP Server and UI Backend]
**Vulnerability:** Found two critical authentication bypass vulnerabilities:
1) In `ccxt_mcp.py`, `execute_approved_order` was exposed directly as an `@mcp.tool()`, allowing an LLM with MCP access to bypass the "human-in-the-loop" approval requirement (which logs pending orders via `create_order`).
2) In `gui/backend/server.js`, `/api/order/pending` and `/api/order/reasoning` bypassed password checks based on an insecure `req.ip` check (`=== '127.0.0.1'`). Due to a permissive CORS `*` policy on the frontend, malicious websites visited by the user could send POST requests locally to `http://127.0.0.1:4000/api/...`, bypassing authentication completely (CSRF/SSRF).

**Learning:**
1) Just because a tool is meant to be called programmatically by a backend does not mean it should be exposed generically to the LLM agent via the MCP protocol without internal authentication.
2) Relying solely on `req.ip` for authentication on localhost is vulnerable to Cross-Site Request Forgery (CSRF) if CORS is excessively permissive (`*`), since the browser runs on localhost and implicitly matches `127.0.0.1`.

**Prevention:**
1) Internal backend tools exposed over an MCP interface must require a secret token (e.g. `approval_token`) known only to the backend.
2) Do not rely on `req.ip` for authentication. Require explicit `Authorization` headers with a shared secret/token even for backend-to-backend internal communication if there's any chance of SSRF or CSRF via a browser.
2026-03-16 - [Real Data Migration]
Vulnerability: Legacy files containing mock data arrays and Math.random() usage were co-existing with production features.
Learning: Unused component files with mock data (`LiquidityFlowMap.tsx`, `PredictiveChart.tsx`) can create confusion. We must ensure only components driven by the MCP backend are utilized.
Prevention: Perform routine codebase sweeps to prune `.orig` files and unused feature components that don't connect to backend endpoints via `callMcpEndpoint`.
2026-03-17 - [Refactoring Repeated Frontend API Calls]
Vulnerability: Copy-pasting the same portfolio fetch logic across 7 different components to make them dynamic causes maintainability issues and spam on the backend via multiple concurrent `setInterval` polls.
Learning: Centralize repeated API polling into a shared custom React hook (e.g. `useActivePortfolioSymbol.ts`). This ensures the API call logic is written once and components can simply subscribe to the shared state.
Prevention: Before duplicating complex `useEffect` fetching logic across multiple files to solve a systemic issue, always assess if a custom Hook or Context provider can abstract and optimize the workload.
