'use client';

import { useState } from 'react';
import type { Sign } from '@/lib/signs';

export interface SignGifProps {
  sign: Sign;
  className?: string;
}

export function SignGif({ sign, className = '' }: SignGifProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex aspect-square items-center justify-center rounded-xl bg-gray-100 ${className}`}
      >
        <span className="text-sm font-medium capitalize text-gray-400">{sign.label}</span>
      </div>
    );
  }

  return (
    <img
      src={sign.gifPath}
      alt={`${sign.label} sign in Ghanaian Sign Language`}
      onError={() => setFailed(true)}
      className={`aspect-square object-contain ${className}`}
    />
  );
}
