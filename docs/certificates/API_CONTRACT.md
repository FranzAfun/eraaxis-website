# Certificate API contract

Contract: `certificates.v1.4` (2026-09-07). EDOS owns this file; the website keeps
an identical copy. This defines the first implementation, not deployed endpoints.
Changes to required fields, meanings or access rules require a new contract
version and matching fixtures before consumers change. Additive optional fields
are allowed. See PROGRESS.md for what actually exists.

## Transport and identity

- Staff base: `/api/lms`; public base: `/api/website/certificates`.
- Website `VITE_API_URL` includes `/api/website`; append `/certificates/...`.
- JSON success: `{ "success": true, "data": {}, "error": null }`.
- JSON failure: `{ "success": false, "data": null, "error": "Safe message.", "code": "MACHINE_CODE" }`.
  Existing authentication middleware may omit `data` and `code`; clients must
  handle HTTP status independently. Never render raw exceptions or proxy HTML.
- IDs inside staff APIs are UUIDs. Public IDs are 32 lowercase hex characters
  from 16 cryptographically random bytes, independent of internal IDs.
- Times are UTC ISO 8601; printed dates are `YYYY-MM-DD` without timezone conversion.
- Pagination: `limit` defaults to 50, maximum 100; opaque `cursor` and
  `{ items, nextCursor }`. Unknown/malformed parameters return 400.
- All certificate responses use `Cache-Control: private, no-store` and
  `X-Content-Type-Options: nosniff`; public pages use noindex and no personal sitemap entries.
- Staff uses existing cookie/CSRF/screen-lock authentication. Every staff request
  also reads current active account, authority level, LMS flag and explicit
  action grants from the database. No Admin bypass or inherited action grant.
- Permission keys stored in `users.permissions`: `CERT_VIEW`, `CERT_PREPARE`,
  `CERT_APPROVE`, `CERT_ISSUE`, `CERT_RESEND`, `CERT_REVOKE`, `CERT_MANAGE_ASSETS`.
  `LMS_ACCESS` must be explicitly boolean true. Absent/malformed values deny.
  Administrative grant writes must check current level 0 and audit transactionally;
  the generic user writer must not provide a way around that audit boundary.

## Public verification

`GET /:publicId` returns 200 for an issued, revoked or superseded record:

```json
{"success":true,"data":{"publicId":"0123456789abcdef0123456789abcdef","issuedName":"Synthetic Learner","programme":"Synthetic Programme","track":"Synthetic Track","issueDate":"2026-09-06","issuer":"ERA AXIS","status":"issued"},"error":null}
```

These seven fields are the complete public projection. `status` is `issued`,
`revoked` or `superseded`; only `issued` means currently valid. No email, phone,
internal ID, batch/enrolment reference, signature, PDF key, download URL or
successor identity is returned. Unknown, draft and malformed IDs share 404
`CERTIFICATE_NOT_FOUND`. Network failures/5xx mean unavailable, never invalid.
Rate limits return 429 `RATE_LIMITED` with `Retry-After` seconds.

## Public attendance link

Versioned separately as `attendance.v1`. It does not move
`certificates.v1.4`: attendance changes nothing about the certificate surface, and
`contractVersion` must keep meaning what it means today.

Website route: `/attendance/:token`. The token is 32 lowercase hex characters, the
same shape as a certificate public ID and for the same reason — the link is pasted
into a meeting chat, so holding one must not help anyone reach another session's.
EDOS builds the full link from `ATTENDANCE_LINK_BASE_URL`, defaulting to
`<WEBSITE_URL>/attendance`, so the two repositories stay in step exactly as they do
for verification. Unknown and malformed tokens share one 404
`ATTENDANCE_SESSION_NOT_FOUND`; a lookup failure is 503 `ATTENDANCE_UNAVAILABLE`,
never a 404.

`GET /api/website/attendance/:token` returns 200 with the session's public face:

```json
{"success":true,"data":{"state":"open","title":"Session 1: Version control","objective":"Set up Git and push a first commit.","programme":"Synthetic Programme","track":"Synthetic Track","sessionDate":"2026-09-13","opensAt":"2026-09-13T09:00:00.000Z","closesAt":"2026-09-13T11:00:00.000Z","googleClientId":"synthetic.apps.googleusercontent.com"},"error":null}
```

These nine fields are the complete public projection. No roster, learner, email,
attendance count, internal ID or link token is returned. `state` is `not_started`,
`open` or `closed`, decided against the window on every request. `googleClientId`
is non-null **only when `state` is `open`**: withholding it is what prevents a
learner outside the window from ever being asked to authenticate, so the client
must render no sign-in affordance without it. It is always the client the server
will verify against, so a button can never be rendered for a client whose tokens
this endpoint would reject.

`POST /api/website/attendance/:token`, body `{ "credential": "<Google ID token>" }`.
The credential is the ID token from Google Identity Services; scopes are only
`openid email profile`. Success is 200:

```json
{"success":true,"data":{"state":"present","learnerName":"Synthetic Learner","title":"Session 1: Version control","sessionDate":"2026-09-13","programme":"Synthetic Programme","track":"Synthetic Track"},"error":null}
```

`state` is `present` on the first sign-in and `already_present` on any later one.
Clicking the link again inside the window is idempotent and is **not** an error: it
returns `success: true` with `already_present`, and writes no second row. Clients
must render it as reassurance, not failure.

The window is re-checked on POST, because the page may have been open since before
the session started: outside it, 409 `ATTENDANCE_NOT_STARTED` or
`ATTENDANCE_CLOSED`, whose `data` carries the same public projection so the page
can re-render its state without a second request. Google is verified locally
against Google's published JWKS — RS256, audience, issuer, expiry and
`email_verified` all required. A rejected token is 401 `GOOGLE_TOKEN_INVALID` or
`GOOGLE_EMAIL_UNVERIFIED`; Google being unreachable or the client ID being unset is
503 `GOOGLE_SIGN_IN_UNAVAILABLE`, which must never be shown as a rejected learner.

Identity is matched on the verified email against learners enrolled on that
course. An address the roster does not hold is 403 `ATTENDANCE_NOT_RECOGNISED`,
refused on the spot and naming the address back, so the learner can raise it while
the class is still running rather than discovering weeks later that they were never
counted. An address that IS registered but on a different course in the same cohort
is 403 `ATTENDANCE_WRONG_COURSE`, naming the course the learner actually belongs to
and stating that signing in here would not count toward their certificate. A learner
takes exactly one course per cohort — `lms_enrolments` enforces it with
UNIQUE (learner_id, cohort_id) and the roster import refuses a second — so this is
always a wrong link rather than a second enrolment, and it must never be recorded. An address two learners share is 409 `ATTENDANCE_EMAIL_AMBIGUOUS` and
identifies neither, exactly as the register import behaves. Nothing on this
endpoint ever creates a learner. Rate limits return 429 `RATE_LIMITED`.

