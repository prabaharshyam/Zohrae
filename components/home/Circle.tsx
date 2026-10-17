"use client";

import clsx from "clsx";
import { useId, useState } from "react";
import { copy } from "@/copy/en";

type State = { kind: "idle" | "sending" | "soon" | "invalid" | "error" } | { kind: "joined"; code: string };

/** XI · The Zohraé Circle: newsletter, with the private code revealed in a glow. */
export function Circle() {
  const t = copy.home.circle;
  const [state, setState] = useState<State>({ kind: "idle" });
  const inputId = useId();
  const msgId = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.status === "joined") setState({ kind: "joined", code: data.code });
      else if (data.status === "soon") setState({ kind: "soon" });
      else if (data.status === "invalid") setState({ kind: "invalid" });
      else setState({ kind: "error" });
    } catch {
      setState({ kind: "error" });
    }
  }

  const message =
    state.kind === "soon" ? t.soon : state.kind === "invalid" ? t.invalid : state.kind === "error" ? t.error : null;

  return (
    <section className="dark-band relative overflow-hidden bg-night text-moon">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle,rgb(255_184_105/0.16),transparent_60%)]"
      />
      <div className="gutter relative mx-auto max-w-3xl py-24 text-center md:py-32">
        <p className="label text-moon/60">{t.eyebrow}</p>
        <h2 className="font-display mt-5 text-[length:var(--fs-h1)]">{t.title}</h2>
        <p className="mx-auto mt-5 max-w-md text-moon/75">{t.body}</p>

        {state.kind === "joined" ? (
          <div className="circle-reveal mx-auto mt-10 max-w-sm border border-glow/40 px-8 py-6" role="status">
            <p className="font-display text-2xl italic">{t.welcome}</p>
            <p className="label mt-4 text-moon/60">{t.codeIntro}</p>
            <p className="font-display mt-2 text-4xl tracking-[0.2em] text-glow">{state.code}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
            <label htmlFor={inputId} className="sr-only">
              {t.placeholder}
            </label>
            <input
              id={inputId}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t.placeholder}
              aria-describedby={message ? msgId : undefined}
              className="h-12 flex-1 border border-moon/30 bg-transparent px-4 text-moon placeholder:text-moon/40 focus:border-glow md:h-14"
            />
            <button
              type="submit"
              disabled={state.kind === "sending"}
              className={clsx(
                "label h-12 bg-ochre px-7 text-espresso md:h-14",
                state.kind === "sending" && "opacity-70",
              )}
            >
              {state.kind === "sending" ? t.sending : t.cta}
            </button>
          </form>
        )}
        {message && (
          <p id={msgId} role="status" className="mx-auto mt-5 max-w-md text-sm text-moon/75">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
