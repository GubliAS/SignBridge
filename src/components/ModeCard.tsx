import Link from 'next/link';

export interface ModeCardProps {
  title:       string;
  description: string;
  href:        string;
  icon:        React.ReactNode;
}

export function ModeCard({ title, description, href, icon }: ModeCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-white p-6 transition-colors hover:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {/* Icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-1">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-sm leading-relaxed text-gray-500">{description}</p>
      </div>

      {/* Arrow — slides right on hover */}
      <div className="flex items-center gap-1 text-sm font-semibold text-brand-500">
        <span>Get started</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
