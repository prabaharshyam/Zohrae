import { ButtonLink } from "@/components/ui/Button";
import { copy } from "@/copy/en";

/** The pull-chain dark room arrives in Phase 6; this is its quiet first draft. */
export default function NotFound() {
  return (
    <section className="gutter mx-auto flex min-h-[80svh] max-w-[1600px] flex-col items-start justify-center pt-[var(--header-h)]">
      <p className="label text-fg-muted">404</p>
      <h1 className="font-display mt-6 max-w-4xl text-[length:var(--fs-h1)]">{copy.notFound.title}</h1>
      <p className="font-display mt-4 text-[length:var(--fs-h3)] italic text-accent-text">{copy.notFound.body}</p>
      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" arrow>
          {copy.stub.backHome}
        </ButtonLink>
        <ButtonLink href="/collections/lumiere" variant="ghost">
          {copy.home.heroPrimaryCta}
        </ButtonLink>
      </div>
    </section>
  );
}
