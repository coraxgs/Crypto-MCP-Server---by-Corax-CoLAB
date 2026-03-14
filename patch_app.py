with open('gui/frontend/src/App.tsx', 'r') as f:
    content = f.read()

# Insert the import
import_str = "import SystemOverview from './components/features/SystemOverview'\n"
content = content.replace("import WhaleConstellations from './components/features/WhaleConstellations'",
                          "import WhaleConstellations from './components/features/WhaleConstellations'\n" + import_str)

# Insert the component at the very beginning of the main-grid
component_str = "\n        {/* Feature 0: System Overview (Spans full width) */}\n        <SystemOverview />\n"
content = content.replace("<div className=\"main-grid\"", "<div className=\"main-grid\"") # just to find it safely
content = content.replace("{/* Feature 1: Arbitrage Wormhole (Spans full width) */}",
                          component_str + "\n        {/* Feature 1: Arbitrage Wormhole (Spans full width) */}")

with open('gui/frontend/src/App.tsx', 'w') as f:
    f.write(content)
