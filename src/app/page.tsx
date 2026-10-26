import { About } from "@/components/About";
import { AgentTools } from "@/components/AgentTools";
import { Chapters } from "@/components/Chapters";
import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Marquee } from "@/components/Marquee";
import { MotionEngine } from "@/components/MotionEngine";
import { Nav } from "@/components/Nav";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Manifesto />
        <Work />
        <Chapters />
        <Services />
        <Process />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MotionEngine />
      <Cursor />
      <AgentTools />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
