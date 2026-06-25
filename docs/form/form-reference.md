# Store Verification Form — field & workflow reference

Self-contained reference for the Google Form used to verify/update existing
store listings, including every question's entry ID, so a fresh session can
generate prefilled per-store links without re-deriving the mapping from scratch.
The automation that consumes this form's submissions lives in
[`../../scripts/apps-script/form-sync.gs`](../../scripts/apps-script/form-sync.gs);
operational notes are in [`form-sync-operations.md`](form-sync-operations.md).
The email that invites a store owner to fill this form out (sent before any
submission) has its own template: [`outreach-email-template.md`](outreach-email-template.md).

**Project:** warhammerdiscounts.com (the live site for this repo)

## 1. The form

- **Title:** "Verify Your Store Listing Information — warhammerdiscounts.com"
- **Edit URL:** `https://docs.google.com/forms/d/1rULc8ok2rAdyFY3uprmtQhl5DWm_i3c5mXzgntgviZw/edit`
- **Live (view) base URL:** `https://docs.google.com/forms/d/e/1FAIpQLSfzAk_VSsmppzKYyV-oZUDAzB17RT8SNli2H_zZDxv-KJRgnQ/viewform`
- Each store gets a **personalized prefilled link** (same base URL + query params) rather than one generic form, so respondents see their current data already filled in and just confirm/correct it.

## 2. How prefilled links work (mechanics)

A prefilled link is the base view URL plus `?usp=pp_url&` followed by one
`entry.XXXXXXX=value` parameter per question.

**Encoding rules** observed from Google's own generated links:

| Character | Encoding |
|---|---|
| space | `+` |
| comma `,` | left literal (not encoded) |
| parentheses `( )` | `%28` `%29` |
| apostrophe `'` | `%27` |
| Checkbox "Other" option | `entry.ID=__other_option__&entry.ID.other_option_response=YourText` |
| Checkbox (multi-select) | repeat `entry.ID=value` once per checked option |

**To regenerate/verify this map after any form edit:**

1. Open the live form, fill in every question with placeholder text (e.g. "Example"), select every radio default, check every checkbox.
2. Menu (⋮) → **Get pre-filled link** → copy the generated URL.
3. Take a full screenshot of the form (top to bottom).
4. Match entry IDs to question order in the screenshot — Google appends them in form order.
5. Diff against the table below: unchanged questions keep their entry ID; new/inserted questions get new IDs; nothing else shifts.

## 3. Full field map (current, as of last form edit)

| # | Entry ID | Question | Type | Options / Notes |
|---|---|---|---|---|
| 1 | 571351982 | Your name (optional) | Short answer | Respondent fills in — don't prefill |
| 2 | 577865459 | What is your affiliation with this store? | Short answer | Respondent fills in — don't prefill |
| 3 | 1052932045 | Store name | Short answer | **Prefill** |
| 4 | 1138144738 | Store street address | Short answer | **Prefill** |
| 5 | 1890704744 | Google Maps link (optional, for a more precise pin) | Short answer | **Prefill** when known |
| 6 | 1644707819 | Do you offer any innate persistent discounts on all Games Workshop models? | Multiple choice | Yes / Yes with exceptions / We offer store loyalty discounts that include GW models / Other: |
| 7 | 1911433926 | What's % discount? | Short answer | **Prefill** (e.g. "15") |
| 8 | 894533038 | Does this discount apply to new Warhammer releases? | Yes/No | **Prefill** |
| 9 | 1656781913 | Does this discount apply to Warhammer pre-orders? | Yes/No | **Prefill** |
| 10 | 1283148159 | Are any specific Warhammer models/categories excluded from this discount? | Short answer | |
| 11 | 1395895797 | Additional discount details | Short answer | |
| 12 | 801742604 | How does your store loyalty program work? | Short answer | Only relevant if Q6 = loyalty option |
| 13 | 1061267075 | Does the loyalty discount apply to new Warhammer releases? | Yes/No | |
| 14 | 701562959 | Does the loyalty discount apply to Warhammer pre-orders? | Yes / No / We do not take pre-orders | |
| 15 | 918549052 | Explain how your discounts work on GW models (Discount Info – Other) | Short answer | Only relevant if Q6 = Other |
| 16 | 1759960920 | Describe how someone puts in a pre-order at your shop | Paragraph | **Prefill** when known |
| 17 | 133136499 | Would you like to provide some information on your Warhammer inventory? | Yes/No | Gate question for stock section |
| 18 | 1640903097 | Which Warhammer products do you carry? | Checkbox (multi) | 40k, Horus Heresy (30k), Age of Sigmar, Old World, Kill Team, Blood Bowl, Necromunda, Legion Imperials (Epic Scale), Black Library Novels, Other: (free text) |
| 19 | 1212434567 | Approximate # of Warhammer items in stock | Multiple choice | 0-20 / 20-50 / 50-100 / 100-200 / 200-500 / 500+ |
| 20 | 1457727863 | [Phase 2] Add social media icons now? | Yes/No | Gate question |
| 21 | 1901313678 | Discord server link / how to join | Short answer | |
| 22 | 864838169 | Facebook link | Short answer | |
| 23 | 1037338558 | Instagram link | Short answer | |
| 24 | 921691492 | X / Twitter link | Short answer | |
| 25 | 1698503128 | Other social media | Short answer | |
| 26 | 920147479 | [Phase 3] Add play space details now? | Yes/No | Gate question |
| 27 | 1002890301 | Do you have tables available for Warhammer games? | Multiple choice | Yes / Yes, but with restrictions / No |
| 28 | 132964555 | Free or cost to use play space? | Free/Cost | |
| 29 | 117437232 | Price if there's a cost | Short answer | |
| 30 | 745734676 | Restrictions, if any | Short answer | |
| 31 | 271259608 | How does someone go about reserving/requesting to use play space? | Short answer | Added in latest form edit |
| 32 | 569376472 | Are you ready to submit this document? | Yes / No, go back and review answers | Leave unprefilled — let respondent confirm naturally |

