"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { startCheckout } from "@/app/cart/actions";
import { CloseIcon } from "@/components/ui/icons";
import { copy } from "@/copy/en";
import { track } from "@/lib/analytics";
import { cart, cartCount, cartSubtotal, useCart, type CartLine } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import { useLenis } from "@/lib/motion/SmoothScroll";

const inr = (amount: number) => formatPrice({ amount, currencyCode: "INR" });

/** The bag, as a drawer from the right on any page. */
export function CartDrawer() {
  const state = useCart();
  const lenis = useLenis();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [state.open, lenis]);

  return (
    <div className={clsx("fixed inset-0 z-[75]", !state.open && "pointer-events-none")} inert={!state.open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={copy.cart.close}
        onClick={cart.close}
        className={clsx(
          "absolute inset-0 bg-night/50 transition-opacity duration-500",
          state.open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={copy.cart.title}
        tabIndex={-1}
        className={clsx(
          "absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-bg text-fg shadow-[-30px_0_60px_rgb(0_0_0/0.25)] outline-none transition-transform duration-700 ease-silk",
          state.open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <CartContents onNavigate={cart.close} />
      </div>
    </div>
  );
}

/** Bag contents, shared by the drawer and the /cart page. */
export function CartContents({ onNavigate, page }: { onNavigate?: () => void; page?: boolean }) {
  const state = useCart();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const count = cartCount(state);

  const checkout = () =>
    startTransition(async () => {
      setMessage(null);
      track("begin_checkout", {
        currency: "INR",
        value: cartSubtotal(state),
        items: state.lines.map((l) => ({
          item_id: l.handle,
          item_name: l.title,
          price: l.price,
          quantity: l.quantity,
        })),
      });
      const res = await startCheckout(
        state.lines.map(({ variantId, quantity, attributes }) => ({ variantId, quantity, attributes })),
        state.gift,
      );
      if ("url" in res) window.location.href = res.url;
      else setMessage(res.error === "preview" ? copy.cart.preview : copy.cart.failed);
    });

  return (
    <>
      <header className={clsx("flex items-center justify-between border-b border-line", page ? "pb-6" : "px-6 py-5")}>
        <h2 data-no-reveal className="font-display text-3xl">
          {copy.cart.title}{" "}
          <span className="label ml-2 align-middle text-[10px] text-fg-muted">{copy.cart.count(count)}</span>
        </h2>
        {!page && (
          <button
            type="button"
            onClick={cart.close}
            aria-label={copy.cart.close}
            className="grid size-11 place-items-center"
          >
            <CloseIcon />
          </button>
        )}
      </header>

      {state.lines.length === 0 ? (
        <div
          className={clsx(
            "flex flex-1 flex-col items-center justify-center gap-6 text-center",
            page ? "py-24" : "px-6",
          )}
        >
          <p className="font-display text-2xl italic text-fg-muted">{copy.cart.empty}</p>
          <Link href="/collections/lumiere" onClick={onNavigate} className="label border-b border-current/40 pb-1">
            {copy.cart.emptyCta}
          </Link>
        </div>
      ) : (
        <>
          <ul className={clsx("flex-1 divide-y divide-line overflow-y-auto", !page && "px-6")} data-lenis-prevent>
            {state.lines.map((l) => (
              <Line key={l.id} line={l} onNavigate={onNavigate} />
            ))}
          </ul>
          <footer className={clsx("border-t border-line", page ? "pt-6" : "px-6 py-6")}>
            <div className="flex items-baseline justify-between">
              <span className="label text-fg-muted">{copy.cart.subtotal}</span>
              <span className="font-display text-2xl">{inr(cartSubtotal(state))}</span>
            </div>
            <p className="mt-2 text-xs text-fg-muted">{copy.cart.shippingNote}</p>
            <p className="mt-1 text-xs text-fg-muted">{copy.cart.giftNote}</p>
            <div className="mt-5 border-t border-line pt-5">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span className="label text-[10px]">{copy.cart.giftToggle}</span>
                <input
                  type="checkbox"
                  role="switch"
                  checked={state.gift.on}
                  onChange={(e) => cart.setGift({ on: e.target.checked })}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className="relative h-5 w-9 rounded-full bg-line transition-colors peer-checked:bg-ochre after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-bg after:transition-transform peer-checked:after:translate-x-4"
                />
              </label>
              {state.gift.on && (
                <div className="mt-3">
                  <p className="text-xs text-fg-muted">{copy.cart.giftHint}</p>
                  <label className="mt-3 block">
                    <span className="sr-only">{copy.cart.giftMessage}</span>
                    <textarea
                      value={state.gift.message}
                      maxLength={250}
                      rows={3}
                      placeholder={copy.cart.giftPlaceholder}
                      onChange={(e) => cart.setGift({ message: e.target.value })}
                      className="font-display w-full resize-none border border-line bg-transparent p-3 text-lg italic outline-none focus:border-ochre"
                    />
                  </label>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={checkout}
              disabled={pending}
              className="label mt-6 flex h-14 w-full items-center justify-center bg-ochre text-espresso transition-opacity disabled:opacity-60"
            >
              {pending ? "…" : copy.cart.checkout}
            </button>
            {message && (
              <p role="status" className="mt-4 text-sm text-fg-muted">
                {message}
              </p>
            )}
          </footer>
        </>
      )}
    </>
  );
}

function Line({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/products/${line.handle}`}
        onClick={onNavigate}
        className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-bg-raised"
      >
        {line.image && <Image src={line.image.url} alt={line.image.alt} fill sizes="80px" className="object-cover" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <Link href={`/products/${line.handle}`} onClick={onNavigate} className="font-display truncate text-xl">
            {line.title}
          </Link>
          <span className="shrink-0 text-sm">{inr(line.price * line.quantity)}</span>
        </div>
        {line.variantTitle && line.variantTitle !== "As shown" && (
          <p className="mt-1 text-sm text-fg-muted">{line.variantTitle}</p>
        )}
        {line.attributes?.map((a) => (
          <p key={a.key} className="mt-1 text-xs text-fg-muted">
            {a.key}: {a.value}
          </p>
        ))}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-line">
            <button
              type="button"
              aria-label={copy.cart.decrease}
              onClick={() => cart.setQuantity(line.id, line.quantity - 1)}
              className="grid size-9 place-items-center"
            >
              −
            </button>
            <span className="w-8 text-center text-sm" aria-live="polite">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label={copy.cart.increase}
              onClick={() => cart.setQuantity(line.id, line.quantity + 1)}
              className="grid size-9 place-items-center"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => cart.remove(line.id)}
            className="label text-[10px] text-fg-muted hover:text-fg"
          >
            {copy.cart.remove}
          </button>
        </div>
      </div>
    </li>
  );
}
