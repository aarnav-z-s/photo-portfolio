# AZ Photography Portfolio

A cinematic, full-feature photography portfolio built with Next.js 14, Framer Motion, Three.js, and Tailwind CSS.

---

## Features

- **Immersive hero** — full-viewport with parallax and cinematic type
- **Grain overlay** — animated SVG film grain across every page
- **Smooth scrolling** — Lenis ultra-smooth scroll with momentum
- **Lightbox** — fullscreen image viewer with keyboard nav and filmstrip
- **Story Mode** — sequential film-style photo viewer with progress bars
- **Gallery grid** — masonry / grid / editorial layouts with live toggle
- **Hover captions** — reveal on hover with metadata overlay
- **Image stacks** — animated layered images fanning on hover
- **Parallax** — Framer Motion scroll-linked parallax on images
- **Ambient audio** — Web Audio API ambient noise toggle (no file needed)
- **Three.js particles** — subtle floating dust on the hero
- **Drag-and-drop upload** — with automatic thumbnail generation via Sharp
- **Password-protected albums** — bcrypt-verified private routes
- **Four gallery sections** — Projects, Experimental, B&W, Visual Essays
- **Visual essays** — editorial layout with expandable long-form text
- **SEO** — full OpenGraph + Twitter metadata, sitemap-ready
- **Mobile-first** — fully responsive, swipe-gesture lightbox/story mode

---

## Quick Start

```bash
cd az-portfolio
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Vercel auto-detects Next.js — click **Deploy**
4. Add environment variables in **Project Settings → Environment Variables**

### Optional environment variables

| Variable | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage for uploads |
| `ALBUM_PASSWORD_HASH` | Bcrypt hash for private album auth |
| `NEXT_PUBLIC_SITE_URL` | Your domain (for SEO) |

### Generate a password hash

```bash
node -e "const b = require('bcryptjs'); console.log(b.hashSync('your-password', 10))"
```

Paste the output into `ALBUM_PASSWORD_HASH`.

### Custom domain

In Vercel project settings → **Domains** → add your domain. Vercel provisions SSL automatically.

---

## Adding Your Photos

Edit `src/lib/photos.ts`. Each photo object:

```ts
{
  id: 'unique-id',
  title: 'Image Title',
  src: 'https://your-image-url.jpg',   // leave '' to use placeholder color
  placeholder: '#0a0d12',              // CSS color shown before image loads
  width: 3200,
  height: 2400,
  category: 'projects',               // 'projects' | 'experimental' | 'bw' | 'essays'
  featured: true,
  metadata: {
    camera: 'Leica M6',
    lens: '35mm Summicron',
    aperture: 'f/2.0',
    shutter: '1/125',
    iso: '400',
    location: 'Tokyo, Japan',
    date: 'March 2024',
    thoughts: 'Shot at 5am when the city held its breath.',
  },
}
```

For essay entries, add an `essay` field with `intro` and `sections`.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 14.2 | Framework |
| React | 18 | UI |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 11 | Animations |
| Three.js + R3F | 0.166 | WebGL particles |
| Lenis | 1.1 | Smooth scroll |
| Sharp | 0.33 | Thumbnail generation |
| bcryptjs | 2.4 | Album password hashing |
| react-dropzone | 14 | File upload UI |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, SEO
│   ├── page.tsx            # Homepage (hero, featured, sections)
│   ├── globals.css         # Dark theme, grain, typography
│   ├── loading.tsx         # Page loading state
│   ├── not-found.tsx       # 404 page
│   ├── projects/           # Projects gallery
│   ├── experimental/       # Experimental gallery
│   ├── bw/                 # B&W gallery
│   ├── essays/             # Visual essays
│   ├── upload/             # Upload manager
│   ├── private/[slug]/     # Password-protected albums
│   └── api/
│       ├── upload/         # File upload + Sharp thumbnail
│       └── private/verify/ # Album password verification
├── components/
│   ├── Navigation.tsx      # Sticky dark nav + mobile menu
│   ├── GrainOverlay.tsx    # Film grain effect
│   ├── AudioToggle.tsx     # Web Audio ambient toggle
│   ├── SmoothScrollProvider.tsx  # Lenis wrapper
│   ├── PageHeader.tsx      # Reusable section header with parallax
│   ├── PhotoCard.tsx       # Lazy photo card with hover caption
│   ├── GalleryGrid.tsx     # Layout-switchable gallery with lightbox
│   ├── Lightbox.tsx        # Fullscreen viewer
│   ├── StoryMode.tsx       # Film-strip sequential viewer
│   ├── ImageStack.tsx      # Animated stacked image preview
│   ├── ParallaxSection.tsx # Scroll-linked parallax wrapper
│   ├── MetadataOverlay.tsx # Camera settings overlay
│   ├── ThreeCanvas.tsx     # Three.js particle field
│   └── UploadZone.tsx      # Drag-and-drop file upload
├── lib/
│   ├── photos.ts           # Photo data (edit this to add your images)
│   └── utils.ts            # Helpers (cn, clamp, etc.)
└── types/
    └── index.ts            # TypeScript types
```

---

## License

Personal use. All photographs © Aarnav Sareen.
