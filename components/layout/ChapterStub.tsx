import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";

type Props = {
  numeral: string;
  eyebrow: string;
  title: ReactNode;
  intro: string;
  phase: number;
  children?: ReactNode;
};

/** Editorial placeholder for routes whose full experience lands in a later phase. */
export function ChapterStub({ numeral, eyebrow, title, intro, phase, children }: Props) {
  return (
    <section className="gutter mx-auto max-w-[1600px] pb-8 pt-[calc(var(--header-h)+12vh)]">
      <p className="label flex items-center gap-4 text-fg-muted">
        <span className="numeral text-lg normal-case tracking-normal">{numeral}</span>
        <span className="h-px w-10 bg-line" />
        {eyebrow}
      </p>
      <h1 className="font-display mt-6 max-w-5xl text-[length:var(--fs-h1)]">{title}</h1>
      <p className="mt-8 max-w-xl text-fg-muted">{intro}</p>
      <p className="label mt-10 inline-block border border-line px-4 py-2 text-[10px] text-accent-text">
        {copy.stub.comingIn(phase)}
      </p>
      {children && <div className="mt-20">{children}</div>}
      {!children && (
        <div className="mt-16">
          <ButtonLink href="/" variant="text" arrow>
            {copy.stub.backHome}
          </ButtonLink>
        </div>
      )}
    </section>
  );
}
