import { ContactForm } from "./ContactForm";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, Clock, MapPin } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-tech-light)' }}>
      <div className="absolute inset-0 hex-pattern"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary font-mono text-sm mb-4">
              // contact
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text text-primary">
              צור קשר
            </h2>
            <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
              נשמח לשמוע ממך ולהציע פתרון מותאם לעסק שלך
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 border border-primary/15 neon-border" style={{ background: 'var(--gradient-card)' }}>
                <h3 className="text-xl font-bold mb-6 text-foreground font-mono">
                  <span className="text-primary">&gt;</span> פרטי יצירת קשר
                </h3>
                
                <div className="space-y-4">
                  <a href="tel:+972545368629" className="flex items-center gap-4 p-3 rounded-md border border-primary/10 hover:border-primary/30 transition-colors bg-primary/5">
                    <div className="p-2 rounded-md border border-primary/20 bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/40 font-mono">PHONE</p>
                      <p className="font-semibold text-foreground">054-536-8629</p>
                    </div>
                  </a>

                  <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-md border border-primary/10 hover:border-primary/30 transition-colors bg-primary/5">
                    <div className="p-2 rounded-md border border-primary/20 bg-primary/10">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/40 font-mono">WHATSAPP</p>
                      <p className="font-semibold text-foreground">שלח הודעה</p>
                    </div>
                  </a>

                  <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-md border border-primary/10 hover:border-primary/30 transition-colors bg-primary/5">
                    <div className="p-2 rounded-md border border-primary/20 bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/40 font-mono">REMOTE SUPPORT</p>
                      <p className="font-semibold text-foreground">תמיכה מרחוק</p>
                    </div>
                  </a>
                </div>

                <div className="mt-6 p-4 rounded-md border border-accent/20 bg-accent/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <p className="font-semibold text-accent font-mono text-sm">AVAILABILITY</p>
                  </div>
                  <p className="text-foreground/50 text-sm">ראשון - חמישי: 9:00 - 18:00</p>
                  <p className="text-foreground/50 text-sm">WhatsApp: זמינים 24/7</p>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="p-6 lg:p-8 border border-primary/15 neon-border" style={{ background: 'var(--gradient-card)' }}>
              <h3 className="text-xl font-bold mb-6 text-foreground font-mono">
                <span className="text-primary">&gt;</span> שלח הודעה
              </h3>
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
