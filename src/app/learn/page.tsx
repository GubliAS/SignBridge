"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SIGNS, type Sign, type SignCategory } from "@/lib/signs";
import { LessonCard } from "@/components/LessonCard";
import { SignGif } from "@/components/SignGif";

const HandCamera = dynamic(
  () => import("@/components/HandCamera").then((m) => m.HandCamera),
  { ssr: false },
);

// --- Types -----------------------------------------------------------------

type FilterTab = "all" | SignCategory;
type TryResult = "idle" | "success" | "wrong";

// --- Constants -------------------------------------------------------------

const TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Greetings", value: "greeting" },
  { label: "Responses", value: "response" },
  { label: "Actions", value: "action" },
  { label: "Objects", value: "object" },
];

const CONFETTI_DOTS = [
  { color: "bg-green", x: "-40px", y: "-50px", delay: "0ms" },
  { color: "bg-yellow-400", x: "30px", y: "-60px", delay: "40ms" },
  { color: "bg-pink-400", x: "55px", y: "-35px", delay: "80ms" },
  { color: "bg-blue-400", x: "60px", y: "10px", delay: "20ms" },
  { color: "bg-orange-400", x: "45px", y: "50px", delay: "60ms" },
  { color: "bg-green", x: "10px", y: "65px", delay: "100ms" },
  { color: "bg-yellow-400", x: "-30px", y: "60px", delay: "30ms" },
  { color: "bg-pink-400", x: "-55px", y: "30px", delay: "70ms" },
  { color: "bg-blue-400", x: "-65px", y: "-10px", delay: "10ms" },
  { color: "bg-orange-400", x: "-50px", y: "-40px", delay: "50ms" },
  { color: "bg-green", x: "20px", y: "-75px", delay: "90ms" },
  { color: "bg-yellow-400", x: "70px", y: "-20px", delay: "15ms" },
  { color: "bg-pink-400", x: "75px", y: "25px", delay: "55ms" },
  { color: "bg-blue-400", x: "-20px", y: "75px", delay: "35ms" },
  { color: "bg-green-light", x: "-70px", y: "20px", delay: "75ms" },
  { color: "bg-orange-400", x: "-45px", y: "-65px", delay: "45ms" },
];

// --- Sub-components ---------------------------------------------------------

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[18px]">
      {CONFETTI_DOTS.map((dot, i) => (
        <span
          key={i}
          className={`absolute h-3 w-3 rounded-full ${dot.color}`}
          style={{
            ["--cx" as string]: dot.x,
            ["--cy" as string]: dot.y,
            animation: `confettiBurst 0.7s ease-out ${dot.delay} both`,
          }}
        />
      ))}
    </div>
  );
}

// --- Modal ------------------------------------------------------------------

interface TryItModalProps {
  sign: Sign;
  result: TryResult;
  onDetect: (label: string) => void;
  onClose: () => void;
  onReset: () => void;
}

