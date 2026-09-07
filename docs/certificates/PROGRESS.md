# Certificate public pages progress

## Supplied font gate - 2026-09-07

EDOS verified that the supplied Playfair Display Bold and Bold Italic files match,
but the files named Garet Regular/Bold are internally Garet Book weight 300 and
Garet Heavy weight 850. No licence files were supplied. No font upload, template
attachment or normal/long review PDF occurred; exact licensed Garet Regular and
Garet Bold remain required. Plus Jakarta Sans and Outfit are not substitutes.

EDOS also implements revision-checked, idempotent editing of draft batch name,
printed programme/course wording and issue date without recreating the batch or
changing its destination, recipients or assets. The synthetic CAD batch was left
without an invented date for the user to complete through that editor.

## Renderer font gate and later EDOS import UX - 2026-09-07

EDOS has verified the current Canva/PDF typography inventory. The complete design
requires licensed Playfair Display Bold, Playfair Display Bold Italic, Garet
Regular and Garet Bold files; no substitutions or embedded PDF subsets are
acceptable. Responsive preview UI evaluation is not certificate approval. Normal
and long-name/programme PDFs using the full fonts still require visual comparison
with the approved design before renderer acceptance.

The deferred EDOS usability milestone is a focused contact-import-style flow:
select cohort/course once, use that table's template, upload, review and save;
shared values use dropdowns, IDs are automatic and sheet columns remain
learner-specific. Creation, import and review must use separate focused routes,
not one crowded page. Renderer acceptance remains first.

## Current: EDOS slice 04 contract synchronized; font handoff pending

Contract `certificates.v1.3` matches EDOS exactly. Website runtime remains unchanged.
EDOS now implements private versioned artwork/font/signature handling, approved
template attachment, the shared DRAFT/future-final renderer and its staff batch
preview UI. Migration114 was applied only to localhost; 54 focused EDOS tests plus
lint/build pass. Reviewed artwork and both authorized signatures exist only in the
authorized development S3 bucket; no font or template was uploaded. No public
verification/retrieval page, production migration, deployment, issue or email
occurred.

Fresh Canva and Print PDF inspection confirmed the approved 3:2 geometry, colors,
font roles, artwork and signatures. Exact full Playfair Display Bold Italic, Garet
Regular and Garet Bold files remain absent; embedded PDF fonts are incomplete
subsets. EDOS therefore fails closed and has not produced normal/long acceptance
PDFs. Next is the font handoff and private synthetic asset setup, then normal/long
DRAFT visual review before website public runtime work.

## Current: import/data-preview checkpoint

Latest user acceptance: all EDOS import UI checks passed. Independent evaluation
remains incomplete. Next is EDOS plan slice04 private assets/sample renderer,
with fresh Canva/screenshot/Print PDF handoff. Authorized signature paths are
recorded privately by location in EDOS DESIGN_HANDOFF.md; no image bytes in Git.

Contract certificates.v1.2 matches EDOS exactly. Compatible EDOS implementation
commit d21b7c7 includes import backend, tests and integrated frontend. Website
runtime is unchanged; public verification/retrieval implementation remains pending.
Preparation screen accepted by user; focused form layouts deferred. EDOS supports
CSV/XLSX templates, validation decisions, transactional upsert and draft recipient
data preview. Existing synthetic CAD rehearsal:8rows/3valid/5invalid;3saved;
reupload1updated/2reused; repeat3reused with no duplicate recipients.
47 focused tests and EDOS lint/build pass, including1,200-row XLSX import.
Full authenticated browser/API import and independent final visual verdict remain
verification gaps (review retries interrupted by limits/infrastructure).
Canva inspection now works:1536x1024 coordinate canvas; actual text/image geometry
recorded in EDOS DESIGN_HANDOFF.md. Need latest screenshot, Print PDF, exact font
styles/files and private authorized signature files before final shared renderer.
No final certificate PDF, real emails, production migration or deployment.

Planning-chat summary: Import/data-preview milestone ready for review, source
contract synchronized. Public runtime and full two-app delivery rehearsal pending.


## Current: EDOS preparation review checkpoint

- Branch/upstream: `feat/certificate-public-pages` / `origin/feat/certificate-public-pages`.
- Contract remains `certificates.v1.1`; website runtime is unchanged.
- Compatible EDOS implementation: `c2f0efdb5dfef0dac4b7b20637021ac6e3bee99f`
  (backend preparation, action editor, guarded LMS navigation and draft setup UI).
