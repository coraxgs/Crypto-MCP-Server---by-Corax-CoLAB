import { authenticatedFetch } from "../auth"
import React, { useEffect, useState, memo, useCallback } from 'react'
import io from 'socket.io-client'

// ⚡ Bolt: Extract row into a memoized component to prevent unnecessary re-renders of the entire list
// when a single row is expanded or when new orders are prepended to the top of the list.
const OrderRow = memo(({
  order,
  isExpanded,
  onToggleExpand,
  onApprove
}: {
  order: any;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onApprove: (id: number) => void;
}) => {
  return (
    <React.Fragment>
      <tr style={{background: order.status === 'pending' ? '#3b2f06' : 'transparent'}}>
        <td>{order.created_at || order.createdAt}</td>
        <td>{order.exchange}</td>
        <td>{order.symbol}</td>
        <td>{order.side}</td>
        <td>{order.amount}</td>
        <td>
          <span style={{
            padding: '2px 6px',
            borderRadius: '4px',
            background: order.status === 'pending' ? '#eab308' : order.status === 'placed' ? '#10b981' : '#64748b',
            color: order.status === 'pending' ? '#000' : '#fff'
          }}>
            {order.status}
          </span>
        </td>
        <td>
          {order.status === 'pending' && (
            <button className="btn-primary" onClick={() => onApprove(order.id)}>Approve</button>
          )}
          {order.reasoning && (
            <button
              style={{ marginLeft: '8px', background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
              onClick={() => onToggleExpand(order.id)}
            >
              {isExpanded ? 'Hide reasoning' : 'View reasoning'}
            </button>
          )}
        </td>
      </tr>
      {isExpanded && order.reasoning && (
        <tr>
          <td colSpan={7} style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
            <div style={{ padding: '12px', background: '#0f172a', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
              <strong style={{ color: '#10b981', display: 'block', marginBottom: '8px' }}>🤖 AI Reasoning:</strong>
              <span style={{ fontStyle: 'italic', color: '#cbd5e1', lineHeight: '1.5' }}>
                "{order.reasoning}"
              </span>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
});

export default function OrdersLogPanel(){
  const [orders,setOrders]=useState<any[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(()=>{
    authenticatedFetch('/api/orders').then(r=>r.json()).then(j=>{ if (j.ok) setOrders(j.data || []) })
    const socket = io()
    socket.on('order_placed', (d:any)=> {
      setOrders(prev => [{...d, created_at: new Date().toISOString()}, ...prev].slice(0,200))
    })
    socket.on('order_pending', (d:any)=> {
      setOrders(prev => [{...d, status: 'pending', created_at: new Date().toISOString()}, ...prev].slice(0,200))
    })
    return ()=>{ socket.disconnect() }
  },[])

  const handleApproveOrder = useCallback(async (orderId: number) => {
    if (!confirm('Approve this AI generated order for execution?')) return
    const resp = await authenticatedFetch('/api/order/approve', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({orderId})
    })
    const j = await resp.json()
    if (j.ok) {
      alert('Order approved and placed!')
      // Refresh list
      authenticatedFetch('/api/orders').then(r=>r.json()).then(j=>{ if (j.ok) setOrders(j.data || []) })
    } else alert(j.error)
  }, []);

  const handleToggleExpand = useCallback((orderId: number) => {
    setExpandedId(prev => prev === orderId ? null : orderId);
  }, []);

  return (
    <div className="card interactive-element">
      <h3>Orders Log (AI Diary)</h3>
      <div className="orders-scroll">
        <table className="table">
          <thead><tr><th>Time</th><th>Exchange</th><th>Symbol</th><th>Side</th><th>Amt</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map((o, i)=>(
              <OrderRow
                key={o.id || i} // Use o.id for stability if available
                order={o}
                isExpanded={expandedId === o.id}
                onToggleExpand={handleToggleExpand}
                onApprove={handleApproveOrder}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
