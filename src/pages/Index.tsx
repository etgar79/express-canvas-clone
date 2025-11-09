import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useEffect(() => {
    const sendVisitorNotification = async () => {
      try {
        const visitorData = {
          userAgent: navigator.userAgent,
          referrer: document.referrer || "ישיר",
          language: navigator.language,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
        };

        await supabase.functions.invoke('send-visitor-email', {
          body: visitorData,
        });
      } catch (error) {
        console.error('Error sending visitor notification:', error);
      }
    };

    sendVisitorNotification();
  }, []);

  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      <main className="pt-[72px]">
        <Hero />
        <Services />
        <About />
      </main>
      <WhatsAppFloat />
      <AccessibilityMenu />
    </div>
  );
};

export default Index;
