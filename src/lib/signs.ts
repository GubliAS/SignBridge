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
  ga:       string;
  ewe:      string;
  imgPath:  string;
  category: SignCategory;
};

export const SIGNS: Sign[] = [
  { label: 'hello',  twi: 'Mahɔ',   ga: 'Ojekoo',        ewe: 'Woezɔ',        category: 'greeting', imgPath: '/signs/hello-handsign.webp'  },
  { label: 'yes',    twi: 'Aane',   ga: 'Yoo',           ewe: 'Ɛ̃',           category: 'response', imgPath: '/signs/yes-handsign.webp'    },
  { label: 'love',   twi: 'Dɔ',     ga: 'Oyiwalɛ',       ewe: 'Lɔ̃',          category: 'response', imgPath: '/signs/love-handsign.webp'   },
  { label: 'help',   twi: 'Boa me', ga: 'Bɔ mli',        ewe: 'Kpe ɖe ŋunye', category: 'action',   imgPath: '/signs/help-handsign.webp'   },
  { label: 'stop',   twi: 'Gyae',   ga: 'Tɔ',            ewe: 'Tɔ',           category: 'action',   imgPath: '/signs/stop-handsign.webp'   },
  { label: 'good',   twi: 'Eye',    ga: 'Yoo',           ewe: 'Nyui',         category: 'response', imgPath: '/signs/good-handsign.webp'   },
  { label: 'bad',    twi: 'Bɔne',   ga: 'Gbɛi',          ewe: 'Vɔ̃',          category: 'response', imgPath: '/signs/bad-handsign.webp'    },
  { label: 'water',  twi: 'Nsuo',   ga: 'Shikpɔŋ',       ewe: 'Tsi',          category: 'object',   imgPath: '/signs/water-handsign.webp'  },
  { label: 'name',   twi: 'Din',    ga: 'Tɔi',           ewe: 'Ŋkɔ',          category: 'object',   imgPath: '/signs/name-handsign.webp'   },
  { label: 'school', twi: 'Sukuu',  ga: 'Sukuulɛ',       ewe: 'Suku',         category: 'object',   imgPath: '/signs/school-handsign.png' },
];

export const SIGN_MAP: Record<string, Sign> = Object.fromEntries(
  SIGNS.map((s) => [s.label, s]),
);

/**
 * Get the static translation for a sign in a given language.
 * Returns undefined for English (use sign.label directly).
 */
export function getStaticTranslation(sign: Sign, lang: Lang): string | undefined {
  switch (lang) {
    case 'tw':  return sign.twi;
    case 'ee':  return sign.ewe;
    case 'gaa': return sign.ga;
    default:    return undefined;
  }
}

/** All four languages now have static lookup data. */
export const INPUT_SUPPORTED_LANGS: Lang[] = ['en', 'tw', 'ee', 'gaa'];

/** Example words a user can type, keyed by input language. */
export const LANG_EXAMPLES: Record<Lang, string> = {
  en:  'hello · yes · help · stop · good · bad · water · name · school',
  tw:  'Mahɔ · Aane · Boa me · Gyae · Eye · Bɔne · Nsuo · Din · Sukuu',
  ee:  'Woezɔ · Ɛ̃ · Kpe ɖe ŋunye · Tɔ · Nyui · Vɔ̃ · Tsi · Ŋkɔ · Suku',
  gaa: 'Ojekoo · Yoo · Bɔ mli · Tɔ · Gbɛi · Shikpɔŋ · Tɔi · Sukuulɛ',
};

/** Placeholder text for the text input, keyed by input language. */
export const LANG_PLACEHOLDER: Record<Lang, string> = {
  en:  'e.g. hello yes water school',
  tw:  'e.g. Mahɔ Aane Nsuo Sukuu',
  ee:  'e.g. Woezɔ Tsi Suku',
  gaa: 'e.g. Ojekoo Shikpɔŋ Sukuulɛ',
};
