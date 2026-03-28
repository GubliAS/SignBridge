/** In-memory cache: sign label → base64-encoded audio string */
const audioCache = new Map<string, string>();

/**
 * Pre-fetches TTS audio for all 10 signs from /api/translate and
 * stores the base64 results in audioCache. Call once on page mount.
 */
export async function preloadTwiAudio(labels: string[]): Promise<void> {
  await Promise.allSettled(
    labels.map(async (label) => {
      if (audioCache.has(label)) return;
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, lang: 'tw' }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { audio?: string };
      if (data.audio) audioCache.set(label, data.audio);
    }),
  );
}

/**
 * Returns the cached base64 audio string for a label, or undefined
 * if the label has not been pre-loaded.
 */
export function getCachedAudio(label: string): string | undefined {
  return audioCache.get(label);
}

/**
 * Plays a base64-encoded audio string in the browser.
 */
export function playAudio(base64: string): void {
  const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
  audio.play().catch(() => {
    // Autoplay may be blocked — user gesture required before first play.
  });
}

/**
 * Speaks an English label via the browser's Web Speech API.
 */
export function speakEnglish(label: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(label);
  utterance.lang = 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
