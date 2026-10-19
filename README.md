# ERA AXIS Official Website

## Overview
This is the official public frontend for ERA AXIS, Ghana's practical STEM and digital skills education platform (eraaxis.com). It presents programmes, the ERA Dev Board, partnerships, insights and the gallery, and takes sign-ups, payments, forms, attendance and certificate checks.

Programmes, partners, insights, gallery, forms and certificates are managed in **EDOS** (the separate internal repo, `C:\Projects\www\edos`) and served from its API at `/api/website`. This site is a backend-driven frontend, not a static site. Sign-ups, dues, forms and contact messages post to the same backend, which sends the emails.

## Tech Stack
- React 19 + Vite
- Tailwind CSS 4
- React Router
- GSAP (ScrollTrigger scenes, loaded on first scroll or touch)
- `thinking-orbs` (loading orbs on busy buttons and waiting text)
- lucide-react
- Inter, self-hosted in `public/fonts`
- Netlify (edge functions for link previews)

## Pages and Features
- Home, About, Programmes (School STEM, Out-of-School Youth, Online Learning, ERA Digital Skills), Dev Board, Partners, Insights, Gallery, FAQ, Contact, Privacy
- `/payments`: programme enrolment, Student Chapter and monthly dues sign-ups (email confirmed by Google or code before paying), continue a payment, payment confirmation
- `/forms/:slug`: forms built in EDOS's LMS (paid or free, file questions with Google Drive, school picker, consent tick)
- Attendance sign-in with Google for LMS sessions
- Public certificate verification (`/certificates/verify/:id`)
- Newsletter confirm and unsubscribe pages
- Motion system in `src/components/motion` (Reveal, PickerTabs, ScrollStack, GSAP scenes)
- Custom 404, soft page landings, scroll-to-top

## Project Structure
- `src/pages`: route-level screens
- `src/components`: `layout` (header, footer), `home`, `programme`, `devboard`, `motion`, `forms`, `ui` (SelectField and other controls), `sections`, `common`
- `src/data`: static content (FAQs, programmes, payments, gallery, SEO)
- `src/assets`: images (always `.webp`) and brand assets
- `src/styles`: theme tokens and global styles; brand colours and their measured contrast in `docs/brand-colours.md`
- `netlify/edge-functions`: link previews for shared forms, insights and private links
- `scripts`: `prerender-seo.js` (runs after build), `check-brand-contrast.js` (`npm run check:contrast`)
- `docs/certificates/API_CONTRACT.md`: must stay byte-identical to EDOS's copy

## Local Setup
```bash
npm install
npm run dev      # port 5174
npm run lint
npm test
npm run build
```

## Environment Variables
Copy `.env.example` to `.env`:
```
VITE_API_URL=
VITE_SITE_URL=
VITE_SOCIAL_LINKEDIN_URL=
VITE_SOCIAL_X_URL=
VITE_SOCIAL_INSTAGRAM_URL=
VITE_SOCIAL_TIKTOK_URL=
VITE_SOCIAL_WHATSAPP_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_API_KEY=
VITE_GOOGLE_APP_ID=
```
The three Google values are public by design (the API key is restricted to the Picker API and to our sites). Never mark them as secret on Netlify.

## Deployment (Netlify)
- Build command: `npm run build`; publish directory: `dist`
- SPA routing via `netlify.toml` redirects
- Shared `/forms/*`, insight and private links get their own preview card from `netlify/edge-functions/`, which reuse `VITE_API_URL`
- Pushing `main` does not publish while automatic builds are off; builds are allowed by hand on release

## Release Checklist
- Bump the version (fix releases bump the last number)
- `npm run lint`, `npm test`, `npm run build`
- Check pages and transitions on a phone and a desktop
- Lighthouse on a production build (`vite preview`), never on the dev server
