// =====================================================================
// Seed data for the UNILAG Hostel Access & Occupancy demo.
// One scanner at Moremi Hall main gate. Tokens below are what the QR
// codes encode; in production these would be NFC tag IDs.
// =====================================================================

export const HALL = {
  name: 'Moremi Hall',
  gate: 'Main gate',
  capacity: 250,
}

// Untracked residents assumed already inside at start of the demo.
// Named/tracked residents (below, initially inside) are added on top so
// the opening headcount reads ~214 of 250, matching the design mock.
export const BASE_INSIDE = 209

// token -> student record. allocation === null or a different hall => denied.
export const REGISTRY = {
  'UNILAG-STU-190401052': { name: 'Adaobi Okafor',   matric: '190401052', allocation: { hall: 'Moremi Hall', room: 'B-214' } },
  'UNILAG-STU-190403311': { name: 'Funke Balogun',   matric: '190403311', allocation: { hall: 'Moremi Hall', room: 'C-102' } },
  'UNILAG-STU-200402198': { name: 'Ngozi Umeh',      matric: '200402198', allocation: { hall: 'Moremi Hall', room: 'A-018' } },
  'UNILAG-STU-210405077': { name: 'Blessing Adeyemi', matric: '210405077', allocation: { hall: 'Moremi Hall', room: 'B-207' } },
  'UNILAG-STU-200401845': { name: 'Chioma Nwosu',    matric: '200401845', allocation: { hall: 'Moremi Hall', room: 'A-101' } },
  'UNILAG-STU-190408820': { name: 'Zainab Bello',    matric: '190408820', allocation: { hall: 'Moremi Hall', room: 'C-210' } },
  // Allocated to a DIFFERENT hall — should be denied at Moremi gate.
  'UNILAG-STU-210401590': { name: 'Chidi Eze',       matric: '210401590', allocation: { hall: 'Eni-Njoku Hall', room: 'D-004' } },
  // Registered student, allocation revoked — no active bed anywhere.
  'UNILAG-STU-200409004': { name: 'Emeka Obi',       matric: '200409004', allocation: null },
}

// Guest passes — tied to who is being visited, valid until the hall curfew
// (see GUEST_CURFEW_HOUR in logic.js). One live and one already-expired so the
// demo dashboard always shows both states.
export const GUEST_REGISTRY = {
  'UNILAG-GUEST-4471': { name: 'Tolu Adeyemi',  visiting: 'Funke Balogun', room: 'C-102', startInside: true,  expiredDemo: false },
  'UNILAG-GUEST-4490': { name: 'Sade Johnson',  visiting: 'Chioma Nwosu',  room: 'A-101', startInside: false, expiredDemo: true },
}

// Tracked residents inside at start (added on top of BASE_INSIDE).
export const INITIAL_INSIDE = [
  'UNILAG-STU-190401052', // Adaobi
  'UNILAG-STU-200402198', // Ngozi
  'UNILAG-STU-210405077', // Blessing
  'UNILAG-STU-200401845', // Chioma
  'UNILAG-STU-190408820', // Zainab (inside)
]

// No-show beds: allocated, but tag unused for an extended period ->
// candidates for reclamation to waitlisted students.
export const NO_SHOW_BEDS = [
  { room: 'B-115', name: 'Aisha Mohammed', matric: '190402744', daysUnseen: 12 },
  { room: 'A-045', name: 'Halima Sule',    matric: '200407120', daysUnseen: 9 },
  { room: 'C-233', name: 'Grace Ekong',    matric: '210409981', daysUnseen: 15 },
  { room: 'B-060', name: 'Peace Anwuli',   matric: '190405560', daysUnseen: 8 },
]

export const DENIED_TODAY_START = 6

// Opening access log (most recent first). Times sit before the 19:00 curfew
// so the seeded history is consistent with the guest pass expiries.
export const INITIAL_LOG = [
  { time: '16:47', name: 'Adaobi Okafor', dir: 'In',  result: 'Allowed',        tone: 'ok' },
  { time: '16:44', name: 'Tolu Adeyemi',  dir: 'In',  result: 'Guest · exp 19:00', tone: 'guest' },
  { time: '16:41', name: 'Chidi Eze',     dir: '—',   result: 'Denied',         tone: 'bad' },
  { time: '16:38', name: 'Funke Balogun', dir: 'Out', result: 'Allowed',        tone: 'ok' },
  { time: '16:32', name: 'Ngozi Umeh',    dir: 'In',  result: 'Allowed',        tone: 'ok' },
]

// Tokens the "Simulate scan" buttons and the test-QR panel use.
export const DEMO_TOKENS = {
  allowed: 'UNILAG-STU-190403311', // Funke Balogun — resident, currently outside -> will enter
  guest:   'UNILAG-GUEST-4471',    // Tolu Adeyemi — live guest pass
  denied:  'UNILAG-STU-210401590', // Chidi Eze — allocated to another hall
  unknown: 'UNILAG-STU-000000000', // not in registry -> tag not recognised
}
