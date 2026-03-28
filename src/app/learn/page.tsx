'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SIGNS, type Sign, type SignCategory } from '@/lib/signs';
import { LessonCard } from '@/components/LessonCard';
import { SignGif } from '@/components/SignGif';

const HandCamera = dynamic(
  () => import('@/components/HandCamera').then((m) => m.HandCamera),
  { ssr: false },
);

// ─── Types ─────────────────────────────────────────────────────────────────

type FilterTab  = 'all' | SignCategory;
type TryResult  = 'idle' | 'success' | 'wrong';

// ─── Constants ─────────────────────────────────────────────────────────────

const TABS: { label: string; value: FilterTab }[] = [
  { label: 'All',       value: 'all'      },
  { label: 'Greetings', value: 'greeting' },
  { label: 'Responses', value: 'response' },
  { label: 'Actions',   value: 'action'   },
  { label: 'Objects',   value: 'object'   },
];

// Confetti dots: each uses CSS custom properties --cx/--cy set via Tailwind
// arbitrary-value [var()] so positions are Tailwind-only, no inline style.
// We pre-define 16 burst vectors and cycle colours from the brand palette.
const CONFETTI_DOTS = [
  { color: 'bg-brand-500',  x: '-40px', y: '-50px', delay: '0ms'   },
  { color: 'bg-yellow-400', x: '30px',  y: '-60px', delay: '40ms'  },
  { color: 'bg-pink-400',   x: '55px',  y: '-35px', delay: '80ms'  },
  { color: 'bg-blue-400',   x: '60px',  y: '10px',  delay: '20ms'  },
  { color: 'bg-orange-400', x: '45px',  y: '50px',  delay: '60ms'  },
  { color: 'bg-brand-500',  x: '10px',  y: '65px',  delay: '100ms' },
  { color: 'bg-yellow-400', x: '-30px', y: '60px',  delay: '30ms'  },
  { color: 'bg-pink-400',   x: '-55px', y: '30px',  delay: '70ms'  },
  { color: 'bg-blue-400',   x: '-65px', y: '-10px', delay: '10ms'  },
  { color: 'bg-orange-400', x: '-50px', y: '-40px', delay: '50ms'  },
  { color: 'bg-brand-500',  x: '20px',  y: '-75px', delay: '90ms'  },
  { color: 'bg-yellow-400', x: '70px',  y: '-20px', delay: '15ms'  },
  { color: 'bg-pink-400',   x: '75px',  y: '25px',  delay: '55ms'  },
  { color: 'bg-blue-400',   x: '-20px', y: '75px',  delay: '35ms'  },
  { color: 'bg-brand-100',  x: '-70px', y: '20px',  delay: '75ms'  },
  { color: 'bg-orange-400', x: '-45px', y: '-65px', delay: '45ms'  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
      {CONFETTI_DOTS.map((dot, i) => (
        <span
          key={i}
          className={`absolute h-3 w-3 rounded-full ${dot.color}`}
          style={{
            // CSS custom properties drive the keyframe translate —
            // this is the only viable pattern for per-dot burst vectors
            ['--cx' as string]: dot.x,
            ['--cy' as string]: dot.y,
            animation: `confettiBurst 0.7s ease-out ${dot.delay} both`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────

interface TryItModalProps {
  sign:     Sign;
  result:   TryResult;
  onDetect: (label: string) => void;
  onClose:  () => void;
  onReset:  () => void;
}

function TryItModal({ sign, result, onDetect, onClose, onReset }: TryItModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Practice the ${sign.label} sign`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
    >
      <div className="relative flex w-full max-w-2xl flex-col gap-5 overflow-y-auto rounded-t-3xl bg-white p-6 pb-8 sm:rounded-3xl sm:p-8 max-h-[90dvh]">

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold">
          Try:{' '}
          <span className="capitalize text-brand-500">{sign.label}</span>
        </h2>

        {/* GIF + Camera */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Target */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Target sign
            </p>
            <SignGif sign={sign} className="w-full max-w-[200px] rounded-2xl bg-gray-50" />
            <p className="text-sm font-semibold capitalize">{sign.label}</p>
            <p className="text-xs text-gray-400">{sign.twi}</p>
          </div>

          {/* Camera */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Your camera
            </p>
            <HandCamera active onSign={onDetect} />
          </div>
        </div>

        {/* Feedback */}
        <div
          className={`relative flex min-h-[80px] flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-colors duration-300 ${
            result === 'success'
              ? 'border-green-400 bg-green-50'
              : result === 'wrong'
              ? 'border-amber-300 bg-amber-50'
              : 'border-gray-100 bg-gray-50'
          }`}
        >
          {result === 'success' && (
            <>
              <ConfettiBurst />
              <span className="text-3xl">✅</span>
              <p className="text-base font-bold text-green-700">Perfect! Great job!</p>
              <button
                type="button"
                onClick={onReset}
                className="mt-1 text-xs text-green-600 underline underline-offset-2"
              >
                Try again
              </button>
            </>
          )}

          {result === 'wrong' && (
            <>
              <span className="text-2xl">👋</span>
              <p className="text-sm font-semibold text-amber-700">Not quite — try again!</p>
            </>
          )}

          {result === 'idle' && (
            <p className="text-sm text-gray-400">Make the sign shown above</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const [filter,    setFilter]    = useState<FilterTab>('all');
  const [trySign,   setTrySign]   = useState<Sign | null>(null);
  const [tryResult, setTryResult] = useState<TryResult>('idle');

  const filtered =
    filter === 'all'
      ? SIGNS
      : SIGNS.filter((s) => s.category === filter);

  const handleTryIt = (sign: Sign) => {
    setTrySign(sign);
    setTryResult('idle');
  };

  const handleClose = () => {
    setTrySign(null);
    setTryResult('idle');
  };

  const handleDetect = (label: string) => {
    if (!trySign) return;
    setTryResult(label === trySign.label ? 'success' : 'wrong');
  };

  return (
    <>
      <main className="min-h-dvh bg-background pb-16">

        {/* Header */}
        <header className="px-4 pb-4 pt-8">
          <h1 className="text-2xl font-bold">Learn Ghanaian Sign Language</h1>
          <p className="mt-1 text-sm text-gray-400">
            Tap a card to practice with your camera
          </p>
        </header>

        {/* Filter tabs — horizontally scrollable on mobile */}
        <nav
          aria-label="Filter by category"
          className="flex gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              aria-pressed={filter === tab.value}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === tab.value
                  ? 'bg-brand-500 text-white'
                  : 'border border-gray-200 text-gray-500 hover:border-brand-500 hover:text-brand-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Card grid */}
        <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3">
          {filtered.map((sign) => (
            <LessonCard key={sign.label} sign={sign} onTryIt={handleTryIt} />
          ))}
        </div>

      </main>

      {/* Try It modal — active=false when closed stops the camera */}
      {trySign && (
        <TryItModal
          sign={trySign}
          result={tryResult}
          onDetect={handleDetect}
          onClose={handleClose}
          onReset={() => setTryResult('idle')}
        />
      )}
    </>
  );
}
