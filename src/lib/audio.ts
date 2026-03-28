import { SIGNS } from '@/lib/signs';
import type { Lang } from '@/lib/signs';
import type { TranslateResponseBody } from '@/app/api/translate/route';

/** In-memory cache: sign label → base64-encoded audio string */
const twiCache = new Map<string, string>();

/** Track any currently playing Audio element so we can cancel it */
let currentAudio: HTMLAudioElement | null = null;

/**
 * Pre-fetches TTS audio for all 10 signs from /api/translate and stores
 * the base64 results in twiCache. Call once on page mount (fire-and-forget).
 * Silently skips any sign that fails — degrades gracefully.
 */
export async function preloadTwiAudio(): Promise<void> {
  await Promise.all(
    SIGNS.map(async (sign) => {
      if (twiCache.has(sign.label)) return;
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label: sign.label, lang: 'tw' }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as TranslateResponseBody;
        if (data.audio) twiCache.set(sign.label, data.audio);
      } catch {
        // Network failure — skip silently
      }
    }),
  );
}

/**
 * Returns the cached base64 audio string for a label, or undefined
 * if the label has not been pre-loaded yet.
 */
export function getCachedAudio(label: string): string | undefined {
  return twiCache.get(label);
}

/**
 * Plays a base64-encoded audio string in the browser.
 * Cancels any currently playing audio first.
 */
export function playAudio(base64: string): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: 'audio/mpeg' });
  const audio = new Audio(URL.createObjectURL(blob));
  currentAudio = audio;
  audio.play().catch(() => {
    // Autoplay may be blocked before a user gesture
  });
}

/**
 * Speaks an English label via the browser's Web Speech API.
 */
export function speakEnglish(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US';
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

/**
 * Handles audio output for a detected sign based on the active language.
 * Checks cache first for Twi; falls back to a live fetch if not cached.
 */
export async function handleSignAudio(label: string, lang: Lang): Promise<void> {
  if (lang === 'en') {
    speakEnglish(label);
    return;
  }

  const cached = getCachedAudio(label);
  if (cached) {
    playAudio(cached);
    return;
  }

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, lang: 'tw' }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as TranslateResponseBody;
    if (data.audio) {
      twiCache.set(label, data.audio);
      playAudio(data.audio);
    }
  } catch {
    // Network failure — silent fallback
  }
}
