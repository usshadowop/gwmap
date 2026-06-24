# Store Verification Form — field & workflow reference

Self-contained reference for the Google Form used to verify/update existing
store listings, including every question's entry ID, so a fresh session can
generate prefilled per-store links without re-deriving the mapping from scratch.
The automation that consumes this form's submissions lives in
[`../../scripts/apps-script/form-sync.gs`](../../scripts/apps-script/form-sync.gs);
operational notes are in [`form-sync-operations.md`](form-sync-operations.md).

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
| 4 | 1138144738 | Address or google maps link | Short answer | **Prefill** |
| 5 | 1644707819 | Do you offer any innate persistent discounts on all Games Workshop models? | Multiple choice | Yes / Yes with exceptions / We offer store loyalty discounts that include GW models / Other: |
| 6 | 1911433926 | What's % discount? | Short answer | **Prefill** (e.g. "15") |
| 7 | 894533038 | Does this discount apply to new Warhammer releases? | Yes/No | **Prefill** |
| 8 | 1656781913 | Does this discount apply to Warhammer pre-orders? | Yes/No | **Prefill** |
| 9 | 1283148159 | Are any specific Warhammer models/categories excluded from this discount? | Short answer | |
| 10 | 1395895797 | Additional discount details | Short answer | |
| 11 | 801742604 | How does your store loyalty program work? | Short answer | Only relevant if Q5 = loyalty option |
| 12 | 1061267075 | Does the loyalty discount apply to new Warhammer releases? | Yes/No | |
| 13 | 701562959 | Does the loyalty discount apply to Warhammer pre-orders? | Yes / No / We do not take pre-orders | |
| 14 | 918549052 | Explain how your discounts work on GW models (Discount Info – Other) | Short answer | Only relevant if Q5 = Other |
| 15 | 1759960920 | Describe how someone puts in a pre-order at your shop | Paragraph | **Prefill** when known |
| 16 | 133136499 | Would you like to provide some information on your Warhammer inventory? | Yes/No | Gate question for stock section |
| 17 | 1640903097 | Which Warhammer products do you carry? | Checkbox (multi) | 40k, Horus Heresy (30k), Age of Sigmar, Old World, Kill Team, Blood Bowl, Necromunda, Legion Imperials (Epic Scale), Black Library Novels, Other: (free text) |
| 18 | 1212434567 | Approximate # of Warhammer items in stock | Multiple choice | 0-20 / 20-50 / 50-100 / 100-200 / 200-500 / 500+ |
| 19 | 1457727863 | [Phase 2] Add social media icons now? | Yes/No | Gate question |
| 20 | 1901313678 | Discord server link / how to join | Short answer | |
| 21 | 864838169 | Facebook link | Short answer | |
| 22 | 1037338558 | Instagram link | Short answer | |
| 23 | 921691492 | X / Twitter link | Short answer | |
| 24 | 1698503128 | Other social media | Short answer | |
| 25 | 920147479 | [Phase 3] Add play space details now? | Yes/No | Gate question |
| 26 | 1002890301 | Do you have tables available for Warhammer games? | Multiple choice | Yes / Yes, but with restrictions / No |
| 27 | 132964555 | Free or cost to use play space? | Free/Cost | |
| 28 | 117437232 | Price if there's a cost | Short answer | |
| 29 | 745734676 | Restrictions, if any | Short answer | |
| 30 | 271259608 | How does someone go about reserving/requesting to use play space? | Short answer | Added in latest form edit |
| 31 | 569376472 | Are you ready to submit this document? | Yes / No, go back and review answers | Leave unprefilled — let respondent confirm naturally |

**General prefill policy:** Only prefill fields we already have verified data for
(currently: store name, address, discount %, applies-to-new-releases,
applies-to-pre-orders, pre-order instructions). Everything else (loyalty
program, stock detail, social links, play space) is new data collection — leave
blank for the store to fill in.

## 4. Completed example: Hub Hobby (pilot store)

Two locations, same management/contact, sent as **one outreach email** with
**two separate prefilled links** (one address field per submission).

**Known data:**

- Discount: 15% off GW models, applies to new releases and pre-orders
- Pre-order process: Contact Hub Hobby Little Canada (651-490-1675), ask for Kevin (Warhammer ordering manager) on Tuesdays
- Little Canada: 82 Minnesota Ave, Little Canada, MN 55117
- Richfield: 6410 Penn Ave S, Richfield, MN 55423

These prefilled links remain valid after the latest form edit since none of the
entry IDs they use were changed — only new, unrelated fields were added. (The
full link strings live with the project's outreach material; regenerate via
Section 2 if the form is edited again.)

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
