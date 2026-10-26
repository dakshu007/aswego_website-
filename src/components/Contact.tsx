import { ArrowUpRight, Mail } from "lucide-react";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { InstagramIcon } from "./icons";

export function Contact() {
  return (
    <section id="contact" className="contact section" aria-labelledby="contact-title">
      <div className="container">
        <p className="kicker">
          <span>08</span> Book a shoot
        </p>
        <h2 id="contact-title" className="contact__title display">
          Let&apos;s <span className="red">ride.</span>
        </h2>
        <div className="contact__grid">
          <div className="contact__aside">
            <p className="contact__lede">
              Race weekend, bike launch, portrait or something new? Tell us the date, the place and the story.
              We reply on Instagram.
            </p>
            <a className="contact__link" href={site.instagram} target="_blank" rel="noopener noreferrer me">
              <InstagramIcon size={22} />
              <span>@{site.handle}</span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
            {site.email && (
              <a className="contact__link" href={`mailto:${site.email}`}>
                <Mail size={22} aria-hidden="true" />
                <span>{site.email}</span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            )}
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
