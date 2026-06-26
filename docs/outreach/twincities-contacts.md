# Twin Cities — store contact emails (for outreach)

Contact emails for every store in [`data/twincities.json`](../../data/twincities.json),
gathered for the verification-email outreach (per
[`docs/handoff.md`](../handoff.md) "Next up" #1 and the
[outreach email template](../form/outreach-email-template.md)).

**Method:** web search + direct fetch of each store's own contact page. Per the
repo rule "verify, don't trust search-summary claims," an email is marked
**confirmed** only when it was read off the store's *own* website (contact page
or footer). **search-only** means it appeared in a web-search summary but the
store's own page couldn't be fetched to confirm it (treat as a lead, not a
fact). **none found** means no public email exists / only a contact form, phone,
or social DM is offered — use the phone number or social channel instead.

_Last gathered: 2026-06-26_

## Confirmed (read off the store's own site)

| Store | Email | Source |
|---|---|---|
| Dumpster Cat Games (Minneapolis) | `dumpstercatgames@gmail.com` | [contact page](https://www.dumpstercatgames.com/pages/contact-us) |
| Source Comics & Games (Roseville) | `source@sourcecomicsandgames.com` | [contact page](https://sourcecomicsandgames.com/pages/contact-hours-policies) |
| The Forge (Chaska) | `theforgemn@gmail.com` | [site](https://www.theforgemn.com/) |
| Dreamers Vault Games — **all 6 MN locations** (Eden Prairie, Burnsville, Champlin, Minneapolis, Roseville, St. Louis Park, South St. Paul) | `info@dreamersvault.com` | [contact page](https://www.dreamersvault.com/ContactUs) |
| Tower Games — **both** (Minneapolis + Bloomington) | `info@towergamesmn.com` | [contact page](https://www.towergamesmn.com/contact) |
| Battlegrounds Cafe (White Bear Lake) | `info@thebattlegroundcafe.com` | [contact page](https://www.thebattlegroundcafe.com/contact) |
| Fox Den Board Game Cafe (Burnsville) | `Questions@foxdenbgc.com` | [contact page](https://www.foxdenbgc.com/contact) |
| VB Games and More (Northfield) | `Vbgamesandmore@gmail.com` | [contact page](https://vbgamesandmore.com/contact-us) |
| Dubois Station LLC (Princeton) | `Glitter@duboisstation.com` | [site](https://duboisstation.com/) |
| All Systems Go Games (Minneapolis) | `asgnempls@gmail.com` | [contact page](https://allsystemsgo.games/pages/contact) |

> Note: Dreamers Vault has a second address, `service@lotusvault.com`, but that's
> for their **online** store (Lotus Vault) only — use `info@dreamersvault.com`
> for the brick-and-mortar locations.

## Search-only leads (not verified on the store's own page — confirm before relying)

| Store | Email | Why unconfirmed |
|---|---|---|
| Hub Hobby — Richfield & Little Canada | `info@hubhobby.com` | Appeared in two web searches; the email on hubhobby.com is Cloudflare-obfuscated so it couldn't be read literally. Same email likely serves both locations (also try ordering manager **Kevin** at Little Canada, 651-490-1675). |
| Gamezenter (Roseville) | `contact@gamezenter.com` | Site contact page returned HTTP 429; email is from search summary and matches the site's domain. |
| Steamship Games (Minneapolis) | `steamshipgames@gmail.com` | Search summary only; store also reachable at (612) 825-4066. |
| Games By James (Mall of America) | `info@GamesByJames.com` | Search summary only. |
| Sliver King Games (Hastings) | `sliverkinggamesllc@gmail.com` | Search summary only. |
| Mystic Fortress Games (Waconia) | `info@mysticfortressgames.com` | Search summary; the store's own site shows only a contact form + phone (952-442-2930). |
| Midwest Jedi (River Falls, WI) | `jedi@midwestjedi.com` | Search summary; midwestjedi.com returned HTTP 503. |
| Galaxy Games (Eagan) | `john@galaxygamesmn.com` | Appeared in two searches but the store has no confirmed standalone website (Facebook-only), so treat with caution. Phone (651) 797-2670. |
| JK's Cards and Collectibles (Farmington) | `jk@jkcollecting.com` | Search summary; the store's own [contact page](https://jkcollecting.com/contact/) lists only phone (651-324-8680), no email. Phone is the safer route. |

## No public email found — use phone or social

| Store | Best contact | Notes |
|---|---|---|
| Scale Model Supplies (St Paul) | Phone (651) 646-7781 | Own site explicitly says phone-during-hours is the best way; no email published. |
| Brickmania (Minneapolis) | [Contact form](https://www.brickmania.com/contact/) / (612) 545-5263 | Site routes email through a form; no address published. |
| Lewis Game Shop (Monticello) | [Contact form](https://www.lewisgameshop.com/contact) / (763) 200-4308 | Form-only; no email published. |
| The Mana Dojo (Burnsville) | [Facebook](https://www.facebook.com/p/The-Mana-Dojo-61586445781964/) / Burnsville Center mall | New shop (opened 2026); no email found. |
| Level Up Games — Minneapolis, St. Paul, Hastings | Phone per location (MPLS 612-315-3945, St Paul 651-528-8681, Hastings 651-346-1631) | No email surfaced; [levelupshoponline.com](https://www.levelupshoponline.com/) has no contact email page. Also [@levelupmpls on FB](https://www.facebook.com/levelupmpls/). |
| Phoenix Games (Fridley) | (763) 315-3821 / [Facebook](https://www.facebook.com/p/Phoenix-Games-100057504457911/) | No email found. |
| Rockhopper Comics (New Hope) | (763) 710-4683 / [Facebook](https://www.facebook.com/rockhoppercomicsandgames/) | No email found. |
| Midtown Hobby Shop and Gaming (Anoka) | [Facebook](https://www.facebook.com/998854583314572) | Too small to be indexed; FB only. |
| Story Arc Comics & Collectibles (Savage) | [Facebook](https://www.facebook.com/p/Story-Arc-Comics-Collectibles-61569494378068/) / [Instagram @storyarcmn](https://www.instagram.com/storyarcmn/) / (952) 882-7282 | Email redacted in directories; reach via social. |
| Top Level Wargames LLC (Woodbury) | [Facebook](https://www.facebook.com/people/Top-Level-Wargames/61581800336873/) / Discord (linked on [site](https://www.toplevelwargames.com/)) | Site has no email; uses Discord/FB. |
| BigBadGameStore LLC (Oak Park Heights) | [Facebook](https://www.facebook.com/BigBadGameStore) / (651) 472-5940 | Run by BigBadToyStore; their store page blocks fetch (403). Try BigBadToyStore customer service if no store reply. |
| The Gamers Den (Cambridge) | [Contact form](https://thegamersden.com/pages/contact) / (763) 689-5370 | Shopify store, contact form; page rate-limited (429) on fetch, no email surfaced. |
| Game Quest (River Falls, WI) | [Facebook](https://www.facebook.com/gamequestgamingriverfalls/) / Discord / (715) 426-7725 | Square-site store, no email published. |

## Excluded (Games Workshop corporate stores — no owner outreach)

These two are GW-owned retail stores, not independent stockists, so the
verification-email outreach doesn't apply:

- **Games Workshop: Fountain Place** (Eden Prairie)
- **Warhammer Saint Anthony** (Saint Anthony)
