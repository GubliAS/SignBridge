'use client';

import type { Landmark } from '@/lib/classifier';

export interface HandCameraProps {
  onLandmarks: (landmarks: Landmark[]) => void;
}

export function HandCamera(_props: HandCameraProps) {
  // Stub — webcam + MediaPipe lazy-import implemented in a later step.
  return null;
}
