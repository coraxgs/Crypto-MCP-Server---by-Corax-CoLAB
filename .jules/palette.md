## 2024-03-14 - [Accessibility] Icon-only Buttons Missing Context
**Learning:** Found a pattern where interactive icon-only buttons (like Play, Pause, Rewind, Settings, Close) across the app components lack `aria-label`s, making them unreadable to screen readers. Elements that appear to be actionable like icons (e.g. Settings) were not even wrapped in `<button>` tags, compromising keyboard accessibility.
**Action:** When adding utility or control icon buttons, always wrap them in a `<button>` tag and provide an explicit `aria-label` describing the action, not just the visual icon.
