"use client";

import { useEffect } from "react";

const triggers = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;

function hasWebGL() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

/**
 * Upgrades the static hero photo to a Three.js scene. Three.js is only fetched after
 * the visitor's first interaction, so the photo stays the fast LCP element and the
 * main thread is free during load. Skipped for reduced motion and Save-Data.
 */
export function HeroGL() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    const start = () => {
      triggers.forEach((t) => window.removeEventListener(t, start));
      const container = document.querySelector<HTMLElement>("[data-hero-gl]");
      const img = document.querySelector<HTMLImageElement>("[data-hero-img]");
      if (!container || !img || !hasWebGL()) return;
      import("./hero-scene").then(({ mountHero }) => {
        if (!cancelled) dispose = mountHero(container, img);
      });
    };

    triggers.forEach((t) => window.addEventListener(t, start, { passive: true }));
    return () => {
      cancelled = true;
      triggers.forEach((t) => window.removeEventListener(t, start));
      dispose?.();
    };
  }, []);

  return null;
}