Staff side, `CERT_PREPARE`, idempotency-keyed and audited like the rest of
preparation. Sessions carry `title`, `objective`, `opensAt` and `closesAt`; both
bounds or neither, closing after opening, spanning at most 7 days.
`POST /api/lms/sessions/:id/attendance-link` returns
`{ "id": "<session id>", "attendanceUrl": "<full link>", "rotated": false }`.
Asking again returns the same link, so a facilitator who lost the message does not
invalidate the one already shared; `{ "rotate": true }` mints a new one and kills
the old, which is how a link posted in the wrong place is revoked. Only the
assembled URL is ever returned, never the raw token. A session that already has a
link cannot have its title, objective or window removed by an edit
(422 `SESSION_LINK_REQUIRES_DETAILS`); generating one without them is refused with
422 `SESSION_DETAILS_REQUIRED` or `SESSION_WINDOW_REQUIRED`.

The eligibility rule lives on the cohort, not the batch:
`attendanceThresholdPercent` (1-100), nullable on `lms_cohorts`, where null means
attendance is not applied. Batches inherit it. The agreed rule is **70% of sessions
held, rounded in the learner's favour**. `attendanceMinimumSessions` still exists on
the table and is still validated by the API, but nothing sets it and eligibility
must ignore it: a floor was dropped because a learner who clears the percentage and
is silently ineligible, with nothing on screen explaining why, is worse than no
floor. Treat it as reserved.

## Who can do what

Eight grants, each requiring the `LMS_ACCESS` feature flag as well. The flag and
the grant are both necessary; neither alone opens anything, which is why the
permissions panel is hidden entirely for a user without the flag rather than
offering switches that cannot take effect.

| Grant | What it allows |
| --- | --- |
| `CERT_VIEW` | See cohorts, courses, sessions, batches and the attendance reports. Read-only, and a prerequisite for every grant below. |
| `CERT_MANAGE_COHORTS` | Create and edit cohorts and courses, set the attendance threshold, and close a course. |
| `CERT_PREPARE` | Create draft batches, import and review the registration list, run sessions and issue attendance links. |
| `CERT_APPROVE` | Freeze a prepared batch for issuing. |
| `CERT_ISSUE` | Generate and send every certificate in an approved batch. |
| `CERT_RESEND` | Send an already-issued certificate again. |
| `CERT_REVOKE` | Withdraw an issued certificate. |
| `CERT_MANAGE_ASSETS` | Upload and authorise certificate artwork and signature images. |

**`CERT_MANAGE_COHORTS` is deliberately separate from `CERT_PREPARE`.** A
facilitator registers learners onto a course somebody else set up; the shape of the
programme — which cohorts and courses exist, and when one closes and freezes
eligibility — is a different authority. Every cohort and offering write requires it
at the route **and** again inside the transaction after the actor row is locked, so
a grant revoked mid-request cannot slip through. Without it the Cohorts screen is
hidden from the sidebar, its route refuses, and every button leading to it is not
rendered.

**`CERT_APPROVE` and `CERT_ISSUE` stay separate** even where one person holds both.
Granting both to a coordinator is a granting decision; keeping them apart means a
second approver can be required later without a migration.

Not yet wired to any endpoint: `CERT_APPROVE`, `CERT_ISSUE`, `CERT_RESEND`,
`CERT_REVOKE`. `CERT_MANAGE_ASSETS` has endpoints but no screen — assets are loaded
outside the app. The permissions panel says so on each, because an administrator
needs to know a grant currently does nothing.

## Cohort reporting

`GET /api/lms/cohorts/:id/metrics` requires `CERT_VIEW` and returns the whole
cohort picture in one response: `cohort`, `final`, `generatedAt`, `totals`,
`gender`, `courses[]`, `sessions[]` and `learners[]`, each learner carrying a
`marks[]` grid of present/excused/absent for every session on their own course.

It is one request rather than several **because an export has to be internally
consistent**. Four separate reads could each catch a different moment and produce a
document whose own sections disagree.

- `final` is true only when **every** course in the cohort is closed. While one is
  still running, any total can still move, and both the screen and the exported
  documents say so in words rather than presenting provisional figures as settled.
- Eligibility comes from the same `computeEligibility` the issuance jobs use, so
  the report and the certificates can never disagree about who earned one.
- A course's `attendanceRate` is the share of **learner-session opportunities**
  taken, not the share of learners who passed — that is what a partner means by
  attendance. A session's rate is over the learners enrolled on that session's own
  course, with excused absences removed from the denominator.
- `gender` counts `unknown` separately and never folds it into `other`: a learner
  whose form did not ask, or whose answer was unreadable, is not the same as one who
  chose "other", and a report must not imply they were.
- Each learner carries `certificate`: `sent`, `issued` (a certificate exists but
  its email was not accepted), `unconfirmed`, `revoked`, `superseded`, or `null`
  when none was ever issued. It sits **beside** eligibility, never in place of it:
  eligibility is a judgement about attendance, this is a fact about what was
  issued, and the two diverge — eligible but not yet issued, or issued and later
  revoked. A live award wins over history. `totals.certificatesIssued` and each
  course's `certificatesIssued` count learners holding a live certificate, and
  `totals.certificatesSent` those whose email was accepted. The screen, the PDF
  and the workbook all show it.

`?offeringId=` and `?sessionId=` narrow the report. A session implies its own
course, so selecting one narrows everything to the learners who could have attended
it, and each learner's grid collapses to that session alone. The screen, the PDF and
the workbook share one narrowing so a filtered document can never disagree with the
page it came from.

Exports follow the existing EDOS report shape — a summary section, then detail —
and carry **no charts**: a chart in a printed report is a picture of numbers the
reader cannot check.

`GET /api/lms/cohorts/:id/metrics/workbook` (`CERT_VIEW`, same filter parameters)
returns the styled `.xlsx` directly. **It is built server-side on purpose**: the
browser bundle carries SheetJS, which writes values but cannot style a cell, while
ExcelJS is already a dependency on the server for the roster export. The workbook
has six sheets (Summary, Courses, Gender, Sessions, Learners, Attendance detail),
each with a branded frozen header row, an autofilter, banded rows, sized columns,
and percentages stored as **real numbers with a percent format** so a reader can
sort, average and chart them rather than being handed text. Every sheet's subtitle
repeats whether the figures are Provisional or Final and states the eligibility
rule, because a printed sheet outlives the screen it came from.

The PDF is landscape with a summary panel, breakdown tables by course, gender and
session, then one row per learner carrying a column per session.

In the learner grid a session that was never on that learner's course is left
**blank**, not marked absent: an absence they could not have had is a false record.
Session columns are headed `S1`, `S2`… in date order, and a key under the table
spells each one out — date, course when the grid spans more than one, and title —
so a course with many sessions does not bury its learners under header text. The
PDF and the workbook use the same numbering.

**Every exported header is human wording** — "Email address", "Sessions attended",
"Eligibility" — never a database column name, because these documents are presented
rather than only read.

## Learner demographics

The registration form already asks for gender, school and location, and until
migration 119 the importer discarded all three, so the answers lived only in a
Google Sheet. They are captured now because partner reporting for a STEM programme
routinely asks which schools were reached, where learners came from, and how
participation broke down — and because capturing them after the first roster is
imported would mean re-uploading it.

