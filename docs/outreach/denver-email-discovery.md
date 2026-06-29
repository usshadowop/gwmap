# Denver outreach — email discovery + draft-generation handoff

Two-step kickoff for Denver outreach, split so the **token-heavy web searching**
runs in **Gemini** and the **draft generation** runs in **Claude (this repo)**:

1. **Gemini** takes the store list below and finds each shop's public contact
   email (lots of web searches — let Gemini's budget absorb that).
2. **Claude** takes Gemini's results and drafts the first-contact "hello" emails
   as Gmail drafts, updates `data/denver.json`, and ships the change.

Targets are the **25 independent Denver-metro shops** (all `category: unconfirmed`).
The two official `Warhammer -` stores in `data/denver.json` are Games Workshop
company-owned — **no outreach**, skip them.

---

## Step 1 — Prompt to paste into Gemini (email discovery)

```text
You are compiling public business contact emails for a free, fan-run directory of
hobby stores (warhammerdiscounts.com). Below are 25 game/hobby shops in the
Denver, Colorado metro. For EACH store, use web search to find the best PUBLIC
contact email address.

Rules:
- Prefer the store's OWN website (contact/about page, footer). A general store
  inbox (info@, contact@, hello@, sales@) is fine; a clearly-public owner email is
  even better.
- Only report an email you actually SEE on a real page. Do NOT guess, infer, or
  pattern-match an address — never fabricate "info@<their-domain>" unless you
  literally see it written somewhere. If you can't find one, say so.
- Cite the exact source URL where you found each email.
- Rate confidence: "site-verified" (on the store's own website), "directory"
  (Yelp / Facebook / Google Business / other directory), or "none" (not found).
- If there's no email, give the best alternative in notes: the store's
  contact-page URL and/or phone number.
- Flag chains / shared inboxes: if several of these locations look like they share
  one corporate inbox (e.g. the Colpar's HobbyTown locations), say so — one email
  may cover several stores.

Output ONLY a JSON array, one object per store, exactly this shape:
[
  {"store":"<name exactly as given>","email":"<address or empty string>","source":"<url or empty>","confidence":"site-verified|directory|none","notes":"<shared inbox? phone? contact-form url? anything useful>"}
]

The 25 stores (name — address — website if known):
1. The Wizard's Chest — 451 Broadway, Denver, CO 80203 — wizardschest.com
2. Timbuk Toys — 2526 S Colorado Blvd, Denver, CO 80222
3. Denver Central Games — 10101 E Hampden Ave, Denver, CO 80231
4. Total Escape Games — 6831 W 120th Ave Ste C, Broomfield, CO 80020
5. Gamers Guild — 4550 Broadway St Unit C-3A, Boulder, CO 80304 — gamersguildboulder.com
6. Bits & Bobs Toy Shop — 829 Main St Unit 7, Longmont, CO 80501 — bitsandbobstoyshop.com
7. Atomic Goblin Games — 1515 Main St, Longmont, CO 80501 — atomicgoblingames.com
8. Heart of Gold Games — 950 Elgin Ave Unit C, Longmont, CO 80501
9. Twist & Shout Records — 2508 E Colfax Ave, Denver, CO 80206
10. Bad Habit Hobbies — 7354 Washington St, Denver, CO 80229
11. Colpar's HobbyTown — 3355 South Wadsworth Blvd Unit G115, Lakewood, CO 80227
12. Colpar's HobbyTown — 1915 S Havana Street, Aurora, CO 80014
13. Colpar HobbyTown - Littleton — 7981 S Broadway, Littleton, CO 80122
14. Atomic Games West — 1921 Youngfield St, Golden, CO 80401
15. PlayForge — 2420 W Main St, Littleton, CO 80120
16. Coffee Cat Comics — 14500 W Colfax Ave Unit 310, Lakewood, CO 80401
17. HobbyTown USA - Westminster — 9120 Wadsworth Pkwy, Westminster, CO 80021
18. Crit Castle Games — 414 S Chambers Rd, Aurora, CO 80017
19. Advantage Games — 1010 W 104th Ave, Northglenn, CO 80234
20. Mythic Games — 8966 W Bowles Ave, Littleton, CO 80123
21. Mind Goblin Games — 22954 E Smoky Hill Rd, Aurora, CO 80016
22. Do Gooder Games Cafe — 16639 Washington St, Thornton, CO 80023
23. Collectormania (Gamers Quest) — 19555 E Parker Sq, Parker, CO 80134 — collectormaniaparker.com
24. Newcastle Comics — 508 5th Ave, Longmont, CO 80501 — newcastlecomics.com
25. Retro Gaming of Denver — 4149 Gibraltar St, Denver, CO 80249 — retrogamingofdenver.com
```

---

## Step 2 — Handoff to paste into Claude (draft generation)

Paste this into a new Claude Code session on the `gwmap` repo, with Gemini's JSON
pasted where indicated.

```text
We're generating the FIRST WAVE of Denver outreach for gwmap. Below is a list of
Denver hobby stores with public contact emails found in a separate web-search
pass. Generate the first-contact "hello" intro emails.

Your task:
1. For each Denver store with a usable email, draft a first-contact "hello" email
   using docs/form/outreach-email-intro-template.md (trust-first: no form, no
   button). Fill {Store Name}, the greeting ("{Store} team" if no owner name), and
   the city link → https://warhammerdiscounts.com/location/denver/ anchored as
   "Denver, CO". Keep the sign-off Jon@warhammerstores.com.
2. Create ONE Gmail draft per store via the Gmail create_draft tool (htmlBody =
   rendered template). DRAFTS ONLY — never send.
   - Chains sharing one inbox (e.g. the Colpar's HobbyTown locations): send a
     single intro email to the shared inbox, naming the locations.
   - Skip the two official "Warhammer -" stores (GW company-owned).
   - Skip any store Gemini returned with no email (list them for a later pass).
3. Append `Intro email sent on <YYYY-MM-DD>` to each emailed store's `note` in
   data/denver.json (keep the full unified schema), and record the contacts in
   docs/outreach/denver-contacts.md (email + source URL + site-verified/directory).
4. Ship data/denver.json + denver-contacts.md via branch → PR → squash-merge
   (node scripts/validate-stores.js must pass; no [skip ci]).
5. Report: drafts created, stores with no email (need another pass), chains bundled.

This is WAVE 1 (intro "hello"). WAVE 2 — the unconfirmed verification email
(docs/form/outreach-email-unconfirmed-template.md, "Confirm Your Listing" button)
— follows once owners reply confirming the channel.

Emails found (Gemini JSON):
<paste Gemini's JSON array here>
```

---

## Notes

- **Why intro-first:** these 25 stores have never been contacted; the intro
  "hello" is the trust-first first touch (no form/button → doesn't read as
  phishing). The listing is fan-sourced and stays regardless — the email just
  invites the owner to keep it accurate (no opt-out).
- **Chains to watch:** Colpar's HobbyTown appears 3× (Lakewood, Aurora, Littleton)
  and there's a separate HobbyTown USA – Westminster; Gemini should flag whether
  any share an inbox so they get one bundled email.
- After wave 1, regenerate this file's targets from `data/denver.json` if the
  store set changes.
