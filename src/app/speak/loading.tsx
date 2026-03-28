export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <span
        aria-label="Loading"
        className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"
      />
    </div>
  );
}
