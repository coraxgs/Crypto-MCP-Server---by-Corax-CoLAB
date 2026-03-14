import React from 'react';

export default function SystemOverview() {
  return (
    <div className="card interactive-element" style={{ gridColumn: '1 / -1', border: '1px solid #334155', background: 'rgba(2, 2, 5, 0.8)', padding: '30px', borderRadius: '12px' }}>
      <h2 style={{ color: '#10b981', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '20px' }}>
        System Overview & Architecture
      </h2>
      <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '30px' }}>
        The image series illustrates the four key stages of the Crypto MCP Server, a local ecosystem developed by Corax CoLAB to bridge AI (Claude Desktop), local tools (on a Raspberry Pi), and blockchain technology. The visual narrative progresses from a high-level architectural overview to the practical user experience and essential security considerations.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        {/* Card 1 */}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '15px' }}>Image 1: Architectural Overview</h3>
          <img
            src="/images/architecture.jpg"
            alt="Architectural Overview"
            style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', border: '1px solid #334155', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
          />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
            This diagram establishes the foundational flow of the system. It shows how Claude Desktop communicates via JSON-RPC with the Crypto MCP Server backend (REST + WebSocket). The server acts as a proxy, directing traffic to specific local MCP tools on a Raspberry Pi—such as CCXT for exchange trading, CoinGecko for market data, and Portfolio for asset aggregation—while logging orders to a local SQLite database.
          </p>
        </div>

        {/* Card 2 */}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '15px' }}>Image 2: Installation and Configuration</h3>
          <img
            src="/images/installation.jpg"
            alt="Installation and Configuration"
            style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', border: '1px solid #334155', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
          />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
            This image highlights the "Quick Start" process. It shows a user physically working with a Raspberry Pi and a terminal interface. The terminal displays successful execution steps of the automated install.sh script, which automates directory creation, Node.js installation, and service setup, bringing the backend and frontend to an active state.
          </p>
        </div>

        {/* Card 3 */}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '15px' }}>Image 3: Frontend Dashboard</h3>
          <img
            src="/images/dashboard.png"
            alt="Frontend Dashboard"
            style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', border: '1px solid #334155', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
          />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
            This visual details the React-based user interface. It is a comprehensive cockpit divided into functional panels, enabling the user to monitor their portfolio, view live market data (tickers), preview orders through a "dry run" simulation, and execute live trades (with a critical confirmation step). A live-updating order log completes the monitoring tools.
          </p>
        </div>

        {/* Card 4 */}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '15px' }}>Image 4: Security and Best Practices</h3>
          <img
            src="/images/security.jpg"
            alt="Security and Best Practices"
            style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', border: '1px solid #334155', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
          />
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5' }}>
            The final infographic summarizes the core security principles for operating the MCP server. It visually maps out essential "best practices": using testnet keys for risk-free simulation, securing API keys (e.g., in .env files), restricting network access (LAN only or VPN/SSH tunnels), leveraging local control and logging, and implementing an authenticated reverse proxy (NGINX) for secure remote exposure.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid #10b981', borderRadius: '0 8px 8px 0' }}>
        <p style={{ color: '#cbd5e1', margin: 0, fontStyle: 'italic' }}>
          In summary, the images provide a clear, visual step-by-step guide to understanding, deploying, using, and securing the Crypto MCP Server, emphasizing its core value of local, autonomous control over crypto assets and data.
        </p>
      </div>
    </div>
  );
}
