import type { ReactNode } from "react";
import type { ProsePage as Page } from "@/data/pages";

/** A long-form page: eyebrow, title and intro, then numbered sections. */
export function ProsePage({ page, aside, children }: { page: Page; aside?: ReactNode; children?: ReactNode }) {
  return (
    <article className="gutter mx-auto max-w-[1600px] pb-24 pt-[calc(var(--header-h)+10vh)]">
      <header className="max-w-4xl">
        <p className="label text-fg-muted">{page.eyebrow}</p>
        <h1 className="font-display mt-5 text-[length:var(--fs-h1)] leading-[1.02]">{page.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-fg-muted">{page.intro}</p>
        {page.updated && <p className="label mt-6 text-[10px] text-fg-muted">Last updated {page.updated}</p>}
      </header>
      <div className="mt-16 grid gap-16 md:grid-cols-[1fr_minmax(0,46rem)] md:gap-24">
        <aside className="md:sticky md:top-32 md:self-start">{aside}</aside>
        <div className="divide-y divide-line border-t border-line">
          {page.sections.map((s, i) => (
            <section key={s.title} className="grid gap-4 py-10 md:grid-cols-[3rem_1fr]">
              <span className="numeral text-sm not-italic text-accent-text">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-display text-[length:var(--fs-h3)]">{s.title}</h2>
                {s.body?.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-4 max-w-prose text-fg-muted">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-4 max-w-prose space-y-3 text-fg-muted">
                    {s.list.map((li) => (
                      <li key={li.slice(0, 24)} className="flex gap-3">
                        <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-ochre" />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
          {children}
        </div>
      </div>
    </article>
  );
}
