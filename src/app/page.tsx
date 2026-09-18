import { AgentMarquee } from "@/components/AgentMarquee";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/modules/HowItWorks";
import { Nav } from "@/components/Nav";
import { Problem } from "@/components/Problem";
import { TerminalSection } from "@/components/terminal/TerminalSection";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-16 rounded-full bg-off-black px-4 py-2 text-body-sm uppercase text-parchment focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <AgentMarquee />
        <HowItWorks />
        <Problem />
        <TerminalSection />
      </main>
      <Footer />
    </>
  );
}
