'use client';

import { LANGUAGES, type Lang } from '@/lib/signs';

export interface LangDropdownProps {
  value: Lang;
  onChange: (l: Lang) => void;
  ariaLabel?: string;
  /** Restrict available options. Defaults to all languages. */
  only?: Lang[];
}

export function LangDropdown({
  value,
  onChange,
  ariaLabel = 'Language',
  only,
}: LangDropdownProps) {
  const entries = (Object.entries(LANGUAGES) as [Lang, { label: string }][]).filter(
    ([code]) => !only || only.includes(code),
  );

  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Lang)}
        aria-label={ariaLabel}
        className="appearance-none bg-[#f5f5f5] rounded-pill pl-4 pr-8 py-[7px] text-xs md:text-sm font-semibold text-ink border-none outline-none cursor-pointer hover:bg-[#ececec] transition-colors"
      >
        {entries.map(([code, { label }]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2"
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 1L5 5L9 1"
          stroke="#999"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
