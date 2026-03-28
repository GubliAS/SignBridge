export type SignCategory = 'greeting' | 'response' | 'action' | 'object';

export interface Sign {
  label: string;
  twi: string;
  category: SignCategory;
  gifPath: string;
}

export const SIGNS: Sign[] = [
  { label: 'hello',  twi: 'Mahɔ',   category: 'greeting', gifPath: '/signs/hello.gif'  },
  { label: 'yes',    twi: 'Aane',   category: 'response', gifPath: '/signs/yes.gif'    },
  { label: 'no',     twi: 'Daabi',  category: 'response', gifPath: '/signs/no.gif'     },
  { label: 'help',   twi: 'Boa me', category: 'action',   gifPath: '/signs/help.gif'   },
  { label: 'stop',   twi: 'Gyae',   category: 'action',   gifPath: '/signs/stop.gif'   },
  { label: 'good',   twi: 'Eye',    category: 'response', gifPath: '/signs/good.gif'   },
  { label: 'bad',    twi: 'Bɔne',   category: 'response', gifPath: '/signs/bad.gif'    },
  { label: 'water',  twi: 'Nsuo',   category: 'object',   gifPath: '/signs/water.gif'  },
  { label: 'name',   twi: 'Din',    category: 'object',   gifPath: '/signs/name.gif'   },
  { label: 'school', twi: 'Sukuu',  category: 'object',   gifPath: '/signs/school.gif' },
];

export const SIGN_MAP: Map<string, Sign> = new Map(
  SIGNS.map((sign) => [sign.label, sign]),
);
