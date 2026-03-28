'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
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

// ssr:false is belt-and-suspenders alongside 'use client' + lazy MediaPipe import
const HandCamera = dynamic(
  () => import('@/components/HandCamera').then((m) => m.HandCamera),
  { ssr: false },
);

// ─── Types ──────────────────────────────────────────────────────────────────

interface SignResult {
  english:   string;
  display:   string;
  secondary: string;
  lang:      Lang;
}

// ─── Toast ──────────────────────────────────────────────────────────────────

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 text-sm text-white shadow-xl animate-sign-fade-in"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-gray-400 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function TranslatePage() {
  const [lang,         setLang]         = useState<Lang>('en');
  const [result,       setResult]       = useState<SignResult | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);
  const [toast,        setToast]        = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = (msg: string) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    preloadTwiAudio().finally(() => setIsPreloading(false));
    return () => clearTimeout(toastTimer.current);
  }, []);

  const handleSign = useCallback(async (label: string) => {
    const sign = SIGN_MAP[label];

    if (lang === 'en') {
      setResult({ english: label, display: label, secondary: sign?.twi ?? '', lang: 'en' });
      speakEnglish(label);
      return;
    }

    // Twi — zero-latency cache path
    const cachedAudio = getCachedAudio(label);
    const cachedText  = getCachedDisplayText(label);
    if (cachedAudio && cachedText) {
      setResult({ english: label, display: cachedText, secondary: label, lang: 'tw' });
      playAudio(cachedAudio);
      return;
    }

    // Cache miss — live fetch
    setIsLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ label, lang: 'tw' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as TranslateResponseBody;
      setResult({ english: label, display: data.displayText, secondary: label, lang: 'tw' });
      if (data.audio) playAudio(data.audio);
    } catch {
      // API failure — fall back to English and notify user
      showToast('Translation unavailable. Showing English only.');
      setResult({ english: label, display: label, secondary: sign?.twi ?? '', lang: 'en' });
      speakEnglish(label);
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  const handleLangChange = (next: Lang) => {
    setLang(next);
    setResult(null);
  };

  return (
    <main className="flex min-h-[calc(100dvh-53px)] flex-col bg-background">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h1 className="text-xl font-bold text-brand-600">Translate</h1>
        <LanguageToggle value={lang} onChange={handleLangChange} />
      </header>

      {/* Preload banner */}
      {isPreloading && (
        <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 bg-brand-50 px-4 py-2 text-sm text-brand-600">
          <span aria-hidden="true" className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          Loading Twi audio…
        </div>
      )}

      {/* Camera */}
      <section className="px-4 pt-4">
        <HandCamera active onSign={handleSign} />
      </section>

      {/* Result */}
      <section
        aria-live="polite"
        aria-label="Detected sign result"
        className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-8"
      >
        {result ? (
          <div
            key={`${result.english}-${result.lang}`}
            className="flex flex-col items-center gap-2 animate-sign-fade-in"
          >
            <p className="text-6xl font-bold text-center leading-tight tracking-tight">
              {result.display}
            </p>
            {result.secondary && (
              <p className="text-xl text-gray-400 text-center">{result.secondary}</p>
            )}
          </div>
        ) : (
          <p className="select-none text-2xl text-gray-300 text-center">
            Make a sign…
          </p>
        )}

        {isLoading && (
          <div aria-label="Loading translation" className="flex items-center gap-1.5 mt-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-bounce [animation-delay:0ms]"   />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-bounce [animation-delay:150ms]" />
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-bounce [animation-delay:300ms]" />
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

    </main>
  );
}
