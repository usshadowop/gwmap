# Store outreach (unconfirmed-listing) email — template & rules

A variant of the [verification email](outreach-email-template.md) for stores
listed as `category: "unconfirmed"` — pulled from the GW Store Finder (or a
search pass) but **not yet verified** to stock Games Workshop or to offer a
discount, so they're hidden by default on the map until confirmed. Use this
template instead of the standard verification one when the store you're emailing
is `unconfirmed`; the copy is framed around *"we found you, confirm your
listing"* rather than *"verify the details we already have."*

Like the verification email, these are generated and sent **manually** (drafts
only — review before sending). Use this template every time so the format stays
consistent across stores.

## Subject line

(Same as the verification email.)

```
Verify Your Store Listing — {Store Name} on warhammerdiscounts.com
```

## Body (HTML)

```html
<div style="font-family:Arial,sans-serif;max-width:640px;color:#333;">
  <p>Hi {owner name, or "{Store Name} team" if the owner's name isn't known},</p>
  <p>I'm Jon H. owner of warhammerstores.com &amp; its subsidiary page warhammerdiscounts.com</p>
  <p>{Store Name} was flagged as potentially stocking and selling Warhammer models in our initial store search pass.</p>
  <p>{Store Name} is currently listed on warhammerdiscounts.com's
    <a href="https://warhammerdiscounts.com/location/{region-slug}/">{City, ST}</a>
    page, as an unconfirmed store so does not show up by default currently.</p>
  <p>I've generated a pre-filled Google Form with your current details we have —
    once you verify, your store will be swapped to confirmed and your changes will be automatically pushed live to the
    site within about 10 minutes.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto;">
    <tr>
      <td align="center" bgcolor="#2563eb" style="border-radius:6px;">
        <a href="{prefilled form link}"
           style="display:inline-block;padding:12px 28px;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">
          Confirm Your Listing
        </a>
      </td>
    </tr>
  </table>
  <p>Thanks for your time,<br>Jon@warhammerstores.com</p>
</div>
```

(Keep the **table + `bgcolor`** button structure — Gmail strips the
`background`/`background-color` CSS off a bare `<a>`, leaving white button text on
a white background, i.e. an invisible button. The `bgcolor` attribute on the
`<td>` survives that stripping. See the
[verification template](outreach-email-template.md) for the full rationale.)

## Rules

This shares all of the [verification email rules](outreach-email-template.md#rules)
— **greeting**, **city link** (+ the region slug / display-name table),
**form link**, **intro line**, **sign-off**, and **sending** all apply
identically. The differences for this variant:

- **When to use:** only when the store's `category` is `unconfirmed`. For a
  store whose listing you've already verified, use the standard
  [verification template](outreach-email-template.md) instead.
- **Button text:** reads **"Confirm Your Listing"** (not "Verify Store
  Details"), since the store isn't live yet.
- **Framing:** the copy makes clear the store is currently hidden (listed as
  `unconfirmed`) and that submitting the form swaps it to confirmed and pushes
  it live.
