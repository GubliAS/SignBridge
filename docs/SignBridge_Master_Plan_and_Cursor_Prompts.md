# SignBridge Ghana
## Master Technical Implementation Plan + Cursor AI Prompts
**Cursor Hackathon · Ghana · 2025 · PRAXIS Framework**

| Stack | Hand tracking | Language API | Deploy |
|---|---|---|---|
| Next.js 15 + TypeScript | @mediapipe/hands | GhanaNLP (Khaya AI) | Vercel (free) |

---

# PART A — MASTER TECHNICAL PLAN

---

## 1. System architecture

> **Core principle:** All ML inference (MediaPipe) runs client-side in the browser via WebAssembly. No camera data ever leaves the device. The Next.js server only handles GhanaNLP API proxying to keep your API key secret.

### 1.1 Architecture layers

| Layer | Technology | Responsibility |
|---|---|---|
| Presentation | Next.js 15 App Router + Tailwind CSS | Pages, routing, UI components, responsive layout |
| Hand tracking | @mediapipe/hands (WebAssembly) | 21 landmark coordinates per frame at 25–30fps, runs in browser |
| Sign classifier | Pure TypeScript (`lib/classifier.ts`) | Rule-based function: 21 coords → sign label or null |
| Language API | GhanaNLP / Khaya AI (server-side) | Translation en→tw + TTS audio, proxied via Next.js API route |
| Speech (English) | Browser Web Speech API | `speechSynthesis` for English output — no API call needed |
| Static assets | `/public/signs/*.gif` | One GIF per sign for Learn mode and Text→Sign mode |

### 1.2 Data flow (sign → spoken output)

```
Webcam frame (browser)
  ↓ MediaPipe Hands (WebAssembly — client only)
  ↓ 21 landmark coordinates [{x,y,z}, …]
  ↓ classifySign(landmarks) — your rule function
  ↓ English label e.g. 'hello'
  ├─ lang='en' → window.speechSynthesis.speak('hello') — instant, no API
  └─ lang='tw' → POST /api/translate { label:'hello', lang:'tw' }
                ↓ Next.js API route (server)
                ↓ GhanaNLP translate: 'hello' → 'Mahɔ'
                ↓ GhanaNLP TTS: 'Mahɔ' → audio buffer (base64)
                ↓ Browser plays audio + displays both labels
```

### 1.3 Next.js client vs server boundary

> ⚠️ **Critical rule:** MediaPipe accesses `navigator.mediaDevices` (webcam) — a browser-only API. Any file that imports or uses MediaPipe MUST have `'use client'` at the top AND must lazy-import MediaPipe inside `useEffect`. If you import it at the top of any file, the Next.js build will crash.

| File | Boundary | Why |
|---|---|---|
| `HandCamera.tsx` | `'use client'` + lazy import | Needs `window`, `navigator`, webcam |
| `LandmarkCanvas.tsx` | `'use client'` | Canvas drawing APIs are browser-only |
| `TranslatePage.tsx` | `'use client'` | Uses `useState`, handles audio playback |
| `app/api/translate/route.ts` | Server Component (default) | Holds `GHANANLP_API_KEY`, never sent to browser |
| `lib/classifier.ts` | Shared — no directive needed | Pure functions, no browser or server APIs |
| `lib/signs.ts` | Shared | Data only, no APIs |

---

## 2. Project file structure

```
signbridge/
├── .cursor/
│   └── rules/
│       └── signbridge.mdc     ← Cursor AI rules (from Part B)
├── src/
│   ├── app/
│   │   ├── page.tsx                ← Landing: mode selector
│   │   ├── layout.tsx              ← Root layout + metadata
│   │   ├── translate/
│   │   │   └── page.tsx            ← Sign → text/audio mode
│   │   ├── learn/
│   │   │   └── page.tsx            ← GSL lesson cards
│   │   ├── speak/
│   │   │   └── page.tsx            ← Text → sign mode
│   │   └── api/
│   │       └── translate/
│   │           └── route.ts        ← GhanaNLP proxy (server-side)
│   ├── components/
│   │   ├── HandCamera.tsx          ← 'use client' | webcam + MediaPipe
│   │   ├── LandmarkCanvas.tsx      ← 'use client' | dots on hand overlay
│   │   ├── SignResult.tsx          ← 'use client' | shows label + Twi
│   │   ├── LanguageToggle.tsx      ← EN/TW switcher
│   │   ├── SignGif.tsx             ← Animated sign display
│   │   ├── LessonCard.tsx          ← Learn mode card
│   │   └── ModeCard.tsx            ← Landing page mode selector
│   ├── lib/
│   │   ├── classifier.ts           ← landmarks[] → sign label
│   │   ├── signs.ts                ← Vocabulary + Twi labels + GIFs
│   │   └── audio.ts                ← Pre-cache + playback helpers
│   └── styles/
│       └── globals.css             ← Tailwind base + custom vars
├── public/
│   └── signs/                  ← hello.gif, yes.gif, etc.
├── .env.local                  ← GHANANLP_API_KEY (never commit)
├── next.config.ts
└── tailwind.config.ts
```