- EDOS checks: 35/35 tests; lint/build pass. Synthetic component browser flows
  cover cohort -> course -> draft and permission saving. Mobile selector overflow fixed.
- User visual acceptance of the usable preparation screen remains pending.
  Full authenticated browser/API flow is unverified; real PostgreSQL tests are separate.
- Next: EDOS import/preview milestone, then public verification/retrieval consumers
  and full two-app rehearsal. Final certificate layout requires current Canva link,
  approved screenshot and measured assets; authorized signatures still outstanding.
- No website deployment, production migrations or real mail performed.

Planning-chat handoff: Both feature branches have upstreams; EDOS first usable
preparation screen is ready for user review after own checks. Public contract
unchanged; public runtime pages and two-app integration remain pending.

## Current handoff (supersedes historical notes below)

Branch/upstream: feat/certificate-public-pages / origin/feat/certificate-public-pages.
First push: `67f1ebdf1eaaa54859c09606ac5733b2a2d1df18`.
Contract now `certificates.v1.1`: public fields unchanged; freezes staff cohort,
course and draft-batch setup before UI consumers. Identical EDOS-owned copy.
Compatible EDOS preparation commit: `0226f97030056f6824397823d2bedecf0e7ae25d`
(includes access audit `0aa6072`). EDOS tests: 34/34, including contract parity and isolated
PostgreSQL integrity/concurrency. Only local migration112 applied in EDOS.
Website runtime code remains unchanged; baseline lint/build/SEO passed.
Current milestone: EDOS's first usable LMS preparation screen, not another switch
review. Website verification/retrieval/binary client and two-app runtime rehearsal
remain pending. No production migration, deployment or real mail.

## Historical checkpoints

Updated: 2026-09-06. Branch: `feat/certificate-public-pages`.
Latest commit: `d7e8fa93a16ac30114ff323c6b964f808a7934a4`.
Current handoff: user accepted the EDOS switch review and authorized verified
commits/pushes to both feature branches with upstreams. Previous pending-review
notes below are historical; no further standalone switch review is needed.
Next meaningful milestone is the first usable EDOS LMS Certificates screen.
No main merge, dev changes, deployment or real mail authorized.
Latest commit for this handoff is available via `git log -1 --oneline` after commit.

- Canonical plan 0.4: `C:/Projects/www/edos/docs/certificates/IMPLEMENTATION_PLAN.md`
  on EDOS `feat/lms-certificates`; EDOS owns the API and implementation plan.
- Website reviewed/fetched main: `ab3e93162a9b0d398b023360e67509c5555eb5a6`.
  EDOS reviewed/fetched main: `2109cccdf635df28de0c09895604555239a366f6`.
- Both working trees were clean with no unpushed main commits or requested branch
  collisions. Only main fetched; dev untouched. Created feature branches from
  reviewed origin/main, with no upstream. No push/merge/deployment performed.
- Read README.md, package/lockfile, netlify.toml, actual routing, JSON API client
  and SEO postbuild. No applicable AGENTS.md found in website or ancestor paths.
- Baseline `npm run lint` and `npm run build` passed, including SEO postbuild
  (18 routes plus homepage). Existing dependencies/lockfile retained unchanged.
- Contract: `certificates.v1`; API_CONTRACT.md is an identical EDOS-owned copy.
  This records future endpoints; none are claimed deployed or integrated yet.
- Environment/migrations: none added. Website API base must include `/api/website`.
- Public screens/binary client not started. No visual review due yet.
- Next: consume frozen public fixtures after EDOS access preparation; implement
  verification and retrieval as separate visually reviewed slices, with unavailable
  API handling, direct-route refresh and noindex. No personal sitemap entries.
- Compatible counterpart: EDOS `feat/lms-certificates` at
  `1b094a2dc55189ee68307f0c0659225c7d23737e`, contract `certificates.v1`.
  EDOS's 17 focused tests pass including identical contract copies. These are
  contract/auth tests with synthetic adapters, not complete two-app integration.
- EDOS's first LMS switch visual preview awaits feedback at
  http://127.0.0.1:5186/ (no login; synthetic data only). Startup from EDOS root:
  `node tmp/certificates-preview.mjs`. Select Synthetic Admin, inspect LMS Access,
  toggle with confirmation and review its help text/mobile spacing. UI edits
  remain uncommitted. No website visual slice is ready yet.

Planning-chat handoff: Website feature branch created from current main and
baseline checks pass. Contract v1 is synchronized with EDOS access preparation;
EDOS's first switch preview awaits feedback. Public screens await their own
implementation/visual checkpoints. No production changes or real emails.
