import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { BusinessTools } from "@/components/BusinessTools";
import { About } from "@/components/About";

import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { SkipLink } from "@/components/SkipLink";

const Index = () => {
  useEffect(() => {
    document.title = "Tech Therapy | תמיכת IT ו-AI לעסקים בפרדס חנה והסביבה – אתגר אהרוני";
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://1979.co.il/");
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://1979.co.il/");
  }, []);
  return (
    <div className="min-h-screen" dir="rtl">
      <SkipLink />
      <Header />
      <main id="main-content" className="pt-[132px] lg:pt-[72px]">
        <section id="hero" className="scroll-mt-[132px] lg:scroll-mt-[72px]">
          <Hero />
        </section>
        <Services />
        <BusinessTools />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <AccessibilityMenu />
    </div>
  );
};

export default Index;