---

## 3. Core data types and vocabulary

### 3.1 TypeScript types

```ts
// lib/signs.ts

export type Lang = 'en' | 'tw'

export type Sign = {
  label:    string       // English label e.g. 'hello'
  twi:      string       // Twi equivalent e.g. 'Mahɔ'
  gifPath:  string       // '/signs/hello.gif'
  category: 'greeting' | 'response' | 'action' | 'object'
}

export type ClassifyResult = {
  sign:       string    // matched sign label
  confidence: number    // 0-1, based on rule match quality
} | null

export type TranslateResponse = {
  displayText: string        // text to show (Twi or English)
  audio:       string | null // base64 audio (Twi only)
  lang:        Lang
}
```

### 3.2 Sign vocabulary (`lib/signs.ts`)

```ts
export const SIGNS: Sign[] = [
  { label:'hello',  twi:'Mahɔ',   gifPath:'/signs/hello.gif',  category:'greeting' },
  { label:'yes',    twi:'Aane',   gifPath:'/signs/yes.gif',    category:'response' },
  { label:'no',     twi:'Daabi',  gifPath:'/signs/no.gif',     category:'response' },
  { label:'help',   twi:'Boa me', gifPath:'/signs/help.gif',   category:'action'   },
  { label:'stop',   twi:'Gyae',   gifPath:'/signs/stop.gif',   category:'action'   },
  { label:'good',   twi:'Eye',    gifPath:'/signs/good.gif',   category:'response' },
  { label:'bad',    twi:'Bɔne',   gifPath:'/signs/bad.gif',    category:'response' },
  { label:'water',  twi:'Nsuo',   gifPath:'/signs/water.gif',  category:'object'   },
  { label:'name',   twi:'Din',    gifPath:'/signs/name.gif',   category:'object'   },
  { label:'school', twi:'Sukuu',  gifPath:'/signs/school.gif', category:'object'   },
]

export const SIGN_MAP = Object.fromEntries(SIGNS.map(s => [s.label, s]))
```

---

## 4. Sign classifier — full implementation

### 4.1 Landmark reference map

| Index | Name | Finger | Use in rules |
|---|---|---|---|
| 0 | WRIST | — | Base reference point |
| 4 | THUMB_TIP | Thumb | `lm[4].y < lm[3].y` → thumb up |
| 8 | INDEX_FINGER_TIP | Index | `lm[8].y < lm[6].y` → index extended |
| 12 | MIDDLE_FINGER_TIP | Middle | `lm[12].y < lm[10].y` → middle extended |
| 16 | RING_FINGER_TIP | Ring | `lm[16].y < lm[14].y` → ring extended |
| 20 | PINKY_TIP | Pinky | `lm[20].y < lm[18].y` → pinky extended |

### 4.2 Full `classifier.ts`

```ts
// src/lib/classifier.ts
// Pure TypeScript — no framework, no browser APIs

export type Landmark = { x: number; y: number; z: number }
export type ClassifyResult = { sign: string; confidence: number } | null

// Helpers: is this finger extended or curled?
const ext  = (tip: Landmark, pip: Landmark) => tip.y < pip.y  // extended
const curl = (tip: Landmark, pip: Landmark) => tip.y > pip.y  // curled

type Rule = (lm: Landmark[]) => boolean

const RULES: Record<string, Rule> = {
  'hello':  lm => ext(lm[8],lm[6])   && ext(lm[12],lm[10])
               && ext(lm[16],lm[14])  && ext(lm[20],lm[18]),

  'yes':    lm => lm[4].y < lm[3].y
               && curl(lm[8],lm[6])   && curl(lm[12],lm[10])
               && curl(lm[16],lm[14]) && curl(lm[20],lm[18]),

  'no':     lm => lm[4].y > lm[3].y
               && curl(lm[8],lm[6])   && curl(lm[12],lm[10])
               && curl(lm[16],lm[14]),

  'help':   lm => ext(lm[8],lm[6])
               && curl(lm[12],lm[10]) && curl(lm[16],lm[14])
               && curl(lm[20],lm[18]),

  'stop':   lm => curl(lm[8],lm[6])  && curl(lm[12],lm[10])
               && curl(lm[16],lm[14]) && curl(lm[20],lm[18])
               && lm[4].x > lm[3].x,

  'good':   lm => ext(lm[8],lm[6])   && ext(lm[12],lm[10])
               && curl(lm[16],lm[14]) && curl(lm[20],lm[18]),

  'water':  lm => ext(lm[8],lm[6])   && ext(lm[12],lm[10])
               && ext(lm[16],lm[14])  && curl(lm[20],lm[18]),

  'name':   lm => curl(lm[8],lm[6])  && curl(lm[12],lm[10])
               && curl(lm[16],lm[14]) && ext(lm[20],lm[18]),

  'school': lm => lm[4].y < lm[3].y
               && ext(lm[8],lm[6]) && curl(lm[12],lm[10]),
}

export function classifySign(lm: Landmark[]): ClassifyResult {
  if (!lm || lm.length < 21) return null
  for (const [sign, rule] of Object.entries(RULES)) {
    if (rule(lm)) return { sign, confidence: 1 }
  }
  return null
}
```

