"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, House, Images, LayoutGrid, MessageCircle, UserRound } from "lucide-react";
import { nav, site } from "@/content/site";

const dock = [
  { href: "#top", label: "Home", Icon: House },
  { href: "#work", label: "Work", Icon: Images },
  { href: "#chapters", label: "Chapters", Icon: LayoutGrid },
  { href: "#about", label: "About", Icon: UserRound },
  { href: "#contact", label: "Book", Icon: MessageCircle },
];

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#top");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 320);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ids = ["top", "work", "chapters", "about", "faq", "contact"];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <header className={`nav${hidden ? " is-hidden" : ""}${scrolled ? " is-scrolled" : ""}`}>
        <div className="nav__bar container">
          <a href="#top" className="nav__brand" aria-label={`${site.name} — back to top`}>
            <span className="nav__mark" aria-hidden="true" />
            <span className="nav__word">As We Go</span>
          </a>
          <nav aria-label="Primary" className="nav__links">
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} aria-current={active === n.href ? "true" : undefined}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn--red btn--sm nav__cta" href="#contact">
            Book a shoot <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <nav aria-label="Quick navigation" className="dock">
        <ul>
          {dock.map(({ href, label, Icon }) => (
            <li key={href}>
              <a href={href} aria-current={active === href ? "true" : undefined}>
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