All three are optional and nullable on `lms_learners`, and they appear in the import
template, the review table, the saved-recipient table and the roster export. **No
row is ever rejected over them**: a learner must not fail to be enrolled, and a
certificate must not fail to issue, because someone left a form field blank or typed
something unexpected.

`gender` is normalised on the way in to one of `male`, `female`, `other`,
`undisclosed`, matched case- and punctuation-insensitively, and a database check
constrains it to exactly that set. **Anything unrecognised is stored as NULL rather
than kept verbatim**, so a breakdown can never silently sprout categories nobody
chose. `school` and `location` are free text on purpose: school and place names are
messy, regional and inconsistently spelled, and forcing them into a controlled list
would lose more than it tidies.

On re-upload the three are **only ever filled in, never blanked**. A later roster
that omits the columns leaves what an earlier one recorded intact, because the
facilitators' own form may change between intakes; a later roster that supplies a
different value does correct it.

These are personal data and are for reporting only. They are never printed on a
certificate and must never appear in any public projection — not in public
verification, and not in the attendance sign-in payload.

## Eligibility

`GET /api/lms/offerings/:id/eligibility` requires `CERT_VIEW` and returns who has
attended enough of the course to be eligible. **This is the single computation.**
The reports facilitators read and the jobs that issue certificates must both come
through it: two implementations that disagree about whether someone earned a
certificate is worse than one that is wrong.

```json
{"success":true,"data":{"offeringId":"...","track":"Synthetic Track","cohortId":"...","cohortLabel":"Synthetic cohort","programme":"Synthetic Programme","closedAt":null,"final":false,"sessionsHeld":5,"thresholdPercent":70,"attendanceApplies":true,"summary":{"learners":4,"eligible":3,"notEligible":1,"withoutEmail":1},"learners":[{"id":"...","learnerName":"Synthetic Learner","email":"synthetic@example.invalid","canSignIn":true,"attended":4,"excused":0,"sessionsHeld":5,"effectiveHeld":5,"percentage":80,"thresholdPercent":70,"requiredSessions":3,"eligible":true,"applies":true}]},"error":null}
```

The rule, all of it:

- The denominator is `sessions_held_at_close` once the course has closed and the
  live session count before then. `final` says which, and it is false while a course
  is running because every figure still moves.
- The threshold is the **cohort's** `attendanceThresholdPercent`, so changing it
  changes every answer under that cohort with no other edit.
- **Rounded in the learner's favour**: `requiredSessions` is
  `max(1, floor(effectiveHeld * threshold / 100))`. At 70% of 3 sessions that is 2,
  not 3, because a learner cannot attend a fraction of a class. The floor of 1 stops
  a one-session course from requiring nothing at all.
- **An excused absence comes out of the denominator** rather than counting as a
  presence: `effectiveHeld = sessionsHeld - excused`. Counting it as attendance
  would overstate what happened; leaving it in would make the forgiveness pointless.
  `attended`, `excused` and `sessionsHeld` are all reported so the raw figures stay
  visible.
- `percentage` is **null**, never 0, when nothing has been held or everything was
  excused: "no sessions have run" is a different statement from "attended none of
  them", and a report showing 0% before a course starts reads as everyone failing.
- `eligible` is **null**, never false, when the cohort has no threshold. Attendance
  is not what decides that cohort, and reading null as ineligible would fail
  everyone in a programme that never took a register. `attendanceApplies` says so
  at the top level.
- `canSignIn` is false for a learner with no email. They can never be matched to a
  Google account, so a facilitator reading a low figure needs to know that is why
  before chasing them.

## Closing a course or cohort

Closing a course is what makes its eligibility final. Until then, "70% of sessions
held" has a denominator that grows every week, so nobody has passed or failed yet.

**Certification is gated on the course, not the cohort.** A batch is prepared per
course, and one course can finish weeks before another in the same intake.

`POST /api/lms/offerings/:id/close` requires `CERT_PREPARE` and an
`Idempotency-Key`, and returns
`{id,cohortId,track,closedAt,sessionsHeldAtClose}`. `sessionsHeldAtClose` is the
frozen denominator, written at the moment of closing and stored rather than
recounted, so deleting a session afterwards cannot change who was eligible. Closing
an already-closed course is 409 `OFFERING_ALREADY_CLOSED`.

`POST /api/lms/cohorts/:id/close` closes the cohort and every course still open
under it, in one transaction, and returns the cohort plus `coursesClosed`. A course
already closed keeps its own earlier `closedAt`. Already closed is 409
`COHORT_ALREADY_CLOSED`; adding a course to a closed cohort is 409 `COHORT_CLOSED`.

**Closing is irreversible and there is no reopen endpoint.** Closed cohorts are
archived: still listed and readable, marked closed, filtered out of the default
view. Closing is not deleting — a closed course keeps its batches and certificates
until someone deliberately deletes it, and deletion still refuses while dependent
work exists.

A closed course refuses everything that would move its answer, all with 409
`OFFERING_CLOSED`: creating or editing a session, issuing or rotating an attendance
link, importing an attendance register, and committing a recipient import.

Its attendance links report `state: "course_closed"`, which outranks the window,
and `POST` returns 409 `ATTENDANCE_COURSE_CLOSED`. This is deliberately distinct
from `ATTENDANCE_CLOSED`: a closed session leaves room to expect another link, and
a closed course does not.

## Private retrieval

1. `POST /:publicId/request-access`, body `{ "email": "synthetic@example.invalid" }`.
   For syntactically valid requests, return the same 202 envelope regardless of
   existence, status, contact match or per-contact cooldown:
   `{ "success": true, "data": { "message": "If these details match an available certificate, we will email a code.", "retryAfterSeconds": 60 }, "error": null }`.
   Queue challenge email; do not wait for SMTP. Apply IP and certificate/contact
   limits without exposing match information. Generic IP throttling may return 429.
2. `POST /:publicId/verify-access`, body `{ "email": "synthetic@example.invalid", "code": "123456" }`.
   Success 200 data: `{ "grant": "<opaque random token>", "expiresAt": "2026-09-06T12:05:00.000Z" }`.
   Failure 400 `ACCESS_CODE_INVALID` for unknown, wrong, expired, consumed or
   exhausted challenges. Use crypto randomness, HMAC-protected codes, constant-time
   comparison, max 5 attempts, 10-minute expiry, 60-second resend cooldown, and
   atomic consumption. A replacement invalidates the previous active challenge.
3. `POST /:publicId/download`, JSON body `{ "grant": "<opaque random token>" }`.
   No staff cookies are required; tokens never go in URLs, logs or persistent
   browser storage. The grant lasts 5 minutes, is certificate-scoped and may be
   retried within its lifetime; its usage is audited. It confers no payment or
   staff access. Revocation/supersession immediately blocks download.
   Success is PDF binary, `Content-Type: application/pdf`, safe ASCII attachment
   filename `certificate-<publicId>.pdf`, private/no-store, nosniff.
   Missing/expired/wrong-scope/revoked grants return 401 `DOWNLOAD_ACCESS_REQUIRED`;
   after grant validation, unavailable/revoked/superseded awards return 409
   `CERTIFICATE_UNAVAILABLE`. A missing stored PDF returns 503 `PDF_UNAVAILABLE`.
   Clients inspect status/content type, handle JSON errors separately, and revoke
   browser object URLs after use. No general file proxy or public static path.

