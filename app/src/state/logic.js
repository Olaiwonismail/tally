// Pure, React-free store logic for the hostel gate.
// Kept separate from store.jsx so it can be unit-tested headlessly.
import {
  HALL, BASE_INSIDE, REGISTRY, GUEST_REGISTRY, INITIAL_INSIDE,
  NO_SHOW_BEDS, DENIED_TODAY_START, INITIAL_LOG,
} from '../data/seed.js'

// Untracked guests assumed inside, so the headcount reads realistically.
export const BASE_GUESTS_INSIDE = 4
// Ignore the same tag re-read within this window (camera fires many frames/sec).
export const RESCAN_COOLDOWN_MS = 2500
// Guest passes expire at a fixed hall curfew (24h clock), not a rolling window.
export const GUEST_CURFEW_HOUR = 19 // 7 pm — guests must be signed out by curfew

const pad = (n) => String(n).padStart(2, '0')
const fmt = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

// Today's curfew instant for a given moment.
export function curfewToday(now = Date.now()) {
  const d = new Date(now)
  d.setHours(GUEST_CURFEW_HOUR, 0, 0, 0)
  return d.getTime()
}
export const CURFEW_LABEL = `${pad(GUEST_CURFEW_HOUR)}:00`

export function makeInitialState(now = Date.now()) {
  const curfew = curfewToday(now)
  const guests = Object.entries(GUEST_REGISTRY).map(([token, g]) => ({
    token,
    name: g.name,
    visiting: g.visiting,
    room: g.room,
    // Live guests are valid until tonight's curfew; the demo's expired
    // example uses yesterday's curfew so it always reads as expired.
    validUntil: g.expiredDemo ? curfew - 86_400_000 : curfew,
    inside: g.startInside,
  }))
  return {
    insideTokens: [...INITIAL_INSIDE],
    guests,
    deniedToday: DENIED_TODAY_START,
    noShowBeds: [...NO_SHOW_BEDS],
    reclaimed: [],
    log: INITIAL_LOG.map((e, i) => ({ id: `seed-${i}`, fresh: false, reason: '', ...e })),
    lastResult: null,
    lastScan: null,
    logSeq: 0,
  }
}