---

## 5. Key component implementations

### 5.1 `HandCamera.tsx` — webcam + MediaPipe

> **This is the most critical file in the project.** Build and test this first. Nothing else works until this does.

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { classifySign, type Landmark } from '@/lib/classifier'

type Props = {
  onSign: (label: string) => void
  active: boolean
}

export default function HandCamera({ onSign, active }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastSign  = useRef<string | null>(null)
  const debounce  = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!active) return

    // CRITICAL: lazy import inside useEffect — never at top level
    import('@mediapipe/hands').then(({ Hands, HAND_CONNECTIONS }) => {
      const hands = new Hands({
        locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
      })
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.75,
        minTrackingConfidence:  0.75,
      })

      hands.onResults(results => {
        drawLandmarks(canvasRef.current, results, HAND_CONNECTIONS)
        const lm = results.multiHandLandmarks?.[0] as Landmark[]
        if (!lm) { lastSign.current = null; return }

        const result = classifySign(lm)
        if (!result) return
        if (result.sign === lastSign.current) return

        lastSign.current = result.sign
        clearTimeout(debounce.current)
        // Only fire after 600ms of the same sign — prevents rapid-fire calls
        debounce.current = setTimeout(() => onSign(result.sign), 600)
      })

      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            const tick = async () => {
              await hands.send({ image: videoRef.current! })
              requestAnimationFrame(tick)
            }
            tick()
          }
        }
      })
    })
  }, [active])

  return (
    <div className='relative w-full aspect-video rounded-2xl overflow-hidden bg-black'>
      <video ref={videoRef} autoPlay muted playsInline
        className='w-full h-full object-cover scale-x-[-1]' />
      <canvas ref={canvasRef}
        className='absolute inset-0 w-full h-full scale-x-[-1]' />
    </div>
  )
}
```

### 5.2 `app/api/translate/route.ts` — GhanaNLP proxy

```ts
// Server-side only. API key NEVER reaches the browser.
import { NextRequest, NextResponse } from 'next/server'

const BASE    = 'https://translation-api.ghananlp.org/v1'
const API_KEY = process.env.GHANANLP_API_KEY!
const HEADERS = {
  'Content-Type':              'application/json',
  'Ocp-Apim-Subscription-Key': API_KEY,
}

export async function POST(req: NextRequest) {
  const { label, lang } = await req.json()

  if (lang === 'en') {
    return NextResponse.json({ displayText: label, audio: null, lang: 'en' })
  }

  try {
    const twiText: string = await fetch(`${BASE}/translate`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ in: label, lang: 'en-tw' })
    }).then(r => r.json())

    const audioBuffer = await fetch(`${BASE}/tts`, {
      method: 'POST', headers: HEADERS,
      body: JSON.stringify({ text: twiText, lang: 'tw' })
    }).then(r => r.arrayBuffer())

    return NextResponse.json({
      displayText: twiText,
      audio: Buffer.from(audioBuffer).toString('base64'),
      lang:  'tw'
    })
  } catch (err) {
    console.error('GhanaNLP error:', err)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
```

### 5.3 `lib/audio.ts` — pre-cache + playback

```ts
import { SIGNS } from './signs'

const twiCache = new Map<string, string>()  // label → base64

export async function preloadTwiAudio(): Promise<void> {
  await Promise.all(
    SIGNS.map(async sign => {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: sign.label, lang: 'tw' })
      })
      const { audio } = await res.json()
      if (audio) twiCache.set(sign.label, audio)
    })
  )
}

export function playAudio(base64: string): void {
  const binary = atob(base64)
  const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0))
  const blob   = new Blob([bytes], { type: 'audio/mpeg' })
  new Audio(URL.createObjectURL(blob)).play()
}

export function speakEnglish(text: string): void {
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang  = 'en-US'
  utt.rate  = 0.9
  window.speechSynthesis.speak(utt)
}