function TryItModal({
  sign,
  result,
  onDetect,
  onClose,
  onReset,
}: TryItModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Practice the ${sign.label} sign`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
    >
      <div className="w-full max-w-[980px] min-h-3/4 lg:min-h-3/4 bg-white rounded-t-[16px] sm:rounded-[16px] overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="bg-ink px-[18px] py-[11px] flex items-center justify-between flex-shrink-0">
          <span className="text-[12px] font-[700] text-white">
            Practice: <span className="capitalize">{sign.label}</span> ·{" "}
            <span className="text-[#888]">{sign.twi}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-[22px] h-[22px] bg-[#222] rounded-full flex items-center justify-center text-[10px] text-[#777] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col flex-1 min-h-0 w-full">
          {/* Content — two column */}
          <div className="flex flex-col md:flex-row flex-1 w-full">
            {/* Left — target sign */}
            <div className="flex flex-col md:w-1/2 items-center justify-between gap-3 p-[22px] border-r border-[#f0f0f0] bg-[#fafafa]">
              <div className="flex-1 w-full rounded-[12px] bg-[#e8e8e8] overflow-hidden flex items-center justify-center min-h-[120px]">
                <SignGif sign={sign} size={160} className="w-full h-full object-contain rounded-[12px]" />
              </div>
              <div className="flex flex-col items-center gap-[4px] flex-shrink-0 pt-1">
                <p className="text-lg md:text-xl font-bold text-ink tracking-[-0.3px] capitalize">
                  {sign.label}
                </p>
                <p className="text-sm md:text-base text-[#aaa]">{sign.twi}</p>
              </div>
            </div>

            {/* Right — live camera */}
            <div className="bg-[#f0f0f0] md:w-1/2 p-3 flex items-center justify-center relative">
              <div className="absolute z-20 top-5 left-5 flex items-center gap-1 bg-green text-white text-[10px] md:text-xs font-medium px-[7px] py-[2px] rounded-pill tracking-[0.04em]">
                <span className="w-[4px] h-[4px] rounded-full bg-white" />
                LIVE
              </div>
              <HandCamera active onSign={onDetect} />
            </div>
          </div>

          {/* Footer bar */}
          <div
            className={`relative px-[18px] py-[10px] flex items-center justify-between border-t ${result === "success" ? "bg-green-light border-[#c8edd8]" : "bg-[#fafafa] border-[#f0f0f0]"}`}
          >
            {result === "success" ? (
              <>
                <ConfettiBurst />
                <div className="flex items-center gap-[6px] text-[11px] text-green-dark font-[700]">
                  <div className="w-4 h-4 rounded-full bg-green flex items-center justify-center">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.5 4L3.5 6L6.5 2"
                        stroke="white"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  Correct sign detected!
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onReset}
                    className="text-[10px] text-[#888] border border-[#ddd] px-3 py-[5px] rounded-[7px] bg-white"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[10px] text-[#888] border border-[#ddd] px-3 py-[5px] rounded-[7px] bg-white"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                {result === "wrong" && (
                  <div className="text-[10px] text-[#774444] font-[600] flex items-center gap-2">
                    <span>👋</span> Different sign — try again
                  </div>
                )}
                {result === "idle" && (
                  <span className="text-[10px] text-[#aaa]">
                    Make the sign shown above
                  </span>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[10px] text-[#888] border border-[#ddd] px-3 py-[5px] rounded-[7px] bg-white ml-auto"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Page -------------------------------------------------------------------

export default function LearnPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [trySign, setTrySign] = useState<Sign | null>(null);
  const [tryResult, setTryResult] = useState<TryResult>("idle");

  const filtered =
    filter === "all" ? SIGNS : SIGNS.filter((s) => s.category === filter);

  const handleTryIt = (sign: Sign) => {
    setTrySign(sign);
    setTryResult("idle");
  };
  const handleClose = () => {
    setTrySign(null);
    setTryResult("idle");
  };
  const handleDetect = (label: string) => {
    if (!trySign) return;
    setTryResult(label === trySign.label ? "success" : "wrong");
  };

  return (
    <>
      <main className="min-h-dvh bg-white pb-16">
        <div className="section-container">
          {/* Header */}
          <div className="bg-white border-b border-[#f0f0f0] pt-5">
            <div className="flex items-end justify-between mb-4">
              <h1 className="text-[24px] font-bold text-ink tracking-[-0.8px]">
                Learn GSL
              </h1>
              <span className="text-[10px] text-[#bbb] font-[600]">
                {SIGNS.length} signs
              </span>
            </div>

            {/* Filter tabs */}
            <nav
              aria-label="Filter by category"
              className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setFilter(tab.value)}
                  aria-pressed={filter === tab.value}
                  className={`cursor-pointer px-4 py-[9px] text-xs md:text-sm font-medium  whitespace-nowrap border-b-[2.5px] transition-colors -mb-px ${
                    filter === tab.value
                      ? "text-ink border-ink"
                      : "text-[#aaa] border-transparent hover:text-[#777]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Blurb */}
          <div className="bg-[#f9f9f9] border-b border-[#f0f0f0] py-3 px-3 mt-2 rounded-md text-xs text-[#999] leading-[1.6]">
            {SIGNS.length} core GSL signs. Tap &quot;Try it&quot; to practise
            live with your camera.
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[10px] p-7">
            {filtered.map((sign) => (
              <LessonCard key={sign.label} sign={sign} onTryIt={handleTryIt} />
            ))}
          </div>
        </div>
      </main>

      {trySign && (
        <TryItModal
          sign={trySign}
          result={tryResult}
          onDetect={handleDetect}
          onClose={handleClose}
          onReset={() => setTryResult("idle")}
        />
      )}
    </>
  );
}
