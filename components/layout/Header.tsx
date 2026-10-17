"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { copy } from "@/copy/en";
import { useLenis } from "@/lib/motion/SmoothScroll";

type NavCollection = { handle: string; title: string; eyebrow: string };

export function Header({ collections }: { collections: NavCollection[] }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const panelId = useId();
  const menuId = useId();
  const collectionsRef = useRef<HTMLLIElement>(null);
  const cartCount = 0; // Cart arrives in Phase 4.

  // Over a section marked data-header-tone (the coloured lamp chapters), the
  // header takes on that section's own ground and ink instead of ivory.
  const [tone, setTone] = useState<{ bg: string; fg: string } | null>(null);
  useEffect(() => {
    let raf = 0;
    const probe = () => {
      raf = 0;
      const hit = document
        .elementsFromPoint(window.innerWidth / 2, 40)
        .find((el) => el instanceof HTMLElement && el.dataset.headerTone !== undefined);
      if (!hit) return setTone((t) => (t ? null : t));
      const cs = getComputedStyle(hit);
      setTone((t) =>
        t?.bg === cs.backgroundColor && t.fg === cs.color ? t : { bg: cs.backgroundColor, fg: cs.color },
      );
    };
    const schedule = () => (raf ||= requestAnimationFrame(probe));
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    const mo = new MutationObserver(schedule); // the light switch recolours chapters
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lights"] });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (adjusting state during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setCollectionsOpen(false);
  }

  // Lock scroll behind the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  // Escape closes whichever menu is open; clicking outside closes the collections panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setCollectionsOpen(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!collectionsRef.current?.contains(e.target as Node)) setCollectionsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const [collectionsLink, ...otherLinks] = copy.nav.primary;
  const solid = scrolled || menuOpen || collectionsOpen;

  return (
    <>
      <a
        href="#main"
        className="label fixed left-4 top-3 z-[60] -translate-y-20 bg-espresso px-4 py-3 text-ivory focus:translate-y-0"
      >
        {copy.nav.skipToContent}
      </a>

      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,height,box-shadow] duration-500 ease-silk",
          solid
            ? "h-16 bg-[color-mix(in_oklab,var(--bg)_94%,transparent)] shadow-[0_1px_0_var(--line)] md:h-[68px]"
            : "h-[var(--header-h)]",
        )}
        style={
          tone && !menuOpen
            ? ({ "--bg": tone.bg, "--fg": tone.fg, "--line": "transparent", color: tone.fg } as React.CSSProperties)
            : undefined
        }
      >
        <div className="gutter mx-auto grid h-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left: menu (mobile) / primary nav (desktop) */}
          <div className="flex items-center">
            <button
              type="button"
              className="-ml-2 grid size-11 place-items-center md:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.openMenu}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <nav aria-label="Primary" className="hidden md:block">
              <ul className="label flex items-center gap-7">
                <li className="relative" ref={collectionsRef}>
                  <button
                    type="button"
                    className="py-3 uppercase tracking-[inherit] transition-colors hover:text-accent-text"
                    aria-expanded={collectionsOpen}
                    aria-controls={panelId}
                    onClick={() => setCollectionsOpen((v) => !v)}
                  >
                    {collectionsLink.label}
                  </button>
                  <CollectionsPanel id={panelId} open={collectionsOpen} collections={collections} />
                </li>
                {otherLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="py-3 transition-colors hover:text-accent-text"
                      aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Centre: wordmark */}
          <Link href="/" aria-label={copy.nav.home} className="block">
            <Logo
              variant="mark"
              title=""
              className={clsx(
                "transition-[width] duration-500 ease-silk",
                solid ? "w-[118px] md:w-[136px]" : "w-[132px] md:w-[176px]",
              )}
            />
          </Link>

          {/* Right: utilities */}
          <div className="-mr-2 flex items-center justify-end">
            <IconLink href="/journal" label={copy.nav.search} className="hidden sm:grid">
              <SearchIcon />
            </IconLink>
            <IconLink href="/personalised" label={copy.nav.wishlist} className="hidden sm:grid">
              <HeartIcon />
            </IconLink>
            <IconLink href="/about" label={copy.nav.account} className="hidden md:grid">
              <UserIcon />
            </IconLink>
            <Link
              href="/cart"
              className="group flex h-11 items-center gap-2 px-2"
              aria-label={`${copy.nav.cart}, ${copy.cart.count(cartCount)}`}
            >
              <span className="label hidden lg:inline">{copy.nav.cart}</span>
              <span className="relative">
                <BagIcon />
                <span className="absolute -right-1.5 -top-1 grid size-4 place-items-center rounded-full bg-ochre text-[9px] font-normal text-espresso">
                  {cartCount}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu id={menuId} open={menuOpen} collections={collections} />
    </>
  );
}

function IconLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={clsx("size-11 place-items-center transition-colors hover:text-accent-text", className)}
    >
      {children}
    </Link>
  );
}

function CollectionsPanel({ id, open, collections }: { id: string; open: boolean; collections: NavCollection[] }) {
  return (
    <div
      id={id}
      hidden={!open}
      className="absolute left-0 top-full mt-3 w-[min(560px,80vw)] border border-line bg-bg-raised p-8 shadow-[0_30px_60px_-30px_rgba(42,29,21,0.35)]"
    >
      <p className="label mb-6 text-fg-muted">{copy.nav.collectionsMenuTitle}</p>
      <ul className="grid grid-cols-2 gap-x-8 gap-y-5 normal-case tracking-normal">
        {collections.map((c) => (
          <li key={c.handle}>
            <Link href={`/collections/${c.handle}`} className="group block">
              <span className="label block text-[10px] text-fg-muted">{c.eyebrow}</span>
              <span className="font-display block text-2xl transition-colors group-hover:text-accent-text">
                {c.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileMenu({ id, open, collections }: { id: string; open: boolean; collections: NavCollection[] }) {
  return (
    <div id={id} hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-bg pt-20 md:hidden">
      <nav aria-label="Mobile" className="gutter flex min-h-full flex-col pb-10">
        <p className="label mb-4 text-fg-muted">{copy.nav.collectionsMenuTitle}</p>
        <ul className="space-y-1">
          {collections.map((c) => (
            <li key={c.handle}>
              <Link href={`/collections/${c.handle}`} className="font-display block py-1.5 text-[2.25rem]">
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
        <hr className="hairline my-8" />
        <ul className="label space-y-5">
          {copy.nav.primary.slice(1).map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block py-1">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/light-finder" className="block py-1">
              {copy.home.heroGhostCta}
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-12">
          <Logo variant="full" title="" className="w-48 opacity-80" />
        </div>
      </nav>
    </div>
  );
}
