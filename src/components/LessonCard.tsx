'use client';

import type { Sign } from '@/lib/signs';
import { SignGif } from '@/components/SignGif';

export interface LessonCardProps {
  sign:    Sign;
  onTryIt: (sign: Sign) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  greeting: 'greeting',
  response: 'response',
  action:   'action',
  object:   'object',
};

export function LessonCard({ sign, onTryIt }: LessonCardProps) {
  return (
    <article className="group rounded-[14px] border border-[#f0f0f0] bg-white overflow-hidden cursor-pointer transition-colors hover:border-green">

      {/* GIF area */}
      <div className="h-[90px] bg-[#f5f5f5] border-b border-[#f0f0f0] relative flex items-center justify-center">
        <SignGif sign={sign} className="w-full h-full" />
        <span className="absolute top-[7px] right-[7px] bg-green-light text-green-dark text-[7px] font-[800] px-[7px] py-[2px] rounded-pill">
          {CATEGORY_LABELS[sign.category]}
        </span>
      </div>

      {/* Body */}
      <div className="p-[10px]">
        <p className="text-[13px] font-[800] text-ink tracking-[-0.3px] mb-[1px] capitalize">{sign.label}</p>
        <p className="text-[10px] text-[#aaa] font-[500] mb-2">{sign.twi}</p>
        <button
          type="button"
          onClick={() => onTryIt(sign)}
          className="w-full py-[7px] rounded-[7px] bg-ink text-white text-[10px] font-[700] transition-colors hover:bg-[#222] min-h-[44px]"
        >
          Try it
        </button>
      </div>
    </article>
  );
}
