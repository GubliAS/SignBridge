import { SIGNS } from '@/lib/signs';
import type { Lang } from '@/lib/signs';
import type { TranslateResponseBody } from '@/app/api/translate/route';

/** audio cache:       label → base64 WAV */
const twiAudioCache = new Map<string, string>();
/** display text cache: label → Twi text returned by the API */
const twiDisplayCache = new Map<string, string>();

/** Track any currently playing Audio element so we can cancel it */
let currentAudio: HTMLAudioElement | null = null;

/**
 * Pre-fetches TTS audio + Twi display text for all 10 signs from /api/translate.
 * Stores results in twiAudioCache and twiDisplayCache.
 * Call once on page mount. Silently skips any sign that fails.
 */
export async function preloadTwiAudio(): Promise<void> {
  let loaded = 0;

  await Promise.all(
    SIGNS.map(async (sign) => {
      if (twiAudioCache.has(sign.label)) {
        loaded++;
        console.log(`Preloading audio: ${loaded}/${SIGNS.length}`);
        return;
      }
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label: sign.label, lang: 'tw' }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as TranslateResponseBody;
        if (data.audio)       twiAudioCache.set(sign.label, data.audio);
        if (data.displayText) twiDisplayCache.set(sign.label, data.displayText);
      } catch {
        // Network failure — skip silently
      } finally {
        loaded++;
        console.log(`Preloading audio: ${loaded}/${SIGNS.length}`);
      }
    }),
  );
}

/** Returns cached base64 audio for a label, or undefined if not pre-loaded. */
export function getCachedAudio(label: string): string | undefined {
  return twiAudioCache.get(label);
}

/** Returns cached Twi display text for a label, or undefined if not pre-loaded. */
export function getCachedDisplayText(label: string): string | undefined {
  return twiDisplayCache.get(label);
}

/**
 * Plays a base64-encoded WAV string in the browser.
 * Cancels any currently playing audio first.
 */
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
  audio.play().catch(() => {
    // Autoplay may be blocked before a user gesture
  });
}

/** Speaks an English label via the browser's Web Speech API. */
export function speakEnglish(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt  = new SpeechSynthesisUtterance(text);
  utt.lang   = 'en-US';
  utt.rate   = 0.9;
  window.speechSynthesis.speak(utt);
}

/**
 * Handles audio output for a detected sign.
 * Returns void (fire-and-forget) — safe to call from event handlers.
 */
export function handleSignAudio(label: string, lang: Lang): void {
  if (lang === 'en') {
    speakEnglish(label);
    return;
  }

  const cached = getCachedAudio(label);
  if (cached) {
    playAudio(cached);
    return;
  }

  // Cache miss — fetch live then play (rarely happens if preload completed)
  void fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label, lang: 'tw' }),
  })
    .then(async (res) => {
      if (!res.ok) return;
      const data = (await res.json()) as TranslateResponseBody;
      if (data.audio)       { twiAudioCache.set(label, data.audio); playAudio(data.audio); }
      if (data.displayText)   twiDisplayCache.set(label, data.displayText);
    })
    .catch(() => { /* silent fallback */ });
}
