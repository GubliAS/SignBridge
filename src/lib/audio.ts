import { SIGNS } from '@/lib/signs';
import type { Lang } from '@/lib/signs';
import type { TranslateResponseBody } from '@/app/api/translate/route';

// Cache keys are "${lang}:${label}" so all four languages share one Map.
// e.g. "tw:hello", "ee:hello", "gaa:hello"
const audioCache   = new Map<string, string>(); // key → base64 WAV
const displayCache = new Map<string, string>(); // key → translated display text

/** Track any currently playing Audio element so we can cancel it */
let currentAudio: HTMLAudioElement | null = null;

function cacheKey(lang: Lang, label: string): string {
  return `${lang}:${label}`;
}

/**
 * Pre-fetches TTS audio + translated display text for all 10 signs
 * for the given language. Silently skips any sign that fails.
 * Safe to call multiple times — already-cached entries are skipped.
 */
export async function preloadAudio(lang: Exclude<Lang, 'en'>): Promise<void> {
  await Promise.all(
    SIGNS.map(async (sign) => {
      const key = cacheKey(lang, sign.label);
      if (audioCache.has(key)) return; // already cached
      try {
        const res = await fetch('/api/translate', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ label: sign.label, lang }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as TranslateResponseBody;
        if (data.audio)       audioCache.set(key,   data.audio);
        if (data.displayText) displayCache.set(key, data.displayText);
      } catch {
        // Network failure — skip silently
      }
    }),
  );
}

/** Returns cached base64 audio for a label + language, or undefined if not pre-loaded. */
export function getCachedAudio(label: string, lang: Lang): string | undefined {
  return audioCache.get(cacheKey(lang, label));
}

/** Returns cached translated display text for a label + language, or undefined. */
export function getCachedDisplayText(label: string, lang: Lang): string | undefined {
  return displayCache.get(cacheKey(lang, label));
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
 * Checks the cache first; falls back to a live fetch on a cache miss.
 * Fire-and-forget — safe to call from event handlers.
 */
export function handleSignAudio(label: string, lang: Lang): void {
  if (lang === 'en') {
    speakEnglish(label);
    return;
  }

  const cached = getCachedAudio(label, lang);
  if (cached) {
    playAudio(cached);
    return;
  }

  // Cache miss — fetch live, store, then play
  void fetch('/api/translate', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ label, lang }),
  })
    .then(async (res) => {
      if (!res.ok) return;
      const data = (await res.json()) as TranslateResponseBody;
      const key  = cacheKey(lang, label);
      if (data.audio)       { audioCache.set(key, data.audio);         playAudio(data.audio); }
      if (data.displayText)   displayCache.set(key, data.displayText);
    })
    .catch(() => { /* silent fallback */ });
}
