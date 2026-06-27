# Twin Cities — store contact emails (for outreach)

Contact emails for every store in [`data/twincities.json`](../../data/twincities.json),
gathered for the verification-email outreach (per
[`docs/handoff.md`](../handoff.md) "Next up" #1 and the
[outreach email template](../form/outreach-email-template.md)).

**Method:** web search + direct fetch of each store's own contact page. Per the
repo rule "verify, don't trust search-summary claims," an email was marked
*site-verified* only when read off the store's own website. Entries the
maintainer reviewed and approved (without a site fetch) are marked
*maintainer-approved*. Stores with no email use phone / social instead.

_Last gathered: 2026-06-26 · last reviewed: 2026-06-26 · drafts created: 2026-06-27_

> **Outreach status (2026-06-27):** Gmail drafts created for every approved
> contact below — 15 single-store emails + 3 multi-store chain emails (Dreamers
> Vault ×7, Tower Games ×2, Hub Hobby ×2), covering 26 stores. Drafts only;
> reviewed/sent manually. The no-email stores (#10–22) were exported to
> [`twincities-no-email-stores.csv`](twincities-no-email-stores.csv) for an
> email-research pass.

## Approved — ready for outreach

| Store | Email | Source |
|---|---|---|
| Dumpster Cat Games (Minneapolis) | `dumpstercatgames@gmail.com` | site-verified ([contact](https://www.dumpstercatgames.com/pages/contact-us)) |
| Source Comics & Games (Roseville) | `source@sourcecomicsandgames.com` | site-verified ([contact](https://sourcecomicsandgames.com/pages/contact-hours-policies)) |
| The Forge (Chaska) | `theforgemn@gmail.com` | site-verified ([site](https://www.theforgemn.com/)) |
| Dreamers Vault Games — **all 6 MN locations** (Eden Prairie, Burnsville, Champlin, Minneapolis, Roseville, St. Louis Park, South St. Paul) | `info@dreamersvault.com` | site-verified ([contact](https://www.dreamersvault.com/ContactUs)) |
| Tower Games — **both** (Minneapolis + Bloomington) | `info@towergamesmn.com` | site-verified ([contact](https://www.towergamesmn.com/contact)) |
| Battlegrounds Cafe (White Bear Lake) | `info@thebattlegroundcafe.com` | site-verified ([contact](https://www.thebattlegroundcafe.com/contact)) |
| Fox Den Board Game Cafe (Burnsville) | `Questions@foxdenbgc.com` | site-verified ([contact](https://www.foxdenbgc.com/contact)) |
| VB Games and More (Northfield) | `Vbgamesandmore@gmail.com` | site-verified ([contact](https://vbgamesandmore.com/contact-us)) |
| Dubois Station LLC (Princeton) | `Glitter@duboisstation.com` | site-verified ([site](https://duboisstation.com/)) |
| Hub Hobby — Richfield & Little Canada | `kevin@hubhobby.com` | maintainer-approved (Kevin is the Warhammer contact for the store) |
| Gamezenter (Roseville) | `contact@gamezenter.com` | maintainer-approved |
| Steamship Games (Minneapolis) | `steamshipgames@gmail.com` | maintainer-approved |
| Sliver King Games (Hastings) | `sliverkinggamesllc@gmail.com` | maintainer-approved |
| Mystic Fortress Games (Waconia) | `info@mysticfortressgames.com` | maintainer-approved |
| Midwest Jedi (River Falls, WI) | `jedi@midwestjedi.com` | maintainer-approved |
| Galaxy Games (Eagan) | `john@galaxygamesmn.com` | maintainer-approved |
| JK's Cards and Collectibles (Farmington) | `jk@jkcollecting.com` | maintainer-approved |
| Scale Model Supplies (St Paul) | `scalemodelsupplies@comcast.net` | maintainer-provided (2026-06-27) |
| Brickmania (Minneapolis) | `ghq@brickmania.com` | maintainer-provided (2026-06-27) |
| The Mana Dojo (Burnsville) | `peter.y@altdigitaldesigns.com` | maintainer-provided (2026-06-27) |
| Phoenix Games (Fridley) | `contact@phoenixgamesonline.com` | maintainer-provided (2026-06-27) |
| Midtown Hobby Shop and Gaming (Anoka) | `genty@midtownhobby.com` | maintainer-provided (2026-06-27) |
| Level Up Games — **all 3** (Minneapolis, St. Paul, Hastings) | `drive@levelupmn.com` | maintainer-provided (2026-06-27) |
| Story Arc Comics & Collectibles (Savage) | `lee.amrine@storyarccomics.com` | maintainer-provided (2026-06-27) |
| Top Level Wargames LLC (Woodbury) | `ethan@toplevelwargames.com` | maintainer-provided (2026-06-27) |
| BigBadGameStore, LLC (Oak Park Heights) | `service@bigbadtoystore.com` | maintainer-provided (2026-06-27) |
| The Gamers Den (Cambridge) | `info@gamersden.net` | maintainer-provided (2026-06-27) |
| Game Quest (River Falls, WI) | `gamequestgaming@hotmail.com` | maintainer-provided (2026-06-27) |

> Note: Dreamers Vault has a second address, `service@lotusvault.com`, but that's
> for their **online** store (Lotus Vault) only — use `info@dreamersvault.com`
> for the brick-and-mortar locations.

## Further research required (before outreach)

_None outstanding._ (Games By James was resolved by a 2026-06-27 phone call —
confirmed Warhammer stockist, no discount; see below.)

## No public email found

Only a phone, contact form, or social channel. `CSV #` matches
[`twincities-no-email-stores.csv`](twincities-no-email-stores.csv). "Checked"
means a research pass confirmed no public email; "pending" = not yet researched.

| CSV # | Store | Best contact | Status |
|---|---|---|---|
| 3 | Lewis Game Shop (Monticello) | [Contact form](https://www.lewisgameshop.com/contact) / (763) 200-4308 | phone-confirmed 2026-06-27 — carries Warhammer, no discount (~100 units); category `none`, now confirmed |
| 9 | Rockhopper Comics (New Hope) | (763) 710-4683 / [Facebook](https://www.facebook.com/rockhoppercomicsandgames/) | checked 2026-06-27 — phone only |
| — | Games By James (Mall of America) | (952) 854-4747 | checked 2026-06-27 — phone-confirmed, no email; carries Warhammer + store loyalty program → category `loyalty`, now confirmed |

## Excluded (Games Workshop corporate stores — no owner outreach)

These two are GW-owned retail stores, not independent stockists, so the
verification-email outreach doesn't apply:

- **Games Workshop: Fountain Place** (Eden Prairie)
- **Warhammer Saint Anthony** (Saint Anthony)
