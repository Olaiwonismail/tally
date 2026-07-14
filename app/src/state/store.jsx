import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const StoreCtx = createContext(null)

const EMPTY = {
  hall: { name: 'Moremi Hall', gate: 'Main gate' },
  log: [], guests: [], noShowBeds: [],
  derived: { residentsInside: 0, guestsInside: 0, capacity: 0, pct: 0, reclaimable: 0, reclaimedCount: 0, deniedToday: 0 },
}

async function postJSON(url, body) {
  try {
    const r = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    return await r.json()
  } catch {
    return { ok: false, error: 'Could not reach the server. Check the connection.' }
  }
}

// Server-backed store: authoritative state lives on the Node server, streamed
// here over SSE so every device (gate screen, phones, admin) stays in sync.
export function StoreProvider({ children }) {
  const [view, setView] = useState(EMPTY)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/state').then((r) => r.json()).then((v) => { if (alive) setView(v) }).catch(() => {})
    const es = new EventSource('/api/stream')
    es.onopen = () => setConnected(true)
    es.onmessage = (e) => { try { setView(JSON.parse(e.data)) } catch { /* ignore */ } }
    es.onerror = () => setConnected(false)
    return () => { alive = false; es.close() }
  }, [])

  const checkin = useCallback((matric) => postJSON('/api/checkin', { matric }), [])
  const guestCheckin = useCallback((payload) => postJSON('/api/guest', payload), [])
  const reclaim = useCallback((room) => { postJSON('/api/reclaim', { room }) }, [])

  const value = useMemo(() => ({
    state: view,
    derived: view.derived,
    hall: view.hall,
    connected,
    checkin,
    guestCheckin,
    reclaim,
  }), [view, connected, checkin, guestCheckin, reclaim])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
