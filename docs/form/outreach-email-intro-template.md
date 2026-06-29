# Intro / first-contact ("hello") email — template & rules

A short, **first-touch** email sent **before** any verification email. It does
two things and nothing more: **introduces Jon and the project succinctly**, and
**asks whether this is the right inbox** to reach the store about its listing.
There is **no Google Form, no button, and no questionnaire** — that keeps the
very first contact human and low-friction, which sidesteps the "looks like
phishing" reaction cold recipients had to the verification button.

Use it as an optional **Phase 0** ahead of the verification step: send the hello,
and once the owner confirms the channel (or replies at all), follow up with the
appropriate verification template — [standard button](outreach-email-template.md),
[`unconfirmed`](outreach-email-unconfirmed-template.md),
[multi-store](outreach-email-multistore-template.md), or the trust-first
[inline-questions](outreach-email-inline-template.md) variant. It's an *additional*
step, not a replacement: for a store you're comfortable contacting directly, you
can still skip straight to a verification email.

Like the other outreach emails, these are drafted via Gmail `create_draft`
(`htmlBody` = the rendered template) and reviewed/sent manually — drafts only,
never auto-send. **Nothing here auto-publishes** (there's no data to publish yet;
it's an introduction).

## Subject line

```
Hello from warhammerdiscounts.com — is this the right contact for {Store Name}?
```

## Body (HTML)

```html
<div style="font-family:Arial,sans-serif;max-width:640px;color:#333;line-height:1.5;">
  <p>Hi {owner name, or "{Store Name} team" if the owner's name isn't known},</p>
  <p>I'm Jon H. owner of warhammerstores.com &amp; its subsidiary page warhammerdiscounts.com</p>
  <p>warhammerdiscounts.com is a free, fan-run map that helps people find local
    hobby shops selling Games Workshop / Warhammer models — and shows which shops
    offer a discount. {Store Name} is one of the stores listed, on its
    <a href="https://warhammerdiscounts.com/location/{region-slug}/">{City, ST}</a>
    page.</p>
  <p>Before I send over the few details we have on file for you to check, I wanted
    to make sure I've got the right inbox: <strong>is this the best email to reach
    {Store Name}</strong> about its listing? If there's a better contact, just
    point me to it.</p>
  <p>Thanks for your time,<br>Jon@warhammerstores.com</p>
</div>
```

## Rules

This shares the [verification email rules](outreach-email-template.md#rules) for
**greeting**, **intro line**, **city link** (+ the region slug / display-name
table there), **sign-off**, and **drafts-only sending**. What's specific to this
first-contact variant:

- **Keep it short.** Three short paragraphs: who you are, what the project is (one
  sentence), and the channel question. Do **not** add the discount questions, an
  "on file" box, or a form — those belong to the verification email that follows.
- **No form link and no button — on purpose.** This is the first time the store
  hears from you, so there's nothing to click. `scripts/prefill-link.js` is **not**
  used here.
- **The one allowed link is the store's own listing page**, anchored to the
  human-readable place name, so the owner can confirm the project is real by
  visiting it. Use the store's **city region page**
  (`https://warhammerdiscounts.com/location/{region-slug}/`) when it has one;
  for a store that only appears on a state map (a Store Finder supplement pin),
  link its **state page** (`https://warhammerdiscounts.com/location/{state-slug}/`,
  e.g. `/location/texas/`) and use the state name as the anchor text. If you'd
  rather keep the first touch completely link-free, drop the link sentence — never
  leave a `{placeholder}` in a sent email.
- **Ask the channel question — but don't offer a removal/opt-out.** The core ask
  is "is this the right email?", paired with "point me to a better contact." The
  listing is **fan/crowd-sourced and stays either way**; this email invites the
  owner to keep it accurate, it isn't asking permission to list them. The fan
  reading the map is priority #1 — owners *update* their info, they don't *approve*
  being listed, so there's nothing to opt out of.
- **Outreach marker on send:** append `Intro email sent on <date>` to the store's
  `note` when you send the hello — distinct from the verification email's
  `Store email confirmation sent on <date>` marker, so the two phases stay
  separable and you don't re-send the intro. (Strip/replace it once they move on to
  a verification email, the same way the sent-marker is handled there.)
- **Sequencing:** when the owner confirms the channel (or simply replies), follow
  up with the right verification template per
  [`step2-outreach.md`](../research-process/step2-outreach.md) Phase C.
- **Sending:** draft via Gmail `create_draft` with `htmlBody` set to the rendered
  template (placeholders filled, the link sentence kept or dropped), then review
  before sending — drafts only, no auto-send.
