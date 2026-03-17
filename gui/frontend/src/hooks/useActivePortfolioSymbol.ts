import { useState, useEffect } from 'react';
import { callMcpEndpoint } from '../api_mcp';

export function useActivePortfolioSymbol(defaultSymbol = 'BTC/USDT', defaultExchange = 'binance') {
    const [targetSymbol, setTargetSymbol] = useState(defaultSymbol);
    const [targetExchange, setTargetExchange] = useState(defaultExchange);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const fetchPortfolioPair = async () => {
            setLoading(true);
            try {
                const portfolio = await callMcpEndpoint('MCP_PORTFOLIO', 'portfolio_value', { exchanges: [defaultExchange] });
                if (!active) return;

                if (portfolio && portfolio.portfolio) {
                    const coins = Object.keys(portfolio.portfolio);
                    if (coins.length > 0) {
                        setTargetSymbol(`${coins[0].toUpperCase()}/USDT`);
                        setTargetExchange(defaultExchange);
                    }
                }
            } catch (err) {
                console.warn("Could not fetch portfolio for dynamic pair, using default", err);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchPortfolioPair();
        const interval = setInterval(fetchPortfolioPair, 60000); // Check every minute to keep updated with Top 1

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [defaultExchange]);

    return { targetSymbol, targetExchange, loading };
}
