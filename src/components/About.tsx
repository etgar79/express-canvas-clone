import { Card } from "@/components/ui/card";
import { CheckCircle, Zap, Heart, TrendingUp, MessageCircle } from "lucide-react";

export const About = () => {
  const advantages = [
    {
      icon: CheckCircle,
      title: "ניסיון של 10+ שנים",
      description: "צברנו ניסיון עשיר בעבודה עם עסקים מכל הגדלים. אנחנו מכירים את האתגרים ויודעים איך להתמודד איתם.",
      stat: "50+ עסקים"
    },
    {
      icon: Zap,
      title: "תמיד מעודכנים",
      description: "אנחנו עוקבים אחרי הטכנולוגיות החדשות ביותר כדי להציע לכם את הפתרונות המתאימים והמתקדמים ביותר.",
      stat: "חדשנות מובילה"
    },
    {
      icon: Heart,
      title: "פתרונות מותאמים אישית",
      description: "אנחנו לא מציעים פתרונות גנריים. כל פתרון נבנה במיוחד עבורכם, מותאם לצרכים ולמטרות שלכם.",
      stat: "התאמה מלאה"
    },
    {
      icon: TrendingUp,
      title: "ליווי ותמיכה צמודים",
      description: "אנחנו זמינים לכם בכל שלב - מתחילת הפרויקט ועד הרבה אחרי. תמיכה מהירה וזמינה בווטסאפ.",
      stat: "תמיכה 24/7"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(220 20% 94%) 100%)' }}>
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        {/* About Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{
            background: 'var(--gradient-tech)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            הגישה שלנו
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            אנחנו מאמינים שטכנולוגיה צריכה לשרת את העסק - לא להיפך. לכן אנחנו לא מוכרים פתרונות מדף, 
            אלא מלווים אתכם בכל שלב: מהבנת הצורך, דרך בחירת הכלים המתאימים, ועד הטמעה מלאה והדרכה.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            עם ניסיון של למעלה מ-10 שנים בעבודה עם עסקים בכל הגדלים, אנחנו יודעים שכל ארגון הוא ייחודי.
            לכן אנחנו מקשיבים, מבינים, ומתאימים את הפתרון בדיוק לצרכים שלכם - תוך שמירה על קשר צמוד ותמיכה מלאה.
          </p>
          <div className="inline-block p-6 rounded-2xl mt-8" style={{
            background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.05) 0%, hsl(var(--tech-purple) / 0.05) 100%)',
            borderLeft: '4px solid hsl(var(--primary))'
          }}>
            <p className="text-xl md:text-2xl font-semibold text-foreground italic">
              "אנחנו כאן כדי שהטכנולוגיה תעבוד בשבילכם - בליווי אישי ומקצועי"
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{
            background: 'var(--gradient-tech)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            למה לבחור בנו?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border border-primary/10 group" style={{ background: 'var(--gradient-card)' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{
                    background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.1) 0%, hsl(var(--tech-purple) / 0.1) 100%)'
                  }}>
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-foreground">{advantage.title}</h4>
                      <span className="text-sm font-bold text-primary px-3 py-1 rounded-full" style={{
                        background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.1) 0%, hsl(var(--tech-purple) / 0.1) 100%)'
                      }}>{advantage.stat}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center mt-16 p-8 rounded-2xl border" style={{ 
          background: 'var(--gradient-card)',
          borderColor: 'hsl(var(--primary) / 0.2)'
        }}>
          <h4 className="text-2xl font-bold mb-4 text-foreground">נשמח לשמוע עליכם</h4>
          <p className="text-lg text-muted-foreground mb-6">
            צרו קשר לשיחת היכרות ללא התחייבות - נשמח להבין את הצרכים שלכם ולראות איך אנחנו יכולים לעזור
          </p>
          <a 
            href="https://wa.me/972545368629" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg text-white"
            style={{
              background: 'var(--gradient-tech)'
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
