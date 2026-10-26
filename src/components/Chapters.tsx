import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { chapterCovers } from "@/content/photos";
import { disciplines } from "@/content/site";

/** Pinned horizontal ride through the five disciplines (desktop); swipeable rail on touch. */
export function Chapters() {
  return (
    <section id="chapters" className="chapters" data-hscroll aria-labelledby="chapters-title">
      <div className="chapters__sticky">
        <div className="chapters__head container">
          <div>
            <p className="kicker">
              <span>03</span> Chapters
            </p>
            <h2 id="chapters-title" className="section-title">
              Five ways we tell a ride
            </h2>
          </div>
          <div className="chapters__progress" aria-hidden="true">
            <span data-hscroll-bar />
          </div>
        </div>

        <ol className="chapters__track" data-hscroll-track>
          {disciplines.map((d, i) => {
            const cover = chapterCovers[d.id];
            return (
              <li className="chapter" key={d.id}>
                <div className="chapter__img">
                  <Image src={cover.src} alt={cover.alt} quality={70} sizes="(min-width: 900px) 34vw, 80vw" />
                </div>
                <div className="chapter__body">
                  <span className="chapter__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{d.title}</h3>
                  <p>{d.blurb}</p>
                </div>
              </li>
            );
          })}
          <li className="chapter chapter--cta">
            <a href="#contact" data-cursor="Ride">
              <span>Your ride, next chapter</span>
              <ArrowUpRight size={56} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
}
