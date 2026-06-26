# Store outreach (verification) email — template & rules

The email sent to a store owner **before** they've submitted anything, asking
them to verify/correct their listing via a personalized prefilled Google Form.
This is distinct from the maintainer-facing approval email in
[`../../scripts/apps-script/form-sync.gs`](../../scripts/apps-script/form-sync.gs)
(`sendApprovalEmail_`), which fires *after* a form submission and is sent to
the maintainer, not the store. For stores listed as `category: "unconfirmed"`
(found but not yet verified, hidden by default), use the
[unconfirmed-listing variant](outreach-email-unconfirmed-template.md) instead.

Outreach emails are generated and sent manually (per
[`../project-plan.md`](../project-plan.md) — "resists automation by design;
personalized cold outreach beats bulk"). Use this template every time so the
format stays consistent across stores.

## Subject line

```
Verify Your Store Listing — {Store Name} on warhammerdiscounts.com
```

## Body (HTML)

```html
<div style="font-family:Arial,sans-serif;max-width:640px;color:#333;">
  <p>Hi {owner name, or "{Store Name} team" if the owner's name isn't known},</p>
  <p>I'm Jon H. owner of warhammerstores.com &amp; its subsidiary page warhammerdiscounts.com</p>
  <p>{Store Name} is currently listed on warhammerdiscounts.com's
    <a href="https://warhammerdiscounts.com/location/{region-slug}/">{City, ST}</a>
    page, but we wanted to email you to verify the details we have are correct.</p>
  <p>I've generated a pre-filled Google Form with your current details —
    once you verify, your changes will be automatically pushed live to the
    site within about 10 minutes.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto;">
    <tr>
      <td align="center" bgcolor="#2563eb" style="border-radius:6px;">
        <a href="{prefilled form link}"
           style="display:inline-block;padding:12px 28px;font-family:Arial,sans-serif;
                  font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">
          Verify Store Details
        </a>
      </td>
    </tr>
  </table>
  <p>Thanks for your time,<br>Jon@warhammerstores.com</p>
</div>
```

(Button styling matches the one already used in `form-sync.gs`'s approval
email, so anything store-facing or maintainer-facing looks like it's from the
same product. Keep the **table + `bgcolor`** structure — Gmail strips the
`background`/`background-color` CSS off a bare `<a>`, which leaves white button
text on a white background, i.e. an invisible button. The `bgcolor` attribute on
the `<td>` survives that stripping.)

## Rules

- **Greeting:** use the owner's first name if known from prior research/contact;
  otherwise greet the store generically (e.g. "Hi Hub Hobby team,") — never
  leave a placeholder unfilled in a sent email.
- **City link:** always a direct link to the store's own region page
  (`https://warhammerdiscounts.com/location/{region-slug}/`), never a search
  link. Anchor text is the human-readable city name, not the raw URL. Region
  slugs and display names (from the landing page nav):

  | region slug | display name |
  |---|---|
  | `twincities` | Twin Cities, MN |
  | `coloradosprings` | Colorado Springs, CO |
  | `denver` | Denver, CO |
  | `duluth` | Duluth, MN |
  | `rochester` | Rochester, MN |
  | `mankato` | Mankato, MN |

- **Form link:** always a **button**, never a bare pasted URL. Generate the
  per-store prefilled link per
  [`form-reference.md`](form-reference.md) §2, and use it as the button's `href`.
- **Intro line:** after the greeting, always include the sender's identity line:
  "I'm Jon H. owner of warhammerstores.com & its subsidiary page
  warhammerdiscounts.com" (constant across all stores).
- **Sign-off:** always `Jon@warhammerstores.com`.
- **Sending:** draft via the Gmail `create_draft` tool with `htmlBody` set to
  the rendered template (placeholders filled in), then review before sending —
  there's no auto-send tool, drafts are reviewed and sent manually.
