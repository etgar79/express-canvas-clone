import { Card } from "@/components/ui/card";
import { Shield, Zap, Heart, TrendingUp, MessageCircle, Award } from "lucide-react";

export const About = () => {
  const advantages = [
    {
      icon: Shield,
      title: "מומחי סייבר מוסמכים",
      description: "הצוות שלנו מוסמך באבטחת מידע וסייבר. אנחנו מגנים על העסק שלך מפני איומים מתקדמים.",
      stat: "Certified"
    },
    {
      icon: Zap,
      title: "זמן תגובה מהיר",
      description: "תגובה תוך דקות לכל תקלה. מערכת ניטור 24/7 שמזהה בעיות לפני שהלקוח מרגיש.",
      stat: "< 30 min"
    },
    {
      icon: Award,
      title: "10+ שנות ניסיון",
      description: "ניסיון עשיר בעבודה עם עסקים מכל הגדלים - מסטארטאפים ועד ארגונים גדולים.",
      stat: "50+ clients"
    },
    {
      icon: TrendingUp,
      title: "פתרונות מותאמים",
      description: "כל פתרון נבנה במיוחד עבורכם. ניתוח צרכים, תכנון ויישום מותאם אישית.",
      stat: "Custom"
    }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      <div className="absolute inset-0 grid-pattern"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        {/* About Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary font-mono text-sm mb-4">
            // about_us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 neon-text text-primary">
            מי אנחנו
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-6">
            <span className="text-primary font-bold">Tech Therapy</span> היא חברת IT ואבטחת סייבר מובילה. 
            אנחנו מספקים פתרונות טכנולוגיים מקיפים - מהגנת סייבר, דרך תשתיות רשת, ועד בית חכם.
          </p>
          <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-6">
            עם ניסיון של למעלה מ-10 שנים, אנחנו מלווים עסקים בכל שלב - מאפיון הצורך ועד הטמעה מלאה,
            תוך שמירה על רמת אבטחה גבוהה וזמינות מלאה.
          </p>
          <div className="inline-block p-6 rounded-lg mt-4 border border-primary/20 bg-primary/5">
            <p className="text-xl md:text-2xl font-semibold text-primary italic font-mono neon-text">
              "Your IT. Our Mission."
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 neon-text-cyan text-accent">
            למה Tech Therapy?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
              <Card key={index} className="p-6 hover:border-primary/40 transition-all duration-300 border border-primary/15 group neon-border" style={{ background: 'var(--gradient-card)' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-foreground">{advantage.title}</h4>
                      <span className="text-xs font-bold text-primary px-2 py-1 rounded-md border border-primary/30 bg-primary/5 font-mono">
                        {advantage.stat}
                      </span>
                    </div>
                    <p className="text-foreground/50 leading-relaxed text-sm">{advantage.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto text-center mt-16 p-8 rounded-lg border border-primary/20 neon-border" style={{ background: 'var(--gradient-card)' }}>
          <h4 className="text-2xl font-bold mb-4 text-foreground">מוכנים לשדרג את ה-IT?</h4>
          <p className="text-lg text-foreground/50 mb-6">
            שיחת ייעוץ ראשונית ללא עלות - נבין את הצרכים ונציע פתרון מותאם
          </p>
          <a 
            href="https://wa.me/972545368629" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md font-bold text-lg transition-all duration-300 hover:scale-105 neon-border"
            style={{
              background: 'var(--gradient-button)',
              color: 'hsl(220 20% 4%)',
            }}
          >
            <MessageCircle className="h-5 w-5" />
            יצירת קשר
          </a>
        </div>
      </div>
    </section>
  );
};
