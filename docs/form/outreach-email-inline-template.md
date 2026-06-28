# Store outreach (inline-questions, reply-by-email) email — template & rules

A **trust-first** variant of the [verification email](outreach-email-template.md)
for owners who are wary of clicking a button to an unfamiliar Google Form (it
reads as phishing to a cold recipient). Instead of a "Verify" button, this
email **puts every question inline** and asks the owner to **just hit reply** and
answer in the email body. There is **no form link and no button** — the only
link is the store's own public listing page, which the owner can verify is real
by visiting warhammerdiscounts.com directly.

Use this when an owner has said (or is likely) to distrust a form link, or as the
default for a store you expect to be link-shy. For everyone else the
[button templates](outreach-email-template.md) (standard / `unconfirmed` /
multi-store) still apply.

> **No auto-publish for this variant.** The button templates feed
> [`form-sync.gs`](../../scripts/apps-script/form-sync.gs), which parses a form
> submission and opens a PR automatically. A free-form email reply can't be
> parsed, so **there is no automation here** — you read the reply and update
> `data/<region>.json` **by hand**, then ship it through the normal branch → PR →
> merge flow (see Rules below). That manual cost is the deliberate trade for an
> email with nothing to click.

Like the other outreach emails, these are drafted via Gmail `create_draft`
(`htmlBody` = the rendered template) and reviewed/sent manually — drafts only,
never auto-send.

## Subject line

(Same as the verification email.)

```
Verify Your Store Listing — {Store Name} on warhammerdiscounts.com
```

## Body (HTML)

