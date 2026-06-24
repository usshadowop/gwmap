# Form-sync — operations & gotchas

How the Google Form → `data/twincities.json` automation actually runs, and the
non-obvious traps. The code is [`../../scripts/apps-script/form-sync.gs`](../../scripts/apps-script/form-sync.gs);
the form's field map is [`form-reference.md`](form-reference.md).

## The pipeline

```
store owner submits Google Form
  → onFormSubmit (Apps Script) builds one store entry from the responses
  → writes to a NEW branch and opens a Pull Request (never commits to main)
  → CI `validate` check runs on the data file
  → maintainer reviews + merges the PR
  → push to main triggers the GitHub Pages deploy workflow
  → site updates in ~1–2 minutes
```

This is **PR-based, not direct-commit-to-main** — chosen to avoid stale-snapshot
clobber, concurrency 409s, and cache-expiry issues; it gains real
diff/history/validation.

## One-time setup (all done by the maintainer)

- A fine-grained GitHub PAT (this repo only, Contents R/W + Pull requests R/W) is stored as the `GITHUB_TOKEN` **Script Property** — never hardcoded in the file.
- `form-sync.gs` is pasted into the Apps Script project.
- An **on-form-submit** trigger is added.
- Branch protection on `main` requires the `validate` status check (admin bypass left ON).
- *(Optional)* the one-click "Approve & merge" email button needs the script deployed as a Web App (Execute as: Me, Access: Anyone) with the `/exec` URL pasted into `WEB_APP_URL`.

## Gotchas (the important ones)

- **The Apps Script copy is MANUAL.** The repo's `form-sync.gs` is source of truth, but edits only take effect after the maintainer **re-pastes** it into the Apps Script editor. Triggers run the latest *saved* code; the Web App `/exec` (doGet) runs the *deployed* version — so if `doGet` changes you must **deploy a new version** (editing code alone doesn't update an existing deployment).
- **Category derivation.** `deriveCategory_` snaps an off-grid discount % to the nearest tier: midpoint 12.5 → `15`, else `10`. The exact % is preserved in the discount text, and the PR/email note the snap.
- **Update merge preserves 6 never-collected fields.** On an UPDATE to an existing store, `lat`, `lng`, `website`, `phone`, `preorderUrl`, and `note` are preserved so a re-submission can't wipe the map pin / contact info. Blank answers *do* still clear other collected text fields — that was the deliberate choice ("keep coords only, overwrite rest").
- **Failures are silent-green.** On a GitHub-API error the code mostly does `console.error(...); return;`, so the run shows as "Completed" (not "Failed") in the Executions dashboard. The only safety net is the trigger's built-in failure email **if enabled** — worth enabling.
- **`validate.yml` is path-filtered** to `data/**.json` / the validate script / the workflow file. Non-data PRs (docs, `js/app.js`, the Apps Script itself) do **not** trigger it, so the merge button shows "waiting for status" on them. Admin/API merge bypasses this. If a non-data PR ever gets stuck, make the workflow always run and path-filter inside the job (or add a tiny always-pass job).
- **Never add `[skip ci]`** to commits/merges — merging the PR is what triggers the deploy.

## Apps Script housekeeping checklist

When working in the Apps Script project:

- Confirm any old/duplicate script is fully removed (no duplicate `onFormSubmit`/helpers → "redeclaration" errors).
- Confirm **exactly one** form-submit trigger (duplicates = double PRs/emails).
- Optionally enable the trigger's "Notify me immediately" failure email.
- Remove any temporary `testConnection()` / debug helpers.

## Open item

- **First real end-to-end test submission still recommended.** The field mapping keys off the EXACT question titles in the form, so it warrants a live pass: submit once through each Q5 branch (15%, 10%, an off-grid % like 20 to confirm the snap to `15`, loyalty, and none) and confirm each opens a PR with the correct derived `category`, Yes/No booleans, and the address-vs-`mapsUrl` split.
