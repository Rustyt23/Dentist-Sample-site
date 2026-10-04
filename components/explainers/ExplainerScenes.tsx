import {
  ACCESS,
  BONE,
  CROWN,
  DECAY_DEEP,
  DECAY_ENAMEL,
  DENTIN,
  ENAMEL,
  GUM_FULL,
  GUM_LEFT,
  GUM_RIGHT,
  PULP,
  TOOTH,
} from "@/components/sections/inside-tooth/geometry";

const VIEWBOX = "0 30 400 450";
const motion = "transform 0.9s cubic-bezier(0.22, 0.8, 0.24, 1), opacity 0.6s ease";

const show = (on: boolean, from = "translateY(0)"): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? "translateY(0)" : from,
  transition: motion,
});

function SceneDefs() {
  return (
    <defs>
      <linearGradient id="ex-enamel" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#d4e6f1" />
      </linearGradient>
      <radialGradient id="ex-dentin" cx="0.5" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#fcf4e4" />
        <stop offset="1" stopColor="#dcc093" />
      </radialGradient>
      <radialGradient id="ex-pulp" cx="0.5" cy="0.22" r="0.85">
        <stop offset="0" stopColor="#ff9fae" />
        <stop offset="1" stopColor="#c62f4f" />
      </radialGradient>
      <linearGradient id="ex-gutta" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6a675" />
        <stop offset="1" stopColor="#d9703f" />
      </linearGradient>
      <linearGradient id="ex-composite" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#eef3f6" />
        <stop offset="1" stopColor="#c9d5dc" />
      </linearGradient>
      <radialGradient id="ex-decay" cx="0.5" cy="0.3" r="0.7">
        <stop offset="0" stopColor="#2f1d13" />
        <stop offset="1" stopColor="#8f6844" />
      </radialGradient>
      <linearGradient id="ex-metal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7c8894" />
        <stop offset="0.35" stopColor="#eef2f5" />
        <stop offset="0.6" stopColor="#b7c1ca" />
        <stop offset="1" stopColor="#66717d" />
      </linearGradient>
      <linearGradient id="ex-crown" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c3d8e5" />
        <stop offset="0.2" stopColor="#f2f8fb" />
        <stop offset="0.5" stopColor="#ffffff" />
        <stop offset="0.8" stopColor="#e6f0f6" />
        <stop offset="1" stopColor="#b6cddc" />
      </linearGradient>
      <linearGradient id="ex-root" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c9ae84" />
        <stop offset="0.5" stopColor="#f8eedc" />
        <stop offset="1" stopColor="#c2a679" />
      </linearGradient>
      <linearGradient id="ex-bone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f3e9d8" />
        <stop offset="1" stopColor="#e2cfb1" />
      </linearGradient>
      <linearGradient id="ex-gum-soft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f8cdd4" />
        <stop offset="0.6" stopColor="#eca5b3" />
        <stop offset="1" stopColor="#e79cab" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ex-gum" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f8cdd4" />
        <stop offset="1" stopColor="#e79cab" />
      </linearGradient>
      <radialGradient id="ex-fade-grad" cx="0.5" cy="0.15" r="0.7">
        <stop offset="0.45" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </radialGradient>
      <mask id="ex-fade" maskUnits="userSpaceOnUse" x="0" y="190" width="400" height="300">
        <rect x="0" y="190" width="400" height="300" fill="url(#ex-fade-grad)" />
      </mask>
      <pattern id="ex-trabecular" width="22" height="18" patternUnits="userSpaceOnUse">
        <ellipse cx="7" cy="6" rx="5" ry="3.4" fill="none" stroke="#cdb48d" strokeWidth="1.1" />
        <ellipse cx="17" cy="14" rx="3.6" ry="2.6" fill="none" stroke="#cdb48d" strokeWidth="1" />
      </pattern>
    </defs>
  );
}

function Jaw({ gums }: { gums: "split" | "full" }) {
  return (
    <g mask="url(#ex-fade)">
      <path d={BONE} fill="url(#ex-bone)" />
      <path d={BONE} fill="url(#ex-trabecular)" opacity="0.5" />
      {gums === "split" ? (
        <>
          <path d={GUM_LEFT} fill="url(#ex-gum)" />
          <path d={GUM_RIGHT} fill="url(#ex-gum)" />
        </>
      ) : null}
    </g>
  );
}

/* ───────────────────────── Root canal ───────────────────────── */

