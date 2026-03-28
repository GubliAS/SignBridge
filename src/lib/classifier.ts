export interface Landmark {
  x: number;
  y: number;
  z: number;
}

/**
 * Classifies a hand pose from 21 MediaPipe landmarks.
 * Returns a sign label (matching SIGNS[].label) or null if no sign matches.
 *
 * Landmark indices used:
 *  4  = thumb tip    |  3  = thumb IP
 *  8  = index tip    |  6  = index PIP
 *  12 = middle tip   | 10  = middle PIP
 *  16 = ring tip     | 14  = ring PIP
 *  20 = pinky tip    | 18  = pinky PIP
 *
 * Extended finger: tip.y < pip.y  (tip is higher on screen)
 * Curled finger:   tip.y > pip.y
 */
export function classifySign(landmarks: Landmark[]): string | null {
  if (landmarks.length !== 21) return null;

  // Stub — full rules implemented in a later step.
  return null;
}
