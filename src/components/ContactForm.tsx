"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";
import { disciplines, site } from "@/content/site";

/**
 * Booking brief. There is no backend: on submit we compose the brief, copy it, and open
 * the Instagram DM (or email, once one is configured) so the conversation lands where
 * As We Go already replies. The toolname/tooldescription attributes expose the form to
 * browser AI agents via declarative WebMCP.
 */
const agentForm = {
  toolname: "request_photo_shoot",
  tooldescription:
    "Request a photography booking from As We Go (motocross, supercross, motorcycle, portrait or event shoots). Fills in a brief and opens a direct message to the studio.",
};
const param = (description: string) => ({ toolparamdescription: description });

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const brief = [
      `Hi As We Go! I'd like to book a shoot.`,
      `Name: ${data.get("name")}`,
      `Shoot: ${data.get("type")}`,
      data.get("date") ? `Date: ${data.get("date")}` : "",
      data.get("location") ? `Location: ${data.get("location")}` : "",
      `Details: ${data.get("message")}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard?.writeText(brief).catch(() => {});
    const target = site.email
      ? `mailto:${site.email}?subject=${encodeURIComponent("Shoot enquiry")}&body=${encodeURIComponent(brief)}`
      : site.instagramDm;
    window.open(target, "_blank", "noopener");
    setStatus("sent");
  }

  return (
    <form className="form" onSubmit={onSubmit} {...agentForm}>
      <div className="field">
        <label htmlFor="f-name">Your name</label>
        <input id="f-name" name="name" autoComplete="name" required {...param("Full name of the person booking")} />
      </div>
      <div className="field">
        <label htmlFor="f-type">Type of shoot</label>
        <select id="f-type" name="type" required defaultValue="" {...param("Kind of shoot requested")}>
          <option value="" disabled>
            Choose one
          </option>
          {disciplines.map((d) => (
            <option key={d.id}>{d.title}</option>
          ))}
          <option>Something else</option>
        </select>
      </div>
      <div className="field field--half">
        <label htmlFor="f-date">Date (optional)</label>
        <input id="f-date" name="date" type="date" {...param("Preferred shoot date, YYYY-MM-DD")} />
      </div>
      <div className="field field--half">
        <label htmlFor="f-location">Location</label>
        <input
          id="f-location"
          name="location"
          autoComplete="address-level2"
          placeholder="Track, city or venue"
          {...param("Where the shoot will take place")}
        />
      </div>
      <div className="field">
        <label htmlFor="f-message">Tell us the story</label>
        <textarea
          id="f-message"
          name="message"
          rows={4}
          required
          placeholder="Race round, launch, portrait session…"
          {...param("Details about the shoot: event, deliverables, budget or references")}
        />
      </div>
      <button className="btn btn--red btn--block" type="submit">
        {site.email ? "Send enquiry" : "Send via Instagram DM"} <Send size={18} aria-hidden="true" />
      </button>
      <p className="form__status" role="status">
        {status === "sent" && (
          <>
            <Check size={16} aria-hidden="true" /> Brief copied. Paste it into the chat that just opened.
          </>
        )}
      </p>
    </form>
  );
}
