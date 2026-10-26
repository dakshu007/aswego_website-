import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero } from "@/content/photos";
import { site } from "@/content/site";
import { HeroGL } from "./HeroGL";

export function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Image
          src={hero.src}
          alt={hero.alt}
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          quality={70}
          className="hero__img"
          data-hero-img
        />
        <div className="hero__gl" data-hero-gl aria-hidden="true" />
        <div className="hero__shade" aria-hidden="true" />
      </div>

      <div className="hero__inner container">
        <p className="eyebrow hero__eyebrow">
          <span className="pulse" aria-hidden="true" />
          Motorsport &amp; lifestyle photography — {site.location.region}, {site.location.country}
        </p>
        <h1 id="hero-title" className="hero__title display">
          <span className="line">
            <span>Every ride</span>
          </span>
          <span className="line">
            <span>
              writes a story<span className="red">.</span>
            </span>
          </span>
        </h1>
        <div className="hero__foot">
          <p className="hero__lede">
            Motocross, supercross, machines and the people who ride them, shot between speed, dirt and
            everyday life.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--red" href="#contact">
              Book a shoot <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className="btn btn--ghost" href="#work">
              View the work <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="hero__meta container" aria-hidden="true">
        <span>@{site.handle}</span>
        <span className="scrollcue">
          Scroll <i />
        </span>
      </div>
      <HeroGL />
    </section>
  );
}
