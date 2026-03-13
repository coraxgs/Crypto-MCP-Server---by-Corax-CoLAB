import { authenticatedFetch } from "../auth"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

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

  async function approveOrder(orderId: number) {
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
  }

  return (
    <div className="card interactive-element">
      <h3>Orders Log (AI Diary)</h3>
      <div className="orders-scroll">
        <table className="table">
          <thead><tr><th>Time</th><th>Exchange</th><th>Symbol</th><th>Side</th><th>Amt</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map((o,i)=>(
              <React.Fragment key={i}>
                <tr style={{background: o.status === 'pending' ? '#3b2f06' : 'transparent'}}>
                  <td>{o.created_at || o.createdAt}</td>
                  <td>{o.exchange}</td>
                  <td>{o.symbol}</td>
                  <td>{o.side}</td>
                  <td>{o.amount}</td>
                  <td>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: o.status === 'pending' ? '#eab308' : o.status === 'placed' ? '#10b981' : '#64748b',
                      color: o.status === 'pending' ? '#000' : '#fff'
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    {o.status === 'pending' && (
                      <button className="btn-primary" onClick={() => approveOrder(o.id)}>Approve</button>
                    )}
                    {o.reasoning && (
                      <button
                        style={{ marginLeft: '8px', background: 'transparent', border: '1px solid #94a3b8', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                      >
                        {expandedId === o.id ? 'Hide reasoning' : 'View reasoning'}
                      </button>
                    )}
                  </td>
                </tr>
                {expandedId === o.id && o.reasoning && (
                  <tr>
                    <td colSpan={7} style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
                      <div style={{ padding: '12px', background: '#0f172a', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                        <strong style={{ color: '#10b981', display: 'block', marginBottom: '8px' }}>🤖 AI Reasoning:</strong>
                        <span style={{ fontStyle: 'italic', color: '#cbd5e1', lineHeight: '1.5' }}>
                          "{o.reasoning}"
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
