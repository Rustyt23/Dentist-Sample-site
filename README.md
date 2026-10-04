# SmileCare Dental Clinic — Client Demo

A frontend-only demo website for a premium dental clinic, built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.

All clinic details, doctor profiles, prices, reviews and appointment availability are **sample content**. There is no backend, database, authentication or payments — the booking flow is a realistic frontend mock.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build && npm start   # production build on http://localhost:3000
```

## Deploy

Every page is statically generated, so it deploys anywhere that runs Next.js.

**Vercel (recommended):** push the project to a Git repository, import it at vercel.com/new, keep the defaults and deploy. Social preview URLs are configured automatically.

**Other hosts (Netlify, Render, a VPS):** run `npm run build`, then `npm start`. Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://smilecare-demo.example`) so WhatsApp/social link previews use the correct domain.

## Pages

| Route         | Contents                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------- |
| `/`           | Hero, trust indicators, treatments, why us, dentists, before/after, reviews, gallery, FAQ, emergency CTA, visit, CTA |
| `/treatments` | Filterable treatment catalogue with prices, badges, dentists and "Book this treatment" links |
| `/doctors`    | Full dentist profiles with working days and "Book with…" links                               |
| `/gallery`    | Filterable clinic gallery with a swipeable lightbox                                         |
| `/contact`    | Contact channels, emergency line, hours, map placeholder, full FAQ                           |
| `/book`       | Mock booking flow: treatment → dentist → date & time → details → confirmation + WhatsApp     |

`/book` accepts `?treatment=<slug>` and `?doctor=<slug>` to pre-select options (used by buttons across the site).

## Replacing the sample content

All content lives in `lib/data/`:

- `clinic.ts` — clinic name, phone, WhatsApp number, emergency number, email, address, landmark, Google Maps link, opening hours, headline stats
- `doctors.ts` — dentist names, photos, credentials, bios, quotes, working days, stats
- `treatments.ts` — treatments, prices, durations, badges
- `content.ts` — reviews, FAQs, gallery photos, before/after cases

Dummy availability for the booking flow is generated in `lib/booking.ts`. Replace `getSlots()` with a call to the clinic's real scheduling system when going live.

Photos are served from Unsplash (free licence) via `next/image`; their IDs are stored in the data files. Replace them with the clinic's own photography before launch.

## Structure

```
app/                 routes, layout, global styles (design tokens in globals.css @theme), favicon, OG image
components/ui/       Button, Container, Reveal, SectionHeading, PageHeader
components/layout/   TopBar, Navbar, Footer, MobileActionBar, Logo
components/sections/ homepage sections (also reused on inner pages), EmergencyCTA
components/book/     booking flow (steps, calendar, summary, success screen)
lib/                 data, booking availability engine, utilities
```