export function getCachedAudio(label: string): string | undefined {
  return twiCache.get(label)
}
```

---

## 6. Design system

> **Direction:** Clean, accessible, high-contrast. Dark teal primary palette. Mobile-first. Min touch target 48px. Works at 100% zoom on a 13-inch laptop for the demo.

### 6.1 Tailwind config additions

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#E1F5EE',
          100: '#9FE1CB',
          500: '#1D9E75',   // primary
          600: '#0F6E56',   // hover
          900: '#04342C',   // dark text on light bg
        },
        surface: '#F8FFFE',
      },
    },
  },
  plugins: [],
}
export default config
```

### 6.2 Component design specs

| Component | Key classes | Notes |
|---|---|---|
| Camera view | `relative w-full aspect-video rounded-2xl overflow-hidden bg-black` | Mirror with `scale-x-[-1]` |
| Sign label (large) | `text-6xl font-bold text-brand-600 text-center` | Readable from 2m during demo |
| Secondary label | `text-xl text-gray-500 text-center mt-1` | Shows the other language |
| Language toggle | `flex gap-2 p-1 bg-gray-100 rounded-full` | Active: `bg-brand-500 text-white` |
| Mode card | `p-6 rounded-2xl border-2 border-gray-100 hover:border-brand-500` | Arrow slides right on hover |
| Lesson card | Card with GIF top, label bottom, Try It CTA | Min-height 300px |
| Status dot | `w-3 h-3 rounded-full animate-pulse` | Green=detecting, Amber=no hand |

---

## 7. 4-hour build schedule

| Time | Milestone | Tasks |
|---|---|---|
| 9:30–10:00 | Setup | Scaffold, install @mediapipe/hands, confirm API key, assign roles, create repo |
| 10:00–10:45 | MediaPipe live | HandCamera working, landmark dots on canvas. Do not proceed until you see dots. |
| 10:45–11:30 | First 5 signs | classifier.ts with hello, yes, no, help, stop. API route + GhanaNLP call. |
| 11:30–12:15 | Full pipeline | Classifier → API → Twi text + audio plays. Language toggle working. |
| 12:15–13:00 | Lunch + review | Test full loop. Is it stable? Replan if needed. |
| 13:00–13:40 | Learn mode | Lesson cards with GIFs + Try It camera check. Add remaining 5 signs. |
| 13:40–14:20 | Speak + pre-cache | Text→sign GIF lookup. `preloadTwiAudio()` on mount. UI polish. |
| 14:20–15:00 | Polish + pitch | Landing page, status indicators, responsive check. Write demo script. |
| 15:00–15:20 | Rehearse demo | Full run-through. Assign who speaks. Fix showstoppers only. |
| 15:20–15:30 | Deploy | Push to Vercel. Test. Freeze code. Submit link. |

---

# PART B — CURSOR AI RULES + PRAXIS PROMPTS

---

## 8. Cursor rules file (`.cursor/rules/signbridge.mdc`)

Create this file **before writing a single line of code.**

```
---
description: SignBridge Ghana — Next.js 15 + MediaPipe + GhanaNLP
globs: ['**/*.ts', '**/*.tsx']
---

# Project: SignBridge Ghana
You are an expert TypeScript + Next.js 15 App Router developer.
This app teaches and translates Ghanaian Sign Language using MediaPipe
Hands (WebAssembly, client-side) and GhanaNLP APIs (Khaya AI, server-side).

## Stack
- Next.js 15 (App Router), TypeScript strict mode, Tailwind CSS v4
- @mediapipe/hands for hand landmark detection (browser only)
- GhanaNLP Translation + TTS APIs via /api/translate route
- Vercel for deployment

## Hard rules
- NEVER import @mediapipe/hands at the top of any file.
  Always use: import('@mediapipe/hands') inside useEffect.
  Violation breaks the Next.js build (SSR crash).
- ALWAYS add 'use client' to any file using MediaPipe, webcam,
  useState, useEffect, useRef, or audio APIs.
- NEVER put GHANANLP_API_KEY in client-side code.
  It lives in .env.local and is only accessed in app/api/translate/route.ts.
- Mirror the camera feed with CSS: scale-x-[-1] on both video and canvas.
- All files live under src/ (src/app, src/components, src/lib).

## Code style
- TypeScript strict. No 'any'. Explicit return types on all functions.
- Named exports only (no default exports except page.tsx and layout.tsx).
- Tailwind utility classes only. No inline styles. No CSS modules.
- Early returns for error conditions. No deeply nested if-else.
- Components: max 120 lines. Extract sub-components if longer.

## Key files
- src/lib/classifier.ts — pure TS, 21 Landmark[] → sign label
- src/lib/signs.ts      — SIGNS[] vocabulary + SIGN_MAP lookup
- src/lib/audio.ts      — preloadTwiAudio(), playAudio(), speakEnglish()
- src/components/HandCamera.tsx — MediaPipe integration ('use client')
- src/app/api/translate/route.ts — GhanaNLP proxy (server-side)

## GhanaNLP API
- Base URL: https://translation-api.ghananlp.org/v1
- Header:   Ocp-Apim-Subscription-Key: process.env.GHANANLP_API_KEY
- Translate: POST /translate  body: { in: string, lang: 'en-tw' }
- TTS:       POST /tts        body: { text: string, lang: 'tw' }
- English output uses window.speechSynthesis — no API call.

## Design
- Primary colour: brand-500 (#1D9E75). Use brand-600 for hover states.
- Mobile-first. Min touch target 48px. Large readable text for demo.
- Camera view: relative, aspect-video, rounded-2xl, overflow-hidden.
- Sign label display: text-6xl font-bold text-center.
```

