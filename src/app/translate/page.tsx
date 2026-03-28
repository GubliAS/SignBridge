'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  getCachedAudio,
  getCachedDisplayText,
  playAudio,
  preloadAudio,
  speakEnglish,
<<<<<<< HEAD
} from '@/lib/audio';
import { LANGUAGES, SIGN_MAP, SIGNS, type Lang } from '@/lib/signs';
import type { TranslateResponseBody } from '@/app/api/translate/route';

// ssr:false is belt-and-suspenders alongside 'use client' + lazy MediaPipe import
const HandCamera = dynamic(
  () => import("@/components/HandCamera").then((m) => m.HandCamera),
  { ssr: false },
);

// ─── Types ──────────────────────────────────────────────────────────────────

interface SignResult {
  english:   string;
  display:   string;
  secondary: string;
  lang:      Lang;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LangDropdown({ value, onChange }: { value: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Lang)}
        aria-label="Output language"
        className="appearance-none bg-[#f5f5f5] rounded-pill pl-4 pr-8 py-[7px] text-[11px] font-[700] text-ink border-none outline-none cursor-pointer hover:bg-[#ececec] transition-colors"
      >
        {(Object.entries(LANGUAGES) as [Lang, { label: string }][]).map(([code, { label }]) => (
          <option key={code} value={code}>{label}</option>
        ))}
      </select>
      {/* chevron */}
      <svg
        className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2"
        width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"
      >
        <path d="M1 1L5 5L9 1" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 1.5L12 3.5v3.5c0 3-2.5 5-5 5.5C4.5 12 2 10 2 7V3.5L7 1.5z" stroke="white" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TranslatePage() {
  const [lang,         setLang]         = useState<Lang>('en');
  const [result,       setResult]       = useState<SignResult | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadLabel, setPreloadLabel] = useState('');
  const [toast,        setToast]        = useState<string | null>(null);
  const [recentSigns,  setRecentSigns]  = useState<string[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showToast = (msg: string) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  // Preload audio for a language in the background
  const triggerPreload = useCallback((target: Lang) => {
    if (target === 'en') return;
    const label = LANGUAGES[target].label;
    setIsPreloading(true);
    setPreloadLabel(label);
    preloadAudio(target as Exclude<Lang, 'en'>).finally(() => setIsPreloading(false));
  }, []);

  // Preload Twi on mount so the first sign detection is instant
  useEffect(() => {
    triggerPreload('tw');
    return () => clearTimeout(toastTimer.current);
  }, [triggerPreload]);

  const handleSign = useCallback(async (label: string) => {
    const sign = SIGN_MAP[label];

    setRecentSigns((prev) => [label, ...prev.filter((s) => s !== label)].slice(0, 8));

    if (lang === 'en') {
      setResult({ english: label, display: label, secondary: sign?.twi ?? '', lang: 'en' });
      speakEnglish(label);
      return;
    }

    // Non-English — zero-latency cache path
    const cachedAudio = getCachedAudio(label, lang);
    const cachedText  = getCachedDisplayText(label, lang);
    if (cachedAudio && cachedText) {
      setResult({ english: label, display: cachedText, secondary: label, lang });
      playAudio(cachedAudio);
      return;
    }

    // Cache miss — live fetch
    setIsLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ label, lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as TranslateResponseBody;
      setResult({ english: label, display: data.displayText, secondary: label, lang });
      if (data.audio) playAudio(data.audio);
    } catch {
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
    triggerPreload(next);
  };

  const currentLangLabel = LANGUAGES[lang].label;

  return (
    <main className="flex flex-col bg-white min-h-[calc(100dvh-60px)]">

      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-[#f0f0f0] px-7 py-[18px] bg-white flex-shrink-0">
        <div>
          <div className="text-[9px] font-[800] text-green uppercase tracking-[0.12em] mb-[3px]">Mode</div>
          <h1 className="text-[20px] font-[900] text-ink tracking-[-0.7px]">Sign → Text</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#bbb] font-[600]">Output</span>
          <LangDropdown value={lang} onChange={handleLangChange} />
        </div>
      </header>

      {/* Preload banner */}
      {isPreloading && (
        <div role="status" aria-live="polite" className="flex items-center justify-center gap-2 bg-green-light px-4 py-2 text-[11px] text-green-dark font-[500]">
          <span aria-hidden="true" className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-green border-t-transparent" />
          Loading {preloadLabel} audio…
        </div>
      )}

      {/* ── Body — two-column on desktop, stacked on mobile ── */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_340px] flex-1">

        {/* Camera column */}
        <div className="bg-[#0d0d0d] flex flex-col">
          <div className="relative flex-1 flex items-center justify-center min-h-[220px] md:min-h-0">
            {/* LIVE badge */}
            <div className="absolute top-3 left-[14px] z-10 flex items-center gap-1 bg-green text-white text-[8px] font-[800] px-[9px] py-[3px] rounded-pill tracking-[0.04em]">
              <span className="w-[5px] h-[5px] rounded-full bg-white" />
              LIVE
            </div>

            <HandCamera active onSign={handleSign} />
          </div>

          {/* Tip bar */}
          <div className="px-[14px] py-[10px] bg-[#0a0a0a] border-t border-[#161616] flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green flex items-center justify-center flex-shrink-0">
              <ShieldIcon />
            </div>
            <span className="text-[9px] text-[#333]">Your camera never leaves this device. All detection runs locally.</span>
          </div>
        </div>

        {/* Result panel */}
        <div className="md:border-l border-[#1a1a1a] bg-white flex flex-col">

          {/* Main result */}
          <section
            aria-live="polite"
            aria-label="Detected sign result"
            className="flex-1 flex flex-col items-center justify-center px-5 py-7 text-center border-b border-[#f5f5f5] min-h-[160px]"
          >
            {result ? (
              <div
                key={`${result.english}-${result.lang}`}
                className="flex flex-col items-center gap-[10px] animate-sign-fade-in"
              >
                <div className="text-[9px] font-[800] text-green uppercase tracking-[0.1em]">Sign detected</div>
                <p className="text-[clamp(48px,8vw,72px)] font-[900] text-ink tracking-[-3px] leading-none">
                  {result.display}
                </p>
                {result.secondary && (
                  <div>
                    <div className="text-[9px] text-[#bbb] uppercase tracking-[0.08em] font-[700] mb-[2px]">
                      {result.lang === 'en' ? 'Twi' : 'English'}
                    </div>
                    <p className="text-[18px] text-[#888] font-[600] tracking-[-0.3px]">{result.secondary}</p>
                  </div>
                )}
                <div className="w-8 h-8 rounded-full bg-green-light flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {isLoading && (
                  <div aria-label="Loading translation" className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green animate-bounce [animation-delay:0ms]"   />
                    <span className="h-2 w-2 rounded-full bg-green animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-green animate-bounce [animation-delay:300ms]" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-[7px] h-[7px] rounded-full border-[1.5px] border-[#ddd] flex-shrink-0" />
                  <p className="text-[14px] text-[#ccc] italic">Make a sign…</p>
                </div>
                {lang !== 'en' && (
                  <div className="text-[10px] text-[#bbb] bg-[#fafafa] border border-[#f0f0f0] rounded-pill px-3 py-[5px]">
                    Output: <span className="font-[700] text-[#999]">{currentLangLabel}</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Sign strip */}
          <div className="px-4 py-[14px]">
            <div className="text-[8px] font-[800] text-[#bbb] uppercase tracking-[0.08em] mb-2">Recent signs</div>
            {recentSigns.length === 0 ? (
              <div className="flex gap-[6px]">
                {SIGNS.slice(0, 5).map((s) => (
                  <div key={s.label} className="rounded-[10px] border border-[#f0f0f0] p-2 text-center min-w-[52px] bg-[#fafafa]">
                    <div className="w-[30px] h-[30px] bg-[#e8e8e8] rounded-[6px] mx-auto mb-1 flex items-center justify-center text-[8px] text-[#ccc]">gif</div>
                    <div className="text-[9px] font-[700] text-[#555]">{s.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-[6px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {recentSigns.map((label, i) => {
                  const s      = SIGN_MAP[label];
                  const active = i === 0;
                  const cached = lang !== 'en' ? getCachedDisplayText(label, lang) : undefined;
                  return (
                    <div
                      key={label}
                      className={`flex-shrink-0 rounded-[10px] border p-2 text-center min-w-[52px] transition-colors ${
                        active ? 'border-green bg-green-light' : 'border-[#f0f0f0] bg-[#fafafa]'
                      }`}
                    >
                      <div className={`w-[30px] h-[30px] rounded-[6px] mx-auto mb-1 flex items-center justify-center text-[8px] ${active ? 'bg-[#c8edd8] text-green-dark' : 'bg-[#e8e8e8] text-[#ccc]'}`}>
                        gif
                      </div>
                      <div className={`text-[9px] font-[700] ${active ? 'text-green-dark' : 'text-[#555]'}`}>{label}</div>
                      {/* Show translated word if cached, else fall back to Twi */}
                      <div className={`text-[7px] ${active ? 'text-green' : 'text-[#bbb]'}`}>
                        {cached ?? s?.twi}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Privacy bar */}
          <div className="px-[14px] py-[10px] bg-green-light border-t border-[#c8edd8] flex items-center gap-[7px]">
            <div className="w-5 h-5 rounded-full bg-green flex items-center justify-center flex-shrink-0">
              <ShieldIcon />
            </div>
            <span className="text-[10px] text-green-dark font-[500]">Your camera never leaves this device. All detection runs locally.</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="assertive"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-[#111] px-5 py-3 text-[13px] text-white shadow-xl animate-sign-fade-in"
        >
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification" className="text-[#666] hover:text-white">✕</button>
        </div>
      )}

    </main>
  );
}
