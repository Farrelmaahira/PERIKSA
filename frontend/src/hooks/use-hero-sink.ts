import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* The hero is sticky and the content sheet slides over it; while that happens the hero text drifts up and fades. */
export function useHeroSink() {
  useLayoutEffect(() => {
    // Guard: bail out silently if the hero section is not on this page
    const heroGrid = document.querySelector(".page-hero-grid, .hero-grid-inner");
    const sheet = document.querySelector(".home-content-sheet");
    if (!heroGrid || !sheet) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(heroGrid, {
        yPercent: -10,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: sheet, start: "top bottom", end: "top 25%", scrub: true },
      });
    });
    return () => mm.revert();
  }, []);
}