Malformed input is the one thing answered plainly, on all three: a certificate ID
that is not 32 hex characters, an address that is not an address, or a grant that
is not 43 base64url characters. Format is public knowledge and a person who
mistyped deserves to be told, while existence is never disclosed. `request-access`
and `verify-access` return 400 `INVALID_REQUEST` and `ACCESS_CODE_INVALID`
respectively; `download` returns 401 `DOWNLOAD_ACCESS_REQUIRED` without a lookup.
A fault in the service itself answers 503 `RETRIEVAL_UNAVAILABLE` on
`verify-access` and `download`, and the ordinary 202 on `request-access`, because
a 500 there would report that something existed to go wrong with.

Website routes: `/certificates/verify/:publicId` and `/certificates/retrieve`.
Retrieval may prefill `?certificate=<publicId>` only; no email or grant in the URL.
No public directory, name lookup or email-wide record search.

The base that EDOS prints and QR-encodes is environment-driven, never a baked-in
domain: `CERTIFICATE_VERIFICATION_BASE_URL`, defaulting to
`<WEBSITE_URL>/certificates/verify`. A local checkout therefore resolves to
`http://localhost:5174/certificates/verify` and verifies against the local public
site. The renderer requires the caller to supply this base and rejects plaintext
HTTP unless the host is loopback, so an issued certificate can never carry an
unverifiable or non-HTTPS link. The website must keep `/certificates/verify/:publicId`
mounted at whatever base the two repositories are configured to share.

## Staff access and preparation

`GET /api/lms/certificate-access` requires LMS + `CERT_VIEW`, and returns
`{ contractVersion: "certificates.v1.4", permissions: ["CERT_VIEW"] }` with only
the current user's explicitly granted certificate actions. This is access
discovery, not evidence that issuance or other future endpoints are ready.

### Preparation extension (v1.1)

Public verification/retrieval fields and semantics are unchanged from v1.
This revision freezes the first usable staff preparation flow before consumers:

- `GET /api/lms/cohorts`: paginated
  `{id,reference,programme,label,createdAt,attendanceThresholdPercent,`
  `attendanceMinimumSessions,closedAt,courseCount,openCourseCount,learnerCount}`.
  The counts let the cohorts screen say what a cohort holds without a request per
  row, and are what make an empty cohort visible as empty. `closedAt` is null until
  the cohort is closed and is what the archive view filters on.
  `attendanceThresholdPercent` is null when the cohort does not apply attendance.
- `POST /api/lms/cohorts`: `{programme,label,attendanceThresholdPercent?,`
  `attendanceMinimumSessions?}` -> 201 same core fields. `reference`
  is derived server-side from `label` (lowercased, diacritics stripped, non-alphanumerics
  collapsed to `-`) with a numeric suffix on collision, and is not accepted from the
  client. It is a machine key; staff never type or see it.
- `PATCH /api/lms/cohorts/:id`: `{programme,label,attendanceThresholdPercent?,`
  `attendanceMinimumSessions?}` -> 200 same fields. Omitting either attendance
  field clears it, which is how a cohort stops applying attendance. The derived
  `reference` is never rewritten: it already appears on exports and preview rows,
  and changing it would make older downloads disagree with the system.
- `DELETE /api/lms/cohorts/:id`: 200 `{id}`. Refuses with 409 `COHORT_IN_USE` while
  the cohort still has courses; deletes never cascade.
- `GET /api/lms/offerings?cohortId=<uuid>`: paginated
  `{id,cohortId,track,closedAt,sessionsHeldAtClose,sessionCount,learnerCount,`
  `withoutEmailCount}`. The counts exist so a facilitator can be warned before
  generating an attendance link that would refuse everyone: `learnerCount` 0 means
  nobody is enrolled on the course, and `withoutEmailCount` counts enrolled learners
  with no email, who cannot be matched to a Google account and so can never sign in
  by link. Once `closedAt` is set, `sessionsHeldAtClose` is the number eligibility is
  measured against and `sessionCount` is only informational.
- `POST /api/lms/offerings`: `{cohortId,track}` -> 201 same fields.
  A course name is unique (case/outer-space insensitive) within its cohort.
- `PATCH /api/lms/offerings/:id`: `{track}` -> 200 same fields.
- `DELETE /api/lms/offerings/:id`: 200 `{id}`. Refuses with 409 `OFFERING_IN_USE`
  while the course still has batches.
- PATCH and DELETE require CERT_PREPARE, LMS access and an Idempotency-Key UUID on
  the same terms as the POSTs, and are audited as `CERT_*_UPDATED` / `CERT_*_DELETED`.
- `DELETE /api/lms/certificate-batches/:id`: 200 `{id}`. Draft only; 409
  `BATCH_NOT_DRAFT` otherwise, and 409 `BATCH_HAS_AWARDS` once certificates have
  been issued from it. Removes the batch's own recipient rows and import previews
  and nothing else: learners and enrolments survive, because those people did
  enrol whether or not this batch does.
- `GET /api/lms/certificate-batches`: paginated
  `{id,name,programme,track,revision,state,createdAt,offeringId,cohort,issueDate,recipientCount}`.
- List pagination uses UUID `cursor`, ascending ID, default limit50, max100;
  nextCursor null means the last page. Only documented query parameters accepted.
- These POSTs require CERT_PREPARE, boolean LMS access and Idempotency-Key UUID.
  GETs require CERT_VIEW and LMS. Writes recheck grants inside the transaction.
  Same normalized payload/key reuses the saved response without another audit;
  changed payload/key conflict returns 409 IDEMPOTENCY_CONFLICT. New duplicate
  cohort/course returns 409 PREPARATION_CONFLICT. Missing selected record returns
  404 COHORT_NOT_FOUND / OFFERING_NOT_FOUND. Missing schema gives 503
  CERTIFICATE_SETUP_REQUIRED with safe guidance, not an empty success result.
- New drafts do not require a template or authorized signatures. Final asset
  attachment and approval remain separate later operations; no Issue endpoint is
  exposed by the preparation implementation. Two signature slots are constrained
  to versions for slot1/slot2 with signatory name/title and explicit synthetic status.
  Real authorization requires non-synthetic private assets, hash and authorization
  reference. No signature images, names or positions are fabricated.
- Admin action editor uses existing `PATCH /api/users/:id` with
  `{permissions:[...],expectedPermissions:[...]}`. Preserve non-certificate grants.
  A stale expectedPermissions array returns 409 PERMISSIONS_CHANGED. Current
  active level0 is locked/rechecked within the write transaction. Server-only
  FEATURE_FLAG_UPDATED / PERMISSIONS_CHANGED events replace client-produced events.
  Deploy matching EDOS frontend/backend together: old clients must stop posting
  these protected audit actions (now rejected), including duplicate USER_CREATED.

