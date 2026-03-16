import React, { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph3D, { ForceGraph3DInstance } from 'react-force-graph-3d';
import * as THREE from 'three';

// Data structure
interface Node {
  id: string;
  name: string;
  group: 'exchange' | 'pair';
  val: number; // size
  color: string;
}

interface Link {
  source: string;
  target: string;
  value: number; // thickness/speed
  color: string;
  isArb: boolean;
}

const exchanges = ['Binance', 'Kraken', 'Coinbase', 'Bybit'];
const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT'];

const generateMockData = () => {
    const nodes: Node[] = [];
    const links: Link[] = [];

    // Add Exchanges
    exchanges.forEach((ex, i) => {
        nodes.push({ id: ex, name: ex, group: 'exchange', val: 20, color: '#10b981' });
    });

    // Add Pairs linked to exchanges
    pairs.forEach((pair, j) => {
        const pairId = `pair-${j}`;
        nodes.push({ id: pairId, name: pair, group: 'pair', val: 5, color: '#3b82f6' });

        exchanges.forEach((ex) => {
            links.push({
                source: ex,
                target: pairId,
                value: 1 + Math.random() * 3,
                color: 'rgba(255, 255, 255, 0.2)',
                isArb: false
            });
        });
    });

    // Create random arbitrage links between exchanges via pairs
    for(let k=0; k<3; k++) {
        const sourceEx = exchanges[Math.floor(Math.random() * exchanges.length)];
        let targetEx = exchanges[Math.floor(Math.random() * exchanges.length)];
        while(targetEx === sourceEx) {
             targetEx = exchanges[Math.floor(Math.random() * exchanges.length)];
        }

        links.push({
            source: sourceEx,
            target: targetEx,
            value: 5,
            color: '#ff0033', // Red laser
            isArb: true
        });
    }

    return { nodes, links };
};

export default function LiquidityFlowMap() {
    const fgRef = useRef<ForceGraph3DInstance>();
    const [graphData, setGraphData] = useState(generateMockData());

    // Periodically update graph to simulate real-time liquidity
    useEffect(() => {
        const interval = setInterval(() => {
            setGraphData(generateMockData());
            // Shockwave effect on arb update
             if (fgRef.current) {
                // fgRef.current.d3ReheatSimulation();
             }
        }, 5000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="card" style={{ padding: 0, height: '400px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, fontFamily: 'monospace', color: '#10b981', background: 'rgba(0,0,0,0.5)', padding: '5px' }}>
                NEURAL-NET LIQUIDITY FLOW (MOCK)
            </div>
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                width={800} // adjust as needed or make responsive
                height={400}
                backgroundColor="rgba(0,0,0,0)"
                nodeLabel="name"
                nodeColor="color"
                nodeRelSize={6}
                nodeVal="val"
                linkColor="color"
                linkWidth={(link: any) => link.value}
                linkDirectionalParticles={(link: any) => link.isArb ? 4 : 2}
                linkDirectionalParticleSpeed={(link: any) => link.isArb ? link.value * 0.01 : 0.005}
                linkDirectionalParticleColor={(link: any) => link.isArb ? '#ff0033' : '#10b981'}
                onNodeClick={(node: any) => {
                    // Aim at node
                    const distance = 40;
                    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
                    if (fgRef.current) {
                        fgRef.current.cameraPosition(
                            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                            node,
                            3000
                        );
                    }
                }}
            />
        </div>
    );
}
