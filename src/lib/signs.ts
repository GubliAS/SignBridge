export type Lang = 'en' | 'tw' | 'ee' | 'gaa';

export interface LangOption {
  label:       string; // Display name shown in the dropdown
  translateTo: string; // GhanaNLP /v1/translate "lang" pair (empty for English)
  ttsCode:     string; // GhanaNLP /tts/v1/tts "language" code (empty for English)
}

/** All supported output languages with their GhanaNLP API codes. */
export const LANGUAGES: Record<Lang, LangOption> = {
  en:  { label: 'English', translateTo: '',        ttsCode: ''    },
  tw:  { label: 'Twi',     translateTo: 'en-tw',   ttsCode: 'tw'  },
  ee:  { label: 'Ewe',     translateTo: 'en-ee',   ttsCode: 'ee'  },
  gaa: { label: 'Ga',      translateTo: 'en-gaa',  ttsCode: 'gaa' },
};

export type SignCategory = 'greeting' | 'response' | 'action' | 'object';

export type Sign = {
  label:    string;
  twi:      string;
  imgPath:  string;
  category: SignCategory;
};

export const SIGNS: Sign[] = [
  { label: 'hello',  twi: 'Mahɔ',   category: 'greeting', imgPath: '/signs/hello-handsign.webp'  },
  { label: 'yes',    twi: 'Aane',   category: 'response', imgPath: '/signs/yes-handsign.webp'    },
  { label: 'love',   twi: 'Dɔ',     category: 'response', imgPath: '/signs/love-handsign.webp'   },
  { label: 'help',   twi: 'Boa me', category: 'action',   imgPath: '/signs/help-handsign.webp'   },
  { label: 'stop',   twi: 'Gyae',   category: 'action',   imgPath: '/signs/stop-handsign.webp'   },
  { label: 'good',   twi: 'Eye',    category: 'response', imgPath: '/signs/good-handsign.webp'   },
  { label: 'bad',    twi: 'Bɔne',   category: 'response', imgPath: '/signs/bad-handsign.webp'    },
  { label: 'water',  twi: 'Nsuo',   category: 'object',   imgPath: '/signs/water-handsign.webp'  },
  { label: 'name',   twi: 'Din',    category: 'object',   imgPath: '/signs/name-handsign.webp'   },
  { label: 'school', twi: 'Sukuu',  category: 'object',   imgPath: '/signs/school-handsign.webp' },
];

export const SIGN_MAP: Record<string, Sign> = Object.fromEntries(
  SIGNS.map((s) => [s.label, s]),
);

/**
 * Languages that have static lookup data for text → sign resolution.
 * English matches `sign.label`; Twi matches `sign.twi`.
 * Ewe and Ga require a live API call and are not supported as input.
 */
export const INPUT_SUPPORTED_LANGS: Lang[] = ['en', 'tw'];

/** Example words a user can type, keyed by language. */
export const LANG_EXAMPLES: Record<Lang, string> = {
  en:  'hello · yes · help · stop · good · bad · water · name · school',
  tw:  'Mahɔ · Aane · Boa me · Gyae · Eye · Bɔne · Nsuo · Din · Sukuu',
  ee:  '',   // not yet supported for input
  gaa: '',   // not yet supported for input
};

/** Placeholder text for the text input, keyed by language. */
export const LANG_PLACEHOLDER: Record<Lang, string> = {
  en:  'e.g. hello yes water school',
  tw:  'e.g. Mahɔ Aane Nsuo Sukuu',
  ee:  'Ewe input not yet supported — try English or Twi',
  gaa: 'Ga input not yet supported — try English or Twi',
};
