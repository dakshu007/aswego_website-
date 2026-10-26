import type { CSSProperties } from "react";

const text =
  "We chase the split second between throttle and gravity: the roost of red earth, the hush before the gate drops, the grin under a dusty helmet. As We Go is a photography studio for riders, races, machines and the people around them, shot between speed, dirt and everyday life.";
const accents = new Set(["speed,", "dirt", "everyday", "life."]);

export function Manifesto() {
  const words = text.split(" ");
  return (
    <section className="manifesto section" aria-labelledby="manifesto-title">
      <div className="container">
        <h2 id="manifesto-title" className="kicker">
          <span>01</span> Manifesto
        </h2>
        <p className="manifesto__text" data-words>
          {words.map((w, i) => (
            <span
              key={i}
              className={accents.has(w) ? "w w--accent" : "w"}
              style={{ "--i": (i / words.length).toFixed(3) } as CSSProperties}
            >
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
