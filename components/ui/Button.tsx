import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowIcon } from "./icons";

type Variant = "primary" | "ghost" | "text";

const styles: Record<Variant, string> = {
  primary: "bg-ochre text-espresso hover:bg-[color-mix(in_oklab,var(--ochre)_88%,white)] px-7 h-12 md:h-14 md:px-9",
  ghost:
    "border border-current/40 hover:border-current px-7 h-12 md:h-14 md:px-9 hover:bg-[color-mix(in_oklab,currentColor_6%,transparent)]",
  text: "h-11 border-b border-current/30 hover:border-current",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean };

/** Link styled as a CTA. Magnetic hover arrives with the delight layer (Phase 6). */
export function ButtonLink({ variant = "primary", arrow, className, children, ...props }: Props) {
  return (
    <Link
      className={clsx(
        "label group inline-flex items-center justify-center gap-3 transition-[background-color,border-color,color] duration-300 ease-silk",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowIcon
          width={16}
          height={16}
          className="transition-transform duration-500 ease-silk group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}
