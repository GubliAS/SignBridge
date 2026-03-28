import type { OutputLanguage } from '@/components/SignResult';

export interface LanguageToggleProps {
  value: OutputLanguage;
  onChange: (lang: OutputLanguage) => void;
}

export function LanguageToggle(_props: LanguageToggleProps) {
  // Stub — EN / TW toggle implemented in a later step.
  return null;
}