The following batch paths are relative to `/api/lms/certificate-batches`:

| Method/path | Permission | Request / successful data |
| --- | --- | --- |
| GET `/` | CERT_VIEW | Paginated batch summaries |
| POST `/` | CERT_PREPARE | `{ offeringId, name, issueDate?, programme, track }` -> 201 `{id,name,revision,state:"draft"}`; final assets attached later |
| GET `/:id` | CERT_VIEW | Batch, `revision`, `reviewHash`, state, counts, approval |
| PATCH `/:id` | CERT_PREPARE | `{revision,name,programme,track,issueDate}` -> updated draft details and new revision |
| GET `/:id/template?format=csv\|xlsx` | CERT_PREPARE | Binary roster template |
| POST `/:id/import-preview` | CERT_PREPARE | Multipart `file`, `revision` -> preview token, counts, paginated rows/errors |
| POST `/:id/import-commit` | CERT_PREPARE | `{ revision, previewToken, decisions }` -> committed revision and counts |
| GET `/:id/preview?rowId=<uuid>&revision=<n>` | CERT_VIEW | Private DRAFT PDF from final renderer |
| POST `/:id/approve` | CERT_APPROVE | `{ revision, reviewHash, evidenceReference }` -> approval bound to frozen content |
| POST `/:id/issue` | CERT_ISSUE | `{ revision, reviewHash }` -> 202 accepted work, below |
| GET `/:id/results` | CERT_VIEW | Paginated row outcomes and aggregate progress |
| POST `/:id/pause`, `/:id/resume` | CERT_ISSUE | `{ revision, reason }` -> persisted control state |

### Implemented import contract (v1.2)

`GET /:id` returns `{id,name,programme,track,revision,state,cohort,sourceNamespace,
issueDate,recipientCount,rows,nextCursor}`. Here `cohort` is the display label string.
Recipient rows contain `id` plus the seven roster fields below; `eligible` is the
literal string `true` or `false`. This is a saved-data preview, not a certificate PDF.
The PDF preview endpoint in the table above is still pending the design handoff.

Multipart import-preview requires `file` and integer `revision`. The source
namespace is no longer supplied by the client: it is derived as `cohort:<cohortId>`
so that re-uploads match learners within the cohort they belong to, and a batch that
already recorded a namespace keeps it. Asking staff to retype a stable machine key
only invited typos that silently duplicated learners.

Preview response: `{previewToken,revision,sourceNamespace,expiresAt,
counts:{total,valid,invalid,review},rows,nextCursor}`. Each row contains `rowId`,
`rowNumber` (header is line1), `values` (seven source fields), `errors`, `warnings`,
`candidates:[{id,name}]`, `matchedVia` (`email`, `phone` or null), `duplicateOfRow`
and `action` (`new`, `update`, `reuse`, `duplicate`, `review`, `invalid`).
An exact email or phone match against exactly one existing learner links that
learner directly, instead of raising a review, and is reported as
`MATCHED_EXISTING_LEARNER`. Phones compare on their last nine digits so local and
international spellings of one number match. A contact held by more than one
learner stays ambiguous and falls back to review, and a row asserting an unknown
external `source_record_id` never auto-links. A second row reaching a learner
already claimed earlier in the file is `duplicate` with a `DUPLICATE_IN_FILE`
warning: excluded by default, includable deliberately, and the commit still
refuses two included rows resolving to one learner. Preview `counts` add `added`,
`matched` and `duplicate`.
Errors/warnings contain `{code,field,message}`. Candidate names/IDs are private
staff data. `valid` counts rows without errors; warnings still need review.

`GET /:id/import-preview/:token?cursor=0&limit=50` pages this same saved preview.
`GET /:id/import-preview/:token/errors` returns formula-escaped CSV.
`GET /:id/roster?format=csv|xlsx` requires CERT_VIEW and downloads current stable
IDs. Detail/preview cursor is an offset integer; limit1–100, default50.

Commit requires an explicit decision for EVERY preview row, with no duplicates:
`{rowId,include:boolean,identity?:"new",matchLearnerId?:uuid,
assistedDelivery?:boolean}`. Identity choices are mutually exclusive; a known
stable source ID cannot be rematched. Possible matches require an explicit
candidate match or distinct-new-person confirmation. Missing email requires
`assistedDelivery:true` if included. Other error rows must be corrected or excluded.
At least one valid row must be included. Excluded and absent rows do not delete
previous batch recipients; import is an upsert, not a replacement operation.

Commit result: `{id,revision,counts:{included,excluded,created,updated,reused},
recipientCount}`. Learner details update; this batch's input snapshot updates.
Other batches retain their snapshots. One-course-per-cohort constraints and
identity mappings are checked again under transaction locks. Audit failure rolls
back the entire import. No import endpoint can issue a certificate or send mail.

### Implemented design asset and draft-preview contract (v1.4)

Certificate artwork, fonts and signatures use a dedicated private object prefix;
they never use public/static directories, website media or the generic file proxy.
Every stored object has an immutable version, SHA-256 digest and private/no-store
metadata. Reads verify the stored bytes against the recorded digest before render.
Asset bytes, private keys and signature images are never returned in JSON or logs.

Asset writes require LMS + `CERT_MANAGE_ASSETS`, current-account rechecks and an
`Idempotency-Key` UUID. A retry with the same normalized fields and file hash
returns the original record; changing them returns 409 `IDEMPOTENCY_CONFLICT`.

- `POST /api/lms/certificate-assets`: multipart `file`, `kind`, `name`, `version`,
  `authorizationReference`, plus `fontFamily`/`fontStyle` for fonts. `kind` is
  `fixed_artwork` (exact 1536x1024 PNG) or `font` (TTF/OTF, maximum 20 MiB).
  Claimed family/style must match the font's internal metadata; approved template
  faces also require their exact internal weight and italic posture. Renamed,
  synthetic or non-embeddable faces are rejected.
  Successful data contains only safe metadata: `{id,kind,name,version,contentType,
  byteSize,width,height,fontFamily,fontStyle,approvedAt}`.
- `POST /api/lms/certificate-signatures`: multipart transparent PNG plus `slot`
  (1 or 2), `version`, `signatoryName`, `signatoryTitle` and
  `authorizationReference`. Original PNG bytes are preserved; successful data is
  `{id,slot,version,signatoryName,signatoryTitle,authorizedAt}`.
- `POST /api/lms/certificate-templates`: JSON `{name,version,
  authorizationReference,assets}`. `assets` maps `fixed_artwork`,
  `playfair_bold_italic`, `outfit_regular` and `outfit_bold` to approved asset UUIDs.
  Exact family/style checks reject substitutions. The server owns measured layout,
  colors and renderer version; successful data is `{id,name,version,
  rendererVersion,approvedAt}`.
- `PATCH /api/lms/certificate-batches/:id/design`: `CERT_PREPARE` plus
  `{revision,templateId,signature1Id,signature2Id}`. It accepts only an approved,
  active template and authorized non-synthetic signatures in their correct slots,
  increments the draft revision and returns `{id,revision,state}`.
