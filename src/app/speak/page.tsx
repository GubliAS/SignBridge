'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  INPUT_SUPPORTED_LANGS,
  LANG_EXAMPLES,
  LANG_PLACEHOLDER,
  LANGUAGES,
  SIGNS,
  SIGN_MAP,
  type Lang,
  type Sign,
} from '@/lib/signs';
import type { TranslateResponseBody } from '@/app/api/translate/route';
import { SignGif } from '@/components/SignGif';
import { LangDropdown } from '@/components/LangDropdown';
import { PageHeader } from '@/components/PageHeader';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Resolve a typed word to a Sign.
 * English  → exact match on sign.label
 * Twi      → exact match on sign.twi
 * Ewe/Ga   → not supported statically; always returns null (placeholder shown)
 */
function resolveWord(word: string, lang: Lang): Sign | null {
  const lower = word.toLowerCase();
  if (lang === 'en') return SIGN_MAP[lower] ?? null;
  if (lang === 'tw') return SIGNS.find((s) => s.twi.toLowerCase() === lower) ?? null;
  return null; // Ewe / Ga have no static translation table
}

const inputSupported = (lang: Lang) => INPUT_SUPPORTED_LANGS.includes(lang);

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * A single result card for one word.
 * Shows the sign GIF + primary label (in output lang) + secondary gloss.
 * Falls back to a placeholder dashed card when no sign was found.
 */
function SignWordCard({
  word,
  sign,
  lang,
}: {
  word: string;
  sign: Sign | null;
  lang: Lang;
}) {
  const [remoteText, setRemoteText] = useState<string | null>(null);
  const [remoteLoading, setRemoteLoading] = useState(false);

  // Fetch translated label for Ewe / Ga output
  useEffect(() => {
    if (!sign || lang === 'en' || lang === 'tw') {
      setRemoteText(null);
      setRemoteLoading(false);
      return;
    }
    let cancelled = false;
    setRemoteLoading(true);
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: sign.label, lang }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('translate'))))
      .then((data: TranslateResponseBody) => {
        if (!cancelled) setRemoteText(data.displayText);
      })
      .catch(() => {
        if (!cancelled) setRemoteText(null);
      })
      .finally(() => {
        if (!cancelled) setRemoteLoading(false);
      });
    return () => { cancelled = true; };
  }, [sign, lang]);

  if (!sign) {
    return (
      <div className="rounded-[14px] border-[1.5px] border-dashed border-[#e0e0e0] p-[14px] text-center bg-[#fafafa] min-w-[82px] opacity-70">
        <div className="w-[54px] h-[54px] bg-[#f5f5f5] rounded-[8px] mx-auto mb-[6px] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7.5" stroke="#ccc" strokeWidth="1.5" />
            <path d="M10 6.5v4M10 13h.01" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-[12px] text-[#ccc] font-semibold truncate max-w-[82px]">{word}</p>
        <p className="text-[10px] text-[#ddd] mt-[2px]">no sign</p>
      </div>
    );
  }

  // Determine what label to show as primary / secondary
  let primary: string;
  let secondary: string;
  if (lang === 'en') {
    primary = sign.label;
    secondary = sign.twi;
  } else if (lang === 'tw') {
    primary = sign.twi;
    secondary = sign.label;
  } else {
    // Ewe / Ga — use fetched text while loading, fall back to Twi
    primary = remoteLoading && !remoteText ? '…' : (remoteText ?? sign.twi);
    secondary = sign.label;
  }

  return (
    <div className="rounded-[14px] border border-[#f0f0f0] p-[14px] text-center bg-white min-w-[82px]">
      <div className="w-[84px] h-[84px] bg-[#f0f0f0] rounded-[8px] mx-auto mb-[6px] overflow-hidden">
        <SignGif sign={sign} size={84} className="rounded-[8px]" />
      </div>
      <p className="text-sm sm:text-base font-semibold text-ink tracking-[-0.3px] mb-[2px] capitalize">
        {primary}
      </p>
      <p className="text-xs text-green font-medium">{secondary}</p>
    </div>
  );
}

