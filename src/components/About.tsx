import { Card } from "@/components/ui/card";
import { CheckCircle, Zap, Heart, TrendingUp, MessageCircle } from "lucide-react";

export const About = () => {
  const advantages = [
    {
      icon: CheckCircle,
      title: "ניסיון של 10+ שנים",
      description: "עבדנו עם 50+ עסקים כמו שלך. ראינו כמעט כל בעיה - ויודעים בדיוק איך לפתור אותה מהר ובצורה נכונה.",
      stat: "98% שביעות רצון"
    },
    {
      icon: Zap,
      title: "תמיד בחזית הטכנולוגיה",
      description: "אנחנו לא מחכים שטכנולוגיות חדשות יגיעו אלינו - אנחנו כבר שם. כך שאתה תמיד צעד אחד לפני המתחרים.",
      stat: "חדשנות מובילה"
    },
    {
      icon: Heart,
      title: "פתרון שנבנה בדיוק בשבילך",
      description: "שום דבר גנרי, שום תבניות מוכנות. רק פתרון מותאם בדיוק לצרכים שלך, לתקציב שלך ולמטרות שלך.",
      stat: "התאמה אישית 100%"
    },
    {
      icon: TrendingUp,
      title: "זמינים בווטסאפ - תשובה תוך שעה",
      description: "לא תישאר לבד. אנחנו זמינים בווטסאפ ונעזור לך מהר - כי אנחנו יודעים שהזמן שלך חשוב.",
      stat: "זמינות 24/7"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        {/* About Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
            הסיפור שלנו - והמסע שלך
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            פגשנו עסקים שהתמודדו עם אותם האתגרים שאתה מתמודד איתם היום: טכנולוגיה שלא עובדת בשבילם, תהליכים שגוזלים זמן, ותחושה שהם מפספסים הזדמנויות.
            למדנו שלכל עסק יש צרכים ייחודיים - ולכן לא תמצא אצלנו פתרונות מדף.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            <strong>אנחנו מתחייבים</strong> שתקבל פתרון שנבנה בדיוק עבורך, ליווי אישי בכל שלב, וזמינות מלאה - כי אנחנו יודעים שכשזה לא עובד, העסק שלך לא עובד.
            כל פרויקט שאנחנו לוקחים הוא לא עוד משימה - זה הזדמנות להוכיח לך שטכנולוגיה יכולה להיות <strong>פשוטה, יעילה ורווחית</strong>.
          </p>
          <div className="inline-block p-6 bg-primary/5 border-l-4 border-primary rounded-lg mt-8">
            <p className="text-xl md:text-2xl font-semibold text-foreground italic">
              "אנחנו כאן כדי שהטכנולוגיה תעבוד בשבילך - לא להיפך"
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            למה לבחור בנו?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 group" style={{ background: 'var(--gradient-card)' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-foreground">{advantage.title}</h4>
                      <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{advantage.stat}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center mt-16 p-8 rounded-2xl border-2 border-primary/20" style={{ background: 'var(--gradient-card)' }}>
          <h4 className="text-2xl font-bold mb-4 text-foreground">רוצה לראות איך זה יעבוד אצלך?</h4>
          <p className="text-lg text-muted-foreground mb-6">
            בוא נדבר 15 דקות - ללא התחייבות. נבין את האתגרים שלך ונראה איך אנחנו יכולים לעזור.
          </p>
          <a 
            href="https://wa.me/972545368629" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <MessageCircle className="h-5 w-5" />
            קבע שיחת היכרות - 15 דקות
          </a>
        </div>
      </div>
    </section>
  );
};
