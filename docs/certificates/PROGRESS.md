# Certificate public pages progress

## Verification page refinements after design review

Two reviews of the verified state were accepted and applied.

The valid-state heading is now "Certificate verified", and the recipient's name
leads the card directly beneath it at display size rather than sitting as one row
among the details, so the answer the visitor came for is the first thing they read.
The name is no longer repeated in the details table. "Check that these details
match the certificate you were shown." was added, and is deliberately scoped to the
valid state only — for a revoked or superseded award, matching details is not the
point being made, and those states keep their own distinct headings and bodies.

The certificate ID gains a copy button with a two-second "Copied" confirmation and
an `aria-live` announcement. `navigator.clipboard` is undefined outside a secure
context, which includes the plain-HTTP LAN address used for phone testing, so it
falls back to a throwaway textarea rather than leaving the button silently dead
there. The ID row is stacked at every width because the two-column layout leaves
its value about 330px, which a 32-character ID and its button cannot share without
wrapping awkwardly; the ID itself uses `break-all` so it wraps inside a narrow
phone column instead of forcing the card to scroll sideways.

Two review points were declined rather than applied, and the reviewers agreed:

- No logo was added inside the card. The site header and its ERA AXIS logo already
  sit above this page, which is the intended brand anchor; a second logo inside the
  card would duplicate it. Note that the brand has two variants, `logo.webp` for
  light backgrounds (used by the header) and `logo-white.webp` for dark ones (used
  by the footer), so any future in-card mark must use the white variant.
- No public "View/Download certificate" action was added. Retrieval is deliberately
  gated behind email, a one-time code and a short-lived scoped grant, so a public ID
  alone cannot pull a named person's document; a public download would also hand out
  clean forgery source material. There is no stored PDF to serve yet either. This
  belongs to the private retrieval milestone, not to public verification.

Verified at 1440x900 and 390x844: the ID and copy button sit inline on desktop and
stack on mobile with no horizontal overflow, the name wraps cleanly across two
lines, copying reports "Copied" and reverts after two seconds, and the revoked,
superseded and not-found states keep their own wording without the compare line.
Lint and build pass.


## LAN exposure for phone testing

The dev server now sets `host: true` alongside its pinned strict port 5174, so a
phone on the same network can open the site and scan a certificate QR end to end.

`VITE_API_URL` changed from the absolute `http://localhost:5000/api/website` to the
relative `/api/website`. A phone resolves `localhost` to itself, so the absolute URL
could never work off-machine; the relative path goes through the Vite dev proxy on
whatever origin the device used, which also makes the request same-origin and takes
CORS out of the path. The proxy target stays `localhost:5000` because the proxy runs
on the development machine. Netlify supplies the absolute production API URL, which
overrides this, so production is unaffected.

Verified over the LAN address: the page renders, the proxied API call returns the
record, and `noindex` is present. Lint and build pass. A real phone-width render has
not been confirmed from this environment.


## Public certificate verification page - implemented

`/certificates/verify/:publicId` is live in this repository and reads the real
EDOS endpoint `GET /api/website/certificates/:publicId`. It renders five states:
verified, revoked, superseded, not found, and unavailable.

Each status gets its own heading and explanation rather than one "verified" badge
with a qualifier, because they are different answers to "can I rely on this?".
Two safety properties drive the copy:

- A lookup that fails for any reason other than a 404 renders **unavailable**,
  never "invalid", and says so explicitly: an outage must never tell someone their
  genuine certificate is fake. A **Try again** action re-runs the lookup in place.
- The not-found copy does not accuse. A mistyped or truncated ID reaches the same
  state as a fabricated one, so it asks the visitor to re-check the ID or rescan.

Malformed IDs are rejected client-side by the same 32-lowercase-hex rule the API
uses, so an obviously broken link never becomes a request. The page carries
`noindex, nofollow, noarchive` through a new `noindex` prop on the shared `SEO`
component, which removes the tag again on the way out so ordinary pages stay
indexable. It is deliberately absent from the sitemap and from the prerender pass
(the prerender still writes 18 routes), and no personal data is prerendered.

The dev server is now pinned to port 5174 with `strictPort`, because a certificate
QR code encodes exactly one URL and Vite's silent port fallback was making locally
generated QR codes point at a port nothing was serving.

Verified in a local browser against real seeded records: verified, revoked,
superseded and not-found each render their own state; the `robots` tag is present
on all of them and absent on the home page; blocking the API produces the
unavailable state with its reassurance text, and **Try again** recovers to the
verified state without a page reload. Lint and build pass in this repository.

Not built yet: private retrieval (`/certificates/retrieve`, request-access,
verify-access, download). Certificate issuance does not exist in EDOS either, so
the records this page reads are local synthetic awards marked `synthetic = true`.

## EDOS focused preparation routes - authenticated QA complete

