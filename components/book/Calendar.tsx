"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addDays,
  BOOKING_WINDOW_DAYS,
  fromDateKey,
  getDayAvailability,
  MONTHS_LONG,
  toDateKey,
  type DayAvailability,
} from "@/lib/booking";
import { cn } from "@/lib/utils";

const WEEKDAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type CalendarProps = {
  now: Date;
  doctor: string;
  selected: string | null;
  onSelect: (dateKey: string) => void;
};

const reasonLabel: Record<DayAvailability, string> = {
  good: "available",
  limited: "few slots left",
  unavailable: "unavailable",
  closed: "closed — call for emergencies",
};

export function Calendar({ now, doctor, selected, onSelect }: CalendarProps) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS);
  const initial = selected ? fromDateKey(selected) : today;
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });

  const first = new Date(view.year, view.month, 1);
  const leading = (first.getDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.year, view.month, i + 1)),
  ];

  const canPrev =
    view.year > today.getFullYear() || (view.year === today.getFullYear() && view.month > today.getMonth());
  const canNext =
    view.year < lastDay.getFullYear() || (view.year === lastDay.getFullYear() && view.month < lastDay.getMonth());

  const shift = (delta: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-navy-900" aria-live="polite">
          {MONTHS_LONG[view.month]} {view.year}
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={!canPrev}
            aria-label="Previous month"
            className="grid size-9 place-items-center rounded-full text-navy-700 ring-1 ring-navy-200 transition hover:bg-mist-50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            disabled={!canNext}
            aria-label="Next month"
            className="grid size-9 place-items-center rounded-full text-navy-700 ring-1 ring-navy-200 transition hover:bg-mist-50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center" role="group" aria-label="Choose a date">
        {WEEKDAY_HEADERS.map((d) => (
          <div key={d} aria-hidden className="pb-2 text-xs font-semibold text-navy-400">
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} aria-hidden />;
          const key = toDateKey(date);
          const level = getDayAvailability(date, doctor, now);
          const disabled = level === "unavailable" || level === "closed";
          const isSelected = key === selected;
          const isToday = key === toDateKey(today);
          const inPast = date < today;
          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`${date.toDateString()}, ${reasonLabel[level]}`}
              onClick={() => onSelect(key)}
              className={cn(
                "relative mx-auto flex aspect-square w-full max-w-12 flex-col items-center justify-center rounded-xl text-sm font-medium transition duration-200",
                isSelected
                  ? "bg-navy-900 text-white shadow-soft"
                  : disabled
                    ? cn("cursor-not-allowed text-navy-200", !inPast && level === "closed" && "text-navy-300")
                    : "text-navy-800 hover:bg-brand-50 hover:text-brand-800",
                isToday && !isSelected && "ring-1 ring-brand-300",
              )}
            >
              {date.getDate()}
              {!disabled ? (
                <span
                  className={cn(
                    "absolute bottom-1.5 size-1 rounded-full",
                    isSelected ? "bg-brand-300" : level === "limited" ? "bg-amber-400" : "bg-brand-500",
                  )}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-navy-500">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-brand-500" aria-hidden /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-400" aria-hidden /> Few slots left
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-navy-200" aria-hidden /> Unavailable / Sunday
        </span>
      </div>
    </div>
  );
}
