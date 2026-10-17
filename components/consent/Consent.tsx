"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { copy } from "@/copy/en";
import { analyticsConfigured } from "@/lib/analytics";

const KEY = "zohrae:consent";
const GA = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
type Choice = "granted" | "denied" | null;

function readChoice(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}
const listeners = new Set<() => void>();
const store = {
  subscribe: (l: () => void) => (listeners.add(l), () => listeners.delete(l)),
  set(v: Exclude<Choice, null>) {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      // Not persisted: ask again next visit.
    }
    listeners.forEach((l) => l());
  },
};

let loaded = false;
function load() {
  if (loaded) return;
  loaded = true;
  if (GA) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
    document.head.appendChild(s);
    const w = window as unknown as { dataLayer: unknown[] };
    w.dataLayer = w.dataLayer || [];
    window.gtag = function gtag() {
      // GA's loader reads the arguments object itself.
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA, { anonymize_ip: true });
  }
  if (PIXEL) {
    type Fbq = ((...a: unknown[]) => void) & {
      queue: unknown[];
      callMethod?: (...a: unknown[]) => void;
      loaded?: boolean;
      version?: string;
      push?: unknown;
    };
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.push = fbq;
    window.fbq = fbq;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    window.fbq("init", PIXEL);
    window.fbq("track", "PageView");
  }
}

/**
 * Cookie consent: a quiet bar, shown only when analytics are configured.
 * GA4 and the Meta Pixel load only after "Accept"; "Essential only" keeps
 * the site exactly as it is. "Cookie settings" in the footer reopens it.
 */
export function Consent() {
  const choice = useSyncExternalStore(store.subscribe, readChoice, () => "denied" as Choice);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    if (choice === "granted") load();
  }, [choice]);
  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener("zohrae:consent", open);
    return () => window.removeEventListener("zohrae:consent", open);
  }, []);

  if (!analyticsConfigured || (choice !== null && !reopened)) return null;
  const t = copy.consent;
  const decide = (v: "granted" | "denied") => {
    store.set(v);
    setReopened(false);
  };
  return (
    <div
      role="dialog"
      aria-label={t.title}
      className="fixed inset-x-3 bottom-3 z-[72] mx-auto max-w-xl border border-line bg-bg/95 p-5 text-fg shadow-[0_20px_50px_-20px_rgb(0_0_0/0.4)] md:bottom-6"
    >
      <p className="font-display text-xl">{t.title}</p>
      <p className="mt-2 text-sm text-fg-muted">{t.body}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => decide("granted")}
          className="label h-11 bg-ochre px-6 text-[10px] text-espresso"
        >
          {t.accept}
        </button>
        <button
          type="button"
          onClick={() => decide("denied")}
          className="label h-11 border border-line px-6 text-[10px]"
        >
          {t.essential}
        </button>
        <a href="/privacy" className="label ml-auto self-center text-[10px] text-fg-muted underline">
          {t.more}
        </a>
      </div>
    </div>
  );
}

/** Footer link that reopens the consent choice. */
export function CookieSettings() {
  if (!analyticsConfigured) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("zohrae:consent"))} className="hover:text-fg">
      {copy.consent.settings}
    </button>
  );
}
