# Certificate public pages progress

Updated: 2026-09-06. Branch: `feat/certificate-public-pages`.
Latest checkpoint: `git log -1 --oneline` (updated in the checkpoint itself).

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
- Counterpart feature commit will be recorded once EDOS commits its checkpoint.

Planning-chat handoff: Website feature branch created from current main and
baseline checks pass. Contract v1 is synchronized; public screens await their
implementation/visual checkpoints. No production changes or real emails.
