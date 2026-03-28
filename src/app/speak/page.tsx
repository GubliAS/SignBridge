'use client';

import { useMemo, useState } from 'react';
import {
  getStaticTranslation,
  LANG_EXAMPLES,
  LANG_PLACEHOLDER,
  LANGUAGES,
  SIGNS,
  SIGN_MAP,
  type Lang,
  type Sign,
} from '@/lib/signs';
import { SignGif } from '@/components/SignGif';
import { LangDropdown } from '@/components/LangDropdown';
import { PageHeader } from '@/components/PageHeader';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Resolve a typed word to a Sign using static translation data.
 *  en  → match sign.label (English)
 *  tw  → match sign.twi   (Twi)
 *  ee  → match sign.ewe   (Ewe)
 *  gaa → match sign.ga    (Ga)
 */
function resolveWord(word: string, lang: Lang): Sign | null {
  const lower = word.toLowerCase();
  switch (lang) {
    case 'en':
      return SIGN_MAP[lower] ?? null;
    case 'tw':
      return SIGNS.find((s) => s.twi.toLowerCase() === lower) ?? null;
    case 'ee':
      return SIGNS.find((s) => s.ewe.toLowerCase() === lower) ?? null;
    case 'gaa':
      return SIGNS.find((s) => s.ga.toLowerCase() === lower) ?? null;
  }
}

/** Pick the right label to show as the primary text on a result card. */
function getPrimaryLabel(sign: Sign, lang: Lang): string {
  if (lang === 'en') return sign.label;
  return getStaticTranslation(sign, lang) ?? sign.label;
}

/** Pick the secondary gloss shown below the primary label. */
function getSecondaryLabel(sign: Sign, displayLang: Lang, inputLang: Lang): string {
  // Show the input language word as gloss when display differs from input
  if (displayLang !== inputLang) {
    return getPrimaryLabel(sign, inputLang);
  }
  // Same lang — show English as the universal gloss
  return sign.label;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SignWordCard({
  word,
  sign,
  inputLang,
  displayLang,
}: {
  word:        string;
  sign:        Sign | null;
  inputLang:   Lang;
  displayLang: Lang;
}) {
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

  const primary   = getPrimaryLabel(sign, displayLang);
  const secondary = getSecondaryLabel(sign, displayLang, inputLang);

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
  const [inputLang,   setInputLang]   = useState<Lang>('en');
  const [displayLang, setDisplayLang] = useState<Lang>('en');
  const [inputText,   setInputText]   = useState('');
  const [words,       setWords]       = useState<string[]>([]);
  const [submitted,   setSubmitted]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputText.trim().split(/\s+/).filter(Boolean);
    setWords(parsed);
    setSubmitted(parsed.length > 0);
  };

  // Changing input language resets results to avoid stale matches
  const handleInputLangChange = (next: Lang) => {
    setInputLang(next);
    setSubmitted(false);
    setWords([]);
    setInputText('');
  };

  const resolvedWords = useMemo(
    () => words.map((word) => ({ word, sign: resolveWord(word, inputLang) })),
    [words, inputLang],
  );

  const examples    = LANG_EXAMPLES[inputLang];
  const placeholder = LANG_PLACEHOLDER[inputLang];

  return (
    <main className="min-h-dvh bg-white">
      <div className="section-container">
        <PageHeader
          mode="Mode"
          title="Text → Sign"
          description="Type a word or phrase to see the corresponding Ghanaian Sign Language GIFs"
        />

        {/* ── Controls row ── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-[#fafafa] border border-[#f0f0f0] rounded-[10px] px-5 py-4 mt-5">
          {/* Input language */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#888]">I&apos;m typing in:</span>
            <LangDropdown
              value={inputLang}
              onChange={handleInputLangChange}
              ariaLabel="Input language"
            />
          </div>

          <span className="hidden sm:block w-px h-5 bg-[#e8e8e8]" aria-hidden="true" />

          {/* Display / output language */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#888]">Display in:</span>
            <LangDropdown
              value={displayLang}
              onChange={setDisplayLang}
              ariaLabel="Display language"
            />
          </div>
        </div>

        {/* ── Input zone ── */}
        <section className="mt-3">
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
              className="flex-1 border-[1.5px] border-[#e0e0e0] rounded-[10px] px-4 py-3 text-[14px] bg-white text-ink placeholder:text-[#ccc] outline-none focus:border-green transition-colors min-h-[44px]"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
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
        {examples && (
          <div className="mt-3 rounded-md bg-[#fffbcc]/50 border border-[#ffe566]/50 px-4 py-[11px] text-[11px] text-[#776600] flex items-start gap-[7px]">
            <span className="font-bold text-[#554400] whitespace-nowrap">
              Supported signs:
            </span>
            <span>{examples}</span>
          </div>
        )}

        {/* ── Output area ── */}
        <section className="py-6">
          {submitted && words.length > 0 ? (
            <>
              <div className="text-xs md:text-sm font-semibold text-[#bbb] uppercase tracking-[0.08em] mb-[14px]">
                Signs for &lsquo;{inputText.trim()}&rsquo;
                {displayLang !== inputLang && (
                  <span className="ml-2 normal-case font-normal text-[#ccc]">
                    — displayed in {LANGUAGES[displayLang].label}
                  </span>
                )}
              </div>
              <div
                className="flex gap-[10px] flex-wrap"
                role="list"
                aria-label="Sign results"
              >
                {resolvedWords.map(({ word, sign }, i) => (
                  <div key={`${word}-${i}`} role="listitem">
                    <SignWordCard
                      word={word}
                      sign={sign}
                      inputLang={inputLang}
                      displayLang={displayLang}
                    />
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
