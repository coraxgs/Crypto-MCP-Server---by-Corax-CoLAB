import { authenticatedFetch } from "../auth"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Plotly from 'plotly.js-basic-dist'

export default function PortfolioPanel() {
  const [details, setDetails] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    authenticatedFetch('/api/portfolio?exchanges=binance').then(r=>r.json()).then(j=>{
      if (j.ok && j.data) {
        setDetails(j.data.details || [])
        setTotal(j.data.total_usd || 0)
      }
    }).catch(console.error)

    const socket = io()
    socket.on('portfolio', (data:any) => {
      if (data) {
        setTotal(data.total_usd || 0)
        setDetails(data.details || [])
      }
    })
    return ()=>{ socket.disconnect() }
  }, [])

  useEffect(() => {
    const assets = details.slice(0, 12)
    const x = assets.map(a=>a.asset)
    const y = assets.map(a=>a.value_usd || 0)
    const data = [{ x, y, type: 'bar', marker:{color:'#10b981'} }]
    Plotly.newPlot('portfolio-chart', data, {height:300, margin:{t:20,b:40}})
  }, [details])

  return (
    <div className="card">
      <h3>Portfolio</h3>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:22,fontWeight:700}}>{ total ? total.toFixed(2) : '—' } USD</div>
        <div className="small-muted">Live</div>
      </div>
      <div id="portfolio-chart" style={{width:'100%',height:300}} />
      <table className="table"><thead><tr><th>Asset</th><th>Amount</th><th>Value</th></tr></thead>
        <tbody>
          {details.map((d,i)=>(<tr key={i}><td>{d.asset}</td><td>{Number(d.amount).toFixed(6)}</td><td>{d.value_usd ? d.value_usd.toFixed(2) : '—'}</td></tr>))}
        </tbody>
      </table>
    </div>
  )
}
