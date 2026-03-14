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
