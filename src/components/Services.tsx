import { services } from "@/content/site";
import { iconMap } from "./icons";

export function Services() {
  return (
    <section className="services section" aria-labelledby="services-title">
      <div className="container services__grid">
        <div className="services__intro">
          <p className="kicker">
            <span>04</span> Services
          </p>
          <h2 id="services-title" className="section-title">
            What we shoot
          </h2>
          <p className="muted">
            One crew for the stills and the reels: race weekends, launches, portraits and the everyday moments
            in between.
          </p>
        </div>
        <ul className="services__list">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon];
            return (
              <li className="service" key={s.title} data-reveal>
                <span className="service__icon">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="service__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
