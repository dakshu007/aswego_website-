import { ArrowUp } from "lucide-react";
import { basePath, nav, site } from "@/content/site";
import { InstagramIcon } from "./icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <p className="footer__tag">
            {site.tagline}
            <br />
            <span className="muted">{site.bio}</span>
          </p>
          <nav aria-label="Footer">
            <ul className="footer__links">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer me">
                  <InstagramIcon size={16} /> Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>
        {/* Decorative wordmark (a graphic, not body text). */}
        <svg className="footer__word" viewBox="0 0 1000 150" aria-hidden="true" focusable="false">
          <text x="500" y="128" textAnchor="middle" fontSize="150" textLength="1000" lengthAdjust="spacing">
            AS WE GO
          </text>
        </svg>
        <div className="footer__bottom">
          <small>
            © {new Date().getFullYear()} {site.name}. All photographs are the property of {site.name}.
          </small>
          <small>
            <a href={`${basePath}/llms.txt`}>llms.txt</a> · {site.location.region}, {site.location.country}
          </small>
          <a className="footer__top-btn" href="#top">
            Back to top <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
