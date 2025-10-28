import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      <main className="pt-[72px]">
        <Hero />
        <Services />
        <About />
      </main>
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
