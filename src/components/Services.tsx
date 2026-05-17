import { ServiceCard } from "./ServiceCard";
import { Monitor, Server, Bot, Wrench, Lightbulb, Building2, Sparkles } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Sparkles,
      title: "שירותי AI",
      question: "רוצים לשלב בינה מלאכותית בעסק?",
      description: "ייעוץ והטמעת פתרונות AI לעסקים: צ'אטבוטים חכמים, אוטומציה מבוססת AI, יצירת תוכן, ניתוח נתונים והטמעת כלי בינה מלאכותית.",
      benefit: "עסק חכם ומתקדם"
    },
    {
      icon: Monitor,
      title: "תיקוני מחשבים",
      question: "המחשב לא עובד כמו שצריך?",
      description: "אבחון ותיקון מחשבים נייחים וניידים, התקנת מערכות הפעלה, שדרוגי חומרה ותוכנה, שחזור מידע ותחזוקה מונעת בפרדס חנה ובאיזור.",
      benefit: "מחשבים אמינים ויציבים"
    },
    {
      icon: Building2,
      title: "תמיכה בעסקים",
      question: "העסק שלכם צריך גב טכנולוגי?",
      description: "תמיכת IT מקיפה לעסקים: ניהול תשתיות, שרתים, רשתות, גיבויים, Office 365 ופתרונות ענן מותאמים.",
      benefit: "שקט נפשי לעסק"
    },
    {
      icon: Bot,
      title: "אוטומציות",
      question: "רוצים שהטכנולוגיה תעבוד בשבילכם?",
      description: "אוטומציה של תהליכים עסקיים, חיבור מערכות, צ'אטבוטים, וייעול זרימות עבודה לחיסכון בזמן ומשאבים.",
      benefit: "חיסכון בזמן ומשאבים"
    },
    {
      icon: Lightbulb,
      title: "ייעוץ טכנולוגי",
      question: "לא יודעים מאיפה להתחיל?",
      description: "ייעוץ מקצועי לבחירת טכנולוגיות, תכנון תשתיות, אסטרטגיית IT ומיפוי צרכים טכנולוגיים לארגון.",
      benefit: "החלטות חכמות"
    },
    {
      icon: Wrench,
      title: "תחזוקה שוטפת",
      question: "רוצים שמישהו ידאג לטכנולוגיה?",
      description: "חבילות תחזוקה חודשיות: ניטור מערכות, עדכוני אבטחה, גיבויים, ותמיכה טכנית בזמינות מלאה בפרדס חנה ובסביבה.",
      benefit: "ראש שקט מהטכנולוגיה"
    }
  ];

  return (
    <section id="services" className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-tech-light)' }}>
      <div className="absolute inset-0 hex-pattern"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-sm mb-4">
            מה אנחנו עושים
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            איך נוכל <span className="text-accent">לעזור</span> לכם?
          </h2>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
            שירותי AI, תיקוני מחשבים ופתרונות טכנולוגיים בפרדס חנה - עם גישה אישית לכל לקוח
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
