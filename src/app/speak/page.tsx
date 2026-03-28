'use client';

import { useState } from 'react';
import { SIGNS, SIGN_MAP, type Lang, type Sign } from '@/lib/signs';
import { SignGif } from '@/components/SignGif';

// ─── Word → Sign resolution ────────────────────────────────────────────────

/**
 * Given a single word and the input language, return the matching Sign or null.
 * - English input: looks up SIGN_MAP by lowercased word.
 * - Twi input:     matches against sign.twi values (case-insensitive).
 */
function resolveWord(word: string, lang: Lang): Sign | null {
  const lower = word.toLowerCase();
  if (lang === 'en') return SIGN_MAP[lower] ?? null;
  return SIGNS.find((s) => s.twi.toLowerCase() === lower) ?? null;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

interface SignWordCardProps {
  word:  string;
  sign:  Sign | null;
}

function SignWordCard({ word, sign }: SignWordCardProps) {
  if (sign) {
    return (
      <div className="flex w-32 shrink-0 flex-col items-center gap-2 sm:w-40">
        <SignGif sign={sign} className="w-full rounded-2xl bg-gray-50" />
        <p className="text-sm font-semibold capitalize">{sign.label}</p>
        <p className="text-xs text-gray-400">{sign.twi}</p>
      </div>
    );
  }

  return (
    <div className="flex w-32 shrink-0 flex-col items-center gap-2 sm:w-40">
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
        <span className="text-center text-xs font-medium text-gray-400 px-2 break-words">
          {word}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-400">{word}</p>
      <p className="text-xs text-gray-300">No sign found</p>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SpeakPage() {
  const [inputLang, setInputLang] = useState<Lang>('en');
  const [inputText, setInputText] = useState('');
  const [words,     setWords]     = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inputText.trim().split(/\s+/).filter(Boolean);
    setWords(parsed);
    setSubmitted(parsed.length > 0);
  };

  const handleLangChange = (lang: Lang) => {
    setInputLang(lang);
    setSubmitted(false);
    setWords([]);
  };

  const matchedCount = submitted
    ? words.filter((w) => resolveWord(w, inputLang) !== null).length
    : 0;

  return (
    <main className="flex min-h-dvh flex-col bg-background">

      {/* Header */}
      <header className="px-4 pb-4 pt-8">
        <h1 className="text-2xl font-bold">Speak in Sign Language</h1>
        <p className="mt-1 text-sm text-gray-400">
          Type a word or phrase to see its sign
        </p>
      </header>

      {/* Form */}
      <section className="px-4 pb-6">
        {/* Language selector */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-gray-500">I&apos;m typing in:</span>
          <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => handleLangChange('en')}
              className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                inputLang === 'en'
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('tw')}
              className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors ${
                inputLang === 'tw'
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Twi
            </button>
          </div>
        </div>

        {/* Input + submit */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="sign-input" className="sr-only">
            Enter text to convert to signs
          </label>
          <input
            id="sign-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              inputLang === 'en'
                ? 'e.g. hello water school'
                : 'e.g. Mahɔ Nsuo Sukuu'
            }
            className="min-h-[52px] flex-1 rounded-2xl border-2 border-gray-200 bg-white px-5 text-base outline-none transition-colors placeholder:text-gray-300 focus:border-brand-500"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="min-h-[52px] rounded-2xl bg-brand-500 px-8 text-base font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            Show Signs
          </button>
        </form>
      </section>

      {/* Results */}
      {submitted && words.length > 0 && (
        <section className="flex flex-col gap-4 px-4 pb-16">
          {/* Match summary */}
          <p className="text-sm text-gray-400">
            {matchedCount} of {words.length} word{words.length !== 1 ? 's' : ''} found in GSL vocabulary
          </p>

          {/* Horizontal scroll row */}
          <div
            className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="Sign results"
          >
            {words.map((word, i) => (
              <div key={`${word}-${i}`} role="listitem">
                <SignWordCard word={word} sign={resolveWord(word, inputLang)} />
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
