import { Card } from "@/components/ui/card";
import { Shield, Zap, Heart, TrendingUp, MessageCircle, Award } from "lucide-react";

export const About = () => {
  const advantages = [
    {
      icon: Heart,
      title: "גישה אישית",
      description: "לכל לקוח מנהל לקוח אישי. אנחנו מכירים את העסק שלכם ויודעים בדיוק מה אתם צריכים.",
      stat: "אנושי"
    },
    {
      icon: Zap,
      title: "תגובה מהירה",
      description: "תגובה תוך דקות לכל פנייה. אנחנו כאן כשצריך אותנו - בטלפון, בוואטסאפ או במקום.",
      stat: "< 30 דק׳"
    },
    {
      icon: Award,
      title: "ניסיון עשיר",
      description: "למעלה מ-10 שנים של ליווי עסקים מכל הגדלים - מעסק של אדם אחד ועד ארגונים גדולים.",
      stat: "10+ שנים"
    },
    {
      icon: TrendingUp,
      title: "פתרונות מותאמים",
      description: "לא מציעים פתרון אחד לכולם. כל פתרון נבנה במיוחד עבורכם, אחרי שיחה והבנה.",
      stat: "בהתאמה"
    }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden bg-muted">
      <div className="absolute inset-0 grid-pattern"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-sm mb-4">
            קצת עלינו
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
            הכירו את <span className="text-accent">Tech Therapy</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-6">
            אנחנו מאמינים שטכנולוגיה צריכה להיות פשוטה, נגישה ומשרתת את האנשים שמשתמשים בה. 
            לכן הקמנו את Tech Therapy - כדי לתת לעסקים ליווי טכנולוגי אישי ואנושי.
          </p>
          <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-6">
            עם למעלה מ-10 שנות ניסיון, אנחנו מלווים כל לקוח מהצעד הראשון ועד להטמעה מלאה,
            עם סבלנות, מקצועיות והרבה אכפתיות.
          </p>
          <div className="inline-block p-6 rounded-2xl mt-4 border border-accent/15 bg-accent/5">
            <p className="text-xl md:text-2xl font-semibold text-accent">
              ״הטכנולוגיה שלכם. המשימה שלנו.״
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            למה בוחרים <span className="text-primary">בנו</span>?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
              <Card key={index} className="p-6 hover:border-accent/30 transition-all duration-300 border border-border group bg-card shadow-sm rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl border border-accent/15 bg-accent/8 flex-shrink-0 group-hover:bg-accent/12 transition-colors">
                    <advantage.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-foreground">{advantage.title}</h4>
                      <span className="text-xs font-bold text-accent px-2.5 py-1 rounded-full border border-accent/20 bg-accent/8">
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

        <div className="max-w-3xl mx-auto text-center mt-16 p-8 rounded-2xl border border-border bg-card shadow-sm">
          <h4 className="text-2xl font-bold mb-4 text-foreground">רוצים לשמוע איך נוכל לעזור?</h4>
          <p className="text-lg text-foreground/50 mb-6">
            שיחת היכרות קצרה וללא עלות - נשמע על העסק ונציע פתרון שמתאים בדיוק לכם
          </p>
          <a 
            href="https://wa.me/972545368629" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 bg-accent text-accent-foreground shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            בואו נדבר
          </a>
        </div>
      </div>
    </section>
  );
};
