# app — front-end

React + Vite front-end for the Tally hostel check-in demo. Routes (hash):
`#/gate` (fixed gate QR), `#/checkin` (mobile matric/guest check-in), `#/admin`
(live dashboard). State is server-backed via `/api` + SSE.

**Run the whole thing (build + server) from the repo root — see [../README.md](../README.md).**

Quick front-end-only commands:

```bash
npm install
npm run build     # -> dist/, served by ../server
npm run dev       # hot reload on :5173, proxies /api to the server on :4000
```