- `GET /api/lms/certificate-batches/:id/preview?rowId=<uuid>&revision=<n>`:
  `CERT_VIEW`; returns a private/no-store `application/pdf` DRAFT using the same
  renderer reserved for final generation. Missing issue date/template/fonts/both
  signatures returns 422 `CERTIFICATE_ASSETS_REQUIRED`; digest or glyph failures
  return a safe 422 error. Revision mismatch returns 409 `REVISION_CONFLICT`.

The renderer uses the Print-export 3:2 grid, Playfair Display Bold Italic for the
recipient name, Outfit Regular/Bold for other variable copy, proportional signature
containment and a unique QR pointing to the agreed HTTPS verification route. Stored
issue dates remain ISO `YYYY-MM-DD`, but certificate output renders them as
unambiguous `DD MON YYYY` text (for example, `07 SEP 2026`). Renderer version 5
centers the one-line verification caption beneath the QR. The seal is wholly part
of the approved fixed artwork; the renderer adds no founding year or texture. It
fits ordinary text down to approved minima, then at most two lines; overflow or
unsupported glyphs blocks preview/issuance instead of clipping or substituting.
This slice does not create certificates, approvals, jobs, delivery, public runtime
pages or production assets. Full licensed font files and the reviewed private asset
versions remain required before a template can be accepted for real issuance.

`PATCH /api/lms/certificate-batches/:id` requires `CERT_PREPARE`, a UUID
`Idempotency-Key`, and `{revision,name,programme,track,issueDate}`. Name is the
internal batch name (maximum 160 characters); programme and track are printed
wording (maximum 240 characters each). All are trimmed and non-empty. Issue date
is required for this edit and must be a real `YYYY-MM-DD` date. The server locks
and rechecks the current active account and batch in one transaction, accepts
only `draft`, increments revision exactly once, and audits
`CERT_BATCH_DETAILS_UPDATED`. It does not change `offeringId`, cohort/course
destination, design assets, signatures or recipient rows. Success data is
`{id,name,programme,track,issueDate,revision,state:"draft"}`. Same key and
normalized payload returns that original response without another update/audit;
changed payload returns 409 `IDEMPOTENCY_CONFLICT`, stale revision returns 409
`REVISION_CONFLICT`, and a non-draft batch returns 409 `BATCH_NOT_DRAFT`.
Two concurrent file parsers maximum per API process,15s timeout,256MiB V8 heap
each; parsing runs in worker threads. These are bounded initial settings, not a
production capacity certification. Expired preview rows require a retention job
before production; token expiry already prevents access after30 minutes.

Staff mutation requests carry `Idempotency-Key` (UUID) and an integer `revision`
when editing existing batches/certificates. Deduplication scope is actor + route
+ target + key; bind it to the request hash. Same key/different payload returns
409 `IDEMPOTENCY_CONFLICT`. Revision mismatches return 409 `REVISION_CONFLICT`.
Clients must reload/review, never silently retry with the latest revision.

The blank template has three columns: `full_name`, `email`, `phone`. Only
`full_name` is required. An upload may additionally carry `source_record_id`,
`learner_id`, `eligible` and `evidence_reference`, because a downloaded roster
contains them and must round trip; any other header is rejected. Absent optional
columns default to empty, and absent `eligible` defaults to `true` until the
attendance mechanism supplies real eligibility. Headers are matched on letters and
digits only, so case, spaces and punctuation are equivalent and common spellings
(`Full name`, `Email Address`, `Phone Number`) resolve to the canonical columns; a
form platform's own columns such as `Timestamp` and any unrecognised column are
ignored. Two columns resolving to the same field, or no column resolving to
`full_name`, are rejected. `eligible` uses `true`/`false`;
blank email is retained as a visible assisted-delivery decision, not dropped. Source IDs are stable within an explicitly recorded source namespace;
new manual rows get stable IDs for re-upload. Preview decisions are keyed to
preview row ID: include/exclude, explicit existing learner match or reviewed new
identity. Server stores/validates decisions, never trusts client validation results.
Preview tokens expire after 30 minutes and bind uploader, batch, revision and file
hash; import commit revalidates identities/enrolments under DB constraints.

Initial parser ceilings: 10 MiB compressed/upload, 50 MiB total decompressed,
5,000 data rows, 7 columns, 1,000 ZIP entries, 2,000 characters/cell. Reject formula
cells, macros, external links, unexpected columns and oversized archives. Names
and printed wording also need renderer/glyph validation. Invalid rows are explicit;
there is no silent partial import. Row error downloads escape spreadsheet formulas.
These limits require rehearsal before release, not an assertion of safe VM capacity.

Row error: `{ rowId, rowNumber, code, field, message }`.
Codes include `COHORT_COURSE_CONFLICT`, `IDENTITY_REVIEW_REQUIRED`,
`DUPLICATE_SOURCE_RECORD`, `ROW_INVALID`, `ALREADY_AWARDED`.
`UNIQUE (learner_id, cohort_id)` and composite offering/cohort FK enforce one
track across batches, including concurrent commits. Email/name alone never merge
learners. No withdrawal exception. Same track reuses the existing enrolment.

### Approval (implemented)

`POST /api/lms/certificate-batches/:id/approve` requires `CERT_APPROVE` and an
`Idempotency-Key`, with body `{ revision }`. It returns
`{ id, state: "approved", approval: { id, revision, contentHash, recipientCount, approvedAt } }`.

**Approval is what freezes a batch.** Every path that could change one — details,
design assets, recipient import, deletion — already refuses anything that is not a
`draft`, so moving the state is what makes it immutable, rather than a rule
somebody has to remember. Approving does not render, email or queue anything.

Refused with 409 `REVISION_CONFLICT` when the submitted revision is not the batch's
current one: the approver is confirming a revision they have seen, and if it moved
while they were reading it they are approving something else. Refused with 422
`ISSUE_DATE_REQUIRED` or `ASSET_NOT_APPROVED` when the batch could never be issued
as it stands, and 422 `IMPORT_INVALID` with no included recipients. A batch that is
not a draft is 409 `BATCH_NOT_DRAFT`.

The stored `contentHash` covers the printed wording, issue date, the exact template
and signature version IDs, and every included recipient in a fixed order. The
revision alone would only catch changes made by paths that remember to bump it;
the hash can be re-checked against the database at the moment of issuing.

`POST /api/lms/certificate-batches/:id/withdraw-approval` requires `CERT_APPROVE`
and a `{ reason }` of up to 240 characters, and returns the batch to `draft` so it
can be corrected. **The approval row is kept, not deleted** — that someone approved
a batch and then took it back is exactly what an audit needs to show. A partial
unique index allows at most one standing approval per batch, so "which approval
authorised this issuance" always has one answer. Withdrawing when none stands is
409 `BATCH_NOT_APPROVED`.

**Self-approval is currently allowed**: one person may prepare and approve. The
plan proposed separate preparer and approver by default, and that remains an open
policy decision — the permissions are already separate, so requiring two people is
a granting change plus one check, not a redesign.

Block issue until asset authorization is resolved.

## Durable issuance and lifecycle

### Issue and progress (implemented; the worker is not)

