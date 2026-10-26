import { Plus } from "lucide-react";
import { faqs } from "@/content/site";

export function Faq() {
  return (
    <section id="faq" className="faq section" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div>
          <p className="kicker">
            <span>07</span> FAQ
          </p>
          <h2 id="faq-title" className="section-title">
            Good to know
          </h2>
        </div>
        <div className="faq__list">
          {faqs.map((f, i) => (
            <details className="faq__item" key={f.q} name="faq" open={i === 0}>
              <summary>
                <h3>{f.q}</h3>
                <Plus className="faq__icon" size={22} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
