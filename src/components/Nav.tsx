'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Translate',   href: '/translate' },
  { label: 'Learn GSL',   href: '/learn'     },
  { label: 'Text → Sign', href: '/speak'     },
] as const;

/* Diamond logo mark */
function LogoMark({ size = 24 }: { size?: number }) {
  const s = Math.round(size * 0.46);
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-green flex-shrink-0"
    >
      <svg width={s} height={s} viewBox="0 0 11 11" fill="none" aria-hidden="true">
        <path d="M5.5 1L9 4.5L5.5 8L2 4.5L5.5 1Z" fill="white" />
      </svg>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#f0f0f0]">
      {/* Main bar */}
      <div className="flex items-center justify-between px-7 py-[15px]">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-[7px] text-[15px] font-[800] text-ink tracking-[-0.3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green rounded"
          onClick={() => setOpen(false)}
        >
          <LogoMark size={24} />
          SignBridge
        </Link>

        {/* Desktop nav links */}
        <nav aria-label="Main navigation" className="hidden md:flex gap-[2px]">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-[11px] py-[6px] text-[11px] font-[600] rounded-[7px] transition-colors ${
                  active
                    ? 'text-ink bg-[#f5f5f5] font-[700]'
                    : 'text-[#999] hover:text-ink hover:bg-[#f5f5f5]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/translate"
          className="hidden md:inline-flex items-center bg-ink text-white text-[12px] font-[700] px-[18px] py-[8px] rounded-pill transition-colors hover:bg-[#222]"
        >
          Try it free →
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col gap-[4px] p-1 cursor-pointer"
        >
          <span className="block w-[18px] h-[1.5px] bg-[#555] rounded-[1px]" />
          <span className="block w-[18px] h-[1.5px] bg-[#555] rounded-[1px]" />
          <span className="block w-[18px] h-[1.5px] bg-[#555] rounded-[1px]" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden flex flex-col border-t border-[#f5f5f5] px-4 pb-3 pt-2 bg-white"
        >
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-[10px] text-[13px] font-[600] transition-colors ${
                  active ? 'text-ink font-[700] bg-[#f5f5f5]' : 'text-[#777] hover:text-ink'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
