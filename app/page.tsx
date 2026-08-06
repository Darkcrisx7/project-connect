import { SiteNav } from "@/components/landing/site-nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StartupShowcase } from "@/components/landing/startup-showcase";
import { StatsBand, Testimonials, FAQ } from "@/components/landing/stats-and-stories";
import { FinalCTA, Footer } from "@/components/landing/cta-footer";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <HowItWorks />
        <StartupShowcase />
        <StatsBand />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
