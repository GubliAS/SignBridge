'use client';

export type OutputLanguage = 'en' | 'tw';

export interface SignResultProps {
  label: string | null;
  language: OutputLanguage;
}

export function SignResult(_props: SignResultProps) {
  // Stub — sign label display + audio trigger implemented in a later step.
  return null;
}
