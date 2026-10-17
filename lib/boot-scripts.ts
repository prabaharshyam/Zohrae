/**
 * Tiny scripts inlined in <head> that run before first paint. They live in a
 * plain (server-safe) module so the layout receives the actual strings;
 * exporting them from a "use client" file would hand the server a reference
 * instead and break them.
 */
export const LIGHT_STORAGE_KEY = "zohrae:light";
export const INTRO_KEY = "zohrae:intro";

/** Applies a saved "lights on" (and dimmer) before paint; mirrors apply() in lib/light/store.ts. */
export const LIGHT_BOOT_SCRIPT = `try{var s=JSON.parse(localStorage.getItem("${LIGHT_STORAGE_KEY}")||"null");if(s&&s.on){document.documentElement.dataset.lights="on"}if(s&&s.dim){document.documentElement.style.setProperty("--dim",String(Math.min(1,Math.max(.1,+s.dim))))}}catch(e){}`;

/** Hides the first-visit intro for returning visitors (this browser session). */
export const INTRO_BOOT_SCRIPT = `try{if(sessionStorage.getItem("${INTRO_KEY}"))document.documentElement.classList.add("intro-seen")}catch(e){}`;
