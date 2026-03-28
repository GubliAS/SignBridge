'use client';

import type { Sign } from '@/lib/signs';
import { SignGif } from '@/components/SignGif';

export interface LessonCardProps {
  sign: Sign;
  onTryIt: (sign: Sign) => void;
}

export function LessonCard({ sign, onTryIt }: LessonCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <SignGif sign={sign} className="w-full" />

      <div className="flex flex-1 flex-col gap-1 px-4 pt-3 pb-2">
        <p className="text-lg font-bold capitalize leading-tight">{sign.label}</p>
        <p className="text-sm text-gray-400">{sign.twi}</p>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => onTryIt(sign)}
          className="min-h-[48px] w-full rounded-full bg-brand-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600 active:scale-95"
        >
          Try it
        </button>
      </div>
    </article>
  );
}
