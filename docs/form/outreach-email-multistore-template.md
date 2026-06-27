# Multi-store outreach (verification) email — template & rules

A variant of the [standard outreach email](outreach-email-template.md) for owners
whose **one contact inbox controls several stores** (chains — e.g. Dreamers Vault
×6, Tower Games ×2, Hub Hobby ×2). Instead of sending that owner one separate
email per location (repeat mail to the same address), send **one email that lists
every location they control, each with its own "Verify" button**.

For single-store owners use the [standard template](outreach-email-template.md);
for an `unconfirmed` (found-but-not-verified) store use the
[unconfirmed variant](outreach-email-unconfirmed-template.md).

> **Why per-store buttons, not one combined form?** The verification Google Form
> is per-store — one submission carries one store name and `form-sync.gs` matches
> it to a single `data/<region>.json` entry (see
> [`form-sync-operations.md`](form-sync-operations.md)). There is **no** single
> submission that can update multiple stores at once, so a true "one combined
> form" doesn't exist. This template's "combined" benefit is purely bundling each
> location's own prefilled link into one email so the owner can verify them all
> in one sitting. Generate each button's link with
> `node scripts/prefill-link.js <region> "<store name>"` — one per location.

## Subject line

```
Verify Your Store Listings — {Owner / Chain Name} on warhammerdiscounts.com
```

(Plural "Listings". Use the chain/brand name, e.g. "Dreamers Vault Games".)

## Body (HTML)

Render one `<table>…</table>` location block per store from the loop below.

```html
<div style="font-family:Arial,sans-serif;max-width:640px;color:#333;">
  <p>Hi {owner name, or "{Chain Name} team" if the owner's name isn't known},</p>
  <p>I'm Jon H. owner of warhammerstores.com &amp; its subsidiary page warhammerdiscounts.com</p>
  <p>You have <strong>{N}</strong> locations listed on warhammerdiscounts.com, and
    we wanted to email you to verify the details we have are correct. I've
    generated a pre-filled Google Form for <strong>each</strong> location below —
    once you verify a location, your changes are automatically pushed live to the
    site within about 10 minutes.</p>
  <p>Feel free to forward this email to the manager or staff at each location so
    each store can fill out its own form — or one person can complete all of them.</p>

  <!-- ===== repeat this block once per location ===== -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:22px 0;border-top:1px solid #e5e7eb;">
    <tr>
      <td style="padding-top:14px;">
        <p style="margin:0;font-weight:bold;font-size:15px;">{Store Name}</p>
        <p style="margin:2px 0 0;font-size:13px;color:#666;">{Store Address}
          &middot; listed on the
          <a href="https://warhammerdiscounts.com/location/{region-slug}/">{City, ST}</a> page</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0 0;">
          <tr>
            <td align="center" bgcolor="#2563eb" style="border-radius:6px;">
              <a href="{prefilled form link for this store}"
                 style="display:inline-block;padding:10px 24px;font-family:Arial,sans-serif;
                        font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">
                Verify {Store Name}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!-- ===== end repeated block ===== -->

  <p>Thanks for your time,<br>Jon@warhammerstores.com</p>
</div>
```

## Rules

Same rules as the [standard template](outreach-email-template.md), plus:

- **One email per shared inbox**, not per store — list every location that inbox
  controls. Never send the same address several near-identical single-store emails.
- **Forwarding line:** include the note that the email can be forwarded to each
  location's manager/staff to fill out their own form, or one person can do them
  all — so a multi-store owner can delegate rather than complete all forms alone.
- **One button per location**, each with its **own** prefilled link from
  `node scripts/prefill-link.js <region> "<store name>"`. Don't reuse one link for
  multiple stores — each submission only matches the store named in it.
- **{N}** in the intro = the location count; keep it in sync with the blocks shown.
- **Per-location city link:** still a direct region-page link
  (`https://warhammerdiscounts.com/location/{region-slug}/`). If a chain spans
  regions, each block links to its own location's region page.
- **Greeting:** owner's first name if known, else the chain name ("Hi Dreamers
  Vault team,"). Never leave a placeholder unfilled.
- **Intro line & sign-off:** unchanged — "I'm Jon H. owner of warhammerstores.com
  &amp; its subsidiary page warhammerdiscounts.com" and `Jon@warhammerstores.com`.
- **Button style:** keep the **table + `bgcolor`** structure (Gmail strips
  `background` off a bare `<a>` → invisible button); see the standard template.
- **Sending:** draft via Gmail `create_draft` (`htmlBody` = rendered template),
  drafts only — reviewed and sent manually.
