import { ServiceCard } from "./ServiceCard";
import { Laptop, Rocket, Bot, Cloud, Wrench, Shield } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Bot,
      title: "ליווי והטמעת בינה מלאכותית",
      question: "רוצים לשלב AI בעסק אבל לא בטוחים מאיפה להתחיל?",
      description: "נלווה אתכם בכל שלב - מזיהוי ההזדמנויות ועד הטמעה מלאה של פתרונות AI. צ'אטבוטים, מערכות חיזוי, וכלי ניתוח - הכל מותאם לצרכים שלכם.",
      benefit: "ליווי מקצועי מתחילה ועד סוף"
    },
    {
      icon: Rocket,
      title: "ייעוץ באוטומציה וייעול תהליכים",
      question: "רוצים לייעל תהליכים אבל לא יודעים מה אפשר?",
      description: "נעזור לכם לזהות הזדמנויות לאוטומציה ונדריך אתכם ביישום. נבנה יחד תהליכים יעילים שחוסכים זמן ומפחיתים טעויות.",
      benefit: "תמיכה והדרכה מלאה"
    },
    {
      icon: Cloud,
      title: "תמיכה בהטמעת מערכות מידע",
      question: "מתכננים להטמיע מערכת חדשה? אנחנו כאן לעזור",
      description: "נלווה אתכם בהטמעת מערכות ארגוניות (ERP, CRM, BI) - מאפיון הצורך ועד הטמעה מלאה. נדאג שהתהליך יהיה חלק ומותאם לצרכים שלכם.",
      benefit: "ליווי מקצועי בכל שלב"
    },
    {
      icon: Wrench,
      title: "הדרכה במעבר לענן",
      question: "רוצים לעבור לענן בצורה בטוחה ויעילה?",
      description: "נדריך אתכם במעבר לענן ובהטמעת כלי שיתוף פעולה (Office 365, SharePoint). נבנה יחד תשתית גמישה ונלמד אתכם לעבוד איתה.",
      benefit: "הדרכה מקיפה וליווי"
    },
    {
      icon: Laptop,
      title: "ייעוץ אסטרטגי טכנולוגי",
      question: "צריכים עזרה בבחירת הטכנולוגיות המתאימות?",
      description: "נלווה אתכם בבחירת הכלים והטכנולוגיות הנכונות לעסק שלכם. נבנה יחד תוכנית IT שתתמוך בצמיחה שלכם.",
      benefit: "ייעוץ מקצועי ומותאם"
    },
    {
      icon: Shield,
      title: "תמיכה שוטפת ואבטחת מידע",
      question: "צריכים גיבוי טכנולוגי שוטף?",
      description: "נספק לכם תמיכה שוטפת, הגנה על המערכות וגיבויים אוטומטיים. זמינים לכם בווטסאפ לכל שאלה או בעיה.",
      benefit: "תמיכה זמינה ומהירה"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-tech-light)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{
          background: 'var(--gradient-tech)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          התחומים שלנו
        </h2>
        <p className="text-lg text-foreground/70 text-center mb-16 max-w-2xl mx-auto">
          אנחנו כאן כדי לתמוך בכם בכל תחום טכנולוגי - מייעוץ והדרכה ועד הטמעה מלאה
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              question={service.question}
              description={service.description}
              benefit={service.benefit}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
