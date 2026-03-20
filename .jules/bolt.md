## 2024-03-14 - React List Rendering
**Learning:** React list components with 200 items recalculating on each simple state change (like expanding a row) can cause noticeable lag.
**Action:** Always wrap repeating list rows in `React.memo` and memoize callbacks passed to them using `useCallback` to avoid unnecessary layout calculations and re-renders on large lists.

## 2024-10-24 - API Rate Limit Bottlenecks in Loops
**Learning:** Redundant API calls within a loop without shared state/memory mapping (e.g. fetching the entire CoinGecko coins list of ~14k assets for *each* uncached portfolio coin) cause severe rate limit HTTP 429 errors and massive slowdowns.
**Action:** Cache the heavy reference list/mapping once for an appropriate duration (e.g. 1 hour) and use memory lookups for individual items to optimize performance and prevent API blocking.
