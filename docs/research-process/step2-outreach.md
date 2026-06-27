# Step 2: Outreach — contacts, prefilled links, and verification-email drafts

Step 1 ([`step1-store-finder.md`](step1-store-finder.md)) ends with every store
for a city seeded into `data/<region>.json` (mostly `category: "unconfirmed"`).
Step 2 turns that seeded list into a set of ready-to-send Gmail **drafts** — one
per store (or one per chain) — each linking to a personalized, prefilled
verification form. When a store owner submits, the response publishes itself
(Step 5 / `form-sync.gs`); Step 2 stops at drafts.

**Draft only — never auto-send.** The maintainer reviews and sends manually
(10–20/day). There is no auto-send tool, and that's deliberate (personalized cold
outreach beats bulk — see [`../project-plan.md`](../project-plan.md)).

Like Step 1, this is city-agnostic. It has four phases:

- **Phase A — Compile contacts.** Find the best reachable email per store; fall
  back to phone/social; record what you find.
- **Phase B — Generate prefilled links.** One prefilled form URL per store from
  its data record (`scripts/prefill-link.js`).
- **Phase C — Pick the right template per store.** Confirmed vs. unconfirmed vs.
  chain (shared inbox) selects which of the three email templates to use.
- **Phase D — Draft the emails.** One Gmail draft per store/chain, drafts only.

This skill is normally driven end-to-end by the
[`begin-city-outreach`](../../.claude/skills/begin-city-outreach/SKILL.md) skill
(steps 2–4); this file is the rigorous "how" for the outreach step, the way
`step1-store-finder.md` is the rigorous "how" for discovery.

---

## Prerequisites (don't start Step 2 without these)

- **Step 1 is done** for the city — `data/<region>.json` exists and is seeded
  (every Store Finder candidate present, default-include policy applied). The
  pre-seeded entries are what makes auto-publish routing work: `form-sync.gs`
  matches a later submission to the store already sitting in the file, so a store
  must exist here *before* you email its owner.
- **The region's live page exists** at
  `https://warhammerdiscounts.com/location/<region-slug>/` (created by
  `scripts/new-city.js` during Step 1 scaffolding). The email links to it.

---

## Phase A — Compile contacts

Produce `docs/outreach/<region>-contacts.md`: for every store, the best outreach
channel, ranked email → contact form → social DM → phone.

### A.1 Find the best email per store
For each store, in order of preference:
1. **The store's own website contact page** — the gold standard. Fetch the literal
   page and read the address off it.
2. A **role inbox** (`info@`, `contact@`, `sales@`) if no personal one is shown.
3. A **contact form** URL (no address, but a reachable channel).
4. **Social** (Facebook page / Instagram DM) or **phone**, if nothing else.

### A.2 Verify, don't trust (same rule as Step 1)
An email or address asserted by a search-engine summary is **not** confirmed
until you've read it off the store's own site (or another first-party source). A
blocked/empty fetch (403, login wall, JS shell) is a capability gap, not a
confirmed "no email" — record it as unverified. Mark each contact in the file as
*site-verified* or *maintainer-approved* so a later pass knows what's solid.

### A.3 Capture what you find back into the data record
When you confirm a store's `website` or `phone`, write it into that store's entry
in `data/<region>.json` (the schema already has both fields). This keeps the data
file the single source of truth and feeds future prefilled links.

When a store confirms its details **directly** (phone call, in person, email reply)
rather than through the Google Form, set its `note` to mirror the form-sync
convention — **`Verified by store via phone on <YYYY-MM-DD>`** (swap "phone" for the
channel used). The form automation writes `Verified by store via form on <date>`;
keep manual confirmations in the same shape, and put substantive details (stock
level, discount, loyalty terms) in their own fields rather than the note.

### A.4 Record the contacts file
Write `docs/outreach/<region>-contacts.md` with three buckets:
- **Approved — ready for outreach** — a table of store → email → source. Group a
  chain's locations under their one shared inbox (see Phase C / multi-store).
