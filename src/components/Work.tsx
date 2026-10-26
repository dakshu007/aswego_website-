import Image from "next/image";
import { photos } from "@/content/photos";
import { disciplines } from "@/content/site";
import { WorkController } from "./WorkController";

const labels = Object.fromEntries(disciplines.map((d) => [d.id, d.title])) as Record<string, string>;

/** Editorial 12-col rhythm, repeated every six frames (desktop only; mobile stacks). */
export const workLayout = ["1 / 8", "9 / 13", "2 / 7", "8 / 13", "1 / 6", "7 / 12"];

/**
 * Server-rendered gallery (zero hydration cost). WorkController adds filtering and the
 * full-screen viewer on top of this markup.
 */
export function Work() {
  const counts: Record<string, number> = { all: photos.length };
  for (const p of photos) counts[p.discipline] = (counts[p.discipline] ?? 0) + 1;

  return (
    <section id="work" className="work section" aria-labelledby="work-title">
      <div className="container">
        <div className="section-head">
          <p className="kicker">
            <span>02</span> Selected work
          </p>
          <h2 id="work-title" className="section-title">
            Frames from the <em>dirt</em>, the road &amp; the in-between
          </h2>
        </div>

        <div className="filters" role="group" aria-label="Filter work by discipline" data-filters>
          {["all", ...disciplines.map((d) => d.id)].map((f) => (
            <button key={f} type="button" className="chip" aria-pressed={f === "all"} data-filter={f}>
              {f === "all" ? "All" : labels[f]}
              <sup>{counts[f] ?? 0}</sup>
            </button>
          ))}
        </div>

        <ul className="work__grid" data-work-grid>
          {photos.map((p, i) => (
            <li
              key={p.id}
              id={`photo-${p.id}`}
              className="work__item"
              style={{ gridColumn: workLayout[i % workLayout.length] }}
              data-discipline={p.discipline}
              data-reveal
            >
              <button
                type="button"
                className="work__btn"
                data-cursor="View"
                data-photo={i}
                aria-label={`Open “${p.title}” full screen`}
              >
                <span className="work__frame">
                  <span className="work__img" data-parallax>
                    <Image src={p.src} alt={p.alt} quality={70} sizes="(min-width: 900px) 46vw, 92vw" />
                  </span>
                </span>
              </button>
              <div className="work__cap">
                <span className="work__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{p.title}</h3>
                <span className="work__meta">
                  {labels[p.discipline]} · {p.place}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <WorkController layout={workLayout} />
    </section>
  );
}
