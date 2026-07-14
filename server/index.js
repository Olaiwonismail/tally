// Shared-state server for the hostel check-in demo.
// Holds one authoritative state (so a phone and the admin laptop agree),
// exposes a small JSON API, pushes live updates over SSE, and serves the
// built front-end. Reuses the exact same decision logic as the client.
import express from 'express'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  reducer, makeInitialState, deriveCounts, makeGuestPass,
} from '../app/src/state/logic.js'
import { REGISTRY, HALL } from '../app/src/data/seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'app', 'dist')
const PORT = Number(process.env.PORT) || 4000

let state = makeInitialState()
const clients = new Set() // open SSE responses

const viewState = () => ({
  hall: HALL,
  log: state.log,
  guests: state.guests,
  noShowBeds: state.noShowBeds,
  derived: deriveCounts(state),
})

function broadcast() {
  const payload = `data: ${JSON.stringify(viewState())}\n\n`
  for (const res of clients) { try { res.write(payload) } catch { /* dropped */ } }
}

// LAN addresses so the gate QR points somewhere a phone can actually reach.
// Ranked: real private Wi-Fi ranges first, virtual adapters last.
function lanAddresses() {
  const out = []
  for (const list of Object.values(os.networkInterfaces())) {
    for (const ni of list || []) {
      if (ni.family === 'IPv4' && !ni.internal) out.push(ni.address)
    }
  }
  const rank = (ip) => ip.startsWith('192.168.') ? 0 : ip.startsWith('10.') ? 1 : 2
  return out.sort((a, b) => rank(a) - rank(b))
}

const app = express()
app.use(express.json())

app.get('/api/state', (_req, res) => res.json(viewState()))

app.get('/api/host', (_req, res) => {
  const addrs = lanAddresses()
  res.json({ port: PORT, addresses: addrs, origin: addrs[0] ? `http://${addrs[0]}:${PORT}` : '' })
})

// Resident check-in by matric — validated against the allocation list.
app.post('/api/checkin', (req, res) => {
  const matric = String(req.body?.matric || '').replace(/\s+/g, '')
  if (!/^\d{3,}$/.test(matric)) {
    return res.status(400).json({ ok: false, error: 'Enter a valid matric number.' })
  }
  state = reducer(state, { type: 'SCAN', token: `UNILAG-STU-${matric}` })
  broadcast()
  const result = state.lastResult
  res.json({ ok: result?.state !== 'denied', result })
})

// Guest check-in — tied to the resident being visited; auto-expiring pass.
app.post('/api/guest', (req, res) => {
  const name = String(req.body?.name || '').trim()
  const hostMatric = String(req.body?.hostMatric || '').replace(/\s+/g, '')
  if (!name || !hostMatric) {
    return res.status(400).json({ ok: false, error: "Enter your name and your host's matric." })
  }
  const host = REGISTRY[`UNILAG-STU-${hostMatric}`]
  if (!host || !host.allocation || host.allocation.hall !== HALL.name) {
    return res.status(400).json({ ok: false, error: `No resident with matric ${hostMatric} in ${HALL.name}.` })
  }
  const guest = makeGuestPass({ name, host })
  state = reducer(state, { type: 'ADD_GUEST', guest })
  state = reducer(state, { type: 'SCAN', token: guest.token })
  broadcast()
  res.json({ ok: true, result: state.lastResult })
})

app.post('/api/reclaim', (req, res) => {
  state = reducer(state, { type: 'RECLAIM', room: String(req.body?.room || '') })
  broadcast()
  res.json({ ok: true, derived: deriveCounts(state) })
})

// Live stream — every state change is pushed to open dashboards.
app.get('/api/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  })
  res.write(`data: ${JSON.stringify(viewState())}\n\n`)
  clients.add(res)
  req.on('close', () => clients.delete(res))
})

// Static built app + SPA fallback (hash routing, so this rarely fires).
app.use(express.static(DIST))
app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')))

app.listen(PORT, '0.0.0.0', () => {
  const addrs = lanAddresses()
  console.log(`\n  Hostel Access server running:`)
  console.log(`  • This machine   http://localhost:${PORT}`)
  for (const a of addrs) console.log(`  • On the network http://${a}:${PORT}   (phones use this)`)
  console.log('')
})
