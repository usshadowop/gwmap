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

## Why it's committed

This is an ephemeral remote environment — the container is re-cloned each
session, so an uncommitted cache wouldn't survive. Committing the snapshot is
what lets discovery reuse it across sessions. Only one copy is kept at a time to
bound repo growth; the monthly re-pull replaces it rather than accumulating
snapshots.
