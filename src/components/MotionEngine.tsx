"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

declare global {
  interface Window {
    /** Smoothed scroll velocity (-1..1), shared with the hero WebGL scene. */
    __awgVelocity?: number;
  }
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * One rAF loop drives every scroll effect on the page (smooth scroll, reveals,
 * parallax, the pinned horizontal Chapters rail, word-by-word manifesto and the
 * velocity-reactive marquee). Everything is progressive: without JS or with
 * reduced motion the page is fully readable and static.
 */
export function MotionEngine() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Sections below the fold use content-visibility:auto with estimated heights. Before any
    // in-page jump (nav, dock, footer, agents), render them for real so targets measure true.
    const renderAll = () => root.classList.add("cv-off");
    const onAnchor = (e: Event) => {
      if ((e.target as Element).closest?.('a[href^="#"]')) renderAll();
    };
    document.addEventListener("click", onAnchor, true);
    window.addEventListener("awg:render-all", renderAll);

    // --- Reveal on scroll -------------------------------------------------
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const armReveals = () =>
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    armReveals();

    if (reduce) {
      root.classList.add("reduced");
      window.addEventListener("awg:content", armReveals);
      return () => {
        io.disconnect();
        window.removeEventListener("awg:content", armReveals);
        document.removeEventListener("click", onAnchor, true);
        window.removeEventListener("awg:render-all", renderAll);
      };
    }

    // --- Visible-set tracking for per-frame work -----------------------------
    const visible = new Set<Element>();
    const vis = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
      },
      { rootMargin: "20% 0px" },
    );
    let parallax: HTMLElement[] = [];
    const armParallax = () => {
      parallax.forEach((el) => vis.unobserve(el));
      parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
      parallax.forEach((el) => vis.observe(el));
    };
    const onContent = () => {
      armReveals();
      armParallax();
    };
    armParallax();
    window.addEventListener("awg:content", onContent);

    const words = document.querySelector<HTMLElement>("[data-words]");
    if (words) {
      words.style.setProperty("--p", "0");
      vis.observe(words);
    }

    // --- Horizontal Chapters rail -------------------------------------------
    const hs = document.querySelector<HTMLElement>("[data-hscroll]");
    const track = hs?.querySelector<HTMLElement>("[data-hscroll-track]");
    const bar = hs?.querySelector<HTMLElement>("[data-hscroll-bar]");
    const wide = window.matchMedia("(min-width: 900px)");
    let hsDistance = 0;
    const layoutRail = () => {
      if (!hs || !track) return;
      if (!wide.matches) {
        hs.style.height = "";
        track.style.transform = "";
        hsDistance = 0;
        return;
      }
      hsDistance = Math.max(0, track.scrollWidth - window.innerWidth);
      hs.style.height = `${window.innerHeight + hsDistance}px`;
    };
    layoutRail();
    if (hs) vis.observe(hs);
    // The rail renders lazily (content-visibility), so re-measure whenever its width changes.
    const railRO = new ResizeObserver(layoutRail);
    if (track) railRO.observe(track);
    window.addEventListener("resize", layoutRail);
    wide.addEventListener("change", layoutRail);

    // --- Marquee speed follows scroll velocity -------------------------------
    const marquee = document.querySelector<HTMLElement>("[data-marquee]");
    const marqueeAnim = () => marquee?.getAnimations()[0];

    // --- Smooth scroll ------------------------------------------------------
    let lenis: Lenis | null = null;
    let raf = 0;
    let velocity = 0;
    let lastVelocity = 0;
    let cancelled = false;

    const onLock = (e: Event) => {
      const locked = (e as CustomEvent<boolean>).detail;
      if (locked) lenis?.stop();
      else lenis?.start();
    };
    window.addEventListener("awg:scroll-lock", onLock);

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({ lerp: 0.09, anchors: { offset: 0 }, autoRaf: false });
    });

    const frame = (t: number) => {
      lenis?.raf(t);
      const vh = window.innerHeight;
      const v = lenis ? clamp(lenis.velocity / 40, -1, 1) : 0;
      velocity += (v - velocity) * 0.12;
      if (Math.abs(velocity) < 0.001) velocity = 0;
      window.__awgVelocity = velocity;
      if (velocity !== lastVelocity) {
        lastVelocity = velocity;
        marquee?.parentElement?.style.setProperty("--v", velocity.toFixed(3));
        const anim = marqueeAnim();
        if (anim) anim.playbackRate = 1 + Math.abs(velocity) * 5;
      }

      for (const el of parallax) {
        if (!visible.has(el)) continue;
        const r = el.getBoundingClientRect();
        const p = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1); // -1..1 around centre
        el.style.transform = `translate3d(0, ${(p * -5).toFixed(2)}%, 0) scale(1.14)`;
      }

      if (words && visible.has(words)) {
        const r = words.getBoundingClientRect();
        const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
        words.style.setProperty("--p", p.toFixed(3));
      }

      if (hs && track && hsDistance > 0 && visible.has(hs)) {
        const r = hs.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - vh), 0, 1);
        track.style.transform = `translate3d(${(-p * hsDistance).toFixed(1)}px, 0, 0)`;
        bar?.style.setProperty("transform", `scaleX(${p.toFixed(3)})`);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      io.disconnect();
      vis.disconnect();
      railRO.disconnect();
      window.removeEventListener("awg:content", onContent);
      window.removeEventListener("awg:scroll-lock", onLock);
      document.removeEventListener("click", onAnchor, true);
      window.removeEventListener("awg:render-all", renderAll);
      window.removeEventListener("resize", layoutRail);
      wide.removeEventListener("change", layoutRail);
    };
  }, []);

  return null;
}
