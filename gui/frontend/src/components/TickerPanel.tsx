import { authenticatedFetch } from "../auth"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

export default function TickerPanel(){
  const [ticker, setTicker] = useState<any>(null)

  useEffect(() => {
    authenticatedFetch('/api/ticker?exchange=binance&symbol=BTC/USDT').then(r=>r.json()).then(j=>{
      if (j.ok) setTicker(j.data)
    }).catch(console.error)

    const socket = io()
    socket.on('ticker', (data:any) => setTicker(data))
    return ()=>{ socket.disconnect() }
  }, [])

  return (
    <div className="card">
      <h3>BTC / USDT (Binance)</h3>
      {ticker ? (<div>
        <div style={{display:'flex',gap:12}}>
          <div><small className="small-muted">Last</small><div style={{fontSize:18}}>{ticker.last ?? ticker.close ?? '—'}</div></div>
          <div><small className="small-muted">Bid</small><div>{ticker.bid ?? '—'}</div></div>
          <div><small className="small-muted">Ask</small><div>{ticker.ask ?? '—'}</div></div>
        </div>
        <pre style={{background:'#334155',padding:8,borderRadius:6}}>{JSON.stringify(ticker, null, 2)}</pre>
      </div>) : <div>Loading…</div>}
    </div>
  )
}
