import { steps } from "@/content/site";
import { iconMap } from "./icons";

export function Process() {
  return (
    <section className="process section" aria-labelledby="process-title">
      <div className="container">
        <div className="section-head">
          <p className="kicker">
            <span>05</span> How it works
          </p>
          <h2 id="process-title" className="section-title">
            From DM to <em>delivered</em>
          </h2>
        </div>
        <ol className="process__list">
          {steps.map((p, i) => {
            const Icon = iconMap[p.icon];
            return (
              <li className="step" key={p.title} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="step__top">
                  <span className="step__num">Step {i + 1}</span>
                  <Icon size={26} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