// Build a time-limited guest pass tied to the resident being visited.
// `host` is a REGISTRY student record (or null if the host wasn't found).
export function makeGuestPass({ name, host }, now = Date.now()) {
  return {
    token: `UNILAG-GUEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    name,
    visiting: host ? host.name : 'unknown host',
    room: host && host.allocation ? host.allocation.room : '—',
    validUntil: curfewToday(now), // expires at tonight's curfew
    inside: false,
  }
}

export function resolveScan(state, token, now) {
  const time = fmt(now)

  // --- guest pass ---
  const guest = state.guests.find((g) => g.token === token)
  if (guest) {
    const expired = now.getTime() > guest.validUntil
    if (expired) {
      return {
        result: { state: 'denied', name: guest.name, dir: '—',
          detail: `${guest.name}'s guest pass expired at ${fmt(new Date(guest.validUntil))}. Entry denied.` },
        logEntry: { time, name: guest.name, dir: '—', result: 'Guest expired', tone: 'bad' },
        deniedInc: 1,
      }
    }
    const leaving = guest.inside
    return {
      result: {
        state: 'guest', name: guest.name, dir: leaving ? 'Out' : 'In',
        headline: `Guest pass — valid until ${fmt(new Date(guest.validUntil))}`,
        detail: `${guest.name}, visiting ${guest.visiting} (Room ${guest.room}).`,
      },
      logEntry: { time, name: guest.name, dir: leaving ? 'Out' : 'In',
        result: `Guest · exp ${fmt(new Date(guest.validUntil))}`, tone: 'guest' },
      toggleGuest: guest.token,
    }
  }

  // --- registered student ---
  const stu = REGISTRY[token]
  if (stu) {
    const ok = stu.allocation && stu.allocation.hall === HALL.name
    if (ok) {
      const inside = state.insideTokens.includes(token)
      const leaving = inside
      return {
        result: {
          state: 'allowed', name: stu.name, dir: leaving ? 'Out' : 'In',
          headline: leaving ? 'Signed out' : 'Entry allowed',
          detail: leaving
            ? `${stu.name} — Room ${stu.allocation.room}, signed out.`
            : `${stu.name} — Room ${stu.allocation.room}, resident.`,
        },
        logEntry: { time, name: stu.name, dir: leaving ? 'Out' : 'In', result: 'Allowed', tone: 'ok' },
        toggleInside: token,
      }
    }
    const reason = stu.allocation
      ? `${stu.name} is allocated to ${stu.allocation.hall}, not ${HALL.name}. The attempt has been logged.`
      : `${stu.name} has no active bed allocation. The attempt has been logged.`
    return {
      result: { state: 'denied', name: stu.name, dir: '—', headline: 'Entry denied', detail: reason },
      logEntry: { time, name: stu.name, dir: '—', result: 'Denied', tone: 'bad' },
      deniedInc: 1,
    }
  }

  // --- unknown tag ---
  return {
    result: { state: 'denied', name: 'Unknown tag', dir: '—', headline: 'Entry denied',
      detail: 'Tag not recognised. No matching record. The attempt has been logged.' },
    logEntry: { time, name: 'Unknown tag', dir: '—', result: 'Denied', tone: 'bad' },
    deniedInc: 1,
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SCAN': {
      const now = action.now ? new Date(action.now) : new Date()
      const { token } = action
      // Debounce repeat reads of the same tag from the live camera.
      if (state.lastScan && state.lastScan.token === token &&
          now.getTime() - state.lastScan.at < RESCAN_COOLDOWN_MS) {
        return state
      }
      const r = resolveScan(state, token, now)
      const seq = state.logSeq + 1
      let insideTokens = state.insideTokens
      if (r.toggleInside) {
        insideTokens = insideTokens.includes(r.toggleInside)
          ? insideTokens.filter((t) => t !== r.toggleInside)
          : [...insideTokens, r.toggleInside]
      }
      let guests = state.guests
      if (r.toggleGuest) {
        guests = guests.map((g) => g.token === r.toggleGuest ? { ...g, inside: !g.inside } : g)
      }
      const logEntry = { id: `log-${seq}`, fresh: true, reason: '', ...r.logEntry }
      return {
        ...state,
        insideTokens,
        guests,
        deniedToday: state.deniedToday + (r.deniedInc || 0),
        log: [logEntry, ...state.log.map((e) => ({ ...e, fresh: false }))].slice(0, 40),
        lastResult: r.result,
        lastScan: { token, at: now.getTime() },
        logSeq: seq,
      }
    }
    case 'ADD_GUEST': {
      return { ...state, guests: [...state.guests, action.guest] }
    }
    case 'RECLAIM': {
      const bed = state.noShowBeds.find((b) => b.room === action.room)
      if (!bed) return state
      return {
        ...state,
        noShowBeds: state.noShowBeds.filter((b) => b.room !== action.room),
        reclaimed: [...state.reclaimed, bed],
      }
    }
    case 'CLEAR_RESULT':
      return { ...state, lastResult: null }
    default:
      return state
  }
}

export function deriveCounts(state) {
  const residentsInside = BASE_INSIDE + state.insideTokens.length
  const guestsInside = BASE_GUESTS_INSIDE + state.guests.filter((g) => g.inside).length
  return {
    residentsInside,
    guestsInside,
    capacity: HALL.capacity,
    pct: Math.round((residentsInside / HALL.capacity) * 100),
    reclaimable: state.noShowBeds.length,
    reclaimedCount: state.reclaimed.length,
    deniedToday: state.deniedToday,
  }
}
