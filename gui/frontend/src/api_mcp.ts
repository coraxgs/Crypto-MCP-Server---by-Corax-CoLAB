import { authenticatedFetch } from "./auth";

export const callMcpEndpoint = async (mcp: string, method: string, params: any = {}) => {
  const res = await authenticatedFetch('/api/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mcp, method, params })
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'MCP call failed');
  return data.data;
};
