const items = ["Motocross", "Supercross", "Machines", "Rider portraits", "Events", "Reels", "Everyday life"];

/** Decorative ticker; the same disciplines are listed accessibly in Services. */
export function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" data-marquee>
        {[0, 1].map((copy) => (
          <div className="marquee__group" key={copy}>
            {items.map((item) => (
              <span className="marquee__item" key={item}>
                {item}
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
