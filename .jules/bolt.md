## 2024-03-14 - React List Rendering
**Learning:** React list components with 200 items recalculating on each simple state change (like expanding a row) can cause noticeable lag.
**Action:** Always wrap repeating list rows in `React.memo` and memoize callbacks passed to them using `useCallback` to avoid unnecessary layout calculations and re-renders on large lists.
