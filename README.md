# ERA AXIS Official Website

## Overview
This is the official public frontend for ERA AXIS, Ghana's practical STEM and digital skills education platform. The website presents programmes, the ERA Dev Board, partnerships, insights, gallery updates, and enrolment/dues pathways.

## Tech Stack
- React
- Vite
- Tailwind CSS
- React Router
- lucide-react
- Netlify deployment

## Pages and Features
- Responsive public marketing site
- Homepage with hero, programme overview, partners, impact, insights, and CTA sections
- About page
- Programmes listing with detail routes (School STEM, Out-of-School Youth, Online Learning, ERA Digital Skills)
- ERA Dev Board page
- Partners page
- Insights listing and insight detail pages
- Gallery page
- FAQ page
- Contact page with client-side enquiry form
- Enrolment & Dues hub
- Programme Enrolment, Monthly Dues, and Student Chapter payment foundations
- Custom 404 page
- Branded route transition overlay and scroll-to-top behavior
- Social links sourced from env in the footer

## Project Structure
- src/pages: Route-level screens.
- src/components: Reusable UI and shared layout pieces.
- src/components/layout: Header, footer, and layout scaffolding.
- src/components/home: Homepage-only sections.
- src/components/sections: Reusable page sections (FAQ, gallery preview, etc.).
- src/data: Static content data (FAQs, insights, partners, gallery).
- src/assets: Images and brand assets.
- src/styles: Theme variables and global styles.

## Local Setup
```bash
npm install
npm run dev
npm run lint
npm run build
```

## Environment Variables
Create a `.env` file (or copy `.env.example`) and define:
```
VITE_API_BASE_URL=
VITE_SITE_URL=
VITE_SOCIAL_LINKEDIN_URL=
VITE_SOCIAL_X_URL=
VITE_SOCIAL_INSTAGRAM_URL=
VITE_SOCIAL_TIKTOK_URL=
VITE_SOCIAL_WHATSAPP_URL=
```

Notes:
- `VITE_` variables are public and are bundled into the client.
- Do not place secrets in frontend env files.
- `VITE_API_BASE_URL` and `VITE_SITE_URL` are reserved for future backend integration and canonical links.

## Deployment (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- SPA routing is handled via `netlify.toml` redirects

## Deployment Readiness Checklist
- `npm run lint`
- `npm run build`
- Check routes and page transitions
- Check mobile responsiveness
- Set Netlify environment variables
- Confirm social links render as expected

