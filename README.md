# SignBridge Ghana

> Real-time Ghanaian Sign Language (GSL) translation to English and Twi — running entirely in the browser.

**Cursor Hackathon · Ghana · 2025 · PRAXIS Framework**

---

## What it does

SignBridge turns GSL hand signs into spoken and written language using your webcam. No account, no upload — all hand-tracking runs locally via WebAssembly. The server only proxies GhanaNLP's translation and TTS APIs to keep the API key secret.

**Three modes:**
| Mode | Route | Description |
|---|---|---|
| Sign → Text | `/translate` | Point your camera at a GSL sign. Get instant English + Twi translation with audio. |
| Learn GSL | `/learn` | Interactive lesson cards for 10 core GSL signs with GIF demonstrations. |
| Text → Sign | `/speak` | Type a word or phrase and see the matching GSL sign GIFs. |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, `src/` directory) |
| Language | TypeScript (strict mode — no `any`) |
| Styling | Tailwind CSS v4 (config-free; tokens in `globals.css` `@theme`) |
| Hand tracking | `@mediapipe/hands` (WebAssembly, browser-only, lazy-imported) |
| Translation + TTS | GhanaNLP / Khaya AI (server-side via API route) |
| Fonts | DM Sans + DM Mono via `next/font/google` |
| Deploy | Vercel |

---

## Project structure

```
signbridge/
├── docs/
│   ├── SignBridge_Master_Plan_and_Cursor_Prompts.md   ← Build plan + Cursor prompts
│   └── SignBridge_Project_Summary.md                  ← 20-page project summary
├── public/
│   └── signs/                  ← Sign images/GIFs (hello.gif, yes.gif, etc.)
├── src/
│   ├── app/
│   │   ├── globals.css         ← Tailwind import + design tokens (@theme)
│   │   ├── layout.tsx          ← Root layout: Nav, Footer, DM Sans/Mono fonts
│   │   ├── page.tsx            ← Landing page (Hero, Stats, Problem, HowItWorks…)
│   │   ├── translate/
│   │   │   ├── page.tsx        ← Sign → Text/Audio mode ('use client')
│   │   │   └── loading.tsx     ← Branded spinner
│   │   ├── learn/
│   │   │   ├── page.tsx        ← GSL lesson cards with category filter
│   │   │   └── loading.tsx     ← Branded spinner
│   │   ├── speak/
│   │   │   ├── page.tsx        ← Text → Sign GIF lookup
│   │   │   └── loading.tsx     ← Branded spinner
│   │   └── api/
│   │       └── translate/
│   │           └── route.ts    ← GhanaNLP proxy (server-side, holds API key)
│   ├── components/
│   │   ├── HandCamera.tsx      ← 'use client' | webcam + MediaPipe integration
│   │   ├── LandmarkCanvas.tsx  ← 'use client' | hand skeleton overlay
│   │   ├── SignResult.tsx      ← 'use client' | detected sign label display
│   │   ├── LanguageToggle.tsx  ← EN / Twi toggle pill
│   │   ├── SignGif.tsx         ← Sign image with fallback placeholder
│   │   ├── LessonCard.tsx      ← Learn mode card (GIF + labels + Try It button)
│   │   ├── ModeCard.tsx        ← Landing page mode selector card
│   │   ├── Nav.tsx             ← Top navigation bar
│   │   ├── NavBar.tsx          ← Navigation bar internals
│   │   └── Footer.tsx          ← Site footer
│   └── lib/
│       ├── classifier.ts       ← Pure TS: 21 Landmark[] → sign label
│       ├── signs.ts            ← SIGNS[] vocabulary + SIGN_MAP lookup + types
│       └── audio.ts            ← preloadTwiAudio(), playAudio(), speakEnglish()
├── .cursor/
│   ├── rules/
│   │   └── signbridge.mdc      ← Cursor AI rules for this repo
│   └── skills/
│       └── ui-ux-pro-max/      ← UI/UX skill for Cursor agents
├── .env.local                  ← GHANANLP_API_KEY (never commit — gitignored)
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── package.json
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A GhanaNLP / Khaya AI API key — [apply here](https://translation-api.ghananlp.org/)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create `.env.local` in the project root:

```env
GHANANLP_API_KEY=your_key_here
```

> This file is gitignored. Never commit it. The key is only accessed inside `src/app/api/translate/route.ts`.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

---

## Sign vocabulary (10 signs)

| Label | Twi | Category | Hand shape |
|---|---|---|---|
| hello | Mahɔ | greeting | Open palm — all 4 fingers extended |
| yes | Aane | response | Thumbs up — thumb up, fingers curled |
| no | Daabi | response | Thumb down, fingers curled |
| help | Boa me | action | Index finger only extended |
| stop | Gyae | action | All fingers curled, thumb tucked across palm |
| good | Eye | response | Index + middle extended (peace/scissors) |
| bad | Bɔne | response | Fist with thumb pointing clearly down |
| water | Nsuo | object | Index + middle + ring extended (W-shape) |
| name | Din | object | Pinky only extended |
| school | Sukuu | object | L-shape: thumb up + index extended |

---

## Architecture

```
Webcam frame (browser)
  ↓ @mediapipe/hands — WebAssembly, client-only
  ↓ 21 landmark coordinates [{x, y, z}, …]
  ↓ classifySign(landmarks) — src/lib/classifier.ts
  ↓ English label e.g. 'hello'
  ├─ lang='en'  →  window.speechSynthesis.speak('hello') — instant, no API
  └─ lang='tw'  →  POST /api/translate { label:'hello', lang:'tw' }
                  ↓ GhanaNLP translate: 'hello' → 'Mahɔ'
                  ↓ GhanaNLP TTS: 'Mahɔ' → audio buffer (base64)
                  ↓ Browser plays audio + displays both labels