The first EDOS usability-refinement slice now separates certificate overview,
new-draft, batch-detail, edit-detail, and import tasks into focused protected
routes without changing the accepted import protocol. EDOS lint/build and 24
certificate tests pass, and independent source evaluation passed after
reconnect, navigation-guard, and full-view-state corrections. Authenticated local
browser QA then covered the focused views at 1440px and 390px, import validation,
Back/Forward discard guards, and offline/reconnect preservation without saving
batch or recipient changes. This website runtime remains unchanged.

## Generated seal approved and integrated - 2026-09-07

The user approved the generated stamped SVG as the master seal with preserved
proportions and black curved `EST. 2021` wording. EDOS commit `161ce0d` contains
the clean and stamped SVG/transparent PNG exports. Development artwork asset
`60711204-527c-49be-bd86-4be384e7714b` and template v5
`5453f943-0e53-4343-9d32-9c811a9010c5` are attached to the synthetic CAD batch
at revision 10. Normal- and long-name DRAFT PDFs passed visual review. No
production deployment, real issuance, public verification record, or email is
authorized; website runtime remains unchanged.

## Seal returned to fixed artwork - 2026-09-07

At the user's direction, EDOS renderer `eraaxis-certificate-5` removes every
generated seal addition. `EST. 2021` and any physical-stamp texture are deferred
to revised approved Canva fixed artwork. The accepted `DD MON YYYY` date and
centered one-line QR caption remain; clean-seal template v4 is attached to the
synthetic CAD batch at revision 9. Website runtime is unchanged.

## Corrected seal and QR checkpoint - 2026-09-07

Following user review, EDOS renderer `eraaxis-certificate-4` removes the rejected
rough seal overlay, arcs `EST. 2021` through individually placed glyphs, and puts
the verification wording on one centered 7.25-point line below the QR. Corrected
development template v3 is attached to the synthetic CAD batch at revision 8.
Normal and long DRAFT samples passed local visual inspection; user acceptance is
pending and website runtime remains unchanged.

## Seal and date review checkpoint - 2026-09-07

EDOS renderer `eraaxis-certificate-3` now displays the stored ISO issue date as
`DD MON YYYY`, adds fixed `EST. 2021` copy in the central seal's upper band, and
adds a restrained deterministic pressed-ink edge. The versioned development
template is attached to the synthetic CAD batch at revision 7; normal and long
DRAFT samples passed local clipping/overlap inspection. User visual acceptance
is pending. Website runtime is unchanged, and nothing was deployed or issued.

## Outfit renderer review checkpoint - 2026-09-07

The user explicitly approved Outfit Regular/Bold under SIL OFL 1.1 as the Garet
replacement. EDOS uploaded Playfair Display Bold Italic and both Outfit faces to
the authorized development bucket, created and attached the Outfit template with
both authorized signatures, set the synthetic test date to `2026-09-07`, and
generated normal/long DRAFT PDFs. Local rendered-page inspection found no clipping
or overlap. Final acceptance remains the user's visual comparison against Canva;
website runtime is unchanged.

## Superseded Garet font gate - 2026-09-07

EDOS verified that the supplied Playfair Display Bold and Bold Italic files match,
but the files named Garet Regular/Bold are internally Garet Book weight 300 and
Garet Heavy weight 850. No licence files were supplied. No font upload, template
attachment or normal/long review PDF occurred at that checkpoint. The later
user-approved Outfit decision above supersedes the Garet requirement.

EDOS also implements revision-checked, idempotent editing of draft batch name,
printed programme/course wording and issue date without recreating the batch or
changing its destination, recipients or assets. At that checkpoint the synthetic
CAD batch was left without an invented date; it now uses the explicit local-test
date recorded above.

## Renderer font gate and later EDOS import UX - 2026-09-07

EDOS verified the original Canva/PDF typography inventory as Playfair Display and
Garet. The later explicit Outfit approval supersedes Garet for rendered variable
copy. Responsive preview UI evaluation is not certificate approval; the new
normal and long-name/programme PDFs still require user visual comparison.

The deferred EDOS usability milestone is a focused contact-import-style flow:
select cohort/course once, use that table's template, upload, review and save;
shared values use dropdowns, IDs are automatic and sheet columns remain
learner-specific. Creation, import and review must use separate focused routes,
not one crowded page. Renderer acceptance remains first.

## Current: EDOS slice 04 contract synchronized; visual approval pending

Contract `certificates.v1.4` matches EDOS exactly. Website runtime remains unchanged.
EDOS now implements private versioned artwork/font/signature handling, approved
template attachment, the shared DRAFT/future-final renderer and its staff batch
preview UI. Migration114 was applied only to localhost; 54 focused EDOS tests plus
lint/build pass. Reviewed artwork, authorized signatures and the approved Outfit
template assets exist only in the authorized development S3 bucket. No public
verification/retrieval page, production migration, deployment, issue or email
occurred.

Fresh Canva and Print PDF inspection confirmed the approved 3:2 geometry, colors,
artwork and signatures. The full Playfair Display Bold Italic and Outfit
Regular/Bold files are privately integrated, and EDOS produced normal/long DRAFT
PDFs. Next is user visual review before website public runtime work.

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
