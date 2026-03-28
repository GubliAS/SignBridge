'use client';

import { useCallback, useEffect, useState } from 'react';
import { HandCamera } from '@/components/HandCamera';
import { LanguageToggle } from '@/components/LanguageToggle';
import {
  getCachedAudio,
  getCachedDisplayText,
  playAudio,
  preloadTwiAudio,
  speakEnglish,
} from '@/lib/audio';
import { SIGN_MAP, type Lang } from '@/lib/signs';
import type { TranslateResponseBody } from '@/app/api/translate/route';

interface SignResult {
  english:    string; // sign label ('hello', 'yes', …)
  display:    string; // text shown large (English word or Twi translation)
  secondary:  string; // the other language shown small
  lang:       Lang;
}

export default function TranslatePage() {
  const [lang,         setLang]         = useState<Lang>('en');
  const [result,       setResult]       = useState<SignResult | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);

  // Pre-cache all Twi audio on mount
  useEffect(() => {
    preloadTwiAudio().finally(() => setIsPreloading(false));
  }, []);

  const handleSign = useCallback(async (label: string) => {
    const sign = SIGN_MAP[label];

    if (lang === 'en') {
      setResult({
        english:   label,
        display:   label,
        secondary: sign?.twi ?? '',
        lang:      'en',
      });
      speakEnglish(label);
      return;
    }

    // Twi — check cache first (zero-latency path)
    const cachedAudio = getCachedAudio(label);
    const cachedText  = getCachedDisplayText(label);

    if (cachedAudio && cachedText) {
      setResult({
        english:   label,
        display:   cachedText,
        secondary: label,
        lang:      'tw',
      });
      playAudio(cachedAudio);
      return;
    }

    // Cache miss — live fetch (should rarely happen after preload)
    setIsLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ label, lang: 'tw' }),
      });

      if (!res.ok) throw new Error('translate failed');

      const data = (await res.json()) as TranslateResponseBody;

      setResult({
        english:   label,
        display:   data.displayText,
        secondary: label,
        lang:      'tw',
      });

      if (data.audio) playAudio(data.audio);
    } catch {
      // Fallback: show English label so screen is never blank
      setResult({
        english:   label,
        display:   label,
        secondary: sign?.twi ?? '',
        lang:      'tw',
      });
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  const handleLangChange = (next: Lang) => {
    setLang(next);
    setResult(null);
  };

  return (
    <main className="flex min-h-dvh flex-col bg-background">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h1 className="text-xl font-bold text-brand-600">SignBridge</h1>
        <LanguageToggle value={lang} onChange={handleLangChange} />
      </header>

      {/* Preload banner — visible only while audio is being cached */}
      {isPreloading && (
        <div className="flex items-center justify-center gap-2 bg-brand-50 px-4 py-2 text-sm text-brand-600">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          Loading Twi audio…
        </div>
      )}

      {/* ── Camera (≈50 vh) ──────────────────────────────────────────── */}
      <section className="px-4 pt-4">
        <HandCamera active onSign={handleSign} />
      </section>

      {/* ── Result display ───────────────────────────────────────────── */}
      <section className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-8">
        {result ? (
          /*
           * key forces a remount whenever the sign or language changes,
           * which restarts the CSS fade-in animation from scratch.
           */
          <div
            key={`${result.english}-${result.lang}`}
            className="flex flex-col items-center gap-2 animate-sign-fade-in"
          >
            <p className="text-6xl font-bold text-center leading-tight tracking-tight">
              {result.display}
            </p>
            {result.secondary && (
              <p className="text-xl text-gray-400 text-center">
                {result.secondary}
              </p>
            )}
          </div>
        ) : (
          <p className="select-none text-2xl text-gray-300 text-center">
            Make a sign…
          </p>
        )}

        {/* Pulsing dots while live-fetching Twi translation */}
        {isLoading && (
          <div className="flex items-center gap-1.5 mt-2" aria-label="Loading translation">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0ms]"   />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-bounce [animation-delay:150ms]" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-bounce [animation-delay:300ms]" />
          </div>
        )}
      </section>

    </main>
  );
}
