"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { copy } from "@/copy/en";
import { cart, type CartAttribute } from "@/lib/cart/store";
import type { Product, ProductVariant } from "@/lib/commerce/types";
import { toast } from "@/lib/delight/fireflies";
import { formatPrice } from "@/lib/format";
import { gsap } from "@/lib/motion/gsap";
import { HeartButton } from "./HeartButton";

/** A glowing orb arcs from the button into the bag, which gives a little bump. */
function flyToBag(from: DOMRect) {
  const bag = document.querySelector<HTMLElement>("[data-cart-icon]");
  if (!bag || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const to = bag.getBoundingClientRect();
  const orb = document.createElement("span");
  orb.className = "bag-orb";
  orb.setAttribute("aria-hidden", "true");
  orb.style.left = `${from.left + from.width / 2}px`;
  orb.style.top = `${from.top + from.height / 2}px`;
  document.body.appendChild(orb);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  gsap
    .timeline({ onComplete: () => orb.remove() })
    .fromTo(orb, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2 })
    .to(orb, { x: dx, duration: 0.85, ease: "power1.inOut" }, 0.1)
    .to(orb, { y: dy, duration: 0.85, ease: "back.in(1.6)" }, 0.1)
    .to(orb, { scale: 0.3, opacity: 0, duration: 0.2 }, 0.8)
    .fromTo(bag, { scale: 1 }, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }, 0.85);
}

export const initialOptions = (product: Product) =>
  Object.fromEntries((product.variants[0]?.selectedOptions ?? []).map((o) => [o.name, o.value]));

type Props = {
  product: Product;
  /** Controlled options (personalised products share them with the live preview). */
  selected?: Record<string, string>;
  onSelectedChange?: (next: Record<string, string>) => void;
  /** Personalisation fields, shown between the options and the button. */
  children?: React.ReactNode;
  /** Line-item properties: the name, lettering, photo, date. */
  attributes?: CartAttribute[];
  /** Return a message to stop the add (e.g. a missing name). */
  validate?: () => string | null;
  /** The image the bag shows (e.g. a rendered preview). */
  bagImage?: () => { url: string; alt: string } | undefined;
};

/** Option pickers, price, quantity and "Add to Collection" for one product. */
export function BuyBox({
  product,
  selected: controlled,
  onSelectedChange,
  children,
  attributes,
  validate,
  bagImage,
}: Props) {
  const [own, setOwn] = useState<Record<string, string>>(() => initialOptions(product));
  const selected = controlled ?? own;
  const setSelected = (fn: (s: Record<string, string>) => Record<string, string>) => {
    const next = fn(selected);
    setOwn(next);
    onSelectedChange?.(next);
  };
  const [problem, setProblem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const variant: ProductVariant | undefined = useMemo(
    () => product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)),
    [product.variants, selected],
  );
  const visibleOptions = product.options.filter((o) => o.values.length > 1);
  const available = Boolean(variant?.availableForSale);

  const add = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!variant) return;
    const message = validate?.() ?? null;
    setProblem(message);
    if (message) return;
    const image = bagImage?.() ?? product.imageOff ?? product.images[0];
    cart.add({
      variantId: variant.id,
      handle: product.handle,
      title: product.title,
      variantTitle: variant.title,
      price: variant.price.amount,
      image: image && { url: image.url, alt: image.alt },
      quantity,
      attributes: attributes?.filter((a) => a.value),
    });
    flyToBag(e.currentTarget.getBoundingClientRect());
    toast(copy.product.added);
    window.setTimeout(() => cart.open(), 950);
  };

  return (
    <div>
      <p className="text-2xl">
        {variant ? formatPrice(variant.price) : formatPrice(product.priceRange.min)}
        {variant?.compareAtPrice && (
          <s className="ml-3 text-base text-fg-muted">{formatPrice(variant.compareAtPrice)}</s>
        )}
        <span className="label ml-3 text-[10px] text-fg-muted">{copy.product.priceNote}</span>
      </p>

      {visibleOptions.map((option) => (
        <fieldset key={option.name} className="mt-8">
          <legend className="label text-fg-muted">
            {option.name} <span className="ml-2 normal-case tracking-normal text-fg">{selected[option.name]}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {option.values.map((value) => {
              const swatch = product.variants.find((v) =>
                v.selectedOptions.some((o) => o.name === option.name && o.value === value),
              )?.swatch;
              const isSwatch = option.name !== "Size" && swatch;
              const active = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  aria-label={isSwatch ? value : undefined}
                  onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                  className={clsx(
                    "transition-[border-color,box-shadow] duration-300",
                    isSwatch ? "size-10 rounded-full border-2 p-0.5" : "label h-11 min-w-16 border px-4 text-[11px]",
                    active ? "border-ochre" : "border-line hover:border-current",
                  )}
                >
                  {isSwatch ? <span className="block size-full rounded-full" style={{ background: swatch }} /> : value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {children}

      {problem && (
        <p role="alert" className="mt-6 text-sm text-[#a5432f]">
          {problem}
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <div className="flex h-14 items-center border border-line" role="group" aria-label={copy.product.quantity}>
          <button
            type="button"
            aria-label={copy.cart.decrease}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="grid h-full w-11 place-items-center"
          >
            −
          </button>
          <span className="w-8 text-center" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label={copy.cart.increase}
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="grid h-full w-11 place-items-center"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!available}
          data-magnetic
          className="label flex h-14 flex-1 items-center justify-center bg-ochre text-espresso transition-[background-color,opacity] hover:bg-[color-mix(in_oklab,var(--ochre)_88%,white)] disabled:opacity-50"
        >
          {available ? copy.product.addToCart : copy.product.soldOut}
        </button>
        <HeartButton handle={product.handle} title={product.title} className="size-14 border border-line" />
      </div>
      <p className="mt-4 text-sm text-fg-muted">{copy.product.shipsIn}</p>
    </div>
  );
}
