# Tally — Pitch Deck Outline (hybrid)

*Working name: **Tally** — a running count of who's actually in.*

**Tagline (recommended):** "Tally — know who's actually in."
Alternates: "Every bed accounted for." · "Real occupancy, reclaimed beds."

**Length:** 10 core slides + 2 backup slides you keep ready for Q&A (don't present unless asked).
Format per slide: **Show** = what's on screen · **Say** = your line. Talk to the bullets, don't read them.

---

## Slide 1 — Title / Hook
- **Show:** "Tally" big, tagline, team + hackathon. Black masthead, one green accent.
- **Say:** "Right now, nobody at UNILAG actually knows how many students are inside a hostel. Tally does."

## Slide 2 — The Problem
- **Show:** Hostel built for X, now holds far more. "Enforced on paper only."
- Squatting: students living in beds they were never allocated.
- No physical checkpoint — a list of who *should* be in a room, no check of who *is*.
- **Say:** "There's a list of who should be in a room. Nobody checks who actually is."

## Slide 3 — What It Actually Costs (the nuisances)
- **Show:** four icons — bathrooms, water/power, security, crowded-out students.
- Overcrowded rooms and bathrooms · utilities strained past capacity · security can't say who belongs · legit students crowded out of promised space.
- **Say:** "This isn't abstract — it's the daily pain students feel."

## Slide 4 — The Solution: Tally
- **Show:** one QR poster at the **main gate** → phone → green/red.
- One code at the hostel main gate. Student scans it, checks in against their allocation.
- **GREEN (allowed)** / **RED (denied + reason)**. Logs **entry and exit** → live headcount.
- QR for this proof of concept; **NFC in production**.
- **Say:** "Turns a paper policy into a live checkpoint — no new hardware, no turnstile."

## Slide 5 — How It Works (flow diagram)  ← corrected to the real build
- **Show:** Scan gate QR → check in with matric → *Allocated to this hall?* → Green/Red → Logged → Dashboard updates. Guest path branches off.
- **Human + system: the security officer enforces, Tally decides.**
- **Say:** "The officer already stands at the gate. Tally just tells them instantly who belongs — and every scan updates the count."

## Slide 6 — The Live Dashboard  ★ money slide — run the live demo here
- **Show:** the real admin screen — headcount vs designed capacity, no-show beds to reclaim, denied attempts, guests inside, running access log updating live.
- **Say:** "Admin stops guessing and starts seeing — hard, dated numbers per hall."
- ⚠️ Have the **Simulate scan** fallback ready in case the camera/Wi-Fi fails.

## Slide 7 — Guest Mode
- **Show:** guest pass with a countdown, tied to the host's room.
- Time-limited, tied to *who's being visited*, auto-expires.
- **Say:** "Legit visitors get in. A guest can't quietly become a squatter."

## Slide 8 — The Bigger Picture (positioning — strongest slide)
The arc, four steps:
1. **Reclaim** wasted no-show beds → real capacity added, no one punished.
2. **Manage** sanctioned occupants → make issued squatting passes registered and visible.
3. **Measure** the true shortfall → hard, dated occupancy numbers.
4. **Pressure** management to build more → the data makes the shortage undeniable.
- **Say:** "We're not policing students. We reclaim beds, measure the gap, and force the real fix."

## Slide 9 — Roadmap → Production
- **Now:** working software, one gate, QR, live cross-device sync (React + Node + SSE).
- **Next:** pilot at a real gate — swap QR for **NFC**, add **login-verified identity**, back it with **FastAPI + Postgres/Supabase + Redis**.
- **Later:** campus-wide, seeded with real allocation data from admin, NDPR review.
- **Say:** "Nothing we build today gets thrown away — we swap QR for NFC and add a login. The logic is already proven."

## Slide 10 — Close / The Ask
- **Say (close):** "Short term we reclaim beds and manage occupancy. Long term we produce the hard data that makes the shortage undeniable — and forces management to build more."
- Thank you · team · contact.

---

## Backup slides (keep loaded, present only if asked)

### B1 — Objections & Answers (the Q&A killer)
| They'll say | You answer |
|---|---|
| "The QR is copyable." | QR proves the logic; production uses **NFC**, far harder to copy or share than a screenshot. |
| "People tailgate in." | There's a **security officer at every gate**. The scan *arms* them — instant green/red instead of a guess. Human enforces, system decides. |
| "A squatter just types someone else's matric." | Demo trusts the matric to prove the flow; production ties check-in to **portal login or the NFC tag** — identity is proven, not claimed. |
| "This is just enforcement on a housing shortage." | We **reclaim** wasted beds, **measure** the gap, and give a legit path for sanctioned occupants. Enforcement is the backstop, not the point. |
| "Isn't tracking students a privacy risk?" | Movement logs are personal data — **dashboard access is restricted, NDPR-aligned**, and it **fails open** for fire/medical exits. |

### B2 — How It's Built (for technical judges)
- **Today:** React + Vite front-end · Node/Express server holding authoritative state · **Server-Sent Events** so gate screen, phones, and admin all stay in sync live.
- **Three views, one gate URL:** `#/gate` (QR), `#/checkin` (phone), `#/admin` (dashboard).
- **Production swap:** FastAPI + Postgres/Supabase (allocations + logs persist) + Redis (live occupancy), HTTPS domain, NFC readers.

---

### Notes to self
- Slide 6 is the **live demo** — open the gate QR, scan with a phone, check in, watch the dashboard move. Simulate button ready as backup.
- Before Slide 8, confirm the **squatting-pass detail** (year / what it was), or phrase it as "UNILAG has issued squatting passes in the past."
- 10 slides in ~5–6 minutes. One idea per slide. Let the demo carry Slide 6.
