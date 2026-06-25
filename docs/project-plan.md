# Project plan — Warhammer discount map

High-level roadmap for the multi-city expansion. Two groups of work: **setup**
(done once) and the **per-city workflow** (repeats per new city). For the
rigorous store-finding mechanics, this defers to
[`research-process/step1-store-finder.md`](research-process/step1-store-finder.md);
this file is just the map of the moving parts.

> Status (2026-06-24): the site architecture (per-region template + per-region
> JSON + shared `js/app.js`) is **built and multi-city** (Twin Cities, Colorado
> Springs, Denver, plus the combined All Cities view), and the Form → PR
> automation is **built and deployed** — so setup Phases A & B are done. Per-city
> store research has been run for all three cities; **outreach is underway in
> Twin Cities** and **not yet started** in Colorado Springs and Denver. See the
> per-city status table below.

## Tool legend

| Tool | Role |
|---|---|
| **Claude.ai chat** (web/mobile) | Planning, copy drafting, schema analysis, store discovery (places/web search), per-store outreach generation |
| **Claude Code** (CLI) | All code/data editing: Apps Script, JSON files, scaffolding, repo work |
| **Claude in Chrome** (extension) | Browser automation (Google Forms UI, light website scraping) |
| **Cowork** (desktop, optional) | Unattended multi-step browser + file tasks; uses Claude in Chrome under the hood |
| **Google Apps Script** | Runtime hosting the Form → JSON → GitHub automation |
| **Gmail / Forms / Sheets** | Outreach, data collection, source-of-truth storage |

## Setup work (one-time) — status

### Phase A — Foundation alignment ✅ done
Verification form schema aligned to the repo JSON schema; Hub Hobby piloted
end-to-end as proof-of-concept.

### Phase B — Form → JSON → GitHub automation ✅ done
Form submissions flow into the repo via a PR. Built and deployed; see
[`form/form-sync-operations.md`](form/form-sync-operations.md). One open item:
a full live end-to-end test submission through each discount branch is still
recommended.

### Phase C — New-city scaffolding helper ⏸ deferred
A `./new-city <slug> <name> <lat> <lng>` script that stamps out a region
subdir + stub HTML + landing-page link. Defer until friction shows up (probably
after city #3). The README documents the manual version as ~5 minutes — not yet
worth automating.

## Per-city workflow (repeats for each new city)

**Per-city status (2026-06-24):**

| Region | Stores | Discovery | Outreach / verification |
|---|---|---|---|
| Twin Cities | 45 | ✅ done | underway — 12 confirmed discounts (5×15%, 5×10%, 2×loyalty), 14 confirmed no-discount, 19 still unconfirmed |
| Colorado Springs | 13 | ✅ A+B+C | not started — all 13 unconfirmed (seeded from the GW Store Finder); Phase C re-run 2026-06-24, no off-list adds |
| Denver | 27 | ✅ A+B+C | barely started — 2 confirmed no-discount, 25 unconfirmed; Phase C run 2026-06-24 added Retro Gaming of Denver, Crit Castle address corrected |
| Duluth | 4 | ✅ A+B+C | stockists confirmed 4/4; Phase C excluded Dungeon's End (closed 2022); discounts unverified |
| Rochester | 1 | ✅ A+B+C | Gamez & More confirmed GW stockist (first-party); discount unverified |
| Mankato | 3 | ✅ A+B+C | Dork Den + Atlantis confirmed stockists (first-party); Mirth listing-only; discounts unverified |

Counts reflect `data/<region>.json` at this pass; `unconfirmed` = listed on the
official GW Store Finder and awaiting an outreach response (default-include
policy). The workflow itself:

1. **Discover stores** — pull the official GW Store Finder for the city and
   tier each candidate. Use the full process in
   [`research-process/step1-store-finder.md`](research-process/step1-store-finder.md)
   (Phase A pull + Phase B verify/tier, default-include policy). Record findings
   in `research-process/results/<region>.md`.
2. **Find contacts** — website / contact-form / social handle per store (Places
   data, then site scraping via Claude in Chrome or Cowork).
3. **Generate outreach materials** — per-store prefilled Google Form link (see
   [`form/form-reference.md`](form/form-reference.md)) + a personalized email.
4. **Execute outreach** — send 10–20/day, manually. Resists automation by
   design; personalized cold outreach beats bulk.
5. **Response → site** — fully automatic once Phase B exists: form submit → PR →
   validate → merge → deploy. No manual work.

## Recommended order

1. **Twin Cities:** work the 19 remaining unconfirmed stores via outreach
   (Phases 3–4); responses publish themselves (Phase 5).
2. **Colorado Springs & Denver:** discovery is done — run contacts + outreach
   (Phases 2–4) against the existing lists.
3. Let Phase 5 (automation) publish responses as they arrive.
4. Reconsider setup **Phase C** (scaffolding helper) when adding city #4 — three
   cities exist now, so the next region-add is the point where it may earn its keep.

## Notes

- Address auto-geocodes via OpenStreetMap Nominatim in the browser, so `lat`/`lng` are optional in the JSON — stores can submit just an address. (For stores pulled from the GW Store Finder, use its `_geoloc` coords directly.)
- Map library is **Leaflet** + OpenStreetMap; hosting is **GitHub Pages** with a CNAME. Don't change either.
- The authoritative store schema lives in [`../CONTRIBUTING.md`](../CONTRIBUTING.md); all regions share one unified flat (~31-field) rich schema — every store carries the full key set — as documented in [`../CLAUDE.md`](../CLAUDE.md).
