/** The Craft visual identity: each service is a small physical/digital object drawn in the same flat style. */
const QR = ["1110111", "1010101", "1110111", "0001000", "1101101", "0110010", "1011101"];

export type ServiceIcon = "web" | "menu" | "nfc" | "webapp" | "app";

export function ServiceObject({ kind, className = "w-full" }: { kind: string; className?: string }) {
  const common = { viewBox: "0 0 160 128", className, role: "img" as const, "aria-hidden": true };
  switch (kind) {
    case "menu":
      return (
        <svg {...common}>
          <rect x="44" y="8" width="72" height="112" rx="14" className="fill-card stroke-ink" strokeWidth="2.5" />
          <rect x="54" y="18" width="52" height="8" rx="4" className="fill-accent" />
          {QR.map((row, y) =>
            row.split("").map((c, x) =>
              c === "1" ? <rect key={`${x}${y}`} x={54 + x * 7.4} y={34 + y * 7.4} width="6.2" height="6.2" rx="1.4" className="fill-ink" /> : null,
            ),
          )}
          <rect x="54" y="92" width="38" height="5" rx="2.5" className="fill-line" />
          <rect x="54" y="102" width="26" height="5" rx="2.5" className="fill-line" />
        </svg>
      );
    case "nfc":
      return (
        <svg {...common}>
          <rect x="22" y="26" width="108" height="72" rx="12" transform="rotate(-8 76 62)" className="fill-accent-soft" />
          <g transform="rotate(6 80 66)">
            <rect x="24" y="28" width="112" height="72" rx="13" className="fill-ink" />
            <rect x="38" y="46" width="24" height="18" rx="4" className="fill-accent" />
            <path d="M36 80h30M36 88h18" stroke="#fffdfa" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
            <path d="M100 52a14 14 0 0 1 0 22M108 46a24 24 0 0 1 0 34M116 40a34 34 0 0 1 0 46" fill="none" stroke="#fffdfa" strokeWidth="3.4" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "webapp":
      return (
        <svg {...common}>
          <rect x="12" y="14" width="136" height="100" rx="14" className="fill-card stroke-ink" strokeWidth="2.5" />
          <rect x="12" y="14" width="34" height="100" rx="14" className="fill-ink" />
          <rect x="20" y="26" width="18" height="5" rx="2.5" fill="#fffdfa" />
          <rect x="20" y="40" width="18" height="4" rx="2" fill="#fffdfa" fillOpacity=".4" />
          <rect x="20" y="50" width="18" height="4" rx="2" fill="#fffdfa" fillOpacity=".4" />
          {[22, 36, 28, 48, 40].map((h, i) => (
            <rect key={i} x={58 + i * 15} y={96 - h} width="9" height={h} rx="3" className={i === 3 ? "fill-accent" : "fill-line"} />
          ))}
          <rect x="58" y="26" width="34" height="12" rx="6" className="fill-accent-soft" />
          <rect x="98" y="26" width="42" height="12" rx="6" className="fill-paper-2" />
        </svg>
      );
    case "app":
      return (
        <svg {...common}>
          <rect x="8" y="22" width="92" height="62" rx="9" className="fill-card stroke-ink" strokeWidth="2.5" />
          <path d="M40 98h28M54 84v14" className="stroke-ink" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="16" y="30" width="36" height="6" rx="3" className="fill-accent" />
          <rect x="16" y="44" width="76" height="30" rx="6" className="fill-paper-2" />
          <g>
            <rect x="94" y="14" width="52" height="102" rx="13" className="fill-ink" />
            <rect x="99" y="21" width="42" height="88" rx="9" className="fill-card" />
            <rect x="113" y="25" width="14" height="4" rx="2" className="fill-ink" />
            <circle cx="120" cy="48" r="9" className="fill-accent" />
            <rect x="104" y="64" width="32" height="6" rx="3" className="fill-line" />
            <rect x="104" y="76" width="32" height="14" rx="5" className="fill-accent-soft" />
          </g>
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="12" y="14" width="136" height="100" rx="14" className="fill-card stroke-ink" strokeWidth="2.5" />
          <path d="M12 38h136" className="stroke-ink" strokeWidth="2.5" />
          <circle cx="26" cy="26" r="3.6" className="fill-accent" />
          <circle cx="38" cy="26" r="3.6" className="fill-line" />
          <circle cx="50" cy="26" r="3.6" className="fill-line" />
          <rect x="26" y="52" width="62" height="11" rx="5.5" className="fill-ink" />
          <rect x="26" y="70" width="84" height="6" rx="3" className="fill-line" />
          <rect x="26" y="81" width="66" height="6" rx="3" className="fill-line" />
          <rect x="26" y="95" width="38" height="12" rx="6" className="fill-accent" />
          <rect x="104" y="48" width="32" height="48" rx="9" className="fill-accent-soft" />
        </svg>
      );
  }
}
