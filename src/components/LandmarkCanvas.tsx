'use client';

import type { Landmark } from '@/lib/classifier';

export interface LandmarkCanvasProps {
  landmarks: Landmark[];
  width: number;
  height: number;
}

export function LandmarkCanvas(_props: LandmarkCanvasProps) {
  // Stub — canvas overlay dots implemented in a later step.
  return null;
}
