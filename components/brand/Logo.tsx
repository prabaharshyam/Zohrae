import clsx from "clsx";
import { copy } from "@/copy/en";
import { ACCENT_BOX, WORDMARK_ACCENT, WORDMARK_GLYPHS, WORDMARK_VIEWBOX, Z_BOX } from "./wordmark-paths";

type Variant = "full" | "mark" | "monogram";
/** Colourways from the brand sheet. `current` inherits text colour. */
type Tone = "current" | "ivory-on-ochre" | "ochre-on-ivory" | "ivory-on-night";

const TONES: Record<Exclude<Tone, "current">, { fg: string; bg: string }> = {
  "ivory-on-ochre": { fg: "var(--ivory)", bg: "var(--ochre)" },
  "ochre-on-ivory": { fg: "var(--ochre)", bg: "var(--ivory)" },
  "ivory-on-night": { fg: "var(--moon)", bg: "var(--night)" },
};

type LogoProps = {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  /** Accessible name; defaults to the brand name. Pass "" when a parent link already names it. */
  title?: string;
  /** Rendered as a separate path so the É accent can be animated or targeted. */
  accentClassName?: string;
};

export function Logo({
  variant = "full",
  tone = "current",
  className,
  title = copy.brand.name,
  accentClassName,
}: LogoProps) {
  const colours = tone === "current" ? null : TONES[tone];
  const style = colours ? { color: colours.fg, background: colours.bg } : undefined;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };

  if (variant === "monogram") {
    return (
      <span className={clsx("inline-block", className)} style={style}>
        <Monogram a11y={a11y} accentClassName={accentClassName} />
      </span>
    );
  }

  return (
    <span className={clsx("logo inline-flex flex-col items-stretch", className)} style={style} {...a11y}>
      <Wordmark accentClassName={accentClassName} />
      {variant === "full" && <Subline />}
    </span>
  );
}

function Wordmark({ accentClassName }: { accentClassName?: string }) {
  return (
    <svg viewBox={WORDMARK_VIEWBOX} className="h-auto w-full" fill="currentColor" aria-hidden focusable="false">
      {Object.entries(WORDMARK_GLYPHS).map(([glyph, d]) => (
        <path key={glyph} d={d} fillRule="evenodd" />
      ))}
      <path d={WORDMARK_ACCENT} className={accentClassName} />
    </svg>
  );
}

/** Live text, justified to the wordmark's width like the original lock-up. */
function Subline() {
  return (
    <svg viewBox="6 0 1157 64" className="logo-subline mt-[6%] h-auto w-full" aria-hidden focusable="false">
      <text
        x="14"
        y="46"
        textLength="1141"
        lengthAdjust="spacing"
        fill="currentColor"
        style={{ fontFamily: "var(--font-jost)", fontWeight: 300, fontSize: 52 }}
      >
        {copy.brand.descriptor}
      </text>
    </svg>
  );
}

function Monogram({ a11y, accentClassName }: { a11y: Record<string, unknown>; accentClassName?: string }) {
  // Z glyph with the É accent flourish lifted to its upper right.
  const pad = 24;
  const accentX = Z_BOX.x + Z_BOX.w - ACCENT_BOX.w * 0.55;
  const accentY = Z_BOX.y - ACCENT_BOX.h - 18;
  const minY = accentY - pad;
  const size = Z_BOX.y + Z_BOX.h + pad - minY;
  const minX = Z_BOX.x + Z_BOX.w / 2 - size / 2 + 12;

  return (
    <svg
      viewBox={`${minX} ${minY} ${size} ${size}`}
      className="h-full w-full"
      fill="currentColor"
      focusable="false"
      {...a11y}
    >
      <path d={WORDMARK_GLYPHS.z} fillRule="evenodd" />
      <path
        d={WORDMARK_ACCENT}
        className={accentClassName}
        transform={`translate(${accentX - ACCENT_BOX.x} ${accentY - ACCENT_BOX.y})`}
      />
    </svg>
  );
}
