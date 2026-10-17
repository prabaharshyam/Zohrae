/**
 * A wedding badge, drawn as vector art so it's sharp at any size: a gold
 * rosette with an ivory face, the role in script, an optional name, and
 * two ribbon tails in the chosen colour.
 */
export function Badge({
  role,
  name,
  ribbon,
  script,
  serif,
  small,
}: {
  role: string;
  name?: string;
  ribbon: string;
  script: string;
  serif: string;
  small?: string;
}) {
  const id = role.replace(/\W/g, "") + ribbon.slice(1);
  const long = role.length > 12;
  return (
    <svg
      viewBox="0 0 200 270"
      role="img"
      aria-label={`${role} badge${name ? ` for ${name}` : ""}`}
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E3A6" />
          <stop offset="0.45" stopColor="#C9A24E" />
          <stop offset="0.6" stopColor="#A9822F" />
          <stop offset="1" stopColor="#E8CB7C" />
        </linearGradient>
        <radialGradient id={`face-${id}`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#FFFDF7" />
          <stop offset="1" stopColor="#EFE6D3" />
        </radialGradient>
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2a1d15" floodOpacity="0.25" />
        </filter>
      </defs>
      {/* Ribbon tails with swallowtail cuts */}
      <g filter={`url(#shadow-${id})`}>
        <path d="M74 150 L52 262 L70 248 L84 264 L104 158 Z" fill={ribbon} />
        <path d="M126 150 L148 262 L130 248 L116 264 L96 158 Z" fill={ribbon} />
        {/* Pleated rosette edge */}
        <g>
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={100 + Math.cos(a) * 78}
                cy={100 + Math.sin(a) * 78}
                r="9"
                fill={ribbon}
                stroke="#00000014"
                strokeWidth="0.6"
              />
            );
          })}
        </g>
        <circle cx="100" cy="100" r="76" fill={`url(#gold-${id})`} />
        <circle cx="100" cy="100" r="68" fill={`url(#face-${id})`} />
        <circle cx="100" cy="100" r="62" fill="none" stroke={`url(#gold-${id})`} strokeWidth="1" />
      </g>
      {(() => {
        // Long roles ("Mother of the Bride") set on two lines.
        const words = role.split(" ");
        const half = Math.ceil(words.length / 2);
        const lines = long ? [words.slice(0, half).join(" "), words.slice(half).join(" ")] : [role];
        const size = long ? Math.min(30, 210 / Math.max(...lines.map((l) => l.length))) : 32;
        const top = (name ? 100 : 108) - (lines.length - 1) * size * 0.45;
        return lines.map((line, i) => (
          <text
            key={line}
            x="100"
            y={top + i * size * 0.9}
            textAnchor="middle"
            fontFamily={script}
            fontSize={size}
            fill={`url(#gold-${id})`}
            stroke="#8a6a26"
            strokeWidth="0.3"
          >
            {line}
          </text>
        ));
      })()}
      {name && (
        <text x="100" y="128" textAnchor="middle" fontFamily={serif} fontSize="11" letterSpacing="2.4" fill="#5a4630">
          {name.toUpperCase()}
        </text>
      )}
      {small && (
        <text
          x="100"
          y={name ? 144 : 140}
          textAnchor="middle"
          fontFamily={serif}
          fontSize="7.5"
          letterSpacing="1.6"
          fill="#8a7458"
        >
          {small}
        </text>
      )}
      {/* Pearl */}
      <circle cx="100" cy="176" r="7" fill="#FBF7EE" stroke={`url(#gold-${id})`} strokeWidth="2" />
      <circle cx="98" cy="174" r="2" fill="#fff" />
    </svg>
  );
}

/** A round return-gift magnet: the couple in script and the date, in one of three designs. */
export function Magnet({
  names,
  date,
  design,
  script,
  serif,
}: {
  names: string;
  date: string;
  design: string;
  script: string;
  serif: string;
}) {
  const palette =
    design === "Marigold"
      ? { face: "#FFF8EC", ring: "#E9A23B", ink: "#7A3E10", petal: "#F2B63F" }
      : design === "Rose garden"
        ? { face: "#FBEFEC", ring: "#D9A3A0", ink: "#6B2E35", petal: "#E7B8B0" }
        : { face: "#FBF6EA", ring: "#C9A24E", ink: "#5A4630", petal: "" };
  const [a, b] = names.split(/\s*&\s*/);
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Return-gift magnet: ${names}, ${date}`}
      className="h-auto w-full"
    >
      <defs>
        <filter id={`ms-${design.replace(/\W/g, "")}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#2a1d15" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter={`url(#ms-${design.replace(/\W/g, "")})`}>
        <circle cx="100" cy="100" r="92" fill={palette.ring} />
        <circle cx="100" cy="100" r="86" fill={palette.face} />
      </g>
      {palette.petal
        ? Array.from({ length: 28 }, (_, i) => {
            const t = (i / 28) * Math.PI * 2;
            return (
              <ellipse
                key={i}
                cx={100 + Math.cos(t) * 76}
                cy={100 + Math.sin(t) * 76}
                rx="6"
                ry="3"
                transform={`rotate(${(t * 180) / Math.PI + 90} ${100 + Math.cos(t) * 76} ${100 + Math.sin(t) * 76})`}
                fill={palette.petal}
                opacity="0.85"
              />
            );
          })
        : [80, 74].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={palette.ring} strokeWidth="0.8" />
          ))}
      <text x="100" y={b ? 88 : 104} textAnchor="middle" fontFamily={script} fontSize="26" fill={palette.ink}>
        {a || names}
      </text>
      {b && (
        <>
          <text x="100" y="104" textAnchor="middle" fontFamily={serif} fontSize="11" fill={palette.ink} opacity="0.8">
            &amp;
          </text>
          <text x="100" y="128" textAnchor="middle" fontFamily={script} fontSize="26" fill={palette.ink}>
            {b}
          </text>
        </>
      )}
      <text
        x="100"
        y={b ? 150 : 132}
        textAnchor="middle"
        fontFamily={serif}
        fontSize="9"
        letterSpacing="2"
        fill={palette.ink}
        opacity="0.75"
      >
        {date}
      </text>
    </svg>
  );
}
