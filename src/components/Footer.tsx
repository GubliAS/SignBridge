import Image from 'next/image';
import Link from 'next/link';

function LogoMark() {
  return (
    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green flex-shrink-0">
      <svg width="9" height="9" viewBox="0 0 11 11" fill="none" aria-hidden="true">
        <path d="M5.5 1L9 4.5L5.5 8L2 4.5L5.5 1Z" fill="white" />
      </svg>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] section-container">
      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-9 pt-11 pb-8">
        {/* Col 1 — Brand */}
        <div className="text-center md:text-left">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green rounded"
          >
            <Image
              src="/logo.png"
              alt="SignBridge"
              width={140}
              height={40}
              className="w-30 h-10 md:h-15 md:w-40 object-cover object-center"
              priority
            />
          </Link>
          <p className="text-xs md:text-sm text-[#444] leading-[1.6] max-w-[200px] md:max-w-[300px] mb-3 mx-auto md:mx-0">
            Real-time Ghanaian Sign Language translation — live, private, and
            free.
          </p>
          <p className="text-xs text-[#2a2a2a]">
            Built with GhanaNLP Khaya AI
          </p>
        </div>

        {/* Col 2 — App modes */}
        <div className="text-center md:text-left">
          <p className="text-xs font-semibold text-[#444] uppercase tracking-[0.1em] mb-3">
            App modes
          </p>
          <div className="flex flex-col gap-[7px]">
            <Link
              href="/translate"
              className="text-sm text-[#666] hover:text-[#aaa] transition-colors"
            >
              Sign → Text
            </Link>
            <Link
              href="/learn"
              className="text-sm text-[#666] hover:text-[#aaa] transition-colors"
            >
              Learn GSL
            </Link>
            <Link
              href="/speak"
              className="text-sm text-[#666] hover:text-[#aaa] transition-colors"
            >
              Text → Sign
            </Link>
          </div>
        </div>

        {/* Col 3 — About */}
        <div className="text-center md:text-left">
          <p className="text-xs font-semibold text-[#444] uppercase tracking-[0.1em] mb-3">
            About
          </p>
          <div className="flex flex-col gap-[7px]">
            <span className="text-[12px] text-[#666]">
              Cursor Hackathon 2025
            </span>
            <span className="text-[12px] text-[#666]">
              HANDS! Lab · Leiden Univ.
            </span>
            <span className="text-[12px] text-[#666]">GhanaNLP · Khaya AI</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#151515] mx-10 py-[18px] flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="text-[10px] text-[#333]">© 2025 SignBridge Ghana</span>
        <span className="text-[9px] font-[700] text-[#444] tracking-[0.04em] bg-[#161616] px-3 py-1 rounded-pill">
          CURSOR HACKATHON 2025
        </span>
      </div>
    </footer>
  );
}
