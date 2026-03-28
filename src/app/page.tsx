import Link from 'next/link';

/* ─── Shared ─────────────────────────────────────────────────────────────── */

function ArrowIcon() {
  return (
    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden="true">
      <path d="M3.5 1L6 3.5L3.5 6M1 3.5h5" stroke="#1D9E75" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="bg-white relative overflow-hidden min-h-[440px] px-10 pt-14 pb-12">

      {/* Text column */}
      <div className="max-w-[520px]">

        {/* Pill badge */}
        <div className="inline-flex items-center gap-[6px] bg-green-light text-green-dark text-[11px] font-[700] px-3 py-[5px] rounded-pill mb-[22px] tracking-[0.02em]">
          <span className="w-[6px] h-[6px] rounded-full bg-green animate-[pulseDot_1.6s_ease-in-out_infinite]" />
          GSL · English · Twi
        </div>

        {/* H1 */}
        <h1 className="text-[clamp(36px,5.5vw,68px)] font-[900] text-ink leading-[1.0] tracking-[-3px] mb-5 max-w-[560px]">
          Breaking<br />barriers<br />through <em className="not-italic text-green">sign.</em>
        </h1>

        {/* Subhead */}
        <p className="text-[15px] text-[#777] leading-[1.7] max-w-[420px] mb-7">
          SignBridge translates Ghanaian Sign Language to English and Twi — live, in your browser, with no data leaving your device.
        </p>

        {/* Buttons + lang toggle */}
        <div className="flex flex-wrap items-center gap-[10px] mb-5">
          <Link
            href="/translate"
            className="inline-flex items-center gap-[7px] bg-green text-white text-[13px] font-[700] px-6 py-3 rounded-pill tracking-[-0.1px] hover:bg-green-dark transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="5" width="16" height="12" rx="2.5" stroke="white" strokeWidth="1.5" />
              <circle cx="10" cy="11" r="3" stroke="white" strokeWidth="1.5" />
              <path d="M7 4h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Start translating →
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center gap-[6px] border border-[#ddd] text-ink text-[13px] font-[600] px-6 py-3 rounded-pill hover:border-[#bbb] transition-colors"
          >
            Learn signs
          </Link>
        </div>

        {/* Language toggle — display only */}
        <div className="flex bg-[#f5f5f5] rounded-pill p-[3px] w-fit">
          <span className="px-[14px] py-[6px] rounded-pill text-[11px] font-[700] bg-ink text-white">English</span>
          <span className="px-[14px] py-[6px] rounded-pill text-[11px] font-[700] text-[#999]">Twi</span>
        </div>
      </div>

      {/* Floating cards — desktop only */}
      <div className="hidden md:flex absolute top-12 right-9 flex-col gap-3 w-[200px]">
        {/* Dark card */}
        <div className="bg-charcoal rounded-[14px] p-[14px] border border-charcoal">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center text-[15px] flex-shrink-0">👋</div>
            <div>
              <div className="text-[9px] text-[#666] font-[600] mb-[1px]">Sign detected</div>
              <div className="text-[12px] font-[800] text-white">hello</div>
            </div>
          </div>
          <div className="flex items-center gap-[5px] text-[16px] font-[900] text-white tracking-[-0.5px] mb-[2px]">
            <div className="w-[14px] h-[14px] rounded-full bg-green-light flex items-center justify-center flex-shrink-0">
              <ArrowIcon />
            </div>
            Mahɔ
          </div>
          <div className="text-[9px] text-[#555]">Live · 0.6s detection</div>
        </div>
        {/* Light card */}
        <div className="bg-white rounded-[14px] p-[14px] border border-[#eee]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-light flex items-center justify-center text-[15px] flex-shrink-0">✋</div>
            <div>
              <div className="text-[9px] text-[#bbb] font-[600] mb-[1px]">Sign detected</div>
              <div className="text-[12px] font-[800] text-ink">help</div>
            </div>
          </div>
          <div className="flex items-center gap-[5px] text-[16px] font-[900] text-ink tracking-[-0.5px] mb-[2px]">
            <div className="w-[14px] h-[14px] rounded-full bg-green-light flex items-center justify-center flex-shrink-0">
              <ArrowIcon />
            </div>
            Boa me
          </div>
          <div className="text-[9px] text-[#ccc]">Twi output ready</div>
        </div>
      </div>

      {/* Mobile mini cards */}
      <div className="flex md:hidden gap-2 mt-5">
        {([
          { emoji: '👋', sign: 'hello', twi: 'Mahɔ',   dark: true  },
          { emoji: '✋', sign: 'help',  twi: 'Boa me', dark: false },
        ] as const).map(({ emoji, sign, twi, dark }) => (
          <div
            key={sign}
            className={`flex-1 min-w-0 rounded-xl p-3 border ${dark ? 'bg-charcoal border-charcoal' : 'bg-white border-[#eee]'}`}
          >
            <div className={`text-[8px] font-[600] mb-[2px] ${dark ? 'text-[#555]' : 'text-[#bbb]'}`}>Sign detected</div>
            <div className={`text-[16px] font-[900] tracking-[-0.5px] mb-[1px] ${dark ? 'text-white' : 'text-ink'}`}>{sign}</div>
            <div className={`text-[10px] font-[600] ${dark ? 'text-green-mid' : 'text-green'}`}>{twi}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */

const STATS = [
  { n: '470K',  label: 'Ghanaians with hearing loss',     src: 'Ghana Census 2021'             },
  { n: '211K+', label: 'Sign language users in Ghana',    src: 'GNAD estimate'                 },
  { n: '~16',   label: 'Schools for the deaf nationally', src: 'Ghana Natl Assoc. of the Deaf' },
  { n: '40M+',  label: 'Africans with hearing loss',      src: 'WHO / World Bank'              },
] as const;

function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#f0f0f0] bg-[#fafafa]">
      {STATS.map(({ n, label, src }, i) => (
        <div
          key={n}
          className={`px-7 py-6 ${i < 3 ? 'border-r border-[#f0f0f0]' : ''} ${i >= 2 ? 'border-t border-[#f0f0f0] md:border-t-0' : ''}`}
        >
          <div className="text-[36px] font-[900] text-ink tracking-[-2px] leading-none mb-[3px]">{n}</div>
          <div className="text-[11px] text-[#888] font-[500] leading-[1.4]">{label}</div>
          <div className="text-[9px] text-[#bbb] mt-[3px]">{src}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Problem ─────────────────────────────────────────────────────────────── */

function Problem() {
  return (
    <section className="bg-white px-10 py-[72px] grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
      <div>
        <div className="text-[10px] font-[800] text-green uppercase tracking-[0.12em] mb-3">The problem</div>
        <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-ink tracking-[-2px] leading-[1.05] mb-5">
          A community left<br />without language
        </h2>
        <p className="text-[14px] text-[#777] leading-[1.8]">
          Over 470,000 Ghanaians live with hearing loss — yet Ghana has no formal sign language policy,
          no system-wide interpreter training, and no assistive tools in most schools. Deaf students attend
          classrooms where teachers cannot communicate with them. Families resort to improvised gestures
          that no one else understands. Researchers describe this as a "linguistic vacuum": deaf children
          arrive at school without a first language, and leave unable to participate fully in society.
        </p>
      </div>
      <div>
        <div className="bg-charcoal rounded-[24px] p-7 mb-3">
          <div className="w-10 h-10 bg-green rounded-[10px] flex items-center justify-center mb-[18px]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 2.6a2 2 0 110 4 2 2 0 010-4zm0 8a4.5 4.5 0 01-3.75-2c.04-1.25 2.5-1.94 3.75-1.94s3.71.69 3.75 1.94A4.5 4.5 0 019 12.6z" fill="white" />
            </svg>
          </div>
          <div className="text-[40px] font-[900] text-white tracking-[-2px] leading-none mb-1">90%+</div>
          <div className="text-[12px] text-[#888] leading-[1.5]">
            of deaf children in Ghana are born to hearing parents — the communication gap starts at birth, before school even begins
          </div>
          <div className="text-[9px] text-[#555] mt-[6px]">Source: Ghana National Association of the Deaf</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f7f7f7] rounded-[18px] p-[18px]">
            <div className="text-[28px] font-[900] tracking-[-1.5px] text-ink leading-none mb-1">0</div>
            <div className="text-[11px] text-[#999] leading-[1.4]">Formal GSL policy — a "null policy" context</div>
            <div className="text-[9px] text-[#ccc] mt-1">Univ. of Toronto, 2024</div>
          </div>
          <div className="bg-[#f7f7f7] rounded-[18px] p-[18px]">
            <div className="text-[28px] font-[900] tracking-[-1.5px] text-ink leading-none mb-1">16</div>
            <div className="text-[11px] text-[#999] leading-[1.4]">Schools for the deaf serving the entire country</div>
            <div className="text-[9px] text-[#ccc] mt-1">GNAD</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How it works ────────────────────────────────────────────────────────── */

const STEPS = [
  {
    n: '01',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="5" width="16" height="12" rx="2.5" stroke="white" strokeWidth="1.5"/><circle cx="10" cy="11" r="3" stroke="white" strokeWidth="1.5"/><path d="M7 4h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    title: 'Show your hand',
    desc:  'Hold a GSL sign in front of your camera. MediaPipe tracks 21 hand landmarks in real time at 25–30fps.',
  },
  {
    n: '02',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h4l2.5-5.5L13 16l2.5-6H17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'SignBridge reads it',
    desc:  'Our classifier matches your hand shape to a known GSL sign — all running locally, zero upload.',
  },
  {
    n: '03',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 7l8-4v14L6 13V7z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M15 8c1 .5 1.5 1.2 1.5 2s-.5 1.5-1.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    title: 'Hear it in your language',
    desc:  'The sign is spoken aloud in English or translated to Twi via GhanaNLP and read out loud.',
  },
] as const;

function HowItWorks() {
  return (
    <section className="bg-[#111] px-10 py-[72px]">
      <div className="text-[10px] font-[800] text-green uppercase tracking-[0.12em] mb-3">How it works</div>
      <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-white tracking-[-2px] leading-[1.05] mb-10 max-w-[380px]">
        Three steps.<br />No setup required.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
        {STEPS.map(({ n, icon, title, desc }, i) => (
          <div
            key={n}
            className={`bg-[#1a1a1a] p-7 ${i === 0 ? 'md:rounded-l-[14px] rounded-t-[14px] md:rounded-t-none' : ''} ${i === 2 ? 'md:rounded-r-[14px] rounded-b-[14px] md:rounded-b-none' : ''}`}
          >
            <div className="text-[10px] font-[700] text-[#444] tracking-[0.08em] mb-4 font-mono">{n}</div>
            <div className="w-11 h-11 bg-green rounded-[10px] flex items-center justify-center mb-4">{icon}</div>
            <div className="text-[17px] font-[800] text-white tracking-[-0.4px] mb-2 leading-[1.2]">{title}</div>
            <div className="text-[12px] text-[#555] leading-[1.6]">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Mode cards ──────────────────────────────────────────────────────────── */

const MODES = [
  {
    href:  '/translate',
    icon:  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="5" width="16" height="12" rx="2.5" stroke="white" strokeWidth="1.5"/><circle cx="10" cy="11" r="3" stroke="white" strokeWidth="1.5"/></svg>,
    title: 'Sign → Text',
    route: '/translate',
    desc:  'Point your camera at a GSL signer and get instant English + Twi translation.',
    cta:   'Start translating →',
    feat:  true,
  },
  {
    href:  '/learn',
    icon:  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="4" width="14" height="12" rx="2" stroke="white" strokeWidth="1.5"/><path d="M7 9h6M7 12h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    title: 'Learn GSL',
    route: '/learn',
    desc:  '10 core GSL signs with GIF demonstrations and live camera practice.',
    cta:   'Browse lessons →',
    feat:  false,
  },
  {
    href:  '/speak',
    icon:  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M4 6h12M4 14h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    title: 'Text → Sign',
    route: '/speak',
    desc:  'Type a word or phrase and see the matching GSL GIFs instantly.',
    cta:   'Try it →',
    feat:  false,
  },
] as const;

function ModeCards() {
  return (
    <section className="bg-white px-10 py-[72px]">
      <div className="text-[10px] font-[800] text-[#999] uppercase tracking-[0.12em] mb-3">What you can do</div>
      <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-ink tracking-[-2px] leading-[1.05] mb-8">
        Three ways to<br />use SignBridge
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-[14px]">
        {MODES.map(({ href, icon, title, route, desc, cta, feat }) => (
          <div key={href} className={`rounded-[24px] p-[26px] ${feat ? 'bg-charcoal' : 'bg-[#f7f7f7]'}`}>
            <div className="w-[42px] h-[42px] bg-green rounded-[10px] flex items-center justify-center mb-5">{icon}</div>
            <div className={`text-[24px] font-[900] tracking-[-1px] leading-[1.1] mb-2 ${feat ? 'text-white' : 'text-ink'}`}>{title}</div>
            <div className={`text-[9px] font-[700] font-mono mb-[10px] ${feat ? 'text-[#555]' : 'text-[#bbb]'}`}>{route}</div>
            <div className={`text-[12px] leading-[1.6] mb-[22px] ${feat ? 'text-[#888]' : 'text-[#777]'}`}>{desc}</div>
            <Link
              href={href}
              className={`inline-flex items-center gap-[5px] text-[12px] font-[700] px-4 py-[9px] rounded-pill transition-colors ${
                feat ? 'bg-green text-white hover:bg-green-dark' : 'border border-[#ddd] text-[#111] hover:border-[#bbb]'
              }`}
            >
              {cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Personas ────────────────────────────────────────────────────────────── */

const PERSONAS = [
  { emoji: '🤝', green: true,  title: 'Deaf students',               desc: 'Access core vocabulary in GSL with audio output in English and Twi — no interpreter needed.' },
  { emoji: '👨‍🏫', green: false, title: 'Teachers & families',         desc: 'Learn the most common GSL signs to communicate with deaf students and family members.' },
  { emoji: '🏥', green: true,  title: 'Healthcare & public services', desc: 'Bridge the gap in hospitals and government offices where sign language interpreters are unavailable.' },
] as const;

function Personas() {
  return (
    <section className="bg-[#fafafa] border-t border-[#f0f0f0] px-10 py-[72px]">
      <div className="text-[10px] font-[800] text-[#999] uppercase tracking-[0.12em] mb-3">Who we serve</div>
      <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-ink tracking-[-2px] leading-[1.05] mb-8">
        Built for real people<br />in real situations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
        {PERSONAS.map(({ emoji, green, title, desc }) => (
          <div key={title} className="bg-white rounded-[24px] p-[26px] border border-[#eee]">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[20px] mb-[14px] ${green ? 'bg-green-light' : 'bg-[#f0f0f0]'}`}>
              {emoji}
            </div>
            <div className="text-[17px] font-[800] text-ink tracking-[-0.4px] mb-[7px]">{title}</div>
            <div className="text-[12px] text-[#888] leading-[1.65]">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Africa ──────────────────────────────────────────────────────────────── */

function Africa() {
  return (
    <section className="bg-[#111] px-10 py-[72px] grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
      <div>
        <div className="text-[10px] font-[800] text-green uppercase tracking-[0.12em] mb-3">The bigger picture</div>
        <h2 className="text-[clamp(28px,3.5vw,44px)] font-[900] text-white tracking-[-2px] leading-[1.05] mb-[18px]">
          A continent-wide<br />communication crisis
        </h2>
        <p className="text-[14px] text-[#666] leading-[1.8]">
          Across Africa, <strong className="text-[#ccc] font-[600]">40 million people</strong> live with significant hearing loss.
          Most have no access to sign language education, certified interpreters, or assistive tools.
          SignBridge is a first step toward changing that — starting with Ghana.
        </p>
      </div>
      <div className="bg-[#1a1a1a] rounded-[24px] p-7">
        <div className="text-[52px] font-[900] text-white tracking-[-3px] leading-none mb-[6px]">40M+</div>
        <div className="text-[12px] text-[#555] leading-[1.5] mb-[20px]">Africans with hearing loss</div>
        <hr className="border-t border-[#2a2a2a] my-[18px]" />
        {[
          { badge: 'Ghana',        text: 'Home to 470K+ deaf and hard-of-hearing people with limited support infrastructure.' },
          { badge: 'Interpreters', text: 'Fewer than 50 certified GSL interpreters for a country of 33 million.' },
          { badge: 'AI tools',     text: 'SignBridge uses browser-native AI — no server, no account, no cost.' },
        ].map(({ badge, text }) => (
          <div key={badge} className="flex items-start gap-[10px] mb-3">
            <span className="bg-green text-white text-[9px] font-[800] px-[9px] py-[3px] rounded-pill whitespace-nowrap flex-shrink-0 mt-[1px] tracking-[0.03em]">
              {badge}
            </span>
            <span className="text-[11px] text-[#555] leading-[1.5]">{text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Privacy bar ─────────────────────────────────────────────────────────── */

function PrivacyBar() {
  return (
    <div className="bg-green-light border-t border-[#c8edd8] px-10 py-[18px] flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1.5L12 3.5v3.5c0 3-2.5 5-5 5.5C4.5 12 2 10 2 7V3.5L7 1.5z" stroke="white" strokeWidth="1.3" fill="none" />
        </svg>
      </div>
      <p className="text-[13px] text-green-dark font-[500] leading-[1.5]">
        Your camera never leaves your device. All hand tracking runs locally via WebAssembly — nothing is uploaded or stored. No account required.
      </p>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <main>
      <Hero />
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
