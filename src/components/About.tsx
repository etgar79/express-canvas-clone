import { whatsappUrl } from "@/lib/whatsapp.mjs";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Heart, TrendingUp, MessageCircle, Award } from "lucide-react";

export const About = () => {
  const advantages = [
    {
      icon: Heart,
      title: "גישה אישית",
      description: "כל לקוח עובד ישירות מולי, בלי מוקד ובלי העברות. אני מכיר את העסק שלכם ויודע בדיוק מה אתם צריכים.",
      stat: "אנושי"
    },
    {
      icon: Zap,
      title: "תגובה מהירה",
      description: "תגובה תוך דקות לכל פנייה. אני כאן כשצריך אותי - בטלפון, בוואטסאפ או במקום.",
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
      description: "אני לא מציע פתרון אחד לכולם. כל פתרון נבנה במיוחד עבורכם, אחרי שיחה והבנה.",
      stat: "בהתאמה"
    }
  ];

  return (
    <section id="about" className="scroll-mt-[132px] lg:scroll-mt-[72px] py-20 relative overflow-hidden bg-muted">

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent-text text-sm mb-4">
            קצת עליי
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
            הכירו את <span className="text-accent">Tech Therapy</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-6">
            אני מאמין שטכנולוגיה צריכה להיות פשוטה, נגישה ומשרתת את האנשים שמשתמשים בה.
            לכן הקמתי את Tech Therapy - כדי לתת לעסקים ולפרטיים בפרדס חנה ובאיזור ליווי טכנולוגי אישי ואנושי.
          </p>
          <p className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-6">
            עם למעלה מ-10 שנות ניסיון, אני מלווה לקוחות בפרדס חנה והסביבה מהצעד הראשון ועד להטמעה מלאה,
            עם סבלנות, מקצועיות והרבה אכפתיות.
          </p>
          <div className="inline-block p-6 rounded-2xl mt-4 border border-accent/15 bg-accent/5">
            <p className="text-xl md:text-2xl font-semibold text-accent-text">
              ״הטכנולוגיה שלכם. המשימה שלי.״
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            למה לבחור <span className="text-primary">בי</span>?
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
                      <span className="text-xs font-bold text-accent-text px-2.5 py-1 rounded-full border border-accent/20 bg-accent/8">
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
          <h4 className="text-2xl font-bold mb-4 text-foreground">רוצים לשמוע איך אוכל לעזור?</h4>
          <p className="text-lg text-foreground/50 mb-6">
            שיחת היכרות קצרה וללא עלות - אשמע על העסק ואציע פתרון שמתאים בדיוק לכם
          </p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl bg-accent text-accent-foreground shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            בואו נדבר
          </a>
        </div>
      </div>
    </section>
  );
};