`POST /api/lms/certificate-batches/:id/issue` requires `CERT_ISSUE`, an
`Idempotency-Key` and body `{ revision }`. It commits the issuance intent, **one**
expansion job and the audit entry in one short transaction and returns **202**:

```json
{"success":true,"data":{"batchId":"...","issuanceId":"...","state":"queued","totalRecipients":42,"statusUrl":"/api/lms/certificate-batches/.../results"},"error":null}
```

It never renders, contacts SMTP or S3, or loops the roster. A thousand recipients
must not become a thousand inserts while a person waits on a request, and must not
be lost if that request is interrupted half way — so the roster is expanded by the
worker against the frozen approved content, not here.

Refused with 409 `APPROVAL_REQUIRED` when the batch is not approved, has no
standing approval, or the approval does not cover the current revision; 409
`REVISION_CONFLICT` when the submitted revision is not current; 422
`IMPORT_INVALID` with no included recipients.

**The approval's content hash is re-computed against the live database and
compared.** The revision alone only catches changes made by paths that remember to
bump it. This is the last moment where catching a drift is still free, and it
refuses rather than issuing something nobody approved.

Retrying with the same `Idempotency-Key` returns the same accepted intent and
queues no second job. A *different* request while one issuance is live is refused
by a partial unique index — two live issuances would each believe they owned the
roster, and the second would send everyone a duplicate.

`GET /api/lms/certificate-batches/:id/results` requires `CERT_VIEW` and returns the
most recent issuance with `progress` — `total`, `expanded`, `generated`,
`emailAccepted`, `pending`, `inFlight`, `failed`, `emailUnknown` — and
`recipients[]`, one row per person on the approved batch carrying their name,
email, certificate `publicId` once it exists, and a single-word `outcome`: `sent`,
`unconfirmed`, `failed`, `no email address`, `generated` or `waiting`. A run is
only really reportable per person: "12 failed" is not something a facilitator can
act on, but "these two addresses bounced" is. `publicId` appears only once the PDF
is stored, so its presence doubles as proof the certificate exists rather than
being promised.

The response also carries `batch` — `name`, `programme`, `track`, `issueDate` and
`cohort` — so the page and its exports can say which run they describe.
`GET /api/lms/certificate-batches/:id/results/workbook` (`CERT_VIEW`) returns the
same report as a styled `.xlsx` with Summary and Recipients sheets, using the
attendance workbook's table styling, or 404 `ISSUANCE_NOT_FOUND` for a batch that
was never issued. The page also offers a PDF built in the browser. Both are staff
documents and carry email addresses and certificate IDs; nothing public does.

Staff route: `/lms/certificates/:batchId/results`. It polls at 5 seconds, backs off
by half each time to a 30-second ceiling, stops entirely once the run has settled,
and stops while the browser tab is hidden — a settled run polled forever would be a
room of open staff tabs asking the API for an answer that cannot change. Each poll
is scheduled after the previous reply rather than on a fixed interval, so a slow
API is never handed a second overlapping request. **These are
reported by category and must not be summed** — a recipient can be both generated
and emailed, so adding those two reports more work done than exists. `null`
issuance means nothing has been issued for that batch yet.

`certificate_jobs` carries one render and one email job per recipient per issuance,
enforced by a unique index, so a retry, a resumed worker or a double-submitted
request cannot produce two certificates for one person: duplicate-free records are
a database property rather than something the worker has to remember. `unknown` is
its own job state and not a failure — plain SMTP cannot promise exactly-once
delivery, and a crash after the server accepted a message leaves an outcome nobody
can honestly call sent or unsent.

```json
{"success":true,"data":{"batchId":"00000000-0000-4000-8000-000000000001","issuanceId":"00000000-0000-4000-8000-000000000002","state":"queued","statusUrl":"/api/lms/certificate-batches/00000000-0000-4000-8000-000000000001/results"},"error":null}
```

Progress distinguishes `queued`, `processing`, `generated`, `email_accepted`,
`failed`, `email_unknown`, and persistent `paused`, with total/completed counts
and `updatedAt`. Counts must specify their category; generated and email-accepted
counts overlap and must not be summed. Poll at 5 seconds initially, back off to
30 seconds, stop when settled or page hidden. No fabricated metrics on failure.

Certificate paths under `/api/lms/certificates`: GET `/`, `/:id`, `/:id/download`
require CERT_VIEW. POST `/:id/resend` requires CERT_RESEND; `/:id/revoke` requires
CERT_REVOKE; `/:id/reissue` requires CERT_PREPARE and CERT_ISSUE and starts a new
approval-bound correction workflow. Bodies include `revision` and `reason`;
reissue additionally carries corrected draft fields. It never bypasses approval.
Asset writes require CERT_MANAGE_ASSETS; global pause/resume requires current
Admin plus LMS + CERT_ISSUE, with actor/reason audit. Exact asset/control payloads
will be frozen before those consumers; they are not implemented by this contract.

Worker constraints: one dedicated process, no API bootstrap or payment scheduler,
one job at a time with no render/mail overlap, one PDF and one send concurrency,
2-second trial minimum mail gap, bounded claims/pool/buffers, leases/heartbeats,
delayed retries and persistent global/per-batch pause. Supervisor hard limits and
pause thresholds require measured headroom. Ambiguous SMTP acceptance becomes
`email_unknown`, not automatic retry or claimed confirmed delivery. PDFs and
template/signature/font hashes are immutable across retries and later edits.

## The issuance worker (implemented; not yet rehearsed at scale)

`npm run worker:certificates` from `server/`. **A dedicated process, deliberately
not another copy of the API** — it never imports `app.js` or `server.js`, so
starting it does not also start Socket.IO, an HTTP listener or the payment
reconciliation scheduler, one of which would quietly begin doing real financial
work on a machine meant only to render PDFs. A test asserts this by inspecting the
module cache, because it is easy to reintroduce with a single import.

Configuration is validated at startup and **fails closed** — a mistyped pacing
value that silently fell back to a default could empty a mail quota in minutes:

| Variable | Default | Purpose |
| --- | --- | --- |
| `CERT_WORKER_POLL_MS` | 5000 | Idle poll interval |
| `CERT_WORKER_LEASE_SECONDS` | 120 | Claim lease; a dead worker's job is reclaimed after this |
| `CERT_WORKER_MAX_ATTEMPTS` | 5 | Before a job is recorded as failed |
| `CERT_WORKER_EMAIL_MIN_GAP_MS` | 2000 | Minimum gap between sends, measured from the last send |
| `CERT_WORKER_DB_POOL` | 2 | Small on purpose: the worker must not starve the API of connections |
| `CERT_WORKER_MAX_PDF_BYTES` | 5 MiB | A render larger than this is refused rather than stored |
| `CERT_WORKER_EMAIL_HOURLY_QUOTA` | 200 | Hard cap on sends per rolling hour |

