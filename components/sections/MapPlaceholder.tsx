import { Navigation } from "lucide-react";
import { clinic } from "@/lib/data/clinic";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/layout/Logo";

/** Stylised, illustration-style map used until a real embedded map is added. */
export function MapPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[2rem] bg-[#e9f1f6] ring-1 ring-navy-100", className)}>
      <svg
        viewBox="0 0 800 560"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Illustrated map of Indiranagar showing the clinic location on 100 Feet Road"
      >
        {/* Park & lake */}
        <path d="M-20 380 C 80 340, 170 360, 230 420 S 260 600, 120 620 L -20 620 Z" fill="#cfeee6" />
        <path d="M600 -20 C 640 60, 720 80, 820 60 L 820 -20 Z" fill="#cfe3f2" />
        <ellipse cx="110" cy="470" rx="46" ry="26" fill="#bfe0f0" />

        {/* City blocks */}
        <g fill="#f7fafc">
          {[
            [40, 40, 150, 110],
            [220, 40, 160, 110],
            [420, 40, 130, 110],
            [40, 190, 150, 120],
            [220, 190, 160, 120],
            [520, 190, 110, 120],
            [660, 190, 140, 120],
            [300, 350, 170, 110],
            [520, 350, 110, 110],
            [660, 350, 140, 110],
            [300, 490, 170, 90],
            [520, 490, 280, 90],
          ].map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="14" />
          ))}
        </g>

        {/* Minor roads */}
        <g stroke="#ffffff" strokeWidth="14" strokeLinecap="round">
          <path d="M0 170 H 800" />
          <path d="M0 330 H 800" />
          <path d="M0 475 H 800" />
          <path d="M205 0 V 560" />
          <path d="M650 160 V 560" />
        </g>

        {/* Main roads */}
        <g strokeLinecap="round" fill="none">
          <path d="M400 -10 C 410 150, 470 260, 495 330 S 500 470, 490 580" stroke="#d6e2ec" strokeWidth="34" />
          <path d="M400 -10 C 410 150, 470 260, 495 330 S 500 470, 490 580" stroke="#ffffff" strokeWidth="26" />
          <path d="M-10 330 H 810" stroke="#d6e2ec" strokeWidth="30" />
          <path d="M-10 330 H 810" stroke="#ffffff" strokeWidth="22" />
          {/* Metro line */}
          <path
            d="M-10 150 C 200 140, 300 150, 380 158 S 620 175, 810 168"
            stroke="#7ab8a9"
            strokeWidth="5"
            strokeDasharray="2 10"
          />
        </g>

        {/* Labels */}
        <g
          fontFamily="var(--font-jakarta), sans-serif"
          fontWeight="600"
          fill="#8597b6"
          fontSize="13"
          letterSpacing="1.5"
        >
          <text x="520" y="322">
            100 FEET ROAD
          </text>
          {/* Labels stay inside x≈130–670 so they survive the side crop on narrow (square) maps */}
          <text x="236" y="322">
            CMH ROAD
          </text>
          <text x="420" y="110" transform="rotate(82 420 110)">
            12TH MAIN
          </text>
          {/* Phones: the info chip covers this corner */}
          <text x="136" y="402" fill="#5a9c8b" className="max-sm:hidden">
            <tspan>DEFENCE</tspan>
            <tspan x="136" dy="18">
              COLONY PARK
            </tspan>
          </text>
        </g>
        <g>
          <circle cx="330" cy="153" r="9" fill="#ffffff" stroke="#157a73" strokeWidth="3" />
          {/* Left of the station, clear of the 12th Main road */}
          <text
            x="316"
            y="138"
            textAnchor="end"
            fontFamily="var(--font-jakarta), sans-serif"
            fontSize="12"
            fontWeight="600"
            fill="#157a73"
          >
            Indiranagar Metro
          </text>
        </g>
      </svg>

      {/* Pin */}
      <div className="absolute top-[48%] left-[61%] -translate-x-1/2 -translate-y-full">
        <div className="relative flex flex-col items-center">
          <span className="absolute top-[52px] h-4 w-10 rounded-full bg-navy-900/20 blur-sm" aria-hidden />
          <span className="absolute top-[38px] size-10 animate-ping rounded-full bg-brand-400/40" aria-hidden />
          <span className="relative rounded-2xl bg-white p-1.5 shadow-lift">
            <LogoMark className="size-9 rounded-xl" />
          </span>
          <span className="relative -mt-1 size-3 rotate-45 bg-white shadow-lift" aria-hidden />
        </div>
      </div>

      {/* Info chip */}
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-2xl bg-white/95 p-4 shadow-lift ring-1 ring-navy-100 backdrop-blur sm:inset-x-auto sm:right-5 sm:bottom-5 sm:left-5">
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy-900">SmileCare Dental Clinic</p>
          <p className="truncate text-sm text-navy-500">
            {clinic.address.line1}, {clinic.address.line2}
          </p>
        </div>
        <a
          href={clinic.directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-full bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800"
        >
          <Navigation className="size-4" aria-hidden />
          <span className="hidden sm:inline">Directions</span>
        </a>
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-navy-500 shadow-soft">
        Indiranagar, Bengaluru
      </span>
    </div>
  );
}