/** Inline banner shown when the selected language has no static lookup support. */
function UnsupportedInputNotice({ lang }: { lang: Lang }) {
  return (
    <div
      role="note"
      className="flex items-start gap-[7px] rounded-md bg-[#fff8e6] border border-[#ffe09a] px-4 py-[10px] text-[11px] text-[#8a6000]"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 mt-[1px]">
        <circle cx="7" cy="7" r="6" stroke="#c98a00" strokeWidth="1.2" />
        <path d="M7 4v3.5M7 9.5h.01" stroke="#c98a00" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span>
        <strong>{LANGUAGES[lang].label} text input isn&apos;t supported yet.</strong>{' '}
        Try typing in <strong>English</strong> or <strong>Twi</strong> — the GIF will still display in your chosen language.
      </span>
    </div>
  );
}

/** Empty / idle state shown before a search is submitted. */
function EmptyState() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="w-[52px] h-[52px] bg-[#f5f5f5] rounded-[14px] flex items-center justify-center mb-3">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M4 8h14M4 12h14M4 16h8" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[13px] text-[#ccc] font-medium">
        Type a word or phrase above to see its signs
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SpeakPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSupported(lang)) return; // Prevent submit when input not supported
    const parsed = inputText.trim().split(/\s+/).filter(Boolean);
    setWords(parsed);
    setSubmitted(parsed.length > 0);
  };

  const handleLangChange = (next: Lang) => {
    setLang(next);
    // Clear results when switching language — avoids stale resolutions
    setSubmitted(false);
    setWords([]);
    setInputText('');
  };

  const resolvedWords = useMemo(
    () => words.map((word) => ({ word, sign: resolveWord(word, lang) })),
    [words, lang],
  );

  const isInputSupported = inputSupported(lang);
  const placeholder = LANG_PLACEHOLDER[lang];
  const examples = LANG_EXAMPLES[lang];

  return (
    <main className="min-h-dvh bg-white">
      <div className="section-container">
        <PageHeader
          mode="Mode"
          title="Text → Sign"
          description="Type a word or phrase to see the corresponding Ghanaian Sign Language GIFs"
          action={
            <>
              <span className="text-xs md:text-sm text-[#888] font-medium">
                I&apos;m typing in:
              </span>
              <LangDropdown
                value={lang}
                onChange={handleLangChange}
                ariaLabel="Input language"
              />
            </>
          }
        />

        {/* ── Input zone ── */}
        <section className="bg-[#fafafa] border-b border-[#f0f0f0] px-7 py-6 mt-5 rounded-md space-y-3">
          {/* Unsupported input warning */}
          {!isInputSupported && <UnsupportedInputNotice lang={lang} />}

          {/* Input + submit */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="sign-input" className="sr-only">
              Enter text to convert to signs
            </label>
            <input
              id="sign-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={placeholder}
              disabled={!isInputSupported}
              className="flex-1 border-[1.5px] border-[#e0e0e0] rounded-[10px] px-4 py-3 text-[14px] bg-white text-ink placeholder:text-[#ccc] outline-none focus:border-green transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || !isInputSupported}
              aria-label="Show signs"
              className="bg-ink text-white px-5 py-3 rounded-full text-sm font-medium transition-colors hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-[5px] min-h-[44px]"
            >
              Show signs
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M6.5 1L12 6.5L6.5 12M1 6.5h11" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </section>

        {/* ── Vocabulary hint ── */}
        {isInputSupported && examples && (
          <div className="mt-3 rounded-md bg-[#fffbcc]/50 border border-[#ffe566]/50 px-4 py-[11px] text-[11px] text-[#776600] flex items-start gap-[7px]">
            <span className="font-bold text-[#554400] whitespace-nowrap">
              Supported signs:
            </span>
            <span>{examples}</span>
          </div>
        )}

        {/* ── Output area ── */}
        <section className="px-7 py-6">
          {submitted && words.length > 0 ? (
            <>
              <div className="text-xs md:text-sm font-semibold text-[#bbb] uppercase tracking-[0.08em] mb-[14px]">
                Signs for &lsquo;{inputText.trim()}&rsquo;
                <span className="ml-2 normal-case font-normal text-[#ccc]">
                  — displayed in {LANGUAGES[lang].label}
                </span>
              </div>
              <div
                className="flex gap-[10px] flex-wrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="list"
                aria-label="Sign results"
              >
                {resolvedWords.map(({ word, sign }, i) => (
                  <div key={`${word}-${i}`} role="listitem">
                    <SignWordCard word={word} sign={sign} lang={lang} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </main>
  );
}