Render the **"What we currently have on file"** box from the store's known data
(the prefill equivalent — only show fields we actually have; drop any line we
don't). The numbered questions are constant across stores; the optional sections
stay in even when we already have an answer, so the owner can correct it.

```html
<div style="font-family:Arial,sans-serif;max-width:640px;color:#333;line-height:1.5;">
  <p>Hi {owner name, or "{Store Name} team" if the owner's name isn't known},</p>
  <p>I'm Jon H. owner of warhammerstores.com &amp; its subsidiary page warhammerdiscounts.com</p>
  <p>{Store Name} is currently listed on warhammerdiscounts.com's
    <a href="https://warhammerdiscounts.com/location/{region-slug}/">{City, ST}</a>
    page (you can see your listing there now), and I wanted to make sure the
    details we have are right.</p>
  <p>So you don't have to click anything, I've put the questions right here in
    this email — <strong>just reply</strong> with your answers. You only need to
    answer what's relevant; skip anything that doesn't apply.</p>

  <p style="margin:22px 0 6px;font-weight:bold;">What we currently have on file</p>
  <div style="border:1px solid #e5e7eb;border-radius:6px;padding:12px 16px;background:#f9fafb;">
    <p style="margin:0 0 4px;"><strong>Store name:</strong> {Store Name}</p>
    <p style="margin:0 0 4px;"><strong>Address:</strong> {Store Address}</p>
    <p style="margin:0 0 4px;"><strong>Discount:</strong> {e.g. 15% off all Games Workshop models}</p>
    <p style="margin:0 0 4px;"><strong>Applies to new releases:</strong> {Yes/No}</p>
    <p style="margin:0 0 4px;"><strong>Applies to pre-orders:</strong> {Yes/No}</p>
    <p style="margin:0;"><strong>How to pre-order:</strong> {pre-order process, if known}</p>
  </div>
  <p style="margin:8px 0 0;">If all of that is correct, a quick "looks good" is
    enough — otherwise just correct anything that's wrong.</p>

  <p style="margin:22px 0 6px;font-weight:bold;">A few more questions (answer any that apply)</p>

  <p style="margin:14px 0 4px;font-weight:bold;color:#555;">About you</p>
  <p style="margin:0 0 4px;">1. Your name (optional):</p>
  <p style="margin:0;">2. Your role / affiliation with the store:</p>

  <p style="margin:14px 0 4px;font-weight:bold;color:#555;">Your Games Workshop discount</p>
  <p style="margin:0 0 4px;">3. Do you offer a standing discount on all Games Workshop models?
    (Yes / Yes, with some exceptions / We offer a store loyalty discount that includes GW / Other)</p>
  <p style="margin:0 0 4px;">4. What is the discount percentage?</p>
  <p style="margin:0 0 4px;">5. Does the discount apply to new Warhammer releases? (Yes/No)</p>
  <p style="margin:0 0 4px;">6. Does the discount apply to Warhammer pre-orders? (Yes/No)</p>
  <p style="margin:0 0 4px;">7. Are any specific Warhammer models or categories excluded from the discount?</p>
  <p style="margin:0;">8. Any additional discount details we should note?</p>

  <p style="margin:14px 0 4px;font-weight:bold;color:#555;">If you run a loyalty program (skip if not)</p>
  <p style="margin:0 0 4px;">9. How does your loyalty program work?</p>
  <p style="margin:0 0 4px;">10. Does the loyalty discount apply to new Warhammer releases? (Yes/No)</p>
  <p style="margin:0;">11. Does it apply to Warhammer pre-orders? (Yes / No / We don't take pre-orders)</p>

  <p style="margin:14px 0 4px;font-weight:bold;color:#555;">Pre-orders</p>
  <p style="margin:0;">12. How does someone place a Warhammer pre-order at your shop?</p>

  <p style="margin:14px 0 4px;font-weight:bold;color:#555;">Your Warhammer inventory (optional)</p>
  <p style="margin:0 0 4px;">13. Which Warhammer product lines do you carry?
    (40k, Horus Heresy / 30k, Age of Sigmar, Old World, Kill Team, Blood Bowl,
    Necromunda, Legion Imperialis / Epic scale, Black Library novels, other)</p>
  <p style="margin:0;">14. Roughly how many Warhammer items do you keep in stock?
    (0–20 / 20–50 / 50–100 / 100–200 / 200–500 / 500+)</p>

  <p style="margin:14px 0 4px;font-weight:bold;color:#555;">Social media (optional — we can add links to your listing)</p>
  <p style="margin:0 0 4px;">15. Discord (server link / how to join):</p>
  <p style="margin:0 0 4px;">16. Facebook:</p>
  <p style="margin:0 0 4px;">17. Instagram:</p>
  <p style="margin:0 0 4px;">18. X / Twitter:</p>
  <p style="margin:0;">19. Any other social media:</p>

  <p style="margin:14px 0 4px;font-weight:bold;color:#555;">Play space (optional)</p>
  <p style="margin:0 0 4px;">20. Do you have tables available for Warhammer games?
    (Yes / Yes, with restrictions / No)</p>
  <p style="margin:0 0 4px;">21. Is the play space free or is there a cost?</p>
  <p style="margin:0 0 4px;">22. Price, if there's a cost:</p>
  <p style="margin:0 0 4px;">23. Any restrictions?</p>
  <p style="margin:0;">24. How does someone reserve or request a table?</p>

  <p style="margin:22px 0 0;">Thanks for your time — just reply whenever it's
    convenient and I'll update your listing.</p>
  <p>Jon@warhammerstores.com</p>
</div>
```

## Rules

This shares the [verification email rules](outreach-email-template.md#rules) for
**greeting**, **city link** (+ the region slug / display-name table there),
**intro line**, **sign-off**, and **drafts-only sending**. What's different for
this variant:

- **When to use:** an owner who distrusts a form/button link (the phishing
  concern), or a store you expect to be link-shy. It's an **additional** variant,
  not a replacement — confirmed stores still default to the
  [standard button template](outreach-email-template.md), `unconfirmed` stores to
  the [unconfirmed variant](outreach-email-unconfirmed-template.md), and chains to
  the [multi-store variant](outreach-email-multistore-template.md).
- **No link, no button — on purpose.** Do **not** add a form button or a
  prefilled-form link. The only hyperlink is the store's own region page
  (`https://warhammerdiscounts.com/location/{region-slug}/`, anchored to the
  human-readable city name), which the owner can independently confirm is real by
  going to warhammerdiscounts.com. `scripts/prefill-link.js` is **not** used here.
- **"What we have on file" box = the prefill equivalent.** Fill it from the
  store's verified data using the same policy as the form prefill
  ([`form-reference.md`](form-reference.md) §3): only show fields we actually have
  (name, address, discount %, applies-to-new-releases, applies-to-pre-orders,
  pre-order process, and the Maps link if known). **Drop any line we don't have a
  value for** — never leave a `{placeholder}` in a sent email.
- **The numbered questions are constant.** Keep all of them (they mirror the
  form's fields, minus the form-only "ready to submit?" confirmation). The
  optional section headers ("skip if not", "optional") let the owner self-select,
  so the full set isn't overwhelming.
- **No auto-publish — you transcribe the reply by hand.** [`form-sync.gs`](../../scripts/apps-script/form-sync.gs)
  only handles form submissions; an email reply doesn't touch it. When a reply
  comes in:
  1. Update the store's entry in `data/<region>.json` from the answers (keep the
     full unified key set; leave un-answered fields blank). Set `category` to the
     real tier (`15`/`10`/`loyalty`/`none`) the reply establishes.
  2. Add a confirmation note: `Verified by store via email on <YYYY-MM-DD>`
     (the email analogue of the phone-confirmation note convention).
  3. Strip the outreach marker (`Store email confirmation sent on <date>`) from
     the note, since the form-sync auto-strip won't run for an email reply.
  4. Ship it the normal way — branch → PR into `main` → squash-merge (validator
     must pass; never `[skip ci]`).
- **Outreach marker on send:** as with the button templates, append
  `Store email confirmation sent on <date>` to the store's `note` when you send
  the email, so we don't re-contact it.
- **Sending:** draft via Gmail `create_draft` with `htmlBody` set to the rendered
  template (placeholders filled, unavailable on-file lines removed), then review
  before sending — drafts only, no auto-send.
