import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { BusinessTools } from "@/components/BusinessTools";
import { About } from "@/components/About";
import { BackupCounter } from "@/components/BackupCounter";

import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { SkipLink } from "@/components/SkipLink";

const Index = () => {
  return (
    <div className="min-h-screen" dir="rtl">
      <SkipLink />
      <Header />
      <main id="main-content" className="pt-[72px]">
        <section id="hero">
          <Hero />
        </section>
        <Services />
        <BusinessTools />
        <About />
        <BackupCounter />
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