---

## 9. PRAXIS Cursor prompts — run in order

> **How to use:** Open Cursor Composer with `Cmd+I` (Mac) or `Ctrl+I` (Windows). Paste the full prompt. Review the diff before accepting. Test each feature before moving to the next prompt.

---

### PROMPT 1 — Project scaffold
**Task type:** STRUCTURED · Run first · Standalone

```
OBJECTIVE: Scaffold the complete SignBridge Ghana Next.js project structure.

STEPS:
1. The project is already created with create-next-app (Next.js 15,
   TypeScript, Tailwind CSS, App Router, src/ directory).

2. Install the required package:
   npm install @mediapipe/hands

3. Create the following empty files with correct boilerplate stubs:
   - src/lib/classifier.ts        (export function classifySign stub)
   - src/lib/signs.ts             (export const SIGNS: Sign[] = [])
   - src/lib/audio.ts             (stubs for preloadTwiAudio, playAudio,
                                   speakEnglish, getCachedAudio)
   - src/components/HandCamera.tsx ('use client', empty component)
   - src/components/LandmarkCanvas.tsx ('use client', empty component)
   - src/components/SignResult.tsx ('use client', empty component)
   - src/components/LanguageToggle.tsx (empty component)
   - src/components/ModeCard.tsx   (empty component)
   - src/components/LessonCard.tsx (empty component)
   - src/components/SignGif.tsx    (empty component)
   - src/app/translate/page.tsx   ('use client', empty page)
   - src/app/learn/page.tsx       (empty page)
   - src/app/speak/page.tsx       (empty page)
   - src/app/api/translate/route.ts (POST handler stub)

4. Create .env.local with:
   GHANANLP_API_KEY=your_key_here

5. Update tailwind.config.ts to add brand colour ramp:
   brand: { 50:'#E1F5EE', 100:'#9FE1CB', 500:'#1D9E75',
            600:'#0F6E56', 900:'#04342C' }

6. Create .cursor/rules/signbridge.mdc with all rules from the
   project rules file.

7. Create public/signs/ directory (empty, for GIF assets).

OUTPUT: Confirm every file was created. Show the final src/ tree.

CONSTRAINTS:
- All new TypeScript files must use strict types, no 'any'.
- Named exports only (except page.tsx, layout.tsx, route.ts).

BEFORE YOU START: Confirm you understand the structure and flag
anything unclear before creating files.
```

---

### PROMPT 2 — Vocabulary + types
**Task type:** CREATION · Depends on: Prompt 1 · Duration: ~15 min

```
OBJECTIVE: Implement src/lib/signs.ts with full type definitions
and the complete 10-sign vocabulary.

STEPS:
1. Define these TypeScript types at the top of the file:
   type Lang = 'en' | 'tw'
   type SignCategory = 'greeting' | 'response' | 'action' | 'object'
   type Sign = {
     label:    string
     twi:      string
     gifPath:  string
     category: SignCategory
   }

2. Create and export SIGNS: Sign[] with these 10 entries:
   hello   / Mahɔ     / greeting
   yes     / Aane     / response
   no      / Daabi    / response
   help    / Boa me   / action
   stop    / Gyae     / action
   good    / Eye      / response
   bad     / Bɔne     / response
   water   / Nsuo     / object
   name    / Din      / object
   school  / Sukuu    / object
   gifPath for each: '/signs/{label}.gif'

3. Export SIGN_MAP as Record<string, Sign>:
   Object.fromEntries(SIGNS.map(s => [s.label, s]))

4. Export the Lang and Sign types for use elsewhere.

OUTPUT: The complete src/lib/signs.ts file.
CONSTRAINTS: Strict TypeScript. No 'any'. Named exports only.
```

---

### PROMPT 3 — Sign classifier
**Task type:** CREATION · Depends on: Prompt 2 · Duration: ~20 min

