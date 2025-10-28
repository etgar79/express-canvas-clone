import { Card } from "@/components/ui/card";
import { CheckCircle, Zap, Heart, TrendingUp } from "lucide-react";

export const About = () => {
  const advantages = [
    {
      icon: CheckCircle,
      title: "ניסיון מוכח וידע מתקדם",
      description: "שנות ניסיון במגוון פרויקטים טכנולוגיים. אנחנו מכירים את האתגרים מבפנים ויודעים לגשת לכל בעיה עם הכלים העדכניים ביותר."
    },
    {
      icon: Zap,
      title: "חדשנות כדרך חיים",
      description: "תמיד בחזית הטכנולוגיה, לומדים את המגמות החדשות ומשלבים כלים חדשניים. כך אתם נהנים מיתרון תחרותי ומפתרונות שמתאימים לעתיד."
    },
    {
      icon: Heart,
      title: "פתרונות בהתאמה אישית",
      description: "לא תמצאו אצלנו פתרון מדף גנרי. לכל ארגון אנו מתאימים פתרון ייחודי שנבנה סביב הצרכים, התהליכים והמטרות שלו."
    },
    {
      icon: TrendingUp,
      title: "שירות אישי וליווי צמוד",
      description: "כל פרויקט מלווה ישירות על-ידי המומחים שלנו, עם זמינות גבוהה, תקשורת פתוחה והתאמות תוך כדי תנועה להבטחת שביעות רצון מלאה."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        {/* About Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
            אודותינו
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            Tech Therapy Computers נוסדה מתוך אמונה שטכנולוגיה מתקדמת יכולה – וצריכה – להיות נגישה לכל עסק. 
            עם ניסיון רב שנים בליווי פרויקטים טכנולוגיים, אנו משלבים הבנה טכנולוגית עמוקה עם ראייה עסקית ממוקדת תוצאות.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            אנחנו מתמחים בהטמעת כלי AI, אוטומציית תהליכים ופיתוח פתרונות בהתאמה אישית, ומאמינים שלכל אתגר טכנולוגי 
            יש פתרון יצירתי וישים. מה שמניע אותנו הוא ההצלחה שלכם – אנו רואים כל פרויקט כהזדמנות להפוך תהליכים 
            מורכבים לפשוטים ויעילים, בליווי אישי וצמוד מתחילת הדרך ועד סופה.
          </p>
          <div className="inline-block p-6 bg-primary/5 border-l-4 border-primary rounded-lg mt-8">
            <p className="text-xl md:text-2xl font-semibold text-foreground italic">
              "להתאים את הטכנולוגיה לאדם – ולא את האדם לטכנולוגיה"
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
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0" style={{ background: 'var(--gradient-card)' }}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full flex-shrink-0">
                    <advantage.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-foreground">{advantage.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center mt-16">
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            מתלבטים איך להתחיל? צרו קשר לשיחת ייעוץ ללא התחייבות – ונבדוק יחד איך טכנולוגיות חדשות יכולות להזניק את העסק שלכם קדימה.
          </p>
        </div>
      </div>
    </section>
  );
};
