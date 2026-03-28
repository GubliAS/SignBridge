'use client';

import { useState } from 'react';
import type { Sign } from '@/lib/signs';

export interface SignGifProps {
  sign:       Sign;
  className?: string;
  size?:      number; // px, for fixed-size usage
}

export function SignGif({ sign, className = '', size }: SignGifProps) {
  const [failed, setFailed] = useState(false);

  const style = size ? { width: size, height: size } : undefined;

  if (failed) {
    return (
      <div
        style={style}
        className={`flex items-center justify-center bg-[#e8e8e8] rounded-lg ${className}`}
      >
        <span className="text-[9px] font-[600] text-[#ccc] capitalize text-center px-1 leading-tight">{sign.label}</span>
      </div>
    );
  }

  return (
    <img
      src={sign.imgPath}
      alt={`${sign.label} sign in Ghanaian Sign Language`}
      onError={() => setFailed(true)}
      style={style}
      className={`object-cover object-center ${className}`}
    />
  );
}
