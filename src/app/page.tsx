import { ModeCard } from '@/components/ModeCard';

// Inline SVG icons — no external icon library needed

function CameraIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.277A1 1 0 0121 8.649v6.702a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3.268l4 2.268 4-2.268" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

const MODES = [
  {
    title:       'Sign → Text',
    description: 'Make a sign. Get instant translation in English or Twi.',
    href:        '/translate',
    icon:        <CameraIcon />,
  },
  {
    title:       'Learn GSL',
    description: 'Interactive lessons for 10 essential Ghanaian signs.',
    href:        '/learn',
    icon:        <GraduationIcon />,
  },
  {
    title:       'Text → Sign',
    description: 'Type English or Twi. See the signs instantly.',
    href:        '/speak',
    icon:        <ChatIcon />,
  },
] as const;

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-16">

      {/* Hero */}
      <section className="mb-14 flex flex-col items-center gap-4 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Ghanaian Sign Language
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-brand-500 sm:text-5xl">
          SignBridge Ghana
        </h1>

        <p className="max-w-md text-lg leading-relaxed text-gray-500">
          Breaking barriers through Ghanaian Sign Language
        </p>
      </section>

      {/* Mode cards */}
      <section
        aria-label="App modes"
        className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {MODES.map((mode) => (
          <ModeCard key={mode.href} {...mode} />
        ))}
      </section>

    </main>
  );
}
