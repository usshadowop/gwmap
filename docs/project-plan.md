# Project plan — Warhammer discount map

High-level roadmap for the multi-city expansion. Two groups of work: **setup**
(done once) and the **per-city workflow** (repeats per new city). For the
rigorous store-finding mechanics, this defers to
[`research-process/step1-store-finder.md`](research-process/step1-store-finder.md);
this file is just the map of the moving parts.

> Status (2026-06-24): the site architecture (per-region template + per-region
> JSON + shared `js/app.js`) is **built and multi-city** (Twin Cities, Colorado
> Springs, Denver, plus the combined All Cities view), and the Form → PR
> automation is **built and deployed**, and the Phase C scaffolding script
> (`scripts/new-city.js`) now exists — so all of setup Phases A, B & C are done. Per-city
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

### Phase C — New-city scaffolding helper ✅ done
`node scripts/new-city.js <slug> "<name>" <lat> <lng>` stamps out a region
subdir + stub HTML + landing-page link + All Cities entry; see
[`../README.md`](../README.md#adding-a-new-region). Built once city count
passed the original "probably after city #3" trigger (six regions exist now).

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
2. **Find contacts** & **3. Generate outreach materials** — compile the best
   email per store, generate a per-store prefilled Google Form link
   (`node scripts/prefill-link.js <region>`), pick the right email template per
   store (confirmed / unconfirmed / chain), and draft one Gmail email per store.
   Full process in
   [`research-process/step2-outreach.md`](research-process/step2-outreach.md)
   (mechanics: [`form/form-reference.md`](form/form-reference.md); templates:
   [`form/outreach-email-template.md`](form/outreach-email-template.md)).
4. **Execute outreach** — send 10–20/day, manually. Resists automation by
   design; personalized cold outreach beats bulk.
5. **Response → site** — fully automatic: form submit → form-sync routes it to
   the right `data/<region>.json` → PR → validate → merge → deploy. No manual work.

Steps 1–4 for a given city are driven by the **`begin-city-outreach` skill**
(`.claude/skills/begin-city-outreach/SKILL.md`) — say "begin city outreach" + a
city and it runs discover → contacts → prefilled-link drafts.

## Recommended order

1. **Twin Cities:** work the 19 remaining unconfirmed stores via outreach
   (Phases 3–4); responses publish themselves (Phase 5).
2. **Colorado Springs & Denver:** discovery is done — run contacts + outreach
   (Phases 2–4) against the existing lists.
3. Let Phase 5 (automation) publish responses as they arrive.
4. Use `node scripts/new-city.js` (Phase C, now built) for the next region add.

## Notes

- Address auto-geocodes via OpenStreetMap Nominatim in the browser, so `lat`/`lng` are optional in the JSON — stores can submit just an address. (For stores pulled from the GW Store Finder, use its `_geoloc` coords directly.)
- Map library is **Leaflet** + OpenStreetMap; hosting is **GitHub Pages** with a CNAME. Don't change either.
- The authoritative store schema lives in [`../CONTRIBUTING.md`](../CONTRIBUTING.md); all regions share one unified flat (~31-field) rich schema — every store carries the full key set — as documented in [`../CLAUDE.md`](../CLAUDE.md).
