'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex gap-1 px-4 py-3 absolute top-0 left-0 right-0 z-50">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full overflow-hidden bg-white/20"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              i < current
                ? 'bg-white w-full'
                : i === current
                ? 'bg-white w-full animate-pulse'
                : 'w-0'
            }`}
          />
        </div>
      ))}
    </div>
  );
}
