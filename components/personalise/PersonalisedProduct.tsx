"use client";

import clsx from "clsx";
import Image from "next/image";
import { useMemo, useState, useSyncExternalStore } from "react";
import { bodoni, jost, LETTERING, type LetteringId } from "@/app/fonts";
import { BuyBox, initialOptions } from "@/components/shop/BuyBox";
import { Gallery } from "@/components/shop/Gallery";
import { copy } from "@/copy/en";
import type { CartAttribute } from "@/lib/cart/store";
import type { Product } from "@/lib/commerce/types";
import { whatsappHref } from "@/lib/format";
import { Badge, Magnet } from "./Badge";
import { CylinderPreview } from "./CylinderPreview";

const t = copy.personalise;
const W = 816;
const H = 1092;
const DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const noop = () => () => {};
const todayIso = () => iso(new Date());

type Photo = { preview: string; name: string; url?: string; status: "uploading" | "done" | "whatsapp" };

/**
 * A personalised product: a live preview on the left that redraws as the
 * customer types, chooses lettering and ink, picks a role or a colour, or
 * adds a photograph; the buy box on the right carries every choice into the
 * bag as line-item properties (and on to Shopify's order).
 */
export function PersonalisedProduct({
  product,
  header,
  details,
}: {
  product: Product;
  header: React.ReactNode;
  details: React.ReactNode;
}) {
  const p = product.personalise!;
  const [selected, setSelected] = useState(() => initialOptions(product));
  const [text, setText] = useState("");
  const [subtext, setSubtext] = useState("");
  const [lettering, setLettering] = useState<LetteringId>("Script");
  const [ink, setInk] = useState(p.inks?.[0]);
  const [role, setRole] = useState(p.roles?.[0] ?? "");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [neededBy, setNeededBy] = useState("");
  const [view, setView] = useState<"preview" | "photos">("preview");

  // Today is only known in the browser (pages are prerendered).
  const today = useSyncExternalStore(noop, todayIso, () => null);
  const earliest = today ? new Date(Date.parse(today) + (p.leadDays + 4) * DAY) : null;
  const tight = neededBy !== "" && earliest !== null && new Date(neededBy) < earliest;

  const family = LETTERING.find((l) => l.id === lettering)!.font.style.fontFamily;
  const shown = {
    text: text || p.text?.placeholder || "",
    subtext: subtext || p.subtext?.placeholder || "",
  };
  const finish = selected.Finish ?? selected.Frame ?? "";
  const swatch = product.variants.find((v) => v.selectedOptions.some((o) => o.value === finish))?.swatch ?? "#EFE8DC";

  const attributes: CartAttribute[] = useMemo(
    () => [
      ...(p.roles ? [{ key: copy.personalise.role, value: role }] : []),
      ...(p.text ? [{ key: p.text.label, value: text.trim() }] : []),
      ...(p.subtext ? [{ key: p.subtext.label, value: subtext.trim() }] : []),
      ...(p.lettering ? [{ key: t.lettering, value: lettering }] : []),
      ...(p.inks && ink ? [{ key: t.ink, value: ink.name }] : []),
      ...(photo ? [{ key: "Photo", value: photo.url ?? `To be sent on WhatsApp (${photo.name})` }] : []),
      ...(neededBy ? [{ key: t.neededBy, value: neededBy }] : []),
    ],
    [p, role, text, subtext, lettering, ink, photo, neededBy],
  );

  const validate = () => {
    if (p.text && !p.text.optional && !text.trim()) return t.missingText(p.text.label);
    if (p.subtext && !p.subtext.optional && !subtext.trim()) return t.missingText(p.subtext.label);
    if (p.photo && !photo) return t.missingPhoto;
    if (photo?.status === "uploading") return t.uploading;
    return null;
  };

  const choosePhoto = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setPhoto({ preview, name: file.name, status: "uploading" });
    setView("preview");
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = res.ok ? ((await res.json()) as { url?: string }) : {};
      setPhoto({ preview, name: file.name, url: data.url, status: data.url ? "done" : "whatsapp" });
    } catch {
      setPhoto({ preview, name: file.name, status: "whatsapp" });
    }
  };

  const field =
    "mt-3 h-12 w-full border border-line bg-transparent px-4 text-base outline-none transition-colors focus:border-ochre";

  return (
    <div className="gutter mx-auto grid max-w-[1600px] gap-10 pt-[calc(var(--header-h)+3rem)] md:grid-cols-[1.3fr_1fr] md:gap-16">
      {/* On phones the preview stays pinned above the fields, so the name appears as you type. */}
      <div
        className={clsx(
          "md:sticky md:top-24 md:self-start",
          view === "preview" &&
            "sticky top-16 z-20 -mx-[var(--gutter)] bg-bg px-[var(--gutter)] pb-2 md:mx-0 md:bg-transparent md:px-0 md:pb-0",
        )}
      >
        <div className="mb-3 flex gap-2" role="tablist">
          {(["preview", "photos"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={clsx(
                "label h-9 rounded-full border px-4 text-[10px] transition-colors",
                view === v ? "border-fg bg-fg text-bg" : "border-line text-fg-muted hover:text-fg",
              )}
            >
              {v === "preview" ? t.preview : t.photos}
            </button>
          ))}
        </div>
        {view === "photos" ? (
          <Gallery product={product} />
        ) : (
          <div className="relative mx-auto aspect-[3/4] max-h-[40svh] overflow-hidden bg-bg-raised md:max-h-none">
            <Preview
              kind={p.kind}
              text={shown.text}
              subtext={shown.subtext}
              family={family}
              ink={ink?.hex ?? "#C9A24E"}
              foil={Boolean(ink && /gold|foil/i.test(ink.name))}
              swatch={swatch}
              role={role}
              finish={finish}
              size={selected.Size}
              photo={photo?.preview}
              title={product.title}
            />
          </div>
        )}
        <p className="mt-3 hidden text-xs text-fg-muted md:block">{t.proofNote}</p>
      </div>

      <div className="md:self-start">
        {header}
        <div className="mt-8">
          <BuyBox
            product={product}
            selected={selected}
            onSelectedChange={setSelected}
            attributes={attributes}
            validate={validate}
          >
            <div className="mt-10 border-t border-line pt-8">
              <p className="label text-accent-text">{t.title}</p>

              {p.roles && (
                <label className="mt-6 block">
                  <span className="label text-fg-muted">{t.role}</span>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className={field}>
                    {p.roles.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
              )}

              {p.text && (
                <label className="mt-6 block">
                  <span className="label flex justify-between text-fg-muted">
                    <span>
                      {p.text.label}
                      {p.text.optional && " (optional)"}
                    </span>
                    <span aria-hidden>
                      {text.length}/{p.text.max}
                    </span>
                  </span>
                  <input
                    value={text}
                    maxLength={p.text.max}
                    placeholder={p.text.placeholder}
                    onChange={(e) => setText(e.target.value)}
                    className={field}
                  />
                </label>
              )}
              {p.subtext && (
                <label className="mt-6 block">
                  <span className="label text-fg-muted">
                    {p.subtext.label}
                    {p.subtext.optional && " (optional)"}
                  </span>
                  <input
                    value={subtext}
                    maxLength={p.subtext.max}
                    placeholder={p.subtext.placeholder}
                    onChange={(e) => setSubtext(e.target.value)}
                    className={field}
                  />
                </label>
              )}

              {p.lettering && (
                <fieldset className="mt-6">
                  <legend className="label text-fg-muted">{t.lettering}</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {LETTERING.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        aria-pressed={lettering === l.id}
                        onClick={() => setLettering(l.id)}
                        className={clsx(
                          "flex h-16 flex-col items-center justify-center border transition-colors",
                          lettering === l.id ? "border-ochre" : "border-line hover:border-current",
                        )}
                      >
                        <span className={clsx(l.font.className, "text-2xl leading-none")}>
                          {(text || p.text?.placeholder || "Aa").slice(0, 8)}
                        </span>
                        <span className="label mt-1 text-[9px] text-fg-muted">{l.id}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {p.inks && (
                <fieldset className="mt-6">
                  <legend className="label text-fg-muted">
                    {t.ink} <span className="ml-2 normal-case tracking-normal text-fg">{ink?.name}</span>
                  </legend>
                  <div className="mt-3 flex gap-2">
                    {p.inks.map((i) => (
                      <button
                        key={i.name}
                        type="button"
                        aria-label={i.name}
                        aria-pressed={ink?.name === i.name}
                        onClick={() => setInk(i)}
                        className={clsx(
                          "size-10 rounded-full border-2 p-0.5",
                          ink?.name === i.name ? "border-ochre" : "border-line",
                        )}
                      >
                        <span
                          className="block size-full rounded-full"
                          style={{
                            background: /gold|foil/i.test(i.name)
                              ? `linear-gradient(135deg, #f6e3a6, ${i.hex} 50%, #8f6a22)`
                              : i.hex,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {p.photo && (
                <div className="mt-6">
                  <span className="label text-fg-muted">{t.photo}</span>
                  <label className="mt-3 flex cursor-pointer items-center gap-4 border border-dashed border-line p-4 transition-colors hover:border-ochre">
                    {photo ? (
                      <span className="relative size-14 shrink-0 overflow-hidden bg-bg-raised">
                        <Image src={photo.preview} alt="" fill unoptimized className="object-cover" />
                      </span>
                    ) : (
                      <span
                        aria-hidden
                        className="grid size-14 shrink-0 place-items-center border border-line text-2xl"
                      >
                        +
                      </span>
                    )}
                    <span className="text-sm">
                      <span className="label block text-[10px]">{photo ? t.changePhoto : t.choosePhoto}</span>
                      <span className="mt-1 block text-fg-muted">
                        {photo?.status === "uploading"
                          ? t.uploading
                          : photo?.status === "done"
                            ? t.uploaded
                            : photo?.status === "whatsapp"
                              ? t.whatsappPhoto
                              : t.photoHint}
                      </span>
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => e.target.files?.[0] && choosePhoto(e.target.files[0])}
                    />
                  </label>
                </div>
              )}

              <label className="mt-6 block">
                <span className="label text-fg-muted">{t.neededBy} (optional)</span>
                <input
                  type="date"
                  value={neededBy}
                  min={today ? iso(new Date(Date.parse(today) + DAY)) : undefined}
                  onChange={(e) => setNeededBy(e.target.value)}
                  className={field}
                />
                <span className="mt-2 block text-xs text-fg-muted">{t.neededByHint(p.leadDays)}</span>
              </label>
              {tight && (
                <p className="mt-3 text-sm">
                  {t.tight}{" "}
                  <a
                    href={whatsappHref(`${t.whatsappHello(product.title)} I need it by ${neededBy}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-current"
                  >
                    WhatsApp
                  </a>
                </p>
              )}
            </div>
          </BuyBox>
        </div>

        {p.bulk && (
          <aside className="mt-10 border border-line p-6">
            <p className="font-display text-2xl">{t.bulkTitle}</p>
            <p className="mt-2 text-sm text-fg-muted">{t.bulkBody}</p>
            <a
              href={whatsappHref(t.whatsappHello(product.title))}
              target="_blank"
              rel="noopener noreferrer"
              className="label mt-5 inline-flex h-11 items-center border border-current/40 px-5 text-[10px] hover:border-current"
            >
              {t.bulkCta}
            </a>
          </aside>
        )}
        {details}
      </div>
    </div>
  );
}

function Preview(props: {
  kind: string;
  text: string;
  subtext: string;
  family: string;
  ink: string;
  foil: boolean;
  swatch: string;
  role: string;
  finish: string;
  size?: string;
  photo?: string;
  title: string;
}) {
  const { kind, text, subtext, family, ink, foil, swatch, role, finish, size, photo, title } = props;
  const serif = bodoni.style.fontFamily;
  const sans = jost.style.fontFamily;
  const alt = `${title} preview: ${text}`;
  const foilText = foil
    ? {
        backgroundImage: `linear-gradient(180deg, #f8e7b0, ${ink} 48%, #8f6a22 56%, #e9cf86)`,
        WebkitBackgroundClip: "text",
        color: "transparent",
      }
    : { color: ink };

  switch (kind) {
    case "tumbler":
      return (
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_45%,#fbf7ef,#efe7da)]">
          <CylinderPreview
            src="/personalise/tumbler.webp"
            width={W}
            height={H}
            tint={swatch === "#EFE8DC" ? undefined : swatch}
            text={text}
            fontFamily={family}
            ink={ink}
            foil={foil}
            box={{ cx: 0.471, cy: 0.42, w: 0.3, h: 0.12 }}
            alt={alt}
          />
        </div>
      );
    case "glass":
      return (
        <CylinderPreview
          src="/personalise/glass.webp"
          width={W}
          height={H}
          text={text}
          fontFamily={family}
          ink={ink}
          foil={foil}
          box={{ cx: 0.49, cy: 0.6, w: 0.5, h: 0.12 }}
          bow={0.12}
          opacity={0.92}
          alt={alt}
        />
      );
    case "coasters":
    case "tray": {
      const spots =
        kind === "coasters"
          ? [
              [0.295, 0.38],
              [0.68, 0.38],
              [0.29, 0.66],
              [0.69, 0.66],
            ]
          : [[0.5, 0.48]];
      return (
        <div className="absolute inset-0 @container">
          <Image
            src={`/personalise/${kind}.webp`}
            alt={alt}
            fill
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
          {spots.map(([x, y], i) => (
            <span
              key={i}
              aria-hidden
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center leading-none whitespace-nowrap"
              style={{
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                fontFamily: family,
                fontSize:
                  kind === "coasters"
                    ? `${Math.min(11, 44 / Math.max(2, text.length))}cqw`
                    : `${Math.min(9, 80 / Math.max(6, text.length))}cqw`,
                mixBlendMode: foil ? "normal" : "multiply",
                textShadow: foil ? "0 1px 0 rgb(0 0 0 / 0.12)" : undefined,
                ...foilText,
              }}
            >
              {text}
              {kind === "tray" && subtext && (
                <span className="mt-[1.2cqw] block text-[2.2cqw] tracking-[0.3em]" style={{ fontFamily: serif }}>
                  EST. {subtext}
                </span>
              )}
            </span>
          ))}
        </div>
      );
    }
    case "badge":
      return (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(70%_60%_at_50%_40%,#fbf3ee,#ecd9d2)] p-[14%]">
          <Badge role={role} name={text} ribbon={swatch} script={LETTERING[0].font.style.fontFamily} serif={serif} />
        </div>
      );
    case "badge-set":
      return (
        <div className="absolute inset-0 grid grid-cols-3 content-center gap-x-[4%] gap-y-[6%] bg-[radial-gradient(70%_60%_at_50%_40%,#fbf3ee,#ecd9d2)] p-[8%]">
          {["Bride", "Groom", "Bridesmaid", "Groomsman", "Cousin", "Family"].map((r) => (
            <Badge
              key={r}
              role={r}
              ribbon={swatch}
              script={LETTERING[0].font.style.fontFamily}
              serif={serif}
              small={text || undefined}
            />
          ))}
        </div>
      );
    case "magnet-set":
      return (
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,#fbf5ea,#eadcc4)]">
          <div className="absolute left-[8%] top-[10%] w-[34%] rotate-[-8deg] opacity-90">
            <Magnet
              names={text}
              date={subtext}
              design={finish}
              script={LETTERING[0].font.style.fontFamily}
              serif={serif}
            />
          </div>
          <div className="absolute right-[6%] top-[56%] w-[30%] rotate-[10deg] opacity-90">
            <Magnet
              names={text}
              date={subtext}
              design={finish}
              script={LETTERING[0].font.style.fontFamily}
              serif={serif}
            />
          </div>
          <div className="absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2">
            <Magnet
              names={text}
              date={subtext}
              design={finish}
              script={LETTERING[0].font.style.fontFamily}
              serif={serif}
            />
          </div>
        </div>
      );
    case "magnet":
      return (
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#e9e9e6,#f7f7f4_45%,#dcdcd8)]">
          <div className="absolute right-[6%] top-[18%] h-[42%] w-[3%] rounded-full bg-[linear-gradient(90deg,#c9c9c4,#f2f2ee,#b9b9b4)] shadow-md" />
          <figure className="absolute left-1/2 top-1/2 w-[56%] -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] rounded-[6px] bg-[#fdfbf6] p-[3.5%] pb-[4%] shadow-[0_18px_30px_-12px_rgb(0_0_0/0.4)] ring-1 ring-[#c9a24e]/60">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-[#e9e2d6]">
              {photo ? (
                <Image src={photo} alt={alt} fill unoptimized className="object-cover" />
              ) : (
                <span className="font-display absolute inset-0 grid place-items-center px-6 text-center text-[#8a7458] italic">
                  {copy.personalise.choosePhoto}
                </span>
              )}
            </div>
            {text && (
              <figcaption
                className="mt-[4%] text-center text-[#5a4630]"
                style={{ fontFamily: family, fontSize: "clamp(14px, 2.2vw, 26px)" }}
              >
                {text}
              </figcaption>
            )}
          </figure>
        </div>
      );
    case "frame": {
      const frameBg = /black/i.test(finish)
        ? "linear-gradient(135deg,#2b2623,#14110f)"
        : /gold/i.test(finish)
          ? "linear-gradient(135deg,#efd58f,#b8913f 45%,#8a6a26 60%,#e2c477)"
          : "linear-gradient(135deg,#d9b88f,#b58c5e 50%,#caa577)";
      // Height, to true proportion: A1 is twice A3 on each side (A3 0.5 : A2 0.71 : A1 1).
      const height = size === "A1" ? 84 : size === "A2" ? 64 : 46;
      return (
        <div className="art-wall absolute inset-0 grid place-items-center">
          <div
            className="relative aspect-[1/1.414] p-[1.6%] shadow-[0_30px_50px_-20px_rgb(42_29_21/0.55)] transition-[height] duration-700 ease-silk"
            style={{ height: `${height}%`, background: frameBg }}
          >
            <div className="size-full bg-[#fbf9f4] p-[12%] shadow-[inset_0_2px_6px_rgb(0_0_0/0.18)]">
              <div className="relative size-full overflow-hidden bg-[#ece5d8] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]">
                {photo ? (
                  <Image src={photo} alt={alt} fill unoptimized className="object-cover" />
                ) : (
                  <span className="font-display absolute inset-0 grid place-items-center px-4 text-center text-sm text-[#8a7458] italic">
                    {copy.personalise.choosePhoto}
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className="label absolute bottom-[5%] text-[10px] text-fg-muted" style={{ fontFamily: sans }}>
            {size} · {finish}
          </span>
        </div>
      );
    }
    default:
      return null;
  }
}