```
OBJECTIVE: Implement the full rule-based sign classifier in
src/lib/classifier.ts

CONTEXT:
MediaPipe Hands outputs 21 landmarks per frame as:
  [{ x: number, y: number, z: number }, ...]
x and y are normalised 0-1. y INCREASES downward on screen.
If tip.y < knuckle.y, the finger is pointing UPWARD (extended).
If tip.y > knuckle.y, the finger is curled.

KEY LANDMARK INDICES:
  4 = thumb tip,  3 = thumb IP joint
  8 = index tip,  6 = index PIP joint
 12 = middle tip, 10 = middle PIP joint
 16 = ring tip,   14 = ring PIP joint
 20 = pinky tip,  18 = pinky PIP joint

STEPS:
1. Define and export:
   type Landmark = { x: number; y: number; z: number }
   type ClassifyResult = { sign: string; confidence: number } | null

2. Write private helpers:
   const ext  = (tip: Landmark, pip: Landmark) => tip.y < pip.y
   const curl = (tip: Landmark, pip: Landmark) => tip.y > pip.y

3. Write and export classifySign(lm: Landmark[]): ClassifyResult
   with rules for ALL 10 signs:
   - hello:  all 4 fingers extended
   - yes:    thumb up, all 4 fingers curled
   - no:     thumb down, all 4 fingers curled
   - help:   only index finger extended
   - stop:   all fingers curled, thumb tucked (lm[4].x > lm[3].x)
   - good:   index + middle extended, ring + pinky curled
   - bad:    same as 'no' + lm[4].y clearly below lm[2].y
   - water:  index + middle + ring extended, pinky curled
   - name:   only pinky extended, others curled
   - school: thumb + index L-shape (lm[4].y < lm[3].y
             && ext(lm[8],lm[6]) && curl(lm[12],lm[10]))

4. Return null if no rule matches.
5. Guard: if (!lm || lm.length < 21) return null

OUTPUT: Complete src/lib/classifier.ts
CONSTRAINTS: Pure TypeScript, no imports, no browser APIs.
```

---

### PROMPT 4 — GhanaNLP API route
**Task type:** CREATION · Depends on: Prompt 1 · Can run in parallel with Prompt 3

```
OBJECTIVE: Implement the GhanaNLP proxy in
src/app/api/translate/route.ts

REQUIREMENTS:
- Accepts POST with body: { label: string, lang: 'en' | 'tw' }
- For lang='en': return { displayText: label, audio: null, lang: 'en' }
  (English speech is handled client-side, no API needed)
- For lang='tw':
    Step 1: POST https://translation-api.ghananlp.org/v1/translate
            body: { in: label, lang: 'en-tw' }
            header: Ocp-Apim-Subscription-Key: process.env.GHANANLP_API_KEY
    Step 2: POST https://translation-api.ghananlp.org/v1/tts
            body: { text: twiText, lang: 'tw' }
    Return: { displayText: twiText, audio: base64String, lang: 'tw' }

- Wrap in try/catch. On error return status 500 with { error: message }.
- Never log or return the API key.
- TypeScript strict. No 'any'.

OUTPUT: Complete src/app/api/translate/route.ts

AFTER CREATING: Test with:
  curl -X POST http://localhost:3000/api/translate \
    -H 'Content-Type: application/json' \
    -d '{"label":"hello","lang":"tw"}'
Confirm you get displayText and audio fields back.
```

---

### PROMPT 5 — Audio utilities + pre-cache
**Task type:** CREATION · Depends on: Prompts 2 + 4 · Duration: ~15 min

```
OBJECTIVE: Implement src/lib/audio.ts with pre-cache and playback.

STEPS:
1. Module-level Map: const twiCache = new Map<string, string>()
   Key = sign label, Value = base64 audio string

2. Export async function preloadTwiAudio(): Promise<void>
   - Import SIGNS from @/lib/signs
   - Promise.all to POST /api/translate for every sign with lang:'tw'
   - Store returned audio in twiCache
   - Silently skip if fetch fails (degrade gracefully)

3. Export function playAudio(base64: string): void
   - Decode base64 → Uint8Array → Blob → Audio element → play()
   - Cancel any currently playing audio first

4. Export function speakEnglish(text: string): void
   - window.speechSynthesis.cancel()
   - SpeechSynthesisUtterance with lang:'en-US', rate:0.9
   - window.speechSynthesis.speak(utt)

5. Export function getCachedAudio(label: string): string | undefined
   - return twiCache.get(label)

6. Export function handleSignAudio(label: string, lang: 'en' | 'tw'): void
   - If lang='en': speakEnglish(label)
   - If lang='tw': check cache first, play if available,
     otherwise fetch /api/translate then play

OUTPUT: Complete src/lib/audio.ts
CONSTRAINTS: No 'use client' — utility module only.
```

