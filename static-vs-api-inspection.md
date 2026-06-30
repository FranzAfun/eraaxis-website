# ERA AXIS Website — API Integration Architecture Report

---

## 1. What Currently Exists

**Folders:**
- `src/hooks/` — exists but empty
- `src/services/` — does not exist
- `src/context/` — does not exist
- `src/providers/` — does not exist

**Libraries installed:**
- React 19, React Router v7, Lucide, Tailwind
- **No data-fetching libraries** — no React Query, SWR, Axios, or fetch wrappers

**Environment:**
- `VITE_API_URL=http://localhost:5000` — defined in `.env`, never used

**Data today:**
- 100% hardcoded via imports from `src/data/` — no API calls anywhere in the codebase

---

## 2. Current Component Tree

```
App
  └─ BrowserRouter
      └─ AppShell
          ├─ RouteTransitionOverlay
          ├─ ScrollToTop
          └─ SiteLayout
              ├─ Header
              ├─ <main> (all routes)
              └─ Footer
```

Each page/component imports directly from `src/data/` — no hooks, no context, no providers.

---

## 3. Distinct Data Sources Needed from EDOS

| Source | Used By |
|---|---|
| `/programmes` | Programs page, ProgrammesOverview (home), enrolment pages |
| `/partners` | Partners page, PartnersStrip (home) |
| `/insights` | Insights page, InsightDetail, InsightsPreview (home) |
| `/gallery` | Gallery page, GalleryPreview (home) |
| `POST /contact/inquiries` | Contact form |
| `POST /newsletter/subscribe` | Newsletter form (Insights, Contact) |

Secondary: `/faqs`, `/testimonials` — lower priority, less shared across pages.

---

## 4. Option Evaluation

### Option A — Single BootstrapProvider (React Context)
- One `GET /bootstrap` request on app mount
- Stores all data in a Context value
- All components consume via `useBootstrap()` hook
- No new dependencies

**Pros:** Simple, one request, globally cached for session, no bundle weight  
**Cons:** All-or-nothing payload — one failure blocks everything; no per-resource invalidation

---

### Option B — React Query (TanStack Query)
- Per-resource `useQuery` hooks (`useProgammes`, `usePartners`, etc.)
- Built-in caching, deduplication, stale-while-revalidate, devtools

**Pros:** Per-resource caching, flexible, industry standard for complex apps  
**Cons:** Adds ~35KB dependency, more boilerplate, overkill for semi-static content with no real-time needs

---

### Option C — Simple services + hooks
- `src/services/api.js` — fetch wrapper functions
- Per-resource hooks with module-level cache variable
- No new dependencies

**Pros:** No dependency, full control, simple  
**Cons:** Manual cache management, no deduplication guarantee, more boilerplate per resource

---

## 5. Recommendation

**Option A — Single BootstrapProvider.**

**Why:**
- Site data (programmes, partners, insights, gallery) is semi-static — changes daily at most, not per user action
- Home page needs partners + insights + gallery simultaneously — one request is more efficient than four
- No real-time requirements
- Aligns with the current minimal-dependency stack
- Simplest to implement and maintain for a small team
- If complexity grows later (real-time, per-resource invalidation), migrate specific resources to React Query without rebuilding the whole architecture

---

## 6. File Placement

```
src/
├─ services/
│  └─ api.js                    ← fetch wrapper, bootstrap call, VITE_API_URL base
├─ hooks/
│  └─ useBootstrap.js           ← module-level cache + useState/useEffect fetch logic
├─ context/
│  └─ BootstrapContext.jsx      ← React Context provider + useBootstrap() consumer hook
├─ App.jsx                      ← UPDATED: wrap AppShell in <BootstrapProvider>
└─ [pages + components]         ← replace static imports with useBootstrap()
```

**Wrap order in App.jsx:**
```
BrowserRouter
  └─ BootstrapProvider          ← new, wraps everything
      └─ AppShell
```

**Components to update:**
- `src/pages/Programs.jsx`
- `src/pages/Partners.jsx`
- `src/pages/Insights.jsx`
- `src/pages/InsightDetail.jsx`
- `src/pages/Gallery.jsx`
- `src/components/home/PartnersStrip.jsx`
- `src/components/home/InsightsPreview.jsx`
- `src/components/home/ProgrammesOverview.jsx`
- `src/components/sections/GalleryPreview.jsx`

---

## 7. Expected EDOS Bootstrap Contract

```
GET /api/bootstrap

Response:
{
  programmes: Programme[],
  partners:   Partner[],
  insights:   Insight[],
  gallery:    GalleryItem[],
  meta?:      { version, timestamp }
}
```

FAQs and testimonials can be added to this response or served as separate endpoints depending on how frequently they change.

---

## 8. Migration Path

1. Create `src/services/api.js`
2. Create `src/hooks/useBootstrap.js` with module-level cache
3. Create `src/context/BootstrapContext.jsx`
4. Wrap `AppShell` in `BootstrapProvider` inside `App.jsx`
5. Refactor pages/components one by one to use `useBootstrap()`
6. Keep `src/data/` files as schema reference and fallback during transition
7. Wire contact form and newsletter to their respective POST endpoints separately
