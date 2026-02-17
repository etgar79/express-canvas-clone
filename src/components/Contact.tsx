import { ContactForm } from "./ContactForm";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, Clock, MapPin } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-tech-light)' }}>
      <div className="absolute inset-0 hex-pattern"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-sm mb-4">
              דברו איתנו
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              נשמח <span className="text-accent">לשמוע</span> מכם
            </h2>
            <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
              השאירו פרטים ונחזור אליכם בהקדם, או פשוט שלחו הודעה בוואטסאפ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6 border border-border bg-card shadow-sm rounded-2xl">
                <h3 className="text-xl font-bold mb-6 text-foreground">
                  איך ליצור קשר
                </h3>
                
                <div className="space-y-4">
                  <a href="tel:+972545368629" className="flex items-center gap-4 p-3 rounded-xl border border-accent/10 hover:border-accent/25 transition-colors bg-accent/5">
                    <div className="p-2 rounded-xl border border-accent/15 bg-accent/10">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/40">טלפון</p>
                      <p className="font-semibold text-foreground">054-536-8629</p>
                    </div>
                  </a>

                  <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl border border-accent/10 hover:border-accent/25 transition-colors bg-accent/5">
                    <div className="p-2 rounded-xl border border-accent/15 bg-accent/10">
                      <MessageCircle className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/40">וואטסאפ</p>
                      <p className="font-semibold text-foreground">שלחו הודעה</p>
                    </div>
                  </a>

                  <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl border border-primary/10 hover:border-primary/25 transition-colors bg-primary/5">
                    <div className="p-2 rounded-xl border border-primary/15 bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/40">תמיכה מרחוק</p>
                      <p className="font-semibold text-foreground">התחברו לתמיכה</p>
                    </div>
                  </a>
                </div>

                <div className="mt-6 p-4 rounded-xl border border-accent/15 bg-accent/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <p className="font-semibold text-accent text-sm">שעות פעילות</p>
                  </div>
                  <p className="text-foreground/50 text-sm">ראשון - חמישי: 9:00 - 18:00</p>
                  <p className="text-foreground/50 text-sm">בוואטסאפ: תמיד זמינים 💬</p>
                </div>
              </Card>
            </div>

            <Card className="p-6 lg:p-8 border border-border bg-card shadow-sm rounded-2xl">
              <h3 className="text-xl font-bold mb-6 text-foreground">
                השאירו פרטים
              </h3>
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
