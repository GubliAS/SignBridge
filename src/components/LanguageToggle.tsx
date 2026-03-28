import type { Lang } from '@/lib/signs';

export interface LanguageToggleProps {
  value: Lang;
  onChange: (lang: Lang) => void;
}

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
      <button
        type="button"
        aria-pressed={value === 'en'}
        onClick={() => onChange('en')}
        className={
          value === 'en'
            ? 'rounded-full bg-brand-500 px-4 py-1 text-sm font-semibold text-white transition-colors'
            : 'rounded-full px-4 py-1 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700'
        }
      >
        English
      </button>
      <button
        type="button"
        aria-pressed={value === 'tw'}
        onClick={() => onChange('tw')}
        className={
          value === 'tw'
            ? 'rounded-full bg-brand-500 px-4 py-1 text-sm font-semibold text-white transition-colors'
            : 'rounded-full px-4 py-1 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700'
        }
      >
        Twi
      </button>
    </div>
  );
}
