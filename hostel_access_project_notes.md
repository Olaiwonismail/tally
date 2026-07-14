# NFC Hostel Access System — Project Notes

**One line:** A gate scanner that helps *prevent and minimise squatting* — and the nuisances that come with it (overcrowded bathrooms, strained water/power, security uncertainty) — while giving admin real occupancy data.

> Verb to use: **"minimise / prevent nuisances"** — not "eliminate." Honest and defensible.

---

## 1. What We're Building

- **One QR scanner at the hostel main gate.**
  (Not per block — blocks aren't standalone. NFC in production; QR for the proof of concept.)
- Scan → **GREEN (allowed)** or **RED (denied + reason)**. Logs both **in and out**.
- **Live admin dashboard:**
  - Headcount vs designed capacity
  - No-show beds available to reclaim
  - Denied attempts
  - Guests currently inside
  - Running access log
- **Guest mode:** time-limited pass tied to *who's being visited*; auto-expires so a guest can't quietly become a squatter.

---

## 2. How We Pitch It (Positioning)

Not *"we catch squatters"* — you can't fully, because consensual subletting routes around any gate.

**Instead, the arc:**

1. **Reclaim wasted no-show beds** → adds real capacity, nobody punished. *(Strongest card.)*
2. **Manage sanctioned occupants** → UNILAG already issues squatting passes; we make them registered, capped, visible.
3. **Measure the true shortfall** → hard, dated occupancy numbers.
4. **Pressure management to build more** → the data makes the shortage undeniable.

**Why it beats a paper logbook:** paper only *records* the problem. This *prevents, times, counts, and can't be easily faked.*

---

## 3. Strongest Arguments

- **No-show reclamation** *adds* legitimate capacity — supply rises, no one is punished.
- **UNILAG already issued squatting passes** → extra occupants are semi-official → we're the tool that manages them.
  *(⚠️ Confirm the exact detail — year / what the passes were — before leaning on this.)*
- Produces a **hard occupancy number** that removes management's deniability and forces the permanent fix.

---

## 4. Objections & Our Answers

| Objection | Our answer |
|---|---|
| **Copyable QR** | QR is demo-only to prove the logic. Production uses **NFC** — far harder to copy/share than a screenshot. |
| **Tailgating** (people slip in behind a scan) | There's a **security officer at each hostel**. The scan *arms* them: instant green/red instead of guessing. **Human enforces, system decides.** |
| **Scan is only advisory** | Now backed by a human with authority (the officer) — a complete checkpoint, no turnstile/hardware needed. |
| **"It's just enforcement on a housing shortage"** | We reclaim wasted beds, measure the gap, and give a legit path for extra occupants. Enforcement is the *backstop*, not the point. |

---

## 5. Blind Spots — Be Ready For These

- **Surveillance / stalking risk** from movement logs → NDPR *and* a safety issue. Lock down who can see the dashboard.
- **Must fail-open** for fire/medical — never block a physical exit.
- **Dead phone / cold-start / lifecycle** — room swaps, graduations, lost tags, day-one "everyone reads as outside."
- **The porter/officer is the real override** — where corruption can live.
- **Demo-day safety net:** build a **"simulate scan" button** in case the camera fails.

---

## 6. One-Liners for Q&A

- **Economic objection:**
  > "We free up wasted beds and measure the true gap — enforcement's just the backstop."

- **Tailgating / enforcement:**
  > "The scan doesn't replace the security officer — it *arms* them. Human enforces, system decides."

- **Copyable QR:**
  > "QR proves the logic. Production uses NFC, which is far harder to copy or share."

- **Closing line:**
  > "Short term we reclaim beds and manage occupancy. Long term we produce the hard data that makes the shortage undeniable and forces management to build more."

---

## 7. Still Open

- [ ] **Confirm the squatting-pass detail** (year / what it actually was).
- [ ] **Build the clickable demo** (gate app + dashboard + fake data + "simulate scan" backup).
