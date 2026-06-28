# Local Games Workshop Store Finder cache

This directory holds one dated snapshot of the official GW Store Finder dataset
(`https://www.warhammer.com/api/storefinder`, ~8,200 stores, ~11 MB). Phase A of
the discovery process reads from this local copy instead of hitting the live
endpoint every session — see
[`../docs/research-process/step1-store-finder.md`](../docs/research-process/step1-store-finder.md).

## Freshness rule

The filename is `storefinder-<YYYY-MM-DD>.json`; the date **is** the freshness
signal. **If that date is more than ~1 month old, re-pull before using it:**

```
node scripts/pull-storefinder.js
```

That script downloads a fresh copy, validates it (HTTP 200 + non-empty JSON
array) before replacing anything, writes `storefinder-<today>.json`, and deletes
the previous snapshot so exactly one current file remains here. A failed
download leaves the existing snapshot untouched.

After re-pulling, regenerate any per-state supplements built from this snapshot
(see below) so they reflect the fresh data.

## Per-state supplements built from this snapshot

`scripts/gen-state-storefinder.js <ST>` reads this snapshot and writes
`data/<state>-storefinder.json` — every store-finder entry in that state,
mapped to the store schema, minus the ones already in the state's curated city
files (deduped by proximity/name). It also wires the file into
`location/<state>/index.html` so the state map shows the full store-finder long
tail behind the "Show unconfirmed stores" toggle, without duplicating curated
pins. Re-run it for each state that has a supplement whenever you re-pull:

```
node scripts/gen-state-storefinder.js MN
```

These generated files are not hand-edited (see
[`../CONTRIBUTING.md`](../CONTRIBUTING.md) → "Generated state store-finder
supplements").

## Why it's committed

This is an ephemeral remote environment — the container is re-cloned each
session, so an uncommitted cache wouldn't survive. Committing the snapshot is
what lets discovery reuse it across sessions. Only one copy is kept at a time to
bound repo growth; the monthly re-pull replaces it rather than accumulating
snapshots.
