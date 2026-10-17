"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register once, client-side. Import gsap and its plugins from here everywhere.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export { gsap, ScrollTrigger, SplitText };
