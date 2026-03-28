// Pure TypeScript — no imports, no browser APIs.
// Safe to import in both client and server contexts.

export type Landmark = { x: number; y: number; z: number };

export type ClassifyResult = { sign: string; confidence: number } | null;

// --- Finger helpers -----------------------------------------------------------
// y increases DOWNWARD in normalised MediaPipe coords.
// tip.y < pip.y  →  tip is HIGHER on screen  →  finger is extended
// tip.y > pip.y  →  tip is LOWER  on screen  →  finger is curled

const ext  = (tip: Landmark, pip: Landmark): boolean => tip.y < pip.y;
const curl = (tip: Landmark, pip: Landmark): boolean => tip.y > pip.y;

// --- Rule table ---------------------------------------------------------------
// Each rule receives the full 21-landmark array and returns true/false.
// Rules are checked in order; first match wins.

type Rule = (lm: Landmark[]) => boolean;

const RULES: [string, Rule][] = [
  // hello — open palm: all four fingers extended
  ['hello', (lm) =>
    ext(lm[8],  lm[6])  &&
    ext(lm[12], lm[10]) &&
    ext(lm[16], lm[14]) &&
    ext(lm[20], lm[18])
  ],

  // yes — thumbs up: thumb pointing up, all four fingers curled
  ['yes', (lm) =>
    lm[4].y < lm[3].y   &&
    curl(lm[8],  lm[6])  &&
    curl(lm[12], lm[10]) &&
    curl(lm[16], lm[14]) &&
    curl(lm[20], lm[18])
  ],

  // bad — fist with thumb clearly pointing DOWN
  // thumb tip must be well below thumb base (lm[2]) — prevents overlap with stop
  ['bad', (lm) =>
    lm[4].y > lm[3].y   &&
    lm[4].y > lm[2].y   && // thumb tip clearly below thumb base — key differentiator
    curl(lm[8],  lm[6])  &&
    curl(lm[12], lm[10]) &&
    curl(lm[16], lm[14]) &&
    curl(lm[20], lm[18])
  ],

  // stop — all fingers curled AND thumb tucked inward (lm[4].x > lm[3].x)
  ['stop', (lm) =>
    curl(lm[8],  lm[6])  &&
    curl(lm[12], lm[10]) &&
    curl(lm[16], lm[14]) &&
    curl(lm[20], lm[18]) &&
    lm[4].x > lm[3].x   // thumb tucked across palm
  ],

  // help — only index finger extended, all others curled
  ['help', (lm) =>
    ext(lm[8],   lm[6])  &&
    curl(lm[12], lm[10]) &&
    curl(lm[16], lm[14]) &&
    curl(lm[20], lm[18])
  ],

  // water — index + middle + ring extended, pinky curled (W-shape)
  ['water', (lm) =>
    ext(lm[8],   lm[6])  &&
    ext(lm[12],  lm[10]) &&
    ext(lm[16],  lm[14]) &&
    curl(lm[20], lm[18])
  ],

  // good — index + middle extended, ring + pinky curled (peace / scissors)
  ['good', (lm) =>
    ext(lm[8],   lm[6])  &&
    ext(lm[12],  lm[10]) &&
    curl(lm[16], lm[14]) &&
    curl(lm[20], lm[18])
  ],

  // name — only pinky extended, all others curled
  ['name', (lm) =>
    curl(lm[8],  lm[6])  &&
    curl(lm[12], lm[10]) &&
    curl(lm[16], lm[14]) &&
    ext(lm[20],  lm[18])
  ],

  // love — ILY shape: index + pinky extended, middle + ring curled
  // Checked before 'school' so that a love sign with thumb raised
  // does not accidentally fire the school (L-shape) rule.
  ['love', (lm) =>
    ext(lm[8],   lm[6])  &&
    curl(lm[12], lm[10]) &&
    curl(lm[16], lm[14]) &&
    ext(lm[20],  lm[18])
  ],

  // school — L-shape: thumb up + index extended, middle curled (key differentiator)
  // Pinky is curled when making this sign, so 'love' above never fires first.
  ['school', (lm) =>
    lm[4].y < lm[3].y   &&
    ext(lm[8],   lm[6])  &&
    curl(lm[12], lm[10])
  ],
];

// --- Classifier ---------------------------------------------------------------

export function classifySign(lm: Landmark[]): ClassifyResult {
  if (!lm || lm.length < 21) return null;

  for (const [sign, rule] of RULES) {
    if (rule(lm)) return { sign, confidence: 1 };
  }

  return null;
}
