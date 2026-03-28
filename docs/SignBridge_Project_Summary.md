# SignBridge Ghana — Comprehensive Project Summary

**Version 1.0 · March 2026**
**Cursor Hackathon · Ghana · PRAXIS Framework**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Problem: A Linguistic Vacuum](#2-the-problem-a-linguistic-vacuum)
3. [Vision and Mission](#3-vision-and-mission)
4. [Solution Overview](#4-solution-overview)
5. [System Architecture](#5-system-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Data Flow and Pipeline](#7-data-flow-and-pipeline)
8. [Sign Classification Engine](#8-sign-classification-engine)
9. [Language and Audio System](#9-language-and-audio-system)
10. [Application Modes](#10-application-modes)
11. [Component Architecture](#11-component-architecture)
12. [Design System](#12-design-system)
13. [API and Server Layer](#13-api-and-server-layer)
14. [Privacy and Security Model](#14-privacy-and-security-model)
15. [Sign Vocabulary and Linguistics](#15-sign-vocabulary-and-linguistics)
16. [Performance Architecture](#16-performance-architecture)
17. [Development Methodology (PRAXIS)](#17-development-methodology-praxis)
18. [Build Timeline and Team Structure](#18-build-timeline-and-team-structure)
19. [Impact Assessment and Target Users](#19-impact-assessment-and-target-users)
20. [Future Roadmap](#20-future-roadmap)

---

## 1. Executive Summary

SignBridge Ghana is a real-time, browser-native assistive technology platform that translates Ghanaian Sign Language (GSL) into spoken and written English and Twi. Built for the Cursor Hackathon 2025 using the PRAXIS framework, it demonstrates that powerful accessibility tools can be delivered without cloud infrastructure, proprietary hardware, or user accounts — entirely within a standard web browser.

The application uses Google's MediaPipe Hands library, compiled to WebAssembly, to detect 21 hand landmarks per camera frame at 25–30 frames per second. A rule-based TypeScript classifier converts those landmark coordinates into one of 10 recognised GSL signs. The result is either spoken aloud in English using the browser's built-in Web Speech API, or translated to Twi and voiced through GhanaNLP's Khaya AI translation and text-to-speech APIs — with the API key never exposed to the client.

**Key technical facts:**
- Camera data never leaves the user's device
- Hand tracking runs in WebAssembly at 25–30 fps
- API calls are only made for text labels (e.g. `"hello"`), not pixel data
- Works on any modern browser with a camera — no installation required
- Built in approximately 4 hours by a small team during a hackathon

**Deployment:** [Vercel](https://vercel.com) free tier — zero server costs for the prototype.

---

## 2. The Problem: A Linguistic Vacuum

### 2.1 Ghana's deaf community

Ghana is home to over **470,000 people** with hearing loss, representing approximately 1.4% of the national population of 33 million. Of this population:

- Approximately **211,000+** are active sign language users (Ghana National Association of the Deaf estimate)
- Over **90%** of deaf children are born to hearing parents, meaning the communication gap begins at birth, before formal education starts
- Only **~16 schools for the deaf** exist nationally to serve the entire country
- Fewer than **50 certified GSL interpreters** are available — a ratio of roughly 1 interpreter per 4,200 deaf people

### 2.2 Systemic gaps

Academic research, including a 2024 University of Toronto study, characterises Ghana's approach to sign language as a **"null policy" context**: there is no formal national sign language policy, no system-wide interpreter training programme, and no assistive technology infrastructure in most schools or public services.

The practical consequences are severe:
- Deaf students attend classrooms where teachers cannot communicate with them
- Families resort to improvised home sign systems that no one outside the immediate household understands
- Access to healthcare, legal services, and government programmes is severely limited
- Deaf Ghanaians are frequently unable to participate fully in civic life

### 2.3 The continental scale

This is not a problem unique to Ghana. Across Africa, **over 40 million people** live with significant hearing loss, and the infrastructure gap — in interpreters, policy, education, and technology — is present in nearly every country on the continent. SignBridge is designed explicitly as a replicable model: the architecture works for any sign language and any target spoken language, not just GSL and Twi.

---

## 3. Vision and Mission

### Vision

A world where deaf Ghanaians — and deaf Africans more broadly — can communicate across the language barrier in real time, without intermediaries, using only the devices already in their hands.

### Mission

To build the most accessible, privacy-respecting, and technically correct sign language translation tool possible, starting with Ghana's 10 most essential everyday signs, and to create an open architecture that can be extended to the full GSL vocabulary and other African sign languages.

### Design principles

1. **Zero friction** — No account, no download, no setup. Open a URL and it works.
2. **Privacy first** — Camera data is sacred. It never leaves the device.
3. **Offline-capable classifier** — Classification runs without internet. Only audio output requires the network.
4. **Mobile-first** — The primary use case is a phone held in front of a signer, not a desktop.
5. **Legible from distance** — Sign labels are displayed at text-6xl (72px+) so they can be read from across a table or room.
6. **Bilingual by default** — English and Twi are first-class citizens. Neither is a fallback.

---

## 4. Solution Overview

SignBridge operates as a three-mode web application:

### Mode 1: Sign → Text (Translate)
The primary demo mode. The user opens their camera, holds a GSL sign, and within 600ms of a stable detection, SignBridge:
- Displays the English word on screen in large text
- Displays the Twi equivalent
- Speaks the word aloud in the selected language
- Plays a GhanaNLP-generated Twi pronunciation if Twi is selected

### Mode 2: Learn GSL
An interactive lesson library. Each of the 10 supported signs has a card showing:
- An animated GIF of the correct hand shape
- The English label
- The Twi translation
- A "Try It" button that opens a live camera modal, shows the target sign, and gives instant pass/fail feedback when the user attempts the sign

### Mode 3: Text → Sign (Speak)
A reverse lookup tool. The user types English or Twi words, and the application shows the corresponding GSL sign GIF for each word in the vocabulary. Unknown words show a graceful placeholder. This mode is useful for hearing people learning to communicate with deaf signers.

---

## 5. System Architecture

### 5.1 Architectural layers

```
┌─────────────────────────────────────────────────────┐
│                   BROWSER (client)                   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Next.js App Router (React 19)               │   │
│  │  ┌──────────────┐  ┌───────────────────────┐ │   │
│  │  │  UI Pages     │  │  React Components     │ │   │
│  │  │  /translate   │  │  HandCamera           │ │   │
│  │  │  /learn       │  │  LandmarkCanvas       │ │   │
│  │  │  /speak       │  │  SignResult           │ │   │
│  │  │  / (landing)  │  │  LanguageToggle       │ │   │
│  │  └──────────────┘  └───────────────────────┘ │   │
│  │                                               │   │
│  │  ┌─────────────────────────────────────────┐ │   │
│  │  │  @mediapipe/hands (WebAssembly)          │ │   │
│  │  │  21 landmarks/frame @ 25-30fps           │ │   │
│  │  └─────────────────────────────────────────┘ │   │
│  │                                               │   │
│  │  ┌─────────────────────────────────────────┐ │   │
│  │  │  classifySign() — Pure TypeScript       │ │   │
│  │  │  src/lib/classifier.ts                  │ │   │
│  │  └─────────────────────────────────────────┘ │   │
│  │                                               │   │
│  │  ┌─────────────────────────────────────────┐ │   │
│  │  │  Web Speech API (English output)        │ │   │
│  │  │  window.speechSynthesis.speak()         │ │   │
│  │  └─────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ POST /api/translate
                       │ { label: 'hello', lang: 'tw' }
                       │ (text only — no camera data)
┌──────────────────────▼──────────────────────────────┐
│             NEXT.JS SERVER (Vercel)                  │
│                                                      │
│  src/app/api/translate/route.ts                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  GhanaNLP Proxy                             │    │
│  │  Reads: GHANANLP_API_KEY from .env.local    │    │
│  │  Calls: POST /v1/translate (en→tw)          │    │
│  │  Calls: POST /v1/tts (tw→audio)             │    │
│  │  Returns: { displayText, audio (base64) }   │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│         GhanaNLP / Khaya AI (external)               │
│         https://translation-api.ghananlp.org/v1      │
└─────────────────────────────────────────────────────┘
```

### 5.2 Client vs server boundary

This boundary is the single most critical architectural decision in the codebase. Violating it causes the Next.js SSR build to crash.

| File | Boundary | Reason |
|---|---|---|
| `HandCamera.tsx` | `'use client'` + lazy MediaPipe import | Requires `window`, `navigator.mediaDevices`, webcam APIs |
| `LandmarkCanvas.tsx` | `'use client'` | Canvas drawing APIs are browser-only |
| `translate/page.tsx` | `'use client'` | Uses `useState`, `useEffect`, audio playback |
| `api/translate/route.ts` | Server only (default) | Holds `GHANANLP_API_KEY`, must never reach the browser |
| `lib/classifier.ts` | Shared (no directive) | Pure TypeScript functions, no browser or server APIs |
| `lib/signs.ts` | Shared (no directive) | Static data only, no APIs |
| `lib/audio.ts` | Client-side utility | Uses `window.speechSynthesis`, `Audio`, `atob` |

### 5.3 The lazy-import rule

MediaPipe accesses `navigator.mediaDevices` — a browser-only API. If imported at the module level, Next.js's static server-side rendering will attempt to execute it during the build and crash. The enforced pattern is:

```typescript
// CORRECT — inside useEffect
useEffect(() => {
  import('@mediapipe/hands').then(({ Hands, HAND_CONNECTIONS }) => {
    // All MediaPipe setup here
  });
}, [active]);

// WRONG — top-level import crashes the build
import { Hands } from '@mediapipe/hands';
```

This rule is codified in `.cursor/rules/signbridge.mdc` and enforced as the first hard rule for all AI agents working on the codebase.

---

## 6. Technology Stack

### 6.1 Framework: Next.js 16 (App Router)

SignBridge uses Next.js 16 with the App Router (introduced in Next.js 13 and stabilised in v15/16). Key App Router features used:

- **`src/app/` directory structure** with file-based routing
- **Server Components by default** — only files explicitly marked `'use client'` run in the browser
- **Route handlers** (`route.ts`) for the serverless API endpoint
- **`loading.tsx`** per route for automatic streaming suspense boundaries
- **`next/font/google`** for zero-layout-shift font loading (DM Sans, DM Mono)
- **`next/dynamic`** available for wrapping `HandCamera` with `ssr: false` to defer loading

### 6.2 TypeScript (strict mode)

The entire codebase uses TypeScript in strict mode (`"strict": true` in `tsconfig.json`). Hard rules:
- No `any` anywhere
- Explicit return types on all exported functions
- All component props typed with explicit interfaces or inline types
- No implicit any from external data — API responses are typed via exported `TranslateResponseBody`

### 6.3 Tailwind CSS v4

SignBridge uses Tailwind CSS v4, which eliminates the `tailwind.config.ts` file entirely. All design tokens are defined in `src/app/globals.css` using the `@theme inline` block:

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-dm-sans);
  --color-green: var(--sb-green);
  --color-green-dark: var(--sb-green-dark);
  --color-charcoal: var(--sb-charcoal);
  --color-ink: var(--sb-black);
  --radius-pill: 100px;
  /* ... */
}
```

This generates utility classes like `bg-green`, `text-ink`, `text-green-dark`, `rounded-pill` directly from CSS custom properties — no JavaScript config file required.

### 6.4 @mediapipe/hands (v0.4)

Google's MediaPipe Hands solution, distributed as an npm package that bundles a WebAssembly binary. Configuration in SignBridge:

```typescript
hands.setOptions({
  maxNumHands: 1,          // Single-hand tracking for performance
  modelComplexity: 1,      // Full model (vs. lite=0) for accuracy
  minDetectionConfidence: 0.75,
  minTrackingConfidence:  0.75,
});
```

The WASM binary and model files are loaded from jsDelivr CDN at runtime:
```typescript
locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
```

### 6.5 GhanaNLP / Khaya AI

GhanaNLP provides two REST endpoints used by SignBridge:

| Endpoint | Method | Purpose |
|---|---|---|
| `https://translation-api.ghananlp.org/v1/translate` | POST | English → Twi text translation |
| `https://translation-api.ghananlp.org/v1/tts` | POST | Twi text → audio (WAV) |

Authentication uses a single header: `Ocp-Apim-Subscription-Key: <key>`.

The translate endpoint receives `{ "in": "hello", "lang": "en-tw" }` and returns a plain string (`"Mahɔ"`). The TTS endpoint receives `{ "text": "Mahɔ", "lang": "tw" }` and returns a binary audio buffer, which the server converts to base64 before sending to the client.

---

## 7. Data Flow and Pipeline

### 7.1 Frame-by-frame processing loop

```
1. navigator.mediaDevices.getUserMedia({ video: true })
   → Webcam stream assigned to <video> element

2. videoRef.current.onloadedmetadata fires
   → requestAnimationFrame(tick) begins

3. tick() runs each frame:
   → hands.send({ image: videoRef.current })
   → MediaPipe processes the frame in WebAssembly
   → hands.onResults(results) callback fires

4. results.multiHandLandmarks[0] extracted
   → Array of 21 { x, y, z } objects (normalised 0-1)
   → classifySign(landmarks) called

5. classifySign() checks rule table in order
   → Returns { sign: 'hello', confidence: 1 } or null

6. Debounce logic:
   → If same sign as lastSign.current: skip
   → If new sign: clearTimeout, set 600ms timer
   → After 600ms stable: onSign(result.sign) fires

7. onSign handler in translate/page.tsx:
   → lang='en': speakEnglish(label), setResult()
   → lang='tw': check cache → play or fetch+play
```

### 7.2 Sign detection debounce

The 600ms debounce is a deliberate design choice. Without it, a single sign would trigger the audio and translation pipeline multiple times per second as the user holds the pose. The debounce ensures:
- Only one translation call per intentional sign
- The user has stable time to complete the sign before detection fires
- No audio overlap from rapid successive detections

### 7.3 Twi audio pre-caching

On mount of the Translate page, `preloadTwiAudio()` is called. This fires 10 parallel POST requests to `/api/translate` — one per sign — and stores the returned base64 audio and Twi text in module-level Maps:

```typescript
const twiAudioCache   = new Map<string, string>(); // label → base64 WAV
const twiDisplayCache = new Map<string, string>(); // label → Twi text
```

The result: when a sign is detected during a live session, audio plays instantly from the cache with zero network latency. The API is called in advance, not on demand.

---

## 8. Sign Classification Engine

### 8.1 How MediaPipe landmarks work

MediaPipe Hands outputs 21 landmark points for each detected hand. Each landmark is a normalised `{ x, y, z }` coordinate where:
- `x` is horizontal position (0 = left edge, 1 = right edge)
- `y` is vertical position (0 = top, 1 = bottom — y **increases downward**)
- `z` is depth relative to the wrist (negative = closer to camera)

The `y` coordinate direction is counter-intuitive but critical: because y increases downward, `tip.y < pip.y` means the fingertip is **higher** on screen — i.e. the finger is extended upward.

### 8.2 Key landmark indices

| Index | Landmark | Finger | Role in classifier |
|---|---|---|---|
| 0 | WRIST | — | Base reference |
| 2 | THUMB_MCP | Thumb | `lm[4].y > lm[2].y` confirms thumb clearly pointing down |
| 3 | THUMB_IP | Thumb | `lm[4].y < lm[3].y` = thumb up (yes), `> lm[3].y` = down (no/bad) |
| 4 | THUMB_TIP | Thumb | Primary thumb position |
| 6 | INDEX_PIP | Index | Joint above knuckle |
| 8 | INDEX_TIP | Index | `lm[8].y < lm[6].y` = extended |
| 10 | MIDDLE_PIP | Middle | Joint above knuckle |
| 12 | MIDDLE_TIP | Middle | `lm[12].y < lm[10].y` = extended |
| 14 | RING_PIP | Ring | Joint above knuckle |
| 16 | RING_TIP | Ring | `lm[16].y < lm[14].y` = extended |
| 18 | PINKY_PIP | Pinky | Joint above knuckle |
| 20 | PINKY_TIP | Pinky | `lm[20].y < lm[18].y` = extended |

### 8.3 Finger state helpers

The entire classifier is built on two boolean helper functions:

```typescript
const ext  = (tip: Landmark, pip: Landmark): boolean => tip.y < pip.y;
const curl = (tip: Landmark, pip: Landmark): boolean => tip.y > pip.y;
```

`ext` returns true when the fingertip is above the PIP joint — finger is extended.
`curl` returns true when the fingertip is below the PIP joint — finger is curled.

### 8.4 Rule table (all 10 signs)

Rules are stored as an ordered array of `[label, rule]` tuples. The first matching rule wins. Order matters: `bad` is checked before `no` because they share a subset of conditions, and `bad` has a stricter discriminating constraint (`lm[4].y > lm[2].y`).

| Sign | Rule logic | Key discriminator |
|---|---|---|
| `hello` | All 4 fingers extended | Open palm |
| `yes` | Thumb up (`lm[4].y < lm[3].y`), all 4 fingers curled | Thumbs up |
| `bad` | Thumb down, thumb tip below thumb base (`lm[4].y > lm[2].y`), all curled | Thumb clearly pointing down |
| `no` | Thumb down (`lm[4].y > lm[3].y`), 4 fingers curled | Loose fist, thumb tilted down |
| `stop` | All fingers curled, thumb tucked (`lm[4].x > lm[3].x`) | Thumb crosses palm horizontally |
| `help` | Only index extended, 3 others curled | Pointing gesture |
| `water` | Index + middle + ring extended, pinky curled | W-shape (3 fingers) |
| `good` | Index + middle extended, ring + pinky curled | Peace/scissors sign |
| `name` | Only pinky extended, 3 others curled | Pinky point |
| `school` | Thumb up + index extended, middle curled | L-shape hand |

### 8.5 Classifier properties

- **Pure TypeScript** — no browser APIs, no imports (except the `Landmark` type it exports). Can run in Node.js, the browser, or tests.
- **Deterministic** — same landmarks always produce the same result. No probabilistic threshold, no ML model weights.
- **Confidence** — currently hardcoded to `1` (binary match). A future improvement would use geometric distance from ideal poses to produce a 0–1 confidence score.
- **Extensibility** — adding a new sign requires adding one entry to the `RULES` array. No retraining required.

---

## 9. Language and Audio System

### 9.1 Dual-language output

SignBridge supports two output languages:

**English (no API required):**
Uses the browser's built-in `window.speechSynthesis` Web Speech API. This is available in all modern browsers, works offline, and has zero latency. The voice is the device's default English voice.

```typescript
export function speakEnglish(text: string): void {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US';
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}
```

**Twi (via GhanaNLP):**
Uses GhanaNLP's Khaya AI translation and TTS APIs. The pipeline:
1. Server receives `{ label: 'hello', lang: 'tw' }`
2. Server POSTs to `/v1/translate`: `{ "in": "hello", "lang": "en-tw" }` → `"Mahɔ"`
3. Server POSTs to `/v1/tts`: `{ "text": "Mahɔ", "lang": "tw" }` → WAV binary
4. Server base64-encodes the WAV and returns `{ displayText: "Mahɔ", audio: "<base64>", lang: "tw" }`
5. Client decodes base64 → Uint8Array → Blob → `Audio` element → `.play()`

### 9.2 Audio cache architecture

The `twiAudioCache` and `twiDisplayCache` Maps are module-level singletons. Once populated by `preloadTwiAudio()`, they persist for the lifetime of the browser tab (not between page navigations, since Next.js client-side navigation doesn't re-import modules — the Maps survive route changes).

The cache hit path for Twi audio:
```
handleSignAudio('hello', 'tw')
  → getCachedAudio('hello')     → base64 string found
  → playAudio(base64)           → instant playback
```

The cache miss path (rare, only before preload completes):
```
handleSignAudio('hello', 'tw')
  → getCachedAudio('hello')     → undefined
  → fetch('/api/translate', ...)  → network round-trip
  → data.audio found
  → twiAudioCache.set('hello', data.audio)
  → playAudio(data.audio)
```

### 9.3 Audio playback

The `playAudio` function maintains a reference to the currently playing `HTMLAudioElement` (`currentAudio`). Before playing a new clip, it pauses the previous one. This prevents audio overlap when signs are detected in quick succession.

```typescript
export function playAudio(base64: string): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  const binary = atob(base64);
  const bytes  = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const blob   = new Blob([bytes], { type: 'audio/wav' });
  const audio  = new Audio(URL.createObjectURL(blob));
  currentAudio = audio;
  audio.play().catch(() => {});
}
```

The `.catch(() => {})` handles browsers that block autoplay before a user gesture. In practice, the Translate page requires the user to click to start the camera, which satisfies the browser's autoplay policy.

---

## 10. Application Modes

### 10.1 Landing page (`/`)

The landing page is a fully server-rendered React component (no `'use client'`) composed of seven sections:

| Section | Content |
|---|---|
| Hero | App name, tagline, CTA buttons, floating demo cards showing detected signs |
| Stats | 4 key impact statistics: 470K Ghanaians with hearing loss, 211K+ sign language users, ~16 schools, 40M+ Africans |
| Problem | The linguistic vacuum — text + 90%+ stat card + policy data |
| How It Works | 3-step visual: Show hand → SignBridge reads it → Hear it |
| Mode Cards | Links to all three app modes with descriptions |
| Personas | 3 target user groups: deaf students, teachers/families, healthcare |
| Africa | Continent-wide scale + statistics |
| Privacy Bar | Camera privacy guarantee strip |

All statistics are sourced: Ghana Census 2021, Ghana National Association of the Deaf (GNAD), University of Toronto 2024, WHO/World Bank.

### 10.2 Translate mode (`/translate`)

The core demo page. Architecture:

**State:**
- `lang: 'en' | 'tw'` — currently selected output language
- `result: { english: string; display: string; lang: Lang } | null` — last detected sign
- `isLoading: boolean` — true while fetching non-cached Twi audio
- `preloaded: boolean` — true after `preloadTwiAudio()` resolves

**Mount effect:** Calls `preloadTwiAudio()` to warm all 10 Twi audio clips before the user begins signing.

**Sign handler (`handleSign`):** Called by `HandCamera` after the 600ms debounce. Updates `result`, triggers audio output via `handleSignAudio()` (which checks cache first, falls back to live fetch).

**Layout:**
1. Header with LanguageToggle
2. `HandCamera` at ~50% viewport height
3. Sign result area: primary label at `text-6xl font-bold`, secondary label in opposite language, fade-in animation on change

### 10.3 Learn mode (`/learn`)

An interactive GSL lesson library with category filtering.

**Filter tabs:** All · Greetings · Responses · Actions · Objects

Each `LessonCard` displays:
- `SignGif` component showing the animated demonstration
- English label + Twi translation
- "Try It" button

The "Try It" flow opens a modal with the `HandCamera` active. The target sign GIF is shown alongside the live camera feed. If the detected sign matches the target, the card enters a green success state. If a different sign is detected, a "Try again" message appears.

**SignGif component:** Renders an `<img>` tag pointing to `/signs/{label}.gif` (or `.webp` as assets evolve). Includes a fallback placeholder if the asset is not found, using an `onError` handler to gracefully degrade.

### 10.4 Speak mode (`/speak`)

The reverse lookup mode. A text input accepts English or Twi words. On submission, the app splits the input into tokens and looks each up in `SIGN_MAP`. Matched words show their `SignGif`. Unmatched words show a gray placeholder card with the word displayed.

This mode is designed for hearing people learning to communicate with deaf signers — they type what they want to say, see the signs, and can learn to replicate them.

---

## 11. Component Architecture

### 11.1 Component inventory

| Component | Directive | Props | Responsibility |
|---|---|---|---|
| `HandCamera` | `'use client'` | `onSign`, `active` | Webcam capture, MediaPipe integration, landmark drawing, sign detection callback |
| `LandmarkCanvas` | `'use client'` | `width`, `height` | Draws green dots and connecting lines over the hand in real time |
| `SignResult` | `'use client'` | `result`, `lang` | Displays the detected sign with animated fade-in |
| `LanguageToggle` | none | `lang`, `onChange` | EN/Twi pill toggle — active state with `bg-green text-white` |
| `SignGif` | none | `sign`, `className` | Sign image with `onError` fallback |
| `LessonCard` | none | `sign`, `onTryIt` | Card layout for Learn mode |
| `ModeCard` | none | `href`, `icon`, `title`, `desc`, `cta`, `feat` | Landing page mode selector card |
| `Nav` | none | — | Top navigation with Translate / Learn / Speak links, active link highlighting |
| `NavBar` | none | — | Internal nav bar layout and mobile hamburger pattern |
| `Footer` | none | — | Site footer with credits |

### 11.2 HandCamera — the critical component

`HandCamera` is the most technically complex component and the one most likely to break if rules are violated. Its lifecycle:

1. **Effect fires** when `active` prop changes to `true`
2. **Lazy import** of `@mediapipe/hands` inside the effect
3. **Hands instance** created with CDN-hosted WASM binary
4. **Options set**: single hand, full model, 75% confidence thresholds
5. **`onResults` callback** registered — runs for every frame
6. **`getUserMedia`** opens the webcam stream
7. **Video element** receives the stream via `srcObject`
8. **`onloadedmetadata`** fires → `requestAnimationFrame(tick)` loop begins
9. **Each tick** sends the video frame to `hands.send()`
10. **Cleanup** when `active` becomes false: animation frame cancelled, stream tracks stopped

The `<video>` and `<canvas>` elements are both wrapped in `scale-x-[-1]` to mirror the image. Without mirroring, users see their hands reversed relative to their natural experience, making sign matching confusing. Both elements must be mirrored consistently or the canvas overlay will not align with the video.

### 11.3 Loading states

Each route has a `loading.tsx` file that Next.js shows automatically via Suspense during server rendering or lazy component loading:

```tsx
export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-green border-t-transparent" />
    </div>
  );
}
```

The spinner uses the brand green colour and a transparent top border to create the rotation effect.

---

## 12. Design System

### 12.1 Token architecture

SignBridge uses Tailwind CSS v4's `@theme inline` block to define all design tokens as CSS custom properties that generate Tailwind utility classes:

```css
:root {
  --sb-green:       #1D9E75;
  --sb-green-light: #E1F5EE;
  --sb-green-mid:   #9FE1CB;
  --sb-green-dark:  #0F6E56;
  --sb-charcoal:    #2C2C2A;
  --sb-black:       #111111;
  --sb-page-bg:     #EEECEA;
}

@theme inline {
  --color-green:       var(--sb-green);
  --color-green-light: var(--sb-green-light);
  --color-green-dark:  var(--sb-green-dark);
  --color-charcoal:    var(--sb-charcoal);
  --color-ink:         var(--sb-black);
  --color-page:        var(--sb-page-bg);
  --radius-pill:       100px;
}
```

This generates `bg-green`, `text-green-dark`, `bg-charcoal`, `text-ink`, `rounded-pill`, etc.

### 12.2 Typography

| Font | Variable | Weights | Usage |
|---|---|---|---|
| DM Sans | `--font-sans` | 300–900 (incl. italic) | All body text, headings, UI labels |
| DM Mono | `--font-mono` | 400, 500 | Code-like labels, route paths in mode cards, step numbers |

Both are loaded via `next/font/google` in `layout.tsx`, which optimises them at build time (subset, preload, no layout shift). The CSS variables are injected into the `<html>` element's class list and referenced in `@theme`.

### 12.3 Colour palette rationale

The **teal-green primary** (`#1D9E75`) was chosen for:
- High contrast on both white and dark charcoal backgrounds
- Association with nature and accessibility
- Clear differentiation from the grays and off-whites of the neutral scale

The **charcoal dark** (`#2C2C2A`) is used for the "featured" mode card and data display cards instead of pure black, giving a warmer, more premium feel.

The **page background** (`#EEECEA`) is slightly warm off-white rather than pure white, reducing eye strain for extended use sessions.

### 12.4 Spacing and layout

- **Min touch target:** 48px (all buttons and interactive elements)
- **Border radius:** Pill (`100px`) for buttons/badges, `24px` for cards, `14px` for smaller cards
- **Page padding:** `px-10` (40px) on sections — consistent horizontal rhythm
- **Section padding:** `py-[72px]` — generous vertical breathing room
- **Camera aspect ratio:** `aspect-video` (16:9) — never distorted, never cropped

### 12.5 Motion and animation

Two keyframe animations are defined in `globals.css`:

| Animation | Trigger | Effect |
|---|---|---|
| `signFadeIn` | New sign detected | `opacity: 0 → 1`, `translateY(8px → 0)` — 200ms ease-out |
| `pulseDot` | Status indicator | Scale 0.8–1.0, opacity 0.5–1.0 — 1.6s ease-in-out infinite |
| `confettiBurst` | (future) success state | Radial explosion animation with CSS custom properties for direction |

---

## 13. API and Server Layer

### 13.1 Route: `POST /api/translate`

**File:** `src/app/api/translate/route.ts`
**Type:** Next.js Route Handler (server-side, never ships to the browser)

**Request body:**
```typescript
{ label: string; lang: 'en' | 'tw' }
```

**Response (`TranslateResponseBody`, exported for client typing):**
```typescript
{
  displayText: string;      // Text to show on screen
  audio:       string | null; // Base64 WAV (Twi only)
  lang:        'en' | 'tw';
}
```

**Logic:**
- If `lang === 'en'`: return `{ displayText: label, audio: null, lang: 'en' }` immediately — no external API call needed.
- If `lang === 'tw'`:
  1. POST to GhanaNLP `/v1/translate` with `{ "in": label, "lang": "en-tw" }`
  2. POST to GhanaNLP `/v1/tts` with `{ "text": twiText, "lang": "tw" }`
  3. Convert audio `ArrayBuffer` to base64 via `Buffer.from(arrayBuffer).toString('base64')`
  4. Return `{ displayText: twiText, audio: base64, lang: 'tw' }`
- Wrapped in `try/catch` — on error, returns HTTP 500 with `{ error: 'Translation failed' }`

### 13.2 API key security

The `GHANANLP_API_KEY` environment variable is read **only** inside `route.ts` via `process.env.GHANANLP_API_KEY`. It is:
- Stored in `.env.local` (gitignored)
- Set as a Vercel environment variable in production
- **Never** referenced in any client component
- **Never** logged or returned in responses
- **Never** included in `NEXT_PUBLIC_*` prefix (which would expose it to the browser bundle)

### 13.3 Error handling strategy

The API route returns structured errors:
```typescript
return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
```

The client-side `handleSignAudio` function handles these silently: a failed Twi translation falls back to English speech synthesis. The user experience degrades gracefully — they still hear the English word, and the UI continues to function.

---

## 14. Privacy and Security Model

### 14.1 What never leaves the device

- **Raw camera frames** — never transmitted anywhere. MediaPipe processes frames in WebAssembly within the browser process.
- **Hand landmark coordinates** — never transmitted. `classifySign()` runs entirely client-side.
- **Video stream** — never leaves the browser tab.

### 14.2 What does leave the device

Only the **classified text label** (e.g. the string `"hello"`) is sent to the server for translation. This contains no biometric data, no location information, and no identifiable content.

### 14.3 No storage

SignBridge stores no data — not in a database, not in localStorage, not in cookies. The `twiAudioCache` Map lives only in JavaScript memory for the duration of the browser tab. On page close, everything is cleared.

### 14.4 No account

No user registration, no authentication, no session tokens. The application is fully anonymous.

### 14.5 HTTPS

All deployments on Vercel use HTTPS by default. The API key in `.env.local` is encrypted at rest in Vercel's environment variable storage.

---

## 15. Sign Vocabulary and Linguistics

### 15.1 TypeScript representation

```typescript
export type SignCategory = 'greeting' | 'response' | 'action' | 'object';

export type Sign = {
  label:    string;
  twi:      string;
  gifPath:  string;
  category: SignCategory;
};
```

### 15.2 Full vocabulary

| Label | Twi | Category | GIF path | Notes |
|---|---|---|---|---|
| hello | Mahɔ | greeting | `/signs/hello.gif` | Open palm — universal greeting gesture |
| yes | Aane | response | `/signs/yes.gif` | Thumbs up |
| no | Daabi | response | `/signs/no.gif` | Thumb down, fist |
| help | Boa me | action | `/signs/help.gif` | Index finger point ("assist me") |
| stop | Gyae | action | `/signs/stop.gif` | Fist with thumb tucked |
| good | Eye | response | `/signs/good.gif` | Peace/scissors sign |
| bad | Bɔne | response | `/signs/bad.gif` | Thumbs down (stricter than no) |
| water | Nsuo | object | `/signs/water.gif` | W-shape (3 fingers) |
| name | Din | object | `/signs/name.gif` | Pinky extended |
| school | Sukuu | object | `/signs/school.gif` | L-shape hand |

### 15.3 Category distribution

- **Greetings (1):** hello
- **Responses (4):** yes, no, good, bad
- **Actions (2):** help, stop
- **Objects (3):** water, name, school

This distribution reflects an intentional bias toward high-frequency, high-utility signs for a person who is deaf in an environment (school, healthcare, street) where they need to communicate basic intent and get affirmative/negative responses quickly.

### 15.4 Sign map lookup

```typescript
export const SIGN_MAP: Record<string, Sign> = Object.fromEntries(
  SIGNS.map((s) => [s.label, s])
);
```

`SIGN_MAP` enables O(1) lookup by English label — used in the Speak mode to match typed words to sign GIFs without iterating the full `SIGNS` array.

---

## 16. Performance Architecture

### 16.1 Frame processing

MediaPipe Hands runs at 25–30fps in a `requestAnimationFrame` loop. On modern hardware (iPhone 12+, mid-range Android, 2019+ laptops), this is achievable without dropped frames. On older devices, the WASM execution may limit throughput to 10–15fps, which is still sufficient for sign detection — humans hold signs for hundreds of milliseconds.

### 16.2 Rendering performance

The React Compiler (`babel-plugin-react-compiler`) is enabled in `next.config.ts` with `reactCompiler: true`. This experimental feature automatically memoizes React components and hooks to prevent unnecessary re-renders, comparable to manual `useMemo`/`useCallback` but automatic and more thorough.

### 16.3 Font loading

DM Sans and DM Mono are loaded via `next/font/google`. This:
- Downloads fonts at build time and self-hosts them from Vercel's CDN
- Injects exact font dimensions before rendering to prevent layout shift (CLS = 0)
- Generates CSS variables injected into the root `<html>` element

### 16.4 Audio pre-warming

The 10 Twi audio clips are fetched in parallel on the Translate page's first mount. At ~50ms per API round-trip on a good connection, the full preload completes in under 1 second. After that, all audio plays from memory with no network latency.

### 16.5 Dynamic import

The `HandCamera` component can be wrapped with `next/dynamic` and `{ ssr: false }` to defer its JavaScript bundle (including the MediaPipe import chain) until client-side hydration. This keeps the initial server-rendered HTML fast and prevents the WASM binary from blocking the first paint.

---

## 17. Development Methodology (PRAXIS)

SignBridge was built using the **PRAXIS framework** — a structured approach to hackathon development designed for small teams building complex real-time applications under time pressure.

### 17.1 PRAXIS principles

**P — Plan before code.** The Master Plan document was written before a single line of application code. Every data type, API contract, component interface, and architectural boundary was specified in writing first.

**R — Rules encode discipline.** The `.cursor/rules/signbridge.mdc` file encodes the hardest-learned lessons as machine-readable constraints. AI code generation tools (Cursor) read these rules before generating any code, preventing the most common errors (SSR crashes from top-level MediaPipe imports, API key exposure).

**A — Architecture clarity.** The client/server boundary is drawn explicitly before building, not discovered after breaking the build. Every file is categorised by its execution context before being written.

**X — eXecute in sequence.** The 10 Cursor prompts in Part B of the Master Plan must be executed in order. Prompts that can run in parallel are explicitly marked. The classification engine (Prompt 3) must be working before the camera component (Prompt 6). The camera component must be working before the translation page (Prompt 7).

**I — Integrate incrementally.** Each prompt produces a testable deliverable. There are explicit verification checkpoints: "Do not proceed until you see dots" (after Prompt 6). Each stage is verified before building on top of it.

**S — Spec the critical path.** The `HandCamera` component is identified as the most critical file in the project. It is built and tested first, in isolation, before any UI is built around it. If it fails, nothing else matters. If it works, everything else is straightforward.

### 17.2 AI-assisted development

The PRAXIS prompts are written for Cursor Composer (`Ctrl+I`). Each prompt is:
- Self-contained (includes all necessary context)
- Constrained (specifies types, patterns, file names, directory locations)
- Verifiable (includes test instructions or checklist items)
- Ordered (clearly states what it depends on)

The Cursor rules file ensures that even when an AI assistant generates code outside the explicit prompts, the hard constraints (no `any`, no top-level MediaPipe imports, no client-side API key access) are consistently enforced.

---

## 18. Build Timeline and Team Structure

### 18.1 Recommended 4-hour schedule

| Time | Milestone | Tasks | Who |
|---|---|---|---|
| 0:00–0:30 | Setup | Scaffold, install packages, confirm API key, create repo | Everyone |
| 0:30–1:15 | MediaPipe live | `HandCamera` working, landmark dots on canvas | Dev 1 |
| 1:15–2:00 | First 5 signs | `classifier.ts` + API route + GhanaNLP call | Dev 1 + 2 |
| 2:00–2:45 | Full pipeline | Classifier → API → Twi text + audio plays | Dev 1 + 2 |
| 2:45–3:15 | Lunch + review | Test full loop, replan if needed | All |
| 3:15–3:55 | Learn mode | Lesson cards + GIFs + Try It modal | Dev 3 |
| 3:55–4:35 | Speak + pre-cache | Text→sign lookup, `preloadTwiAudio()`, UI polish | Dev 2 + 3 |
| 4:35–5:15 | Polish + pitch | Landing page, status indicators, responsive check | Dev 3 |
| 5:15–5:35 | Rehearse demo | Full run-through, assign speaking roles | All |
| 5:35–5:45 | Deploy | Push to Vercel, test, freeze code, submit | Dev 1 |

### 18.2 Team roles

| Role | Responsibility |
|---|---|
| Dev 1 | `HandCamera.tsx`, `classifier.ts`, `translate/page.tsx` — the core real-time pipeline |
| Dev 2 | `api/translate/route.ts`, `audio.ts`, `speak/page.tsx` — server + audio layer |
| Dev 3 | `learn/page.tsx`, `LessonCard.tsx`, `page.tsx` (landing), final polish |
| Dev 4 | `signs.ts` vocabulary, design review, demo scripting |

### 18.3 Parallel work

The two most parallelisable tasks are:
1. **Prompt 3** (classifier) and **Prompt 4** (API route) — can run simultaneously on different machines because they have no shared dependencies beyond the type definitions in `signs.ts`.
2. **Prompts 7, 8, and 9** — Translate, Learn, and Speak pages can all be built in parallel once `HandCamera` is verified working.

The **critical path** runs through: scaffold → vocabulary types → classifier → HandCamera → translate page. This sequence cannot be parallelised and must be completed in order.

---

## 19. Impact Assessment and Target Users

### 19.1 Primary users

**Deaf students (ages 6–18):**
The intended daily users. In a classroom where the teacher does not know GSL, a student can hold a sign in front of their phone and have it spoken aloud for the teacher to hear. This requires no interpreter and no pre-installed software.

**Teachers and hearing family members:**
SignBridge's Learn mode enables hearing people to acquire the 10 most essential GSL signs in minutes. The "Try It" camera practice gives them immediate feedback on their hand shapes. A teacher spending 20 minutes with the Learn mode before class can meaningfully communicate with deaf students.

**Healthcare and public service workers:**
Hospitals, police stations, government offices, and banks frequently have no GSL interpreter available. A phone running SignBridge on a table between a deaf person and a hearing service provider can bridge the gap for basic communication — name, help, stop, yes, no.

### 19.2 Impact metrics (current vocabulary)

With 10 signs, SignBridge already covers:
- The single most important greeting (hello)
- Both essential agreement signals (yes, no)
- The single most critical emergency signal (help)
- A safety command (stop)
- Quality assessment (good, bad)
- A daily necessity (water)
- Two identity/location signals (name, school)

This is a minimal viable vocabulary for a deaf person in a school or medical context to communicate intent and receive confirmation.

### 19.3 Scale potential

**Ghana:** 211,000+ active GSL users. A web app requiring only a URL and camera represents the lowest possible barrier to access.

**Africa:** The same architecture can be applied to any African sign language — South African Sign Language, Nigerian Sign Language, Kenyan Sign Language — by replacing the vocabulary file and classifier rules. GhanaNLP's Twi-specific pipeline would be replaced with language-appropriate TTS; English output via Web Speech API works for any sign language.

**Global:** The architectural pattern — WebAssembly hand tracking + rule-based classifier + serverless API proxy — is applicable to any sign language in any country. The PRAXIS prompts are generalisable templates.

### 19.4 Limitations and honest assessment

- **10 signs is not a language.** SignBridge is a vocabulary tool, not a full sign language translator. GSL has thousands of signs. Expanding the vocabulary requires more training data, more classifier rules, and — beyond a certain scale — a machine learning approach rather than rule-based classification.
- **Rule-based classification is brittle.** Different people sign the same word differently. Variations in hand size, skin tone, camera angle, and lighting all affect landmark detection. A robust production system would use a trained neural network classifier.
- **MediaPipe's landmark detection has failure modes.** Highly textured backgrounds, poor lighting, fast motion blur, and partial hand occlusion all reduce detection reliability. Camera quality matters significantly.
- **Twi is one of ~80 Ghanaian languages.** 30% of Ghanaians speak Twi as a first language. The tool currently supports English and Twi only. Expanding to Ga, Ewe, Hausa, or Dagbani would require additional GhanaNLP API support.

---

## 20. Future Roadmap

### 20.1 Near-term (next 3 months)

| Priority | Feature | Description |
|---|---|---|
| P0 | Expanded vocabulary | Add 40 more signs to reach the 50 most common GSL signs. Each sign requires: classifier rule, GIF asset, Twi translation. |
| P0 | ML classifier | Replace rule-based `classifySign()` with a trained TFLite model for higher accuracy and coverage of ambiguous signs. |
| P1 | Sign assets | Replace placeholder GIF paths with actual signed video assets or high-quality animated GIFs recorded by native GSL signers. |
| P1 | Offline mode | Service Worker cache for Twi audio clips + static assets. Enable full functionality without internet after first visit. |
| P2 | Confidence display | Show a visual confidence meter when classification is near a threshold, prompting the user to adjust their sign. |
| P2 | Multiple hands | Enable `maxNumHands: 2` for two-handed signs (currently not in the 10-sign vocabulary, but required for expansion). |

### 20.2 Medium-term (3–12 months)

| Priority | Feature | Description |
|---|---|---|
| P1 | Sentence mode | Buffer detected signs into a sequence. Display full phrases, not just individual words. |
| P1 | Additional Ghanaian languages | Ga, Ewe, Hausa output alongside English and Twi. Contingent on GhanaNLP API support. |
| P1 | Teacher dashboard | A simple progress tracking interface showing which signs a student has successfully practiced and how many attempts each took. |
| P2 | Android PWA | Progressive Web App manifest + service worker for Add to Home Screen on Android. No app store required. |
| P2 | Signer recording | Allow users to record short videos of themselves signing, for sharing with teachers or family members. |
| P3 | Bidirectional | Text/speech to GSL: given an English sentence, show the sequence of GSL signs the user should make. Currently implemented in Speak mode for single words. |

### 20.3 Long-term (1+ year)

| Feature | Description |
|---|---|
| Full GSL dictionary | 500+ sign vocabulary with verified annotations from native GSL signers and the Ghana National Association of the Deaf. |
| Other African sign languages | Adapt the platform for South African Sign Language, Nigerian Sign Language, Kenyan Sign Language — with partnerships with national deaf associations. |
| School curriculum integration | Structured lesson plans aligned with Ghana's school curriculum, enabling GSL to be taught as a subject alongside other languages. |
| API platform | Expose the classification and translation pipeline as an API so other developers can build on top of SignBridge's infrastructure. |
| Continuous sign recognition | Move from static pose recognition to temporal sequence modelling, enabling recognition of signs that involve movement (the majority of real sign languages). |

### 20.4 Technical debt and known issues

1. **`brand-*` Tailwind classes in some components:** `ModeCard.tsx` and `LanguageToggle.tsx` reference `brand-500` and `brand-50` which are not defined in the `@theme` block (which uses `green` and `green-light` instead). These classes may silently fail or need migration.
2. **`preloadTwiAudio` console logs:** The `console.log` statements in `audio.ts` tracking preload progress should be removed or replaced with a proper loading state before production.
3. **No error boundary:** The app has no top-level React error boundary. A crash in `HandCamera` would show a blank page. An `error.tsx` per route would improve resilience.
4. **`video.onloadedmetadata` cleanup:** The requestAnimationFrame loop in `HandCamera` should track its frame ID and cancel it in the cleanup function to prevent memory leaks when the component unmounts.
5. **`SIGN_MAP` type:** Currently `Record<string, Sign>` which means accessing an unknown key returns `undefined` at runtime but TypeScript treats the return as `Sign` (not `Sign | undefined`). Switching to `Partial<Record<string, Sign>>` or a `Map<string, Sign>` would be more type-safe.

---

## Appendix A: File Reference

| File | Lines | Purpose |
|---|---|---|
| `src/app/page.tsx` | ~405 | Landing page (Hero, Stats, Problem, HowItWorks, ModeCards, Personas, Africa, PrivacyBar) |
| `src/app/translate/page.tsx` | ~284 | Sign → Text translation mode |
| `src/app/learn/page.tsx` | ~232 | GSL lesson card library |
| `src/app/speak/page.tsx` | ~167 | Text → Sign reverse lookup |
| `src/app/api/translate/route.ts` | ~93 | GhanaNLP proxy server route |
| `src/app/layout.tsx` | ~40 | Root layout, fonts, Nav, Footer |
| `src/app/globals.css` | ~81 | Design tokens, keyframes, base styles |
| `src/components/HandCamera.tsx` | ~200 | Webcam + MediaPipe integration |
| `src/components/Nav.tsx` | ~115 | Top navigation bar |
| `src/components/NavBar.tsx` | ~81 | Nav internals |
| `src/components/Footer.tsx` | ~61 | Site footer |
| `src/components/LessonCard.tsx` | ~45 | Learn mode card |
| `src/components/ModeCard.tsx` | ~44 | Landing page mode selector |
| `src/components/SignGif.tsx` | ~38 | Sign image with fallback |
| `src/components/LanguageToggle.tsx` | ~38 | EN/Twi pill toggle |
| `src/components/LandmarkCanvas.tsx` | ~15 | Hand skeleton overlay |
| `src/components/SignResult.tsx` | ~14 | Detected sign display |
| `src/lib/classifier.ts` | ~119 | Sign classification engine |
| `src/lib/audio.ts` | ~117 | Audio cache and playback utilities |
| `src/lib/signs.ts` | ~30 | Vocabulary data and types |

---

## Appendix B: Environment and Configuration

### `.env.local` (gitignored)
```
GHANANLP_API_KEY=your_key_here
```

### `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,  // Enables automatic memoisation via React Compiler
};

export default nextConfig;
```

### `tsconfig.json` key settings
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

The `@/*` path alias allows `import { SIGNS } from '@/lib/signs'` from any file in `src/`, regardless of directory depth.

---

*SignBridge Ghana · Cursor Hackathon 2025 · PRAXIS Framework*
*Built with Next.js 16, React 19, @mediapipe/hands 0.4, GhanaNLP Khaya AI, and Tailwind CSS v4*
*Document prepared March 2026*