**General prefill policy:** Only prefill fields we already have verified data for
(currently: store name, address, Google Maps link, discount %,
applies-to-new-releases, applies-to-pre-orders, pre-order instructions).
Everything else (loyalty program, stock detail, social links, play space) is
new data collection — leave blank for the store to fill in.

**Latest full pre-filled link** (placeholder values, used to verify the entry-ID
map above after the address/Maps-link split — every field filled with
"Example"/defaults so each `entry.ID=` pair can be matched to its question):

```
https://docs.google.com/forms/d/e/1FAIpQLSfzAk_VSsmppzKYyV-oZUDAzB17RT8SNli2H_zZDxv-KJRgnQ/viewform?usp=pp_url&entry.571351982=Example&entry.577865459=Example&entry.1052932045=Example&entry.1138144738=Example&entry.1890704744=https://maps.app.goo.gl/Ad5ZSqZCdSCrbJ9a6&entry.1644707819=Yes&entry.1911433926=15&entry.894533038=Yes&entry.1656781913=Yes&entry.1283148159=Example&entry.1395895797=Example&entry.801742604=Example&entry.1061267075=Yes&entry.701562959=Yes&entry.918549052=Example&entry.1759960920=Example&entry.133136499=Yes&entry.1640903097=40k&entry.1640903097=Horus+Heresy+(30k)&entry.1640903097=Age+of+Sigmar&entry.1640903097=Old+World&entry.1640903097=Kill+Team&entry.1640903097=Blood+Bowl&entry.1640903097=Necromunda&entry.1640903097=Legion+Imperials+(Epic+Scale)&entry.1640903097=Black+Library+Novels&entry.1640903097=__other_option__&entry.1640903097.other_option_response=Codexes&entry.1212434567=200+-+500&entry.1457727863=Yes&entry.1901313678=Example&entry.864838169=Example&entry.1037338558=Example&entry.921691492=Example&entry.1698503128=Example&entry.920147479=Yes&entry.1002890301=Yes&entry.132964555=Free&entry.117437232=Example&entry.745734676=Example&entry.271259608=Example&entry.569376472=Yes
```

## 4. Completed example: Hub Hobby (pilot store)

Two locations, same management/contact, sent as **one outreach email** with
**two separate prefilled links** (one per location).

**Known data:**

- Discount: 15% off GW models, applies to new releases and pre-orders
- Pre-order process: Contact Hub Hobby Little Canada (651-490-1675), ask for Kevin (Warhammer ordering manager) on Tuesdays
- Little Canada: 82 Minnesota Ave, Little Canada, MN 55117
- Richfield: 6410 Penn Ave S, Richfield, MN 55423

The original pilot links used the old combined "Address or google maps link"
question (entry.1138144738). That entry ID still exists, so the links won't
error — but that field is now **address-only**, and a separate Maps-link field
(entry.1890704744) was added. Any pilot link that put a Maps URL into
entry.1138144738 should be **regenerated** (Section 2) so the URL lands in the
new Maps-link field instead of the address box. (The full link strings live with
the project's outreach material.)

## 5. Outstanding / next steps

- Roll out the same per-store prefilled-link + email process to the remaining stores.
- Build the separate **new-store signup form** (for stores not yet on the map) — not yet started.
- Re-run the field-mapping process (Section 2) any time the form is edited again, *before* generating new per-store links.

## 6. Source data schema (for reference)

Each store record maps to: `name`, `address`, `lat`/`lng`, `discount`,
`category` (`15`/`10`/`loyalty`/`none`/`unconfirmed`), `newReleases`,
`preorders`, `preorderLinkText`, `preorderUrl`, `website`, `phone`, `mapsUrl`,
`note`. The authoritative field list is in
[`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
