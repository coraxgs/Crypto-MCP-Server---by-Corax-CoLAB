## 2026-03-20 - [Timing Attack] Password Length Leak in Authentication Middleware
**Vulnerability:** The authentication middleware in `gui/backend/server.js` used `tokenBuffer.length !== passBuffer.length || !crypto.timingSafeEqual(...)` to verify the dashboard password.
**Learning:** Returning early when lengths mismatch allows an attacker to deduce the exact length of the password through timing attacks.
**Prevention:** Always hash both the expected password and provided token (e.g., using `crypto.createHash('sha256')`) before comparing them with `crypto.timingSafeEqual`, as hashes from the same algorithm will always have the same length.
