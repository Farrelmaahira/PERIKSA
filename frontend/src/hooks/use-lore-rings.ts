import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Lore section: rings grow and the big number counts up, both tied to scroll position. */
export function useLoreRings() {
  useLayoutEffect(() => {
    // Guard: bail out silently if the lore section is not on this page
    const loreTrigger = document.querySelector(".lore-rings-center");
    if (!loreTrigger) return;

    const rings = document.querySelectorAll(".lore-rings-center .ring");
    const bigFigure = document.querySelector(".lore-rings-center .lore-big-number");
    if (!rings.length && !bigFigure) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: loreTrigger, start: "top 85%", end: "center 55%", scrub: 0.6 },
      });

      if (rings.length) {
        tl.from(rings, { scale: 0.4, opacity: 0, stagger: 0.1 }, 0);
      }
      if (bigFigure) {
        tl.from(bigFigure, { textContent: 0, snap: { textContent: 1 } }, 0);
      }
    });
    return () => mm.revert();
  }, []);
}
