# Tally — Hostel Access & Occupancy (demo)

A live check-in demo for the UNILAG hostel access concept, in the **Registry**
(GOV.UK Design System) theme. See [`concept note.pdf`](./concept%20note.pdf) and
[`hostel_access_project_notes.md`](./hostel_access_project_notes.md) for the idea.

## How it works

- **One fixed QR code at the gate** (the `Gate` screen). It encodes the check-in
  URL, so a student's **normal phone camera** opens the check-in page — nothing to
  install, no in-app camera.
- **Check-in page** (mobile): enter your **matric** → checked against tonight's
  allocation → **allowed / denied**, or **check in as a guest** (a time-limited pass
  tied to the resident you're visiting). Entry and exit are both logged.
- **Admin dashboard** updates **live** (Server-Sent Events) the moment anyone checks
  in — occupancy vs capacity, no-show beds to reclaim, denied today, guests inside,
  and a running access log.

One Node server holds the shared state so every device agrees. The decision logic
(matric → allocation → allowed/guest/denied, occupancy) is in `app/src/state/logic.js`
and is unit-tested headlessly.

## Run it

```bash
# 1. Build the front-end
cd app
npm install        # first time only
npm run build

# 2. Start the server (serves the app + API on port 4000)
cd ../server
npm install        # first time only
npm start
```

Then on the **laptop** open **http://localhost:4000** → the **Gate** screen shows the QR.
Open the **Admin dashboard** at **http://localhost:4000/#/admin** (or the nav).

### Demo with a real phone

1. Put the **phone and laptop on the same Wi-Fi**.
2. On the Gate screen, the QR points at your machine's network address. If your phone
   can't open it, use the **address picker** under the QR to select the right one
   (pick your real Wi-Fi adapter, not a virtual/WSL one).
3. Scan with the phone camera → the check-in page opens → enter a matric → watch the
   Admin dashboard update instantly.

> Camera note: the phone uses its **own** camera to open a URL, so no HTTPS is needed.
> Restart the server for a clean slate (state is in memory and resets on restart).

### Try these matrics

| Matric | Outcome |
|---|---|
| `190403311` | Resident (Funke, C-102) — **allowed**, toggles in/out |
| `200402198` | Resident (Ngozi) — allowed |
| `210401590` | **Denied** — allocated to a different hall |
| `200409004` | **Denied** — no active allocation |
| anything else | **Denied** — not recognised |
| Guest → host `190403311` | Guest pass valid 2 hours |

## Dev mode (hot reload, laptop only)

Run the server (`cd server && npm start`), then in another terminal
`cd app && npm run dev` and open http://localhost:5173 — Vite proxies `/api` to the
server. Phones should use the built app on `:4000`.

## Layout

```
app/     # React + Vite front-end (Gate / Check-in / Admin)
  src/state/logic.js   # pure decision + occupancy logic (headless-testable)
  src/state/store.jsx  # server-backed React store (fetch + SSE)
  src/components/       # Registry-themed UI
server/  # Node + Express: shared state, JSON API, SSE stream, serves app/dist
```
