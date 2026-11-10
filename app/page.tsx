import { Hero, Nav } from "@/components/Hero";
import Chaos from "@/components/Chaos";
import Demo from "@/components/Demo";
import { Audience, Faq, FinalCta, FloatWA, Marquee, Process, Services, Stats } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Chaos />
        <Demo />
        <Services />
        <Marquee />
        <Audience />
        <Process />
        <Stats />
        <Faq />
        <FinalCta />
      </main>
      <FloatWA />
    </>
  );
}
