## 2024-03-14 - [Accessibility] Icon-only Buttons Missing Context
**Learning:** Found a pattern where interactive icon-only buttons (like Play, Pause, Rewind, Settings, Close) across the app components lack `aria-label`s, making them unreadable to screen readers. Elements that appear to be actionable like icons (e.g. Settings) were not even wrapped in `<button>` tags, compromising keyboard accessibility.
**Action:** When adding utility or control icon buttons, always wrap them in a `<button>` tag and provide an explicit `aria-label` describing the action, not just the visual icon.

## 2024-05-18 - [Accessibility] Contextual Context in Tables/Lists
**Learning:** Found that repeated action buttons inside tables/lists (like "Approve" or "View reasoning") are ambiguous for screen reader users because they just read out the same action repeatedly without knowing which specific item the action belongs to.
**Action:** When mapping over items to render action buttons, always append identifying information (like an ID, name, or symbol) to the `aria-label` so the screen reader announces e.g., "Approve order 123" instead of just "Approve".