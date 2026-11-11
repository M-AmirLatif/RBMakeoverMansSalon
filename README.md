# R.B Makeover Man's Salon — Official Website

A production-ready website for **R.B Makeover Man's Salon**, located at Rose Commercial, Main Boulevard, Park View City, Lahore, Pakistan. Built mobile-first with modern editorial aesthetics, high performance, strict accessibility, and authentic local business integration.

---

## 🌟 Key Features

- **Mobile-First Responsive Design:** Engineered and tested from 360px up to 1920px 4K displays.
- **Editorial Barbershop Aesthetic:** Deep slate-charcoal backgrounds (`#0B0F0D`), warm linen typography (`#F5EFEB`), and antique brushed gold accents (`#C59B46`).
- **Interactive Grooming Menu:** 23 verified services arranged across 4 tabbed categories, each paired with authentic salon interior photography and a direct WhatsApp inquiry generator.
- **Verified Local Proof:** Displays the 4.9-star Google rating and 36 verified reviews, with attribution cards for praised craftspeople (Ijaz/Ejaz Bhai, Naveed Bhai).
- **Accessible Lightbox Portfolio:** Fast, keyboard-navigable (`←`, `→`, `ESC`), touch-swipeable gallery displaying real salon stations, styling bays, and cosmetic inventories.
- **Direct WhatsApp Appointment Engine:** Client-side form with strict Pakistani mobile number validation (`03XXXXXXXXX` or `+923XXXXXXXXX`) that formats prefilled booking requests directly to WhatsApp (`+92 326 9326566`).
- **SEO & Local Schema:** Complete Next.js metadata, OpenGraph cards, Twitter cards, dynamic `sitemap.xml`, `robots.txt`, and Google `HairSalon` JSON-LD structured data.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (v16 App Router, TypeScript, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4 with custom CSS theme tokens)
- **Typography:** Self-hosted Google Fonts via `next/font`:
  - Display / Hero: `Bebas Neue`
  - Headings: `Playfair Display`
  - Body / UI: `Plus Jakarta Sans`
- **Icons:** `lucide-react` + custom inline SVGs for WhatsApp, Facebook, Google, and salon branding.
- **Image Optimization:** Dual-format WebP and JPEG asset delivery via `next/image` with responsive `sizes` and zero layout shift.

---

## 📁 Project Architecture

```
RbMakeovermansSalon/
├── images/                        # Original source photos from client
├── websiteuisampleimages/         # Design reference mockups
├── public/
│   ├── images/                    # Optimized WebP and JPEG assets
│   ├── favicon.svg                # Scalable brand monogram icon
│   └── apple-touch-icon.svg       # iOS home-screen icon
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts, JSON-LD, skip-link
│   │   ├── page.tsx               # Single-page application orchestration
│   │   ├── globals.css            # Tailwind theme tokens & base styles
│   │   ├── sitemap.ts             # Dynamic sitemap generator
│   │   └── robots.ts              # Search engine crawler configuration
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Sticky glass navigation & mobile drawer
│   │   │   ├── Footer.tsx         # Comprehensive branding & contact footer
│   │   │   └── MobileActionBar.tsx# Sticky bottom Call/WhatsApp/Map bar
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx    # Impact headline, rating chip & stat strip
│   │   │   ├── AboutSection.tsx   # Salon philosophy & owner pull quote
│   │   │   ├── ServicesSection.tsx# 4 categories, 23 services & WhatsApp inquiries
│   │   │   ├── WhyChooseUsSection.tsx# 6 pillars grounded in client reviews
│   │   │   ├── GallerySection.tsx # Bento masonry grid with category filters
│   │   │   ├── TestimonialsSection.tsx# 4.9 summary & 9 authentic review cards
│   │   │   ├── TeamSection.tsx    # Customer praise for Ijaz & Naveed Bhai
│   │   │   ├── FacilitiesSection.tsx# Grouped amenity tiles (WiFi, Parking, etc.)
│   │   │   ├── LocationSection.tsx# Interactive Google Maps & directions
│   │   │   └── ContactSection.tsx # Pakistan phone validation & WhatsApp composer
│   │   └── ui/
│   │       ├── BrandLogo.tsx      # Vector monogram and salon wordmark
│   │       ├── Button.tsx         # Pill-shaped accessible CTA button
│   │       ├── SectionHeading.tsx # Two-tone Playfair heading component
│   │       ├── RatingStars.tsx    # Fractional star rating display
│   │       ├── Lightbox.tsx       # Accessible modal for image inspection
│   │       └── Icons.tsx          # Branded inline SVG icons
│   ├── data/
│   │   ├── siteConfig.ts          # SINGLE SOURCE OF TRUTH for salon details
│   │   ├── services.ts            # 23 verified services categorized
│   │   ├── reviews.ts             # 9 genuine Google reviews
│   │   ├── amenities.ts           # 5 categories of verified salon facilities
│   │   ├── team.ts                # Craftspeople praised by customers
│   │   └── images.ts              # Typed image manifest with alt texts & focal points
│   └── lib/
│       ├── validation.ts          # Phone, date, and form validation utilities
│       ├── whatsapp.ts            # Encoded WhatsApp URL message builders
│       └── utils.ts               # Formatting helpers & class mergers
├── run-tests.mjs                  # Automated browser E2E test suite
└── README.md
```

---

## ⚙️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Production Build & Linting
```bash
npm run lint
npm run build
```

### 4. Run Automated Browser Test Suite
Runs end-to-end tests across 5 viewports (360px, 390px, 768px, 1280px, 1920px), verifying responsive overflow, mobile menu drawer, category tabs, lightbox modal, and WhatsApp form validation:
```bash
node run-tests.mjs
```

---

## ✏️ How to Edit Business Information

All business details live in a single typed configuration file:
👉 **`src/data/siteConfig.ts`**

In this file you can update:
- **Salon Name & Owner:** Owner name (`Imtiaz Ahmad`), brand name, and introductory message.
- **Contact Details:** Primary phone (`0326 9326566`), alternate phone, and email (`r.bmakeover92@gmail.com`).
- **WhatsApp Target:** Target mobile number for instant appointment and service inquiries.
- **Physical Address:** Street, commercial zone, and Google Maps query strings.
- **Social Media:** Facebook page URL and handle.

---

## 🖼️ How Images Are Managed

- **Originals:** Preserved untouched in `images/`.
- **Public Assets:** Processed, cropped, and resized versions live in `public/images/` in both optimized `.webp` and `.jpg` formats.
- **Manifest:** All image metadata (alt texts, focal points, dimensions, roles, and categories) is cataloged in `src/data/images.ts`.

---

## 🚀 Deployment

The site is fully optimized for one-click deployment on **Vercel**, **Netlify**, or any Node.js hosting platform:

### Deploying to Vercel
1. Push the code to a Git repository (GitHub / GitLab / Bitbucket).
2. Import the project in [Vercel Dashboard](https://vercel.com/new).
3. Set the optional environment variable:
   - `NEXT_PUBLIC_SITE_URL`: Your live domain (e.g. `https://rbmakeover.com`).
4. Click **Deploy**.