export function RootCanalScene({ step, animate }: { step: number; animate: boolean }) {
  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" aria-hidden>
      <SceneDefs />
      <Jaw gums="split" />

      <path d={DENTIN} fill="url(#ex-dentin)" />

      {/* Pulp: infected → emptied → sealed */}
      <path
        d={PULP}
        fill="url(#ex-pulp)"
        style={{ opacity: step === 0 ? 1 : 0, transition: motion }}
        className={animate && step === 0 ? "animate-glow-pulse" : undefined}
      />
      <path d={PULP} fill="#c62f4f" style={{ opacity: step === 0 ? 0.55 : 0, transition: motion }} />
      <path
        d={PULP}
        fill="#fffaf3"
        stroke="#43b3a8"
        strokeWidth="1.6"
        strokeDasharray="4 4"
        style={{ opacity: step === 1 ? 1 : 0, transition: motion }}
      />
      <path d={PULP} fill="url(#ex-gutta)" style={{ opacity: step >= 2 ? 1 : 0, transition: motion }} />

      <path d={ENAMEL} fill="url(#ex-enamel)" stroke="#c9dfeb" strokeWidth="1.2" />

      {/* Decay → cleaned access → sealed */}
      <g style={{ opacity: step === 0 ? 1 : 0, transition: motion }}>
        <path d={DECAY_ENAMEL} fill="url(#ex-decay)" />
        <path d={DECAY_DEEP} fill="url(#ex-decay)" />
      </g>
      <path
        d={ACCESS}
        fill="#fffaf3"
        stroke="#43b3a8"
        strokeWidth="1.4"
        strokeDasharray="3 3"
        style={{ opacity: step === 1 ? 1 : 0, transition: motion }}
      />
      <path d={ACCESS} fill="url(#ex-composite)" style={{ opacity: step >= 2 ? 1 : 0, transition: motion }} />

      {/* Rotary file cleaning the canal */}
      <g style={show(step === 1, "translateY(-40px)")}>
        <g className={animate ? "animate-file-pump" : undefined}>
          <rect x="161" y="30" width="20" height="30" rx="5" fill="#1f978d" />
          <rect x="165" y="36" width="12" height="3" rx="1.5" fill="#ace4dc" />
          <path
            d="M 171 60 L 171 100 C 169 160, 168 220, 164 262 C 152 300, 146 340, 144 372"
            fill="none"
            stroke="#8d99a6"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 171 100 C 169 160, 168 220, 164 262 C 152 300, 146 340, 144 372"
            fill="none"
            stroke="#5b6672"
            strokeWidth="3.2"
            strokeDasharray="2 4"
          />
        </g>
      </g>

      {/* Crown placed on top */}
      <g style={show(step >= 3, "translateY(-80px)")}>
        <path d={CROWN} fill="url(#ex-crown)" stroke="#c9dfeb" strokeWidth="1.2" />
        <path
          d="M 102 140 C 102 108, 114 84, 136 72"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/* ───────────────────────── Implant ───────────────────────── */

const THREADS = [252, 266, 280, 294, 308, 322, 336, 350, 364].map((y) => {
  const half = 16 - ((y - 236) / 140) * 4;
  return `M ${200 - half} ${y} L ${200 + half} ${y + 5}`;
});

function NeighbourTooth({ dx }: { dx: number }) {
  return (
    <g transform={`translate(${dx} 22)`}>
      <path d={TOOTH} fill="url(#ex-root)" />
      <path d={CROWN} fill="url(#ex-crown)" />
    </g>
  );
}

export function ImplantScene({ step, animate }: { step: number; animate: boolean }) {
  return (
    <svg viewBox={VIEWBOX} className="h-full w-full" aria-hidden>
      <SceneDefs />
      <Jaw gums="full" />

      <NeighbourTooth dx={-205} />
      <NeighbourTooth dx={205} />

      {/* Where the tooth used to be */}
      <path
        d={TOOTH}
        transform="translate(0 22)"
        fill="none"
        stroke="#78cfc5"
        strokeWidth="2"
        strokeDasharray="6 6"
        style={{ opacity: step === 0 ? 0.9 : 0, transition: motion }}
      />

      {/* Titanium implant post */}
      <g style={show(step >= 1, "translateY(-220px)")}>
        <path d="M 184 236 L 216 236 L 212 376 C 210 392, 190 392, 188 376 Z" fill="url(#ex-metal)" />
        {THREADS.map((d) => (
          <path key={d} d={d} stroke="#5b6672" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
        ))}
        <rect x="182" y="230" width="36" height="9" rx="2" fill="url(#ex-metal)" />
      </g>

      {/* Bone fusing to the implant */}
      <g style={{ opacity: step >= 2 ? 1 : 0, transition: motion }}>
        {[
          [176, 270],
          [224, 286],
          [178, 318],
          [222, 338],
          [182, 362],
          [218, 372],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="#43b3a8"
            className={animate ? "animate-glow-pulse" : undefined}
          />
        ))}
      </g>

      {/* Gum heals over the top of the implant */}
      <path d={GUM_FULL} fill="url(#ex-gum-soft)" mask="url(#ex-fade)" />

      {/* Abutment */}
      <g style={show(step >= 2, "translateY(-140px)")}>
        <path
          d="M 189 232 L 211 232 L 214 206 C 214 198, 208 194, 200 194 C 192 194, 186 198, 186 206 Z"
          fill="url(#ex-metal)"
        />
      </g>

      {/* Ceramic crown */}
      <g style={show(step >= 3, "translateY(-160px)")}>
        <g transform="translate(0 30)">
          <path d={CROWN} fill="url(#ex-crown)" stroke="#c9dfeb" strokeWidth="1.2" />
          <path
            d="M 102 140 C 102 108, 114 84, 136 72"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}
