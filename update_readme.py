import re

with open('README.md', 'r') as f:
    content = f.read()

overview_text = """
## 🗺️ System Overview & Architecture

The image series illustrates the four key stages of the Crypto MCP Server, a local ecosystem developed by Corax CoLAB to bridge AI (Claude Desktop), local tools (on a Raspberry Pi), and blockchain technology. The visual narrative progresses from a high-level architectural overview to the practical user experience and essential security considerations.

### Image 1: Architectural Overview
This diagram establishes the foundational flow of the system. It shows how Claude Desktop communicates via JSON-RPC with the Crypto MCP Server backend (REST + WebSocket). The server acts as a proxy, directing traffic to specific local MCP tools on a Raspberry Pi—such as CCXT for exchange trading, CoinGecko for market data, and Portfolio for asset aggregation—while logging orders to a local SQLite database.

<div align="center">
  <img width="800" alt="Architectural Overview" src="./gui/frontend/public/images/architecture.jpg" style="border-radius: 12px; margin-bottom: 20px;" />
</div>

### Image 2: Installation and Configuration
This image highlights the "Quick Start" process. It shows a user physically working with a Raspberry Pi and a terminal interface. The terminal displays successful execution steps of the automated install.sh script, which automates directory creation, Node.js installation, and service setup, bringing the backend and frontend to an active state.

<div align="center">
  <img width="800" alt="Installation and Configuration" src="./gui/frontend/public/images/installation.jpg" style="border-radius: 12px; margin-bottom: 20px;" />
</div>

### Image 3: Frontend Dashboard
This visual details the React-based user interface. It is a comprehensive cockpit divided into functional panels, enabling the user to monitor their portfolio, view live market data (tickers), preview orders through a "dry run" simulation, and execute live trades (with a critical confirmation step). A live-updating order log completes the monitoring tools.

<div align="center">
  <img width="800" alt="Frontend Dashboard" src="./gui/frontend/public/images/dashboard.png" style="border-radius: 12px; margin-bottom: 20px;" />
</div>

### Image 4: Security and Best Practices
The final infographic summarizes the core security principles for operating the MCP server. It visually maps out essential "best practices": using testnet keys for risk-free simulation, securing API keys (e.g., in .env files), restricting network access (LAN only or VPN/SSH tunnels), leveraging local control and logging, and implementing an authenticated reverse proxy (NGINX) for secure remote exposure.

<div align="center">
  <img width="800" alt="Security and Best Practices" src="./gui/frontend/public/images/security.jpg" style="border-radius: 12px; margin-bottom: 20px;" />
</div>

In summary, the images provide a clear, visual step-by-step guide to understanding, deploying, using, and securing the Crypto MCP Server, emphasizing its core value of local, autonomous control over crypto assets and data.

---
"""

new_content = content.replace("---", f"---\n{overview_text}", 1)

with open('README.md', 'w') as f:
    f.write(new_content)