---

### PROMPT 6 — HandCamera component
**Task type:** CREATION · Depends on: Prompts 2 + 3 · **MOST CRITICAL**

```
OBJECTIVE: Build HandCamera.tsx — webcam + MediaPipe integration.
This is the most critical component. Build it with extreme care.

REQUIREMENTS:
- 'use client' at top
- Props: { onSign: (label: string) => void; active: boolean }

MEDIAPIPE INTEGRATION (inside useEffect, dependency: [active]):
  1. If active is false, return early and clean up camera stream
  2. import('@mediapipe/hands').then(({ Hands, HAND_CONNECTIONS }) => {
     - locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
     - options: maxNumHands:1, modelComplexity:1,
       minDetectionConfidence:0.75, minTrackingConfidence:0.75
  3. hands.onResults(results => {
     - Draw landmarks on canvas (green dots + connecting lines)
     - Extract results.multiHandLandmarks?.[0] as Landmark[]
     - Call classifySign(landmarks)
     - If new sign detected: clearTimeout, set 600ms debounce → onSign()
  4. navigator.mediaDevices.getUserMedia({ video: true })
  5. Assign stream to videoRef.current.srcObject
  6. On loadedmetadata: requestAnimationFrame loop calling hands.send()
  7. Cleanup: cancel animation frame, stop stream tracks

JSX:
  <div className='relative w-full aspect-video rounded-2xl overflow-hidden bg-black'>
    <video ref={videoRef} autoPlay muted playsInline
      className='w-full h-full object-cover scale-x-[-1]' />
    <canvas ref={canvasRef}
      className='absolute inset-0 w-full h-full scale-x-[-1]' />
  </div>

OUTPUT: Complete src/components/HandCamera.tsx

VERIFY BEFORE CONTINUING:
  [ ] Camera feed visible and mirrored
  [ ] Green landmark dots appear on hand
  [ ] Console logs sign labels when you make signs
  [ ] No SSR errors in terminal
```

---

### PROMPT 7 — Translate page (core demo)
**Task type:** CREATION · Depends on: Prompts 3 + 4 + 5 + 6 · **THE MAIN DEMO**

```
OBJECTIVE: Build src/app/translate/page.tsx — the main translation mode.
This is the centrepiece of the demo. It must look polished.

'use client' required.

STATE:
  - lang: 'en' | 'tw'  (default: 'en')
  - result: { english: string; display: string; lang: Lang } | null
  - isLoading: boolean

ON MOUNT:
  - Call preloadTwiAudio() — show subtle loading indicator

SIGN HANDLER (handleSign(label)):
  - lang='en': setResult + speakEnglish(label)
  - lang='tw': check getCachedAudio(label) first
    * If cached: setResult + playAudio(cached)
    * If not: setIsLoading → fetch → setResult + playAudio → setIsLoading(false)

LAYOUT:
  1. Header: app name + LanguageToggle
  2. HandCamera (~50% viewport height)
  3. Result: primary text at text-6xl font-bold, secondary in other language
     Show 'Make a sign...' when result is null
     Fade-in animation when result changes
  4. Loading spinner when isLoading

LANGUAGE TOGGLE:
  - 'English' / 'Twi' buttons
  - Active: bg-brand-500 text-white rounded-full
  - Switching lang resets result to null

OUTPUT: src/app/translate/page.tsx + src/components/LanguageToggle.tsx

CONSTRAINTS:
  - No inline styles. Tailwind only.
  - Result text readable from 2 metres.
  - Works at 375px mobile width.
```

---

### PROMPT 8 — Learn mode
**Task type:** CREATION · Depends on: Prompts 2 + 6 · Duration: ~30 min

```
OBJECTIVE: Build src/app/learn/page.tsx — interactive GSL lesson cards.

PAGE:
  - Header: 'Learn Ghanaian Sign Language'
  - Filter tabs: All | Greetings | Responses | Actions | Objects
  - Grid of LessonCard (2 cols mobile, 3 cols tablet+)

LessonCard (src/components/LessonCard.tsx):
  Props: { sign: Sign; onTryIt: (sign: Sign) => void }
  - Top: SignGif (looping GIF)
  - Middle: English label + Twi label
  - Bottom: 'Try it' button
  - Style: white card, rounded-2xl, shadow-sm, border-gray-100

TRY IT FLOW:
  - Click 'Try it': open modal with HandCamera active
  - Show target GIF on left, camera on right
  - If sign detected matches target: green success state
  - If different: 'Try again' message
  - 'Close' sets active=false on HandCamera

SignGif (src/components/SignGif.tsx):
  Props: { sign: Sign; className?: string }
  - <img src={sign.gifPath} alt={sign.label} />
  - Fallback placeholder if GIF not found
  - aspect-square object-contain

OUTPUT:
  - src/app/learn/page.tsx
  - src/components/LessonCard.tsx
  - src/components/SignGif.tsx
```

