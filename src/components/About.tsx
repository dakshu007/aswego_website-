import { Camera, MapPin, Route } from "lucide-react";
import logo from "@/assets/brand/logo-mark.svg";
import { site } from "@/content/site";

export function About() {
  return (
    <section id="about" className="about section" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__mark" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG */}
          <img src={logo.src} alt="As We Go logo" width={255} height={485} loading="lazy" />
        </div>
        <div className="about__copy">
          <p className="kicker">
            <span>06</span> About
          </p>
          <h2 id="about-title" className="section-title">
            A motorsport photographer in {site.location.region}, shooting <em>as we go</em>
          </h2>
          <p>
            As We Go started trackside, with mud on the lens and a habit of standing too close to the berm.
            Today it is a motorsport and lifestyle photography studio that covers motocross and supercross
            racing, motorcycle launches, rider portraits and brand events.
          </p>
          <p className="muted">
            We don&apos;t stage the story. We ride along with it, reading the light, the line and the people,
            and we deliver frames and reels that feel like you were there.
          </p>
          <ul className="about__facts">
            <li>
              <MapPin size={18} aria-hidden="true" /> Based in {site.location.region}, {site.location.country}
            </li>
            <li>
              <Route size={18} aria-hidden="true" /> Travels across India
            </li>
            <li>
              <Camera size={18} aria-hidden="true" /> Stills + reels
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
