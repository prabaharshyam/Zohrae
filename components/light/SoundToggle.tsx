"use client";

import { copy } from "@/copy/en";
import { light, useLight } from "@/lib/light/store";

/** Footer control for the light switch's click sound (off by default). */
export function SoundToggle() {
  const { sound } = useLight();
  return (
    <button
      type="button"
      aria-pressed={sound}
      onClick={() => light.setSound(!sound)}
      className="hover:text-accent-text"
    >
      {sound ? copy.light.soundOn : copy.light.soundOff}
    </button>
  );
}
