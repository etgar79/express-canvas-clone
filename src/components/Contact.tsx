import { ContactForm } from "./ContactForm";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MessageCircle } from "lucide-react";

export const Contact = () => {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-tech-light)' }}>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{
            background: 'var(--gradient-tech)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            צור קשר
          </h2>
          <p className="text-lg text-foreground/70 text-center mb-12 max-w-2xl mx-auto">
            נשמח לשמוע ממך ולעזור לך למצוא את הפתרון הטכנולוגי המושלם לעסק שלך
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border border-primary/10" style={{ background: 'var(--gradient-card)' }}>
                <h3 className="text-2xl font-bold mb-6 text-foreground">פרטי יצירת קשר</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0" style={{
                      background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.1) 0%, hsl(var(--tech-purple) / 0.1) 100%)'
                    }}>
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">טלפון</p>
                      <a href="tel:+972545368629" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        054-536-8629
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0" style={{
                      background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.1) 0%, hsl(var(--tech-purple) / 0.1) 100%)'
                    }}>
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <a 
                        href="https://wa.me/972545368629" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        שלח הודעה
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl flex-shrink-0" style={{
                      background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.1) 0%, hsl(var(--tech-purple) / 0.1) 100%)'
                    }}>
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">תמיכה מרחוק</p>
                      <a 
                        href="https://898.tv/sos1979" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        לחץ כאן
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl" style={{
                  background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.05) 0%, hsl(var(--tech-purple) / 0.05) 100%)',
                  borderRight: '4px solid hsl(var(--primary))'
                }}>
                  <p className="text-foreground font-semibold mb-2">זמני פעילות</p>
                  <p className="text-muted-foreground">ראשון - חמישי: 9:00 - 18:00</p>
                  <p className="text-muted-foreground">זמינות בוואטסאפ 24/7</p>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="p-6 lg:p-8 border border-primary/10" style={{ background: 'var(--gradient-card)' }}>
              <h3 className="text-2xl font-bold mb-6 text-foreground">שלח הודעה</h3>
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
