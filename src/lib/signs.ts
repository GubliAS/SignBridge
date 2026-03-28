export type Lang = 'en' | 'tw';

export type SignCategory = 'greeting' | 'response' | 'action' | 'object';

export type Sign = {
  label:    string;
  twi:      string;
  imgPath:  string;
  category: SignCategory;
};

//use images instead of imgPath

export const SIGNS: Sign[] = [
  { label: 'hello',  twi: 'Mahɔ',   category: 'greeting', imgPath: '/signs/hello-handsign.webp'  },
  { label: 'yes',    twi: 'Aane',   category: 'response', imgPath: '/signs/yes-handsign.webp'    },
  { label: 'no',     twi: 'Daabi',  category: 'response', imgPath: '/signs/no-handsign.webp'     },
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
