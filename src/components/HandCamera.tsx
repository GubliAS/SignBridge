'use client';

import { useEffect, useRef } from 'react';
import { classifySign, type Landmark } from '@/lib/classifier';

export interface HandCameraProps {
  onSign: (label: string) => void;
  active: boolean;
}

export function HandCamera({ onSign, active }: HandCameraProps) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const dotRef      = useRef<HTMLDivElement>(null);
  const lastSign    = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rafId       = useRef<number>(0);
  const streamRef   = useRef<MediaStream | null>(null);

  // Keep onSign in a ref so the RAF/debounce closure never goes stale,
  // even if the parent re-renders and passes a new function reference.
  const onSignRef = useRef(onSign);
  useEffect(() => { onSignRef.current = onSign; });

  useEffect(() => {
    // ── Inactive: tear down anything running ──────────────────────────────
    if (!active) {
      cancelAnimationFrame(rafId.current);
      clearTimeout(debounceTimer.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      lastSign.current  = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      const canvas = canvasRef.current;
      if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // ── Active: load MediaPipe + start camera ─────────────────────────────
    let cancelled = false;

    import('@mediapipe/hands').then(({ Hands, HAND_CONNECTIONS }) => {
      if (cancelled) return;

      // ── 1. Initialise Hands ──────────────────────────────────────────────
      const hands = new Hands({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      });

      hands.setOptions({
        maxNumHands:            1,
        modelComplexity:        1,
        minDetectionConfidence: 0.75,
        minTrackingConfidence:  0.75,
      });

      // ── 2. onResults callback ─────────────────────────────────────────────
      hands.onResults((results) => {
        const video  = videoRef.current;
        const canvas = canvasRef.current;
        const dot    = dotRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Sync canvas resolution to video
        canvas.width  = video.videoWidth  || canvas.offsetWidth;
        canvas.height = video.videoHeight || canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const rawLandmarks = results.multiHandLandmarks?.[0];

        // Status dot: green when hand visible, amber otherwise
        if (dot) {
          dot.className = rawLandmarks
            ? 'absolute top-3 right-3 w-3 h-3 rounded-full bg-green-400 shadow-lg'
            : 'absolute top-3 right-3 w-3 h-3 rounded-full bg-amber-400 shadow-lg';
        }

        if (!rawLandmarks) {
          lastSign.current = null;
          return;
        }

        const landmarks = rawLandmarks as Landmark[];
        const W = canvas.width;
        const H = canvas.height;

        // Draw connecting skeleton lines first (beneath dots)
        ctx.strokeStyle = '#22c55e'; // green-500
        ctx.lineWidth   = 2;
        for (const [start, end] of HAND_CONNECTIONS) {
          const s = landmarks[start];
          const e = landmarks[end];
          ctx.beginPath();
          ctx.moveTo(s.x * W, s.y * H);
          ctx.lineTo(e.x * W, e.y * H);
          ctx.stroke();
        }

        // Draw filled circles at each landmark
        ctx.fillStyle = '#4ade80'; // green-400
        for (const lm of landmarks) {
          ctx.beginPath();
          ctx.arc(lm.x * W, lm.y * H, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // ── Classify + debounce ──────────────────────────────────────────
        const result = classifySign(landmarks);
        if (!result) return;
        if (result.sign === lastSign.current) return;

        lastSign.current = result.sign;
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
          console.log('[HandCamera] sign:', result.sign);
          onSignRef.current(result.sign);
        }, 600);
      });

      // ── 3. Start camera ───────────────────────────────────────────────────
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }

          streamRef.current = stream;
          const video = videoRef.current;
          if (!video) return;

          video.srcObject = stream;

          // ── 4. RAF loop ────────────────────────────────────────────────────
          video.onloadedmetadata = () => {
            const tick = async (): Promise<void> => {
              if (cancelled || !videoRef.current) return;
              try {
                await hands.send({ image: videoRef.current });
              } catch {
                // MediaPipe may throw on the first frame before init completes
              }
              rafId.current = requestAnimationFrame(tick);
            };
            void tick();
          };
        })
        .catch((err: unknown) => {
          console.error('[HandCamera] camera access denied:', err);
        });
    }).catch((err: unknown) => {
      console.error('[HandCamera] MediaPipe load failed:', err);
    });

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId.current);
      clearTimeout(debounceTimer.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      lastSign.current  = null;
    };
  }, [active]); // onSign intentionally omitted — kept fresh via onSignRef

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full scale-x-[-1]"
      />
      {/* Status indicator: green = hand detected, amber = no hand */}
      <div
        ref={dotRef}
        className="absolute top-3 right-3 w-3 h-3 rounded-full bg-amber-400 shadow-lg"
      />
    </div>
  );
}
