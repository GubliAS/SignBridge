import Link from "next/link";
import type { ReactNode } from "react";
import {
  Hand,
  ArrowRight,
  Video,
  Users,
  GraduationCap,
  Building2,
  Camera,
  BrainCircuit,
  BookOpen,
  AlignLeft,
} from "lucide-react";
import { Icon as IIcon } from "@iconify/react";

/* --- Ticker --------------------------------------------------------------- */

const TICKER_ITEMS = [
  "470,737 Ghanaians with hearing loss",
  "211,000+ sign language users in Ghana",
  "~16 schools for the deaf nationally",
  "40 million Africans with hearing loss",
  "90%+ deaf children born to hearing parents",
  "Zero formal GSL policy in Ghana",
  "Built with GhanaNLP Khaya AI",
] as const;

function Ticker() {
  return (
    <div className="bg-green overflow-hidden py-[10px]" aria-hidden="true">
      <div className="flex motion-safe:animate-[ticker_28s_linear_infinite] w-max">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-5 px-8 whitespace-nowrap text-[11px] font-[700] uppercase tracking-[0.1em] text-[#052e1e]"
          >
            {item}
            <span className="w-[5px] h-[5px] rounded-full bg-[#052e1e] opacity-40 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Hero sign card ------------------------------------------------------- */

/**
 * icon  = pre-rendered ReactNode — Lucide OR Iconify, your choice.
 * The coloured circle wrapper sets currentColor (text-white / text-green),
 * so icons inside inherit the right colour automatically — no colour class needed.
 */
type SignCardProps = {
  sign:   string;
  twi:    string;
  status: string;
  dark:   boolean;
  icon:   ReactNode;
};

function SignCard({ sign, twi, status, dark, icon }: SignCardProps) {
  return (
    <div
      className={`w-[175px] rounded-[18px] p-4 shadow-xl shadow-black/[0.07]
        ${dark ? "bg-charcoal" : "bg-white border border-[#ebebeb]"}`}
    >
      {/* Icon bubble + sign name */}
      <div className="flex items-center gap-[10px] mb-3">
        <div
          aria-hidden="true"
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
            ${dark ? "bg-green text-white" : "bg-green-light text-green"}`}
        >
          {icon}
        </div>
        <div>
          <div className={`text-[10px] font-[500] mb-[1px] ${dark ? "text-[#555]" : "text-[#aaa]"}`}>
            Sign detected
          </div>
          <div className={`text-[13px] font-semibold leading-none ${dark ? "text-white" : "text-ink"}`}>
            {sign}
          </div>
        </div>
      </div>

      {/* Translation */}
      <div className={`flex items-center gap-[7px] mb-[6px] ${dark ? "text-white" : "text-ink"}`}>
        <div
          aria-hidden="true"
          className={`w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0
            ${dark ? "bg-green text-white" : "bg-green-light text-green"}`}
        >
          <ArrowRight size={10} />
        </div>
        <span className="text-[18px] font-bold tracking-[-0.5px] leading-none">{twi}</span>
      </div>

      {/* Status */}
      <div className={`text-[10px] font-[500] ${dark ? "text-[#555]" : "text-[#bbb]"}`}>
        {status}
      </div>
    </div>
  );
}

/* --- Hero ----------------------------------------------------------------- */

/**
 * Mix Lucide and Iconify freely:
 *   Lucide  → <Hand size={16} aria-hidden="true" />
 *   Iconify → <IIcon icon="mdi:hand-wave" width={16} height={16} aria-hidden="true" />
 * NO colour class on icons — inherited from the circle via currentColor.
 */
const HERO_CARDS: (SignCardProps & { pos: string })[] = [
  {
    sign:   "hello",
    twi:    "Hello",
    status: "English output ready",
    dark:   false,
    pos:    "absolute top-[9%] left-[3%] xl:left-[7%]",
    icon:   <Hand size={16} aria-hidden="true" />,
  },
  {
    sign:   "help",
    twi:    "Boa me",
    status: "Twi output ready",
    dark:   true,
    pos:    "absolute top-[6%] right-[3%] xl:right-[7%]",
    icon:   <IIcon icon="mdi:hand-heart" width={16} height={16} aria-hidden="true" />,
  },
  {
    sign:   "sorry",
    twi:    "Kɛ kɛ mi",
    status: "Ga output ready",
    dark:   true,
    pos:    "absolute bottom-[13%] left-[2%] xl:left-[6%]",
    icon:   <IIcon icon="mdi:hand-wave" width={16} height={16} aria-hidden="true" />,
  },
  {
    sign:   "goodbye",
    twi:    "De Nyuie",
    status: "Ewe output ready",
    dark:   false,
    pos:    "absolute bottom-[11%] right-[2%] xl:right-[6%]",
    icon:   <IIcon icon="tdesign:wave-bye" width={16} height={16} aria-hidden="true" />,
  },
];

function Hero() {
  return (
    <section
      className="bg-white relative overflow-hidden min-h-[88vh] flex flex-col items-center justify-center py-20 md:py-24
        before:content-[''] before:absolute before:inset-0 before:pointer-events-none
        before:bg-[image:linear-gradient(rgba(0,0,0,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.028)_1px,transparent_1px)]
        before:bg-[size:64px_64px]"
    >
      {/* Decorative background circle */}
      <div
        className="absolute opacity-70 inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[820px] h-[820px] rounded-full border border-[#e8e8e8] flex items-center justify-center">
          <div className="w-[620px] h-[620px] rounded-full border border-[#e8e8e8] flex items-center justify-center">
            <div className="w-[420px] h-[420px] rounded-full border border-[#e8e8e8]" />
          </div>
        </div>
      </div>

      {/* 4 floating sign cards — desktop only */}
      {HERO_CARDS.map((card) => (
        <div key={card.sign} className={`hidden lg:block ${card.pos} z-10`}>
          <SignCard {...card} />
        </div>
      ))}

      {/* Centre content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-[600px]">
        {/* Badge */}
        <div className="inline-flex items-center gap-[6px] bg-green-light/50 text-green-dark text-[12px] tracking-wider font-[600] px-3 py-[5px] rounded-pill mb-6 tracking-[0.04em]">
          <span className="w-[6px] h-[6px] rounded-full bg-green animate-[pulseDot_1.6s_ease-in-out_infinite]" />
          GHANAIAN SIGN LANGUAGE · ENGLISH · TWI
        </div>

        {/* H1 */}
        <h1 className="text-[clamp(48px,7.5vw,90px)] font-[700] text-ink leading-[0.95] tracking-[-4px] mb-5">
          Breaking barriers
          <br />
          through <em className="not-italic text-green">sign.</em>
        </h1>

        {/* Subhead */}
        <p className="text-[15px] text-[#777] leading-[1.7] max-w-[400px] mb-8">
          SignBridge translates Ghanaian Sign Language to English and Twi —
          live, in your browser, with no data leaving your device.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <Link
            href="/translate"
            className="inline-flex items-center gap-[7px] bg-green text-white text-[13px] font-[700] px-6 py-3 rounded-pill hover:bg-green-dark transition-colors"
          >
            <Video size={14} aria-hidden="true" />
            Start translating →
          </Link>
          <Link
            href="/learn"
            className="bg-white inline-flex items-center gap-[6px] border border-[#ddd] text-ink text-[13px] font-[600] px-6 py-3 rounded-pill hover:border-[#bbb] transition-colors"
          >
            Learn signs
          </Link>
        </div>
      </div>

      {/* Mobile 2×2 card grid */}
      <div className="lg:hidden relative z-10 grid grid-cols-2 gap-3 mt-10 px-6 w-full max-w-[420px]">
        {HERO_CARDS.map((card) => (
          <SignCard key={card.sign} {...card} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute right-8 bottom-8 hidden lg:flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#bbb] motion-safe:animate-[scrollLine_2s_ease_infinite]" />
        <span className="text-[9px] font-[700] uppercase tracking-[0.15em] text-[#bbb] [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>
    </section>
  );
}

/* --- Stats ---------------------------------------------------------------- */

const STATS = [
  { n: "10", label: "Core GSL signs supported", src: "Growing library" },
  { n: "2", label: "Output languages", src: "English & Twi" },
  { n: "<1s", label: "Average detection latency", src: "MediaPipe, 25–30fps" },
  {
    n: "0",
    label: "Bytes uploaded to any server",
    src: "100% on-device processing",
  },
] as const;

function Stats() {
  return (
    <div className="section-container grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#f0f0f0] bg-[#fafafa]">
      {STATS.map(({ n, label, src }, i) => (
        <div
          key={n}
          className={`px-7 py-6 ${i < 3 ? "border-r border-[#f0f0f0]" : ""} ${i >= 2 ? "border-t border-[#f0f0f0] md:border-t-0" : ""}`}
        >
          <div className="text-[36px] font-[900] text-ink tracking-[-2px] leading-none mb-[3px]">
            {n}
          </div>
          <div className="text-[11px] text-[#888] font-[500] leading-[1.4]">
            {label}
          </div>
          <div className="text-[9px] text-[#bbb] mt-[3px]">{src}</div>
        </div>
      ))}
    </div>
  );
}

/* --- Problem --------------------------------------------------------------- */

function Problem() {
  return (
    <section className="section-container bg-white py-[72px] grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
      <div>
        <div className="flex items-center gap-3 text-[10px] font-[800] text-green uppercase tracking-[0.12em] mb-3">
          <span>The problem</span>
          <span className="h-px bg-green flex-[0_0_32px]" aria-hidden="true" />
        </div>
        <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-ink tracking-[-2px] leading-[1.05] mb-5">
          A community left
          <br />
          without language
        </h2>
        <p className="text-[14px] text-[#777] leading-[1.8]">
          Over 470,000 Ghanaians live with hearing loss — yet Ghana has no
          formal sign language policy, no system-wide interpreter training, and
          no assistive tools in most schools. Deaf students attend classrooms
          where teachers cannot communicate with them. Families resort to
          improvised gestures that no one else understands. Researchers describe
          this as a "linguistic vacuum": deaf children arrive at school without
          a first language, and leave unable to participate fully in society.
        </p>
      </div>
      <div>
        <div className="bg-charcoal rounded-[24px] p-7 mb-3">
          <div className="w-10 h-10 bg-green rounded-[10px] flex items-center justify-center mb-[18px]">
            <Users size={18} className="text-white" aria-hidden="true" />
          </div>
          <div className="text-[40px] font-[900] text-white tracking-[-2px] leading-none mb-1">
            90%+
          </div>
          <div className="text-[12px] text-[#888] leading-[1.5]">
            of deaf children in Ghana are born to hearing parents — the
            communication gap starts at birth, before school even begins
          </div>
          <div className="text-[9px] text-[#555] mt-[6px]">
            Source: Ghana National Association of the Deaf
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f7f7f7] rounded-[18px] p-[18px]">
            <div className="text-[28px] font-[900] tracking-[-1.5px] text-ink leading-none mb-1">
              0
            </div>
            <div className="text-[11px] text-[#999] leading-[1.4]">
              Formal GSL policy — a "null policy" context
            </div>
            <div className="text-[9px] text-[#ccc] mt-1">
              Univ. of Toronto, 2024
            </div>
          </div>
          <div className="bg-[#f7f7f7] rounded-[18px] p-[18px]">
            <div className="text-[28px] font-[900] tracking-[-1.5px] text-ink leading-none mb-1">
              16
            </div>
            <div className="text-[11px] text-[#999] leading-[1.4]">
              Schools for the deaf serving the entire country
            </div>
            <div className="text-[9px] text-[#ccc] mt-1">GNAD</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- How it works ---------------------------------------------------------- */

const STEPS = [
  {
    n: "01",
    title: "Show your hand",
    desc: "Hold a GSL sign in front of your camera. MediaPipe tracks 21 hand landmarks in real time at 25–30fps.",
    tag: "Camera",
  },
  {
    n: "02",
    title: "SignBridge reads it",
    desc: "Our classifier matches your hand shape to a known GSL sign — all running locally, zero upload.",
    tag: "On-device AI",
  },
  {
    n: "03",
    title: "Hear it in your language",
    desc: "The sign is spoken aloud in English or translated to Twi via GhanaNLP and read out loud.",
    tag: "Khaya TTS",
  },
] as const;

function HowItWorks() {
  return (
    <section className="bg-[#111] py-[72px]">
      <div className="section-container">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-14 gap-4">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-[800] text-[#444] uppercase tracking-[0.12em] mb-3">
              <span>How it works</span>
              <span
                className="h-px bg-[#444] flex-[0_0_32px]"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-white tracking-[-2px] leading-[1.05]">
              Three steps.
              <br />
              No setup required.
            </h2>
          </div>
          <p className="hidden md:block text-[13px] text-[#555] max-w-[240px] leading-[1.7] text-right">
            Works entirely in your browser.
            <br />
            Nothing uploaded. Nothing stored.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#222]">
          {STEPS.map(({ n, title, desc, tag }, i) => (
            <div
              key={n}
              className={`relative p-10 overflow-hidden group cursor-default
              ${i < 2 ? "md:border-r border-[#222]" : ""}
              ${i > 0 ? "border-t md:border-t-0 border-[#222]" : ""}
            `}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(29,158,117,0.06)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Large background step number */}
              <div className="text-[80px] font-[900] font-mono text-[#2a2a2a] leading-none tracking-[-3px] mb-4 group-hover:text-[rgba(29,158,117,0.22)] transition-colors duration-300 select-none">
                {n}
              </div>

              {/* Expanding green line */}
              <div className="w-10 h-[2px] bg-green mb-6 motion-safe:group-hover:w-20 transition-all duration-300" />

              <div className="text-[18px] font-[800] text-white tracking-[-0.4px] mb-2 leading-[1.25]">
                {title}
              </div>
              <div className="text-[13px] text-[#555] leading-[1.7] mb-6">
                {desc}
              </div>

              {/* Tag badge */}
              <span className="inline-block text-[9px] font-[700] uppercase tracking-[0.1em] text-green-dark border border-green-dark px-[10px] py-[4px]">
                {tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Mode cards ------------------------------------------------------------ */

const MODES = [
  {
    href: "/translate",
    Icon: Camera,
    title: "Sign → Text",
    route: "/translate",
    desc: "Point your camera at a GSL signer and get instant English + Twi translation.",
    cta: "Start translating →",
    feat: true,
  },
  {
    href: "/learn",
    Icon: BookOpen,
    title: "Learn GSL",
    route: "/learn",
    desc: "10 core GSL signs with GIF demonstrations and live camera practice.",
    cta: "Browse lessons →",
    feat: false,
  },
  {
    href: "/speak",
    Icon: AlignLeft,
    title: "Text → Sign",
    route: "/speak",
    desc: "Type a word or phrase and see the matching GSL GIFs instantly.",
    cta: "Try it →",
    feat: false,
  },
] as const;

function ModeCards() {
  return (
    <section className="bg-white py-[72px]">
      <div className="section-container">
        <div className="flex items-center gap-3 text-[10px] font-[800] text-[#999] uppercase tracking-[0.12em] mb-3">
          <span>What you can do</span>
          <span className="h-px bg-[#ccc] flex-[0_0_32px]" aria-hidden="true" />
        </div>
        <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-ink tracking-[-2px] leading-[1.05] mb-8">
          Three ways to
          <br />
          use SignBridge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-[14px]">
          {MODES.map(({ href, Icon, title, route, desc, cta, feat }) => (
            <div
              key={href}
              className={`relative rounded-[24px] p-[26px] overflow-hidden group ${feat ? "bg-charcoal" : "bg-[#f7f7f7]"}`}
            >
              {/* Bottom border slide-in on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-green scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full"
                aria-hidden="true"
              />
              <div className="w-[42px] h-[42px] bg-green rounded-[10px] flex items-center justify-center mb-5">
                <Icon size={18} className="text-white" aria-hidden="true" />
              </div>
              <div
                className={`text-[24px] font-[900] tracking-[-1px] leading-[1.1] mb-2 ${feat ? "text-white" : "text-ink"}`}
              >
                {title}
              </div>
              <div
                className={`text-[9px] font-[700] font-mono mb-[10px] ${feat ? "text-[#555]" : "text-[#bbb]"}`}
              >
                {route}
              </div>
              <div
                className={`text-[12px] leading-[1.6] mb-[22px] ${feat ? "text-[#888]" : "text-[#777]"}`}
              >
                {desc}
              </div>
              <Link
                href={href}
                className={`inline-flex items-center gap-[5px] text-[12px] font-[700] px-4 py-[9px] rounded-pill transition-colors ${
                  feat
                    ? "bg-green text-white hover:bg-green-dark"
                    : "border border-[#ddd] text-[#111] hover:border-[#bbb]"
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Personas -------------------------------------------------------------- */

const PERSONAS = [
  {
    icon: Users,
    green: true,
    title: "Deaf students",
    desc: "Access core vocabulary in GSL with audio output in English and Twi — no interpreter needed.",
  },
  {
    icon: GraduationCap,
    green: false,
    title: "Teachers & families",
    desc: "Learn the most common GSL signs to communicate with deaf students and family members.",
  },
  {
    icon: Building2,
    green: true,
    title: "Healthcare & public services",
    desc: "Bridge the gap in hospitals and government offices where sign language interpreters are unavailable.",
  },
] as const;

function Personas() {
  return (
    <section className="bg-[#fafafa] border-t border-[#f0f0f0] py-[72px]">
      <div className="section-container">
        <div className="flex items-center gap-3 text-[10px] font-[800] text-[#999] uppercase tracking-[0.12em] mb-3">
          <span>Who we serve</span>
          <span className="h-px bg-[#ccc] flex-[0_0_32px]" aria-hidden="true" />
        </div>
        <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-ink tracking-[-2px] leading-[1.05] mb-8">
          Built for real people
          <br />
          in real situations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
          {PERSONAS.map(({ icon: Icon, green, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-[24px] p-[26px] border border-[#eee]"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-[14px]
                  ${green ? "bg-green-light" : "bg-[#f0f0f0]"}`}
              >
                <Icon
                  size={20}
                  className={green ? "text-green" : "text-[#666]"}
                  aria-hidden="true"
                />
              </div>
              <div className="text-[17px] font-[800] text-ink tracking-[-0.4px] mb-[7px]">
                {title}
              </div>
              <div className="text-[12px] text-[#888] leading-[1.65]">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Africa ---------------------------------------------------------------- */

function Africa() {
  return (
    <section className="bg-[#111] px-10 py-[72px] grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
      <div className="section-container">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-[800] text-green uppercase tracking-[0.12em] mb-3">
            <span>The bigger picture</span>
            <span
              className="h-px bg-green flex-[0_0_32px]"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-white tracking-[-2px] leading-[1.05] mb-[18px]">
            A continent-wide
            <br />
            communication crisis
          </h2>
          <p className="text-[14px] text-[#666] leading-[1.8]">
            Across Africa,{" "}
            <strong className="text-[#ccc] font-[600]">
              40 million people
            </strong>{" "}
            live with significant hearing loss. Most have no access to sign
            language education, certified interpreters, or assistive tools.
            SignBridge is a first step toward changing that — starting with
            Ghana.
          </p>
        </div>
      </div>
      <div className="bg-[#1a1a1a] rounded-[24px] p-7">
        <div className="text-[52px] font-[900] text-white tracking-[-3px] leading-none mb-[6px]">
          40M+
        </div>
        <div className="text-[12px] text-[#555] leading-[1.5] mb-[20px]">
          Africans with hearing loss
        </div>
        <hr className="border-t border-[#2a2a2a] my-[18px]" />
        <div className="flex flex-col gap-[3px]">
          {[
            {
              badge: "Ghana",
              text: "Home to 470K+ deaf and hard-of-hearing people with limited support infrastructure.",
            },
            {
              badge: "Interpreters",
              text: "Fewer than 50 certified GSL interpreters for a country of 33 million.",
            },
            {
              badge: "AI tools",
              text: "SignBridge uses browser-native AI — no server, no account, no cost.",
            },
          ].map(({ badge, text }) => (
            <div
              key={badge}
              className="bg-[#222] border-l-2 border-green pl-4 pr-4 py-4 hover:pl-6 transition-all duration-200 cursor-default"
            >
              <div className="text-[9px] font-[800] uppercase tracking-[0.1em] text-green-dark font-mono mb-[4px]">
                {badge}
              </div>
              <div className="text-[11px] text-[#555] leading-[1.5]">
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Privacy bar ----------------------------------------------------------- */

function PrivacyBar() {
  return (
    <div className="bg-green-light border-t border-[#c8edd8] section-container py-[18px] flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center flex-shrink-0">
        <BrainCircuit size={15} className="text-white" aria-hidden="true" />
      </div>
      <p className="text-[13px] text-green-dark font-[500] leading-[1.5]">
        Your camera never leaves your device. All hand tracking runs locally via
        WebAssembly — nothing is uploaded or stored. No account required.
      </p>
    </div>
  );
}

/* --- Page ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Ticker />
      <Stats />
      <Problem />
      <HowItWorks />
      <ModeCards />
      <Personas />
      <Africa />
      <PrivacyBar />
    </main>
  );
}