```

**Privacy guarantee:** Camera data never leaves the device. MediaPipe processes frames entirely in WebAssembly. Only the classified text label (e.g. `"hello"`) is sent to the server for translation.

---

## Design tokens

Defined in `src/app/globals.css` under `@theme inline`:

| Token | Value | Usage |
|---|---|---|
| `green` | `#1D9E75` | Primary brand colour, buttons, accents |
| `green-dark` | `#0F6E56` | Hover states |
| `green-light` | `#E1F5EE` | Backgrounds, badges |
| `green-mid` | `#9FE1CB` | Secondary accents |
| `charcoal` | `#2C2C2A` | Dark cards |
| `ink` | `#111111` | Body text |
| `page` | `#EEECEA` | Page background |
| `radius-pill` | `100px` | Pill-shaped buttons/badges |

---

## Key rules (for AI agents and contributors)

- **Never** import `@mediapipe/hands` at the top of a file — always lazy-import inside `useEffect` or the Next.js build crashes on SSR.
- **Never** reference `process.env.GHANANLP_API_KEY` in client components — server-side only.
- **Always** add `'use client'` to any file using MediaPipe, webcam, `useState`, `useEffect`, `useRef`, or audio APIs.
- **Always** mirror both `<video>` and `<canvas>` with `className='scale-x-[-1]'`.
- TypeScript strict mode — no `any`, no inline styles, Tailwind utility classes only.
- Named exports for all components and utilities; default exports only for `page.tsx`, `layout.tsx`, `route.ts`.

---

## Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deploy on Vercel

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add `GHANANLP_API_KEY` as an environment variable in Project Settings → Environment Variables.
4. Deploy.

---

## Context

Over **470,000 Ghanaians** live with hearing loss. Ghana has no formal sign language policy, fewer than 50 certified GSL interpreters for 33 million people, and only ~16 schools for the deaf nationally. SignBridge is a first step toward bridging that gap — starting with the 10 most essential signs, with English and Twi output, running on any device with a camera.

---

*Built with Next.js 16, @mediapipe/hands, GhanaNLP Khaya AI APIs, and Tailwind CSS v4.*
