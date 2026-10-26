"use client";

import { useEffect, useRef } from "react";

/** Red dot + trailing ring on fine pointers; grows with a label over [data-cursor]. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    const label = r.querySelector("span")!;
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      document.documentElement.classList.add("has-cursor");
      const target = (e.target as Element).closest?.("[data-cursor]");
      const text = target?.getAttribute("data-cursor") ?? "";
      r.classList.toggle("is-label", Boolean(text));
      label.textContent = text;
      r.classList.toggle("is-link", !text && Boolean((e.target as Element).closest?.("a, button, summary, label")));
    };
    const leave = () => document.documentElement.classList.remove("has-cursor");
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__dot" ref={dot} />
      <div className="cursor__ring" ref={ring}>
        <span />
      </div>
    </div>
  );
}
