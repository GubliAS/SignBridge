'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Translate', href: '/translate' },
  { label: 'Learn',     href: '/learn'     },
  { label: 'Speak',     href: '/speak'     },
] as const;

export function NavBar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    pathname === href
      ? 'font-medium text-brand-500'
      : 'font-medium text-gray-500 transition-colors hover:text-brand-500';

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        >
          SignBridge
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden gap-6 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger label — mobile only */}
        <label
          htmlFor="nav-toggle"
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
        >
          {/* Three-line icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>

      {/*
        Peer checkbox: must be a sibling of the mobile nav for the
        Tailwind `peer-checked:` selector to work. Hidden from all users.
      */}
      <input
        type="checkbox"
        id="nav-toggle"
        className="peer sr-only"
        aria-hidden="true"
      />

      {/* Mobile nav — shown when checkbox is checked */}
      <nav
        aria-label="Mobile navigation"
        className="hidden flex-col gap-1 border-t border-gray-100 px-4 pb-4 pt-2 peer-checked:flex md:hidden"
      >
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-lg px-3 py-2.5 ${linkClass(href)}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
