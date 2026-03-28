'use client';

import { useState } from 'react';
import { SIGNS, SIGN_MAP, type Lang, type Sign } from '@/lib/signs';
import { SignGif } from '@/components/SignGif';

// ─── Word → Sign resolution ────────────────────────────────────────────────

function resolveWord(word: string, lang: Lang): Sign | null {
  const lower = word.toLowerCase();
  if (lang === 'en') return SIGN_MAP[lower] ?? null;
  return SIGNS.find((s) => s.twi.toLowerCase() === lower) ?? null;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SignWordCard({ word, sign }: { word: string; sign: Sign | null }) {
  if (sign) {
    return (
      <div className="rounded-[14px] border border-[#f0f0f0] p-[14px] pt-[14px] text-center bg-white min-w-[82px]">
        <div className="w-[54px] h-[54px] bg-[#f0f0f0] rounded-[8px] mx-auto mb-[6px] overflow-hidden">
          <SignGif sign={sign} size={54} className="rounded-[8px]" />
        </div>
        <p className="text-[12px] font-[800] text-ink tracking-[-0.3px] mb-[2px] capitalize">{sign.label}</p>
        <p className="text-[9px] text-green font-[700]">{sign.twi}</p>
      </div>
    );
  }
  return (
    <div className="rounded-[14px] border-[1.5px] border-dashed border-[#e0e0e0] p-[14px] text-center bg-[#fafafa] min-w-[82px] opacity-70">
      <div className="w-[54px] h-[54px] bg-[#f5f5f5] rounded-[8px] mx-auto mb-[6px] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="#ccc" strokeWidth="1.5" />
          <path d="M10 6.5v4M10 13h.01" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[12px] text-[#ccc] font-[600]">{word}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

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

  return (
    <main className="min-h-dvh bg-white">

      {/* ── Header ── */}
      <header className="bg-white border-b border-[#f0f0f0] px-7 py-[22px]">
        <div className="text-[10px] font-[700] text-[#bbb] uppercase tracking-[0.08em] mb-1">Mode</div>
        <h1 className="text-[24px] font-[900] text-ink tracking-[-0.8px] mb-1">Text → Sign</h1>
        <p className="text-[12px] text-[#bbb]">Type a word or phrase to see the corresponding Ghanaian Sign Language GIFs</p>
      </header>

      {/* ── Input zone ── */}
      <section className="bg-[#fafafa] border-b border-[#f0f0f0] px-7 py-6">

        {/* Language row */}
        <div className="flex items-center gap-[10px] mb-3">
          <span className="text-[12px] text-[#888] font-[500]">I&apos;m typing in:</span>
          <div className="flex bg-white border border-[#e0e0e0] rounded-pill p-[3px]">
            {(['en', 'tw'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => handleLangChange(l)}
                className={`px-[14px] py-[5px] rounded-pill text-[11px] font-[700] transition-colors ${
                  inputLang === l ? 'bg-ink text-white' : 'text-[#aaa] hover:text-ink'
                }`}
              >
                {l === 'en' ? 'English' : 'Twi'}
              </button>
            ))}
          </div>
        </div>

        {/* Input + button */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="sign-input" className="sr-only">Enter text to convert to signs</label>
          <input
            id="sign-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              inputLang === 'en'
                ? 'Type a word or phrase… e.g. hello yes water school'
                : 'e.g. Mahɔ Nsuo Sukuu'
            }
            className="flex-1 border-[1.5px] border-[#e0e0e0] rounded-[10px] px-4 py-3 text-[14px] bg-white text-ink placeholder:text-[#ccc] outline-none focus:border-green transition-colors min-h-[44px]"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            aria-label="Show signs"
            className="bg-ink text-white px-5 py-3 rounded-[10px] text-[12px] font-[700] transition-colors hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-[5px] min-h-[44px]"
          >
            Show signs
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M6.5 1L12 6.5L6.5 12M1 6.5h11" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </section>

      {/* ── Vocabulary hint ── */}
      <div className="bg-[#fffbcc] border-b border-[#ffe566] px-7 py-[11px] text-[11px] text-[#776600] flex items-start gap-[7px]">
        <span className="font-[800] text-[#554400] whitespace-nowrap">Supported signs:</span>
        <span>hello · yes · no · help · stop · good · bad · water · name · school — unknown words show a placeholder card</span>
      </div>

      {/* ── Output area ── */}
      <section className="px-7 py-6">
        {submitted && words.length > 0 ? (
          <>
            <div className="text-[9px] font-[800] text-[#bbb] uppercase tracking-[0.08em] mb-[14px]">
              Signs for &lsquo;{inputText.trim()}&rsquo;
            </div>
            <div
              className="flex gap-[10px] flex-wrap md:flex-wrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="list"
              aria-label="Sign results"
            >
              {words.map((word, i) => (
                <div key={`${word}-${i}`} role="listitem">
                  <SignWordCard word={word} sign={resolveWord(word, inputLang)} />
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Idle state */
          <div className="flex flex-col items-center py-10 text-center">
            <div className="w-[52px] h-[52px] bg-[#f5f5f5] rounded-[14px] flex items-center justify-center mb-3">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M4 8h14M4 12h14M4 16h8" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[13px] text-[#ccc] font-[500]">Type a word or phrase above to see its signs</p>
          </div>
        )}
      </section>

    </main>
  );
}
