# Certificate API contract

Contract: `certificates.v1` (2026-09-06). EDOS owns this file; the website keeps
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

Website routes: `/certificates/verify/:publicId` and `/certificates/retrieve`.
Retrieval may prefill `?certificate=<publicId>` only; no email or grant in the URL.
No public directory, name lookup or email-wide record search.

## Staff access and preparation

`GET /api/lms/certificate-access` requires LMS + `CERT_VIEW`, and returns
`{ contractVersion: "certificates.v1", permissions: ["CERT_VIEW"] }` with only
the current user's explicitly granted certificate actions. This is access
discovery, not evidence that issuance or other future endpoints are ready.

The following batch paths are relative to `/api/lms/certificate-batches`:

| Method/path | Permission | Request / successful data |
| --- | --- | --- |
| GET `/` | CERT_VIEW | Paginated batch summaries |
| POST `/` | CERT_PREPARE | `{ offeringId, templateVersionId, signatureVersionIds, issueDate, programme, track }` -> 201 batch |
| GET `/:id` | CERT_VIEW | Batch, `revision`, `reviewHash`, state, counts, approval |
| PATCH `/:id` | CERT_PREPARE | Revision + changed draft fields -> new revision, clears approval |
| GET `/:id/template?format=csv\|xlsx` | CERT_PREPARE | Binary roster template |
| POST `/:id/import-preview` | CERT_PREPARE | Multipart `file`, `revision` -> preview token, counts, paginated rows/errors |
| POST `/:id/import-commit` | CERT_PREPARE | `{ revision, previewToken, decisions }` -> committed revision and counts |
| GET `/:id/preview?rowId=<uuid>&revision=<n>` | CERT_VIEW | Private DRAFT PDF from final renderer |
| POST `/:id/approve` | CERT_APPROVE | `{ revision, reviewHash, evidenceReference }` -> approval bound to frozen content |
| POST `/:id/issue` | CERT_ISSUE | `{ revision, reviewHash }` -> 202 accepted work, below |
| GET `/:id/results` | CERT_VIEW | Paginated row outcomes and aggregate progress |
| POST `/:id/pause`, `/:id/resume` | CERT_ISSUE | `{ revision, reason }` -> persisted control state |

Staff mutation requests carry `Idempotency-Key` (UUID) and an integer `revision`
when editing existing batches/certificates. Deduplication scope is actor + route
+ target + key; bind it to the request hash. Same key/different payload returns
409 `IDEMPOTENCY_CONFLICT`. Revision mismatches return 409 `REVISION_CONFLICT`.
Clients must reload/review, never silently retry with the latest revision.

Import columns: `source_record_id`, `learner_id` (optional), `full_name`, `email`,
`phone` (optional), `eligible`, `evidence_reference` (optional). `eligible` uses
`true`/`false`; blank email is retained as a visible assisted-delivery decision,
not dropped. Source IDs are stable within an explicitly recorded source namespace;
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

Approval is invalidated by any reviewed-content change. Default separate
preparer/approver; exact approver policy remains a release decision. Block issue
until that policy and asset authorization are resolved.

## Durable issuance and lifecycle

Issue commits a frozen issuance intent, unique batch-expansion job and audit in
one short transaction. It never renders, contacts SMTP/S3, or loops over the
whole roster. Retrying the same approved issue returns the same accepted intent.

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

## Errors and release gates

| HTTP | Codes |
| --- | --- |
| 400 | INVALID_REQUEST, ACCESS_CODE_INVALID |
| 401 | AUTH_REQUIRED, ACCOUNT_UNAVAILABLE, DOWNLOAD_ACCESS_REQUIRED |
| 403 | LMS_ACCESS_DISABLED, CERT_PERMISSION_REQUIRED, ADMIN_REQUIRED |
| 404 | CERTIFICATE_NOT_FOUND, BATCH_NOT_FOUND |
| 409 | REVISION_CONFLICT, IDEMPOTENCY_CONFLICT, APPROVAL_REQUIRED, COHORT_COURSE_CONFLICT, CERTIFICATE_UNAVAILABLE |
| 413 | IMPORT_TOO_LARGE |
| 422 | IMPORT_INVALID, IDENTITY_REVIEW_REQUIRED, ASSET_NOT_APPROVED |
| 429 | RATE_LIMITED |
| 503 | CERTIFICATE_SERVICE_UNAVAILABLE, PDF_UNAVAILABLE |

Pending before real issuance: public full-name/retention policy, approver grants,
completion evidence, approved measured artwork/font/signature handoff, provider
quotas, assisted delivery policy and successful 1,200-recipient isolated rehearsal.
Contract examples are synthetic fixtures only. No real mail, production load test,
deployment, migration 099, resets, seeds or reconciliation apply are authorized.
