"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Mucho más responsivo al trackpad de laptop
      wheelMultiplier: 1,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    } as any); // cast to any si cambian los tipos de lenis

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