---

### PROMPT 9 — Speak mode + landing page
**Task type:** CREATION · Depends on: Prompts 2 + 7 · Duration: ~25 min

```
OBJECTIVE: Build Speak mode and the landing page.

TASK 1 — src/app/speak/page.tsx:
  - Text input for English or Twi
  - Language selector: 'I'm typing in: English | Twi'
  - 'Show Signs' button
  - On submit: split into words, show SignGif from SIGN_MAP for each
    Gray placeholder card for words not in SIGN_MAP
  - Horizontal scrollable row of sign cards

TASK 2 — src/app/page.tsx (Landing):
  - App name in brand-500, large
  - Tagline: 'Breaking barriers through Ghanaian Sign Language'
  - Three ModeCards:

  Sign → Text  | /translate | camera icon
    'Make a sign. Get instant translation in English or Twi.'

  Learn GSL    | /learn     | graduation cap icon
    'Interactive lessons for 10 essential Ghanaian signs.'

  Text → Sign  | /speak     | chat bubble icon
    'Type English or Twi. See the signs instantly.'

  ModeCard style: p-6 rounded-2xl border-2 border-gray-100
    hover:border-brand-500 transition-colors
    Arrow icon that slides right on hover.

OUTPUT:
  - src/app/speak/page.tsx
  - src/app/page.tsx
  - src/components/ModeCard.tsx
```

---

### PROMPT 10 — Polish, layout, accessibility
**Task type:** ITERATION · Depends on: all prompts · Run last

```
OBJECTIVE: Final polish pass across the entire app.

TASK 1 — src/app/layout.tsx:
  - Geist Sans + Geist Mono fonts via next/font/google
  - Metadata: title, description, theme-color #1D9E75
  - Top nav bar: logo left, Translate|Learn|Speak links right
  - Active link: brand-500, font-medium
  - Mobile: hamburger (Tailwind peer pattern, no library)

TASK 2 — Loading states:
  - Translate: skeleton while preloadTwiAudio() runs
  - Learn: skeleton grid while mounting
  - loading.tsx in each route folder with branded spinner

TASK 3 — Error handling:
  - GhanaNLP failure: toast 'Translation unavailable. Showing English only.'
    Fall back to speakEnglish()
  - Camera denied: clear message with enable instructions

TASK 4 — Accessibility:
  - aria-label on all interactive elements
  - Camera: role='img' aria-label='Live camera feed with hand tracking'
  - Sign result: aria-live='polite'
  - Language toggle: aria-pressed
  - All GIFs: descriptive alt text

TASK 5 — Performance:
  - Wrap HandCamera in dynamic() with ssr:false
  - next/image where appropriate

TASK 6 — Responsive:
  - Test 375px / 768px / 1280px
  - Camera never cropped
  - Sign label readable at arm's length on mobile

OUTPUT: All modified files with brief changelog per file.

BEFORE YOU START: Review all existing files. List what you find
and what you plan to change before making any edits.
```

---

## 10. Prompt run order + dependencies

| Order | Prompt | Who | Notes |
|---|---|---|---|
| 1 | Prompt 1 | All together | Everyone watches. Shared codebase setup. |
| 2 | Prompt 2 | Dev 4 / anyone | Vocabulary + types. No framework knowledge needed. |
| 3 | Prompt 3 | Dev 1 | Classifier. Review every rule carefully. |
| 3 | Prompt 4 | Dev 2 | API route. Runs **in parallel** with Prompt 3. |
| 4 | Prompt 5 | Dev 2 | Audio utils. Needs Prompts 2 + 4 done first. |
| 5 | Prompt 6 | Dev 1 | HandCamera. **Most critical. Test before anything proceeds.** |
| 6 | Prompt 7 | Dev 1 + 3 | Translate page. The main demo. |
| 7 | Prompt 8 | Dev 3 | Learn mode. Independent once P6 works. |
| 8 | Prompt 9 | Dev 2 + 3 | Speak mode + landing. |
| 9 | Prompt 10 | Dev 3 | Polish. Run last, ~45 min before submission. |

> **Parallel tracks:** Prompts 3 and 4 can run simultaneously on different machines. Prompts 7, 8, and 9 can all run in parallel once Prompt 6 is verified working. Do not start Prompt 6 until Prompt 3 is complete and tested.

---

*SignBridge Ghana · Cursor Hackathon 2025 · PRAXIS Framework*
*Built with Next.js 15, @mediapipe/hands, GhanaNLP Khaya AI APIs, and Tailwind CSS*
