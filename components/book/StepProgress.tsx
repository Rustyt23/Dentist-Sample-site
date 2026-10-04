import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepProgressProps = {
  steps: string[];
  current: number;
  /** Highest step the user has reached; earlier steps are clickable */
  reached: number;
  onSelect: (index: number) => void;
};

export function StepProgress({ steps, current, reached, onSelect }: StepProgressProps) {
  const percent = ((current + 1) / steps.length) * 100;

  return (
    <div className="border-b border-navy-100 px-6 py-5 sm:px-8">
      {/* Compact progress for phones */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-navy-900">{steps[current]}</span>
          <span className="text-navy-400">
            Step {current + 1} of {steps.length}
          </span>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist-100"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={current + 1}
          aria-label="Booking progress"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-brand-400 to-brand-600 transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Full stepper */}
      <ol className="hidden items-center sm:flex" aria-label="Booking steps">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = i <= reached && !active;
          return (
            <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelect(i)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 rounded-full py-1 pr-2 text-sm font-semibold whitespace-nowrap transition",
                  clickable ? "cursor-pointer" : "cursor-default",
                  active ? "text-navy-900" : done ? "text-navy-700" : "text-navy-300",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-xs transition duration-300",
                    active && "bg-navy-900 text-white shadow-soft ring-4 ring-navy-100",
                    done && "bg-brand-600 text-white group-hover:bg-brand-700",
                    !active && !done && "bg-white text-navy-400 ring-1 ring-navy-200",
                  )}
                >
                  {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : i + 1}
                </span>
                <span className={cn(clickable && "group-hover:text-brand-700")}>{label}</span>
              </button>
              {i < steps.length - 1 ? (
                <span className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-navy-100" aria-hidden>
                  <span
                    className="block h-full bg-brand-500 transition-[width] duration-500 ease-out"
                    style={{ width: i < current ? "100%" : "0%" }}
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
