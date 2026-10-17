"use client";

import { useState } from "react";
import { copy } from "@/copy/en";
import { whatsappHref } from "@/lib/format";

const t = copy.contactPage;

/** A short note that opens WhatsApp ready to send: nothing is stored on our side. */
export function ContactForm() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState<string>(t.topics[0]);
  const [message, setMessage] = useState("");
  const field =
    "mt-3 w-full border border-line bg-transparent px-4 py-3 outline-none transition-colors focus:border-ochre";
  return (
    <form
      className="border border-line p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const text = `Hello Zohraé! I'm ${name || "a visitor"}. About: ${topic}.\n\n${message}`;
        window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
      }}
    >
      <h2 className="font-display text-[length:var(--fs-h3)]">{t.formTitle}</h2>
      <label className="mt-6 block">
        <span className="label text-fg-muted">{t.name}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} />
      </label>
      <label className="mt-6 block">
        <span className="label text-fg-muted">{t.topic}</span>
        <select value={topic} onChange={(e) => setTopic(e.target.value)} className={field}>
          {t.topics.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="mt-6 block">
        <span className="label text-fg-muted">{t.message}</span>
        <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={field} />
      </label>
      <button type="submit" data-magnetic className="label mt-8 h-14 w-full bg-ochre text-espresso">
        {t.send}
      </button>
      <p className="mt-3 text-xs text-fg-muted">{t.sendHint}</p>
    </form>
  );
}
