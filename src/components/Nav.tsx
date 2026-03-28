"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Translate", href: "/translate" },
  { label: "Learn GSL", href: "/learn" },
  { label: "Text → Sign", href: "/speak" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#f0f0f0]">
      {/* Main bar */}
      <div className="flex items-center justify-between  py-[15px] section-container">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green rounded"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="SignBridge"
            width={10000}
            height={10000}
            className="w-30 h-10 md:h-15 md:w-40 object-contain object-center"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <nav aria-label="Main navigation" className="hidden md:flex gap-[2px]">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-[11px] py-[6px] text-sm lg:text-[15px] font-medium rounded-[7px] transition-colors ${
                  active
                    ? "text-ink bg-[#f5f5f5] font-[700]"
                    : "text-[#999] hover:text-ink hover:bg-[#f5f5f5]"
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
          className="hidden md:inline-flex gap-1.5 items-center bg-ink text-white text-sm font-medium px-[18px] py-[10px] rounded-pill transition-colors hover:bg-[#222]"
        >
          Try it free
          <ArrowRight size={14} />
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
                className={`rounded-lg px-3 py-[10px] text-[13px] font-semibold transition-colors ${
                  active
                    ? "text-ink font-bold bg-[#f5f5f5]"
                    : "text-[#777] hover:text-ink"
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
