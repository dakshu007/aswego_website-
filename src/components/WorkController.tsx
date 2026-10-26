"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { photos } from "@/content/photos";
import { disciplines } from "@/content/site";

const labels = Object.fromEntries(disciplines.map((d) => [d.id, d.title])) as Record<string, string>;

/** Filtering + full-screen viewer for the server-rendered Work grid. */
export function WorkController({ layout }: { layout: string[] }) {
  const [visible, setVisible] = useState<number[]>(() => photos.map((_, i) => i));
  const [open, setOpen] = useState<number | null>(null); // index into `visible`
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const visibleRef = useRef(visible);
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + visible.length) % visible.length)),
    [visible.length],
  );

  // Delegate clicks from the static markup.
  useEffect(() => {
    const filters = document.querySelector<HTMLElement>("[data-filters]");
    const grid = document.querySelector<HTMLElement>("[data-work-grid]");
    if (!filters || !grid) return;
    const items = Array.from(grid.children) as HTMLElement[];

    const onFilter = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>("[data-filter]");
      if (!btn) return;
      const f = btn.dataset.filter;
      filters.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      const shown: number[] = [];
      items.forEach((li, i) => {
        const match = f === "all" || li.dataset.discipline === f;
        li.hidden = !match;
        if (match) {
          li.style.gridColumn = layout[shown.length % layout.length];
          li.classList.remove("is-in");
          shown.push(i);
        }
      });
      setVisible(shown);
      window.dispatchEvent(new Event("awg:content"));
    };
    const onOpen = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>("[data-photo]");
      if (!btn) return;
      setOpen(Math.max(0, visibleRef.current.indexOf(Number(btn.dataset.photo))));
    };
    filters.addEventListener("click", onFilter);
    grid.addEventListener("click", onOpen);
    return () => {
      filters.removeEventListener("click", onFilter);
      grid.removeEventListener("click", onOpen);
    };
  }, [layout]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open !== null && !dialog.open) {
      dialog.showModal();
      window.dispatchEvent(new CustomEvent("awg:scroll-lock", { detail: true }));
    } else if (open === null && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const current = open === null ? null : photos[visible[open]];

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={current ? `${current.title} — full screen` : "Photo viewer"}
      onClose={() => {
        setOpen(null);
        window.dispatchEvent(new CustomEvent("awg:scroll-lock", { detail: false }));
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(null);
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {current && (
        <div className="lightbox__inner">
          <figure className="lightbox__figure" key={current.id}>
            <Image src={current.src} alt={current.alt} sizes="100vw" quality={75} />
            <figcaption>
              <span className="work__num">
                {String((open ?? 0) + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
              </span>
              <strong>{current.title}</strong>
              <span>
                {labels[current.discipline]} · {current.place} · {current.year}
              </span>
            </figcaption>
          </figure>
          <div className="lightbox__ctrls">
            <button type="button" className="icon-btn" onClick={() => step(-1)} aria-label="Previous photo">
              <ArrowLeft aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn" onClick={() => step(1)} aria-label="Next photo">
              <ArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--red"
              onClick={() => setOpen(null)}
              aria-label="Close viewer"
              autoFocus
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
