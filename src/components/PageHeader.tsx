import type { ReactNode } from 'react';

export interface PageHeaderProps {
  /** Small ALL-CAPS mode label shown above the title */
  mode: string;
  title: string;
  description?: string;
  /** Optional right-side slot — e.g. a language dropdown */
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  mode,
  title,
  description,
  action,
  className = '',
}: PageHeaderProps) {
  return (
    <header
      className={`bg-white border-b border-[#f0f0f0] py-[22px] flex items-start justify-between gap-4 ${className}`}
    >
      <div>
        <div className="text-[10px] font-semibold text-[#bbb] uppercase tracking-[0.08em] mb-1">
          {mode}
        </div>
        <h1 className="text-[24px] font-bold text-ink tracking-[-0.8px] mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-[#bbb]">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2 pt-1 shrink-0">{action}</div>
      )}
    </header>
  );
}