**A gap between sends is not a quota, and this distinction matters.** At the 2s
default the worker would offer 1,800 messages an hour, far above what a shared
mailbox provider allows — and exceeding a provider limit throttles or suspends
**the whole domain's mail**, not just this batch. The quota is counted from
`certificate_jobs` over a rolling hour rather than from a variable, because an
in-memory counter resets on restart, which is exactly the moment somebody would
blow through the limit. Sends recorded as `unknown` count too: the server may well
have delivered them, so they consumed quota either way. When the quota is reached,
**rendering continues and only sending waits**, and the check happens before
claiming so a job is never taken out of the queue only to be put back.

The default of 200 is deliberately conservative and **must be set from the
provider's own published limit before a real send**. ERA AXIS mail runs on
Namecheap Private Email (`mail.privateemail.com`), whose limits are plan-dependent
and are not recorded here because they change; confirm the current figure against
the live plan rather than trusting a number in this document.

One job at a time, expansion before rendering before email, so a batch produces
certificates before it tries to send them. A long render heartbeats its lease;
graceful shutdown finishes the job in hand rather than leaving a claim to expire.

**Rendering is idempotent.** The award is created once, and if it already carries a
stored PDF the work is already done. A retry after a crash must not re-render,
because that would produce different bytes for a certificate somebody may already
hold. The PDF is stored before the award records its key, so nothing can be emailed
that cannot be produced again.

**Delivery distinguishes three outcomes**, and the distinction is what stops a
learner receiving two certificates or none:

- **sent** — the mail server accepted it. Not proof of delivery.
- **failed** — a definite rejection (5xx, invalid mailbox). Safe to retry.
- **unknown** — the connection dropped after the server may already have accepted
  the message, or a temporary 4xx. Retrying could send a second copy; calling it
  sent could hide a certificate that never arrived. It is recorded for a person to
  look at rather than guessed either way.

A recipient with no email address is **skipped, not failed**: assisted delivery
means somebody hands that one over in person, and it must not sit in the queue
being retried forever. An email whose certificate is not rendered yet is
**deferred without counting an attempt**, so a slow render cannot exhaust the retry
budget and mark a good certificate undeliverable.

Queue guarantees live in the database, not in worker code. `FOR UPDATE SKIP LOCKED`
means two workers claiming at once take different jobs. Only the holder of a claim
may complete it, so a worker whose lease expired cannot finish work another has
taken over. Pause is a column on the issuance rather than a runtime flag, so it
survives a restart — which is exactly when it matters. Failures back off
exponentially with jitter.

### Finishing: who gets told

**Issuing is a background job and the operator may close EDOS entirely.** The
request returns 202 immediately and the worker runs in its own process, so nothing
depends on a browser tab staying open — which matters, because 500 certificates at
the 200/hour quota is about two and a half hours.

When an issuance reaches a terminal state, `settleIssuance` queues a `notify` job
**on the transition**, guarded by a unique index so several jobs finishing in the
same instant cannot produce several emails about one batch. The notification is a
job rather than a direct send at the end of the run: if the mail server is briefly
down, a direct send would be lost and nobody would ever learn the batch completed.

- **The person who started it** gets the counts — recipients, generated, emails
  accepted, anything failed or unconfirmed — and a deep link to the run's record.
  It reports what happened rather than declaring success: a run where four emails
  could not be delivered is finished but not fine.
- **Administrators** (`authority_level = 0`) get a one-line operational note: how
  many certificates were in the run, the outcome, and how many need review.
  **No certificate detail at all** — not the batch name, not the programme, not the
  requester, and certainly not a recipient. An operational alert is not a reason to
  circulate a roster to people who were never granted `CERT_VIEW`. This is asserted
  by a test that fails if any identifying string reaches an administrator.

The requester also gets an **EDOS notification** — the same one the bell shows —
pointing at the same record the email links to, so somebody who never opens their
inbox still finds out. **The worker writes that row itself rather than calling
`utils/notify`**: that module imports the realtime layer, and a socket emit from a
separate process is a no-op anyway, since the socket map is per-process. Web push
is sent directly because it is HTTP and does cross a process boundary; a failed
push is logged and ignored, since a learner's certificate must not wait on
somebody's expired browser subscription. The bell picks it up on the next load.

A failing administrator mailbox is caught and logged rather than failing the job,
because a retry would email the operator their own summary a second time over
somebody else's bounce. The `notify` job is excluded from the outstanding-work
count, or an issuance could never settle.

**Not done: the load rehearsal.** The plan requires 1,200 synthetic recipients
under representative traffic, with measured API latency and worker RSS, before the
pacing defaults are trusted in production.

## Errors and release gates

| HTTP | Codes |
| --- | --- |
| 400 | INVALID_REQUEST, ACCESS_CODE_INVALID |
| 401 | AUTH_REQUIRED, ACCOUNT_UNAVAILABLE, DOWNLOAD_ACCESS_REQUIRED, GOOGLE_TOKEN_INVALID, GOOGLE_EMAIL_UNVERIFIED |
| 403 | LMS_ACCESS_DISABLED, CERT_PERMISSION_REQUIRED, ADMIN_REQUIRED, ATTENDANCE_NOT_RECOGNISED, ATTENDANCE_WRONG_COURSE |
| 404 | CERTIFICATE_NOT_FOUND, BATCH_NOT_FOUND, ATTENDANCE_SESSION_NOT_FOUND, SESSION_NOT_FOUND |
| 409 | REVISION_CONFLICT, IDEMPOTENCY_CONFLICT, BATCH_NOT_DRAFT, BATCH_NOT_APPROVED, APPROVAL_REQUIRED, ISSUANCE_CONFLICT, COHORT_COURSE_CONFLICT, CERTIFICATE_UNAVAILABLE, ATTENDANCE_NOT_STARTED, ATTENDANCE_CLOSED, ATTENDANCE_COURSE_CLOSED, ATTENDANCE_EMAIL_AMBIGUOUS, ATTENDANCE_CONFLICT, OFFERING_CLOSED, OFFERING_ALREADY_CLOSED, COHORT_CLOSED, COHORT_ALREADY_CLOSED |
| 413 | IMPORT_TOO_LARGE |
| 422 | IMPORT_INVALID, IDENTITY_REVIEW_REQUIRED, ASSET_NOT_APPROVED, SESSION_DETAILS_REQUIRED, SESSION_WINDOW_REQUIRED, SESSION_WINDOW_INCOMPLETE, SESSION_WINDOW_INVALID, SESSION_WINDOW_TOO_LONG, SESSION_LINK_REQUIRES_DETAILS, NO_SESSIONS |
| 429 | RATE_LIMITED |
| 503 | CERTIFICATE_SERVICE_UNAVAILABLE, PDF_UNAVAILABLE, ISSUANCE_UNAVAILABLE, ATTENDANCE_UNAVAILABLE, ATTENDANCE_SERVICE_UNAVAILABLE, GOOGLE_SIGN_IN_UNAVAILABLE |

Pending before real issuance: public full-name/retention policy, approver grants,
completion evidence, approved measured artwork/font/signature handoff, provider
quotas, assisted delivery policy and successful 1,200-recipient isolated rehearsal.
Contract examples are synthetic fixtures only. No real mail, production load test,
deployment, migration 099, resets, seeds or reconciliation apply are authorized.
