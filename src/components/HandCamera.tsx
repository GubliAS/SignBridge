'use client';

import { useEffect, useRef, useState } from 'react';
import { classifySign, type Landmark } from '@/lib/classifier';

export interface HandCameraProps {
  onSign: (label: string) => void;
  active: boolean;
}

export function HandCamera({ onSign, active }: HandCameraProps) {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const dotRef        = useRef<HTMLDivElement>(null);
  const lastSign      = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rafId         = useRef<number>(0);
  const streamRef     = useRef<MediaStream | null>(null);

  // useState used only for error UI — doesn't fire on every frame
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Keep onSign in a ref so the RAF/debounce closure never goes stale
  const onSignRef = useRef(onSign);
  useEffect(() => { onSignRef.current = onSign; });

  useEffect(() => {
    // -- Inactive: tear down anything running ------------------------------
    if (!active) {
      cancelAnimationFrame(rafId.current);
      clearTimeout(debounceTimer.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      lastSign.current  = null;
      setCameraError(null);
      if (videoRef.current) videoRef.current.srcObject = null;
      const canvas = canvasRef.current;
      if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // -- Active: load MediaPipe + start camera -----------------------------
    let cancelled = false;

    import('@mediapipe/hands').then(({ Hands, HAND_CONNECTIONS }) => {
      if (cancelled) return;

      const hands = new Hands({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      });

      hands.setOptions({
        maxNumHands:            1,
        modelComplexity:        1,
        minDetectionConfidence: 0.75,
        minTrackingConfidence:  0.75,
      });

      hands.onResults((results) => {
        const video  = videoRef.current;
        const canvas = canvasRef.current;
        const dot    = dotRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width  = video.videoWidth  || canvas.offsetWidth;
        canvas.height = video.videoHeight || canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const rawLandmarks = results.multiHandLandmarks?.[0];

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

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth   = 2;
        for (const [start, end] of HAND_CONNECTIONS) {
          const s = landmarks[start];
          const e = landmarks[end];
          ctx.beginPath();
          ctx.moveTo(s.x * W, s.y * H);
          ctx.lineTo(e.x * W, e.y * H);
          ctx.stroke();
        }

        ctx.fillStyle = '#4ade80';
        for (const lm of landmarks) {
          ctx.beginPath();
          ctx.arc(lm.x * W, lm.y * H, 4, 0, Math.PI * 2);
          ctx.fill();
        }

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

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
          streamRef.current = stream;
          const video = videoRef.current;
          if (!video) return;
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            const tick = async (): Promise<void> => {
              if (cancelled || !videoRef.current) return;
              try { await hands.send({ image: videoRef.current }); } catch { /* first-frame init */ }
              rafId.current = requestAnimationFrame(tick);
            };
            void tick();
          };
        })
        .catch((err: unknown) => {
          console.error('[HandCamera] camera access denied:', err);
          if (!cancelled) {
            setCameraError(
              'Camera access was denied. Please allow camera access in your browser settings and reload the page.',
            );
          }
        });
    }).catch((err: unknown) => {
      console.error('[HandCamera] MediaPipe load failed:', err);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId.current);
      clearTimeout(debounceTimer.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      lastSign.current  = null;
    };
  }, [active]);

  if (cameraError) {
    return (
      <div
        role="alert"
        className="relative flex w-full aspect-video flex-col items-center justify-center gap-3 rounded-2xl bg-gray-50 px-6 text-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.277A1 1 0 0121 8.649v6.702a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        </svg>
        <p className="text-sm font-medium text-gray-500">{cameraError}</p>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label="Live camera feed with hand tracking"
      className="relative w-full h-full aspect-video rounded-2xl overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        className="w-full h-full object-cover scale-x-[-1]"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full scale-x-[-1]"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="absolute top-3 right-3 w-3 h-3 rounded-full bg-amber-400 shadow-lg"
      />
    </div>
  );
}
