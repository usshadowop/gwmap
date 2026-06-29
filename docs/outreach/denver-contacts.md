# Denver — store contact emails (for outreach)

Wave 1 (first-contact "hello" intro) contact list for the 25 independent
Denver-metro shops in `data/denver.json`. Emails were gathered in a separate
web-search pass (Gemini), per the two-step flow in
[`denver-email-discovery.md`](denver-email-discovery.md). Per
[`CLAUDE.md`](../../CLAUDE.md), "site-verified" means the address was seen on the
store's own website; "directory" means it came from Facebook / a business
directory and is not first-party-confirmed.

_Last gathered: 2026-06-29._

## Emailed — intro "hello" drafts created 2026-06-29

One Gmail draft per inbox using
[`../form/outreach-email-intro-template.md`](../form/outreach-email-intro-template.md)
(trust-first: no form, no button). DRAFTS ONLY — the maintainer reviews and sends
manually. `Intro email sent on 2026-06-29.` appended to each store's `note` in
`data/denver.json`. All are `category: unconfirmed`.

| Store | Email | Source | Confidence |
|---|---|---|---|
| The Wizard's Chest | `thewizard@thewizardschest.com` | wizardschest.com/store-information/ | site-verified |
| Timbuk Toys | `Customerservice@timbuktoys.com` | timbuktoys.com/pages/contact-us-we-re-here-to-help | site-verified |
| Denver Central Games | `denvercentralgames@gmail.com` | denvercentralgames.com/contact | site-verified |
| Total Escape Games | `store@totalescapegames.com` | totalescapegames.com/about/quick-links/ | site-verified |
| Gamers Guild | `gamersguildboulder@gmail.com` | facebook.com/GamersGuildBoulder/about/ | directory |
| Bits & Bobs Toy Shop | `bitsandbobstoyshop@gmail.com` | facebook.com/p/Bits-Bobs-Toy-Shop-100083113110543/ | directory |
| Atomic Goblin Games | `info@atomicgoblingames.com` | atomicgoblingames.com/boulder-longmont-games-contact | site-verified |
| Heart of Gold Games | `heartofgoldgameslongmont@gmail.com` | facebook.com/HeartOfGoldGames/ | directory |
| PlayForge | `info@playforgegames.com` | facebook.com/PlayForgeGames/ | directory |
| Coffee Cat Comics | `contact@coffeecatcomics.com` | coffeecatcomics.com/pages/contact-us | site-verified |
| Crit Castle Games | `critcastle@gmail.com` | facebook.com/CritCastleGames/ | directory |
| Mind Goblin Games | `mindgoblingames@outlook.com` | facebook.com/MindGoblinGames/ | directory |
| Newcastle Comics | `locohelp@newcastlecomics.com` | downtownlongmont.com/go/new-castle-comics | directory |
| Retro Gaming of Denver | `onlineorders@retrogamingofdenver.com` | retrogamingofdenver.com (via Trustpilot listing) | directory |

### Chain — one inbox, one bundled email (covers 3 listings)

`colparshtu@gmail.com` (**site-verified**, colparshobbytown.com/contact) is the
shared inbox for all three Colpar's HobbyTown locations. One intro draft was sent
naming all three; each location's `note` is still marked individually.

| Store (listing) | Phone |
|---|---|
| Colpar's HobbyTown — Lakewood | (303) 988-5157 |
| Colpar's HobbyTown — Aurora | (303) 341-0414 |
| Colpar HobbyTown - Littleton | (720) 459-7387 |

So **17 stores** were contacted via **15 drafts** (14 single + 1 bundled Colpar's).

## No email found — need a later pass (phone / form / social only)

Gemini returned no usable public email for these 8. Not emailed this wave; best
alternative contact noted. They stay `category: unconfirmed` and listed.

| Store | Best contact |
|---|---|
| Twist & Shout Records | (303) 722-1943 · contact form at twistandshout.com/contact |
| Bad Habit Hobbies | TCGPlayer store — uses TCGPlayer's internal contact system |
| Atomic Games West | No email or contact channel surfaced |
| HobbyTown USA - Westminster | (303) 431-0482 |
| Advantage Games | (720) 598-6812 · partial unverified email (`brosephur23@…`) seen on a directory, not confirmed |
| Mythic Games | (720) 304-5819 |
| Do Gooder Games Cafe | No public email (newsletter signup only) |
| Collectormania (Gamers Quest) | (303) 766-3530 |

## Excluded (Games Workshop corporate — no owner outreach)

- **Warhammer - Square One Denver** (1112 S Colorado Blvd, Glendale) — GW-owned.
- **Warhammer - Boulder** (4800 Baseline Rd, Boulder) — GW-owned.

---
**Next:** maintainer reviews/sends the 15 intro drafts (10–20/day). When an owner
replies confirming the channel, follow up with the
[`unconfirmed` verification template](../form/outreach-email-unconfirmed-template.md)
("Confirm Your Listing" button) and swap the `Intro email sent` marker for
`Store email confirmation sent on <date>`. For the 8 no-email stores, a deeper
contact-finding pass (or phone outreach) is needed if email is wanted.