- **Further research required** — leads too weak to send yet (unverified email,
  or the store's GW-stocking itself is still in doubt), with why.
- **No public email found** — phone/contact-form/social only.

### A.5 No-email stores → CSV for a deeper pass
Export the "no public email" stores to
`docs/outreach/<region>-no-email-stores.csv` (columns: `store, address, phone,
facebook, instagram, contact_form, discord, notes`). These are the stores worth a
second, deeper email-research pass (e.g. piping the CSV through another tool)
before deciding to contact them by phone/social instead.

---

## Phase B — Generate prefilled links

```
node scripts/prefill-link.js <region>                  # one link per store
node scripts/prefill-link.js <region> "<name or id>"   # just one store
```

- It builds the link straight from the store's `data/<region>.json` record, so the
  outreach can't drift from the form's real entry IDs. Mechanics + the entry-ID
  map: [`../form/form-reference.md`](../form/form-reference.md).
- It only fills fields we actually have (name, address, Maps link, and — for a
  confirmed tier — the discount %, new-releases / pre-order flags, pre-order
  text). Everything else is left blank for the store to complete.
- **Use its output verbatim as the button `href`.** Never hand-assemble a form
  link, and never reuse one store's link for another — each submission only
  matches the store named in it, so a reused link updates the wrong store.

Capture the output (e.g. to a scratch file) and map each store name → its link to
build the drafts in Phase D.

---

## Phase C — Pick the right template per store

There are three email templates. Choose per store by **(1) is it a chain sharing
one inbox? then (2) is the store confirmed or unconfirmed?**

| Store situation | Template | Button text |
|---|---|---|
| One store, **confirmed** (`category` = `15` / `10` / `loyalty` / `none`) | [`outreach-email-template.md`](../form/outreach-email-template.md) | **Verify Store Details** |
| One store, **`unconfirmed`** (found, not yet verified — hidden by default) | [`outreach-email-unconfirmed-template.md`](../form/outreach-email-unconfirmed-template.md) | **Confirm Your Listing** |
| **Chain** — one inbox controls several locations | [`outreach-email-multistore-template.md`](../form/outreach-email-multistore-template.md) | **Verify {Store}** per location |

Key points:
- **`category: "none"` is confirmed, not unconfirmed.** It means a verified
  stockist that offers no discount — use the standard (confirmed) template, not
  the unconfirmed one. Only literal `category: "unconfirmed"` uses the unconfirmed
  template.
- **Chains take precedence on which template** — bundle all of one owner's
  locations into a single multi-store email (per-location buttons + the
  forward-to-each-location line) rather than sending the shared inbox several
  near-identical single-store emails. (The form is per-store, so there's no single
  combined submission — see the multi-store template's note.)
- To decide the per-store template programmatically, read each store's `category`
  from `data/<region>.json`; group stores by shared email from the contacts file
  to detect chains.

All three templates share the same rules (greeting, direct city link + region-slug
table, intro identity line, `Jon@warhammerstores.com` sign-off, and the
bulletproof **table + `bgcolor`** button — Gmail strips `background` off a bare
`<a>`, making an invisible button). See the standard template for the full rule
set; the variants only change framing and button text.

---

## Phase D — Draft the emails

1. Render each email's `htmlBody` from the chosen template, filling: greeting
   (owner first name if known, else "{Store} team"), the store name(s)/address(es),
   the direct city link, and the prefilled link(s) from Phase B as the button
   `href`(s).
2. Create **one Gmail draft per store (or per chain)** with the Gmail
   `create_draft` tool (`htmlBody` = the rendered template). **Stop here.**
3. **Verify** with `list_drafts` that every intended recipient has exactly one
   draft and there are no duplicates.

### D.1 Operating notes / gotchas
- **Drafts only.** There is no auto-send tool by design; the maintainer sends.
- **Fixing a wrong draft:** there's no edit-draft or hard-delete tool. To replace
  a draft (e.g. wrong template), create the corrected one, then move the old one
  to **Trash** via `apply_sensitive_thread_label` (each draft is its own thread).
  Trash is recoverable; nothing is permanently deleted.
- **Greeting:** never leave a placeholder unfilled — fall back to "{Store} team".
- **Don't reuse links across stores** (Phase B) — a multi-store email needs a
  *distinct* prefilled link per location button.

---

## Definition of done — Step 2 for a city

Record alongside the contacts file:

- [ ] **Contacts** — `docs/outreach/<region>-contacts.md` written (approved /
      further-research / no-email buckets); `website`/`phone` written back into
      `data/<region>.json` where found.
- [ ] **No-email CSV** — `docs/outreach/<region>-no-email-stores.csv` exported for
      the phone/social-only stores.
- [ ] **Prefilled links** — generated for every store with a usable email.
- [ ] **Template chosen per store** — confirmed → standard, `unconfirmed` →
      unconfirmed variant, chain → multi-store; verified against each store's
      `category`.
- [ ] **Drafts created** — one Gmail draft per store/chain, drafts only, verified
      present via `list_drafts` with no duplicates.
- [ ] **Handoff updated** — note in `docs/handoff.md` how many drafts were created
      (and any stores deferred to phone/social or further research).

Stores with no reachable contact are not failures of this step — flag them
explicitly (deferred to phone/social or to the CSV research pass) rather than
silently dropping them. After Step 2, the maintainer sends the drafts (Step 4) and
responses publish themselves (Step 5).
