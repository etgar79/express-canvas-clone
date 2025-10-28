import { ServiceCard } from "./ServiceCard";
import { Laptop, Rocket, Bot, Cloud, Wrench, Shield } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Bot,
      title: "ייעוץ והטמעת בינה מלאכותית",
      description: "ליווי בפיתוח ושילוב פתרונות AI בעסק לשיפור שירות, שיווק ותפעול. פיתוח צ'אטבוטים חכמים, מערכות חיזוי, וניתוח נתונים אוטומטי שמביא אתכם לחזית הטכנולוגיה."
    },
    {
      icon: Rocket,
      title: "אוטומציה וייעול תהליכים",
      description: "זיהוי נקודות תורפה ויישום טכנולוגיות אוטומציה לחיסכון משמעותי בזמן ועלויות, הפחתת טעויות אנוש, והגברת הפרודוקטיביות. נהפוך תהליכים מורכבים לפשוטים ויעילים."
    },
    {
      icon: Cloud,
      title: "הטמעת מערכות מידע מתקדמות",
      description: "הטמעה או שדרוג של מערכות ארגוניות (ERP, CRM, BI) עם מינימום הפרעה לפעילות. אפיון מדויק, התאמה אישית והטמעה מלאה שמבטיחה שהמערכת תשרת אתכם באופן אופטימלי."
    },
    {
      icon: Wrench,
      title: "פתרונות ענן ושיתוף פעולה",
      description: "מעבר חכם לענן, ניהול Office 365, SharePoint, Power Automate והטמעת כלי שיתוף פעולה מתקדמים. נבנה עבורכם תשתית דיגיטלית גמישה שמתרחבת עם הארגון."
    },
    {
      icon: Laptop,
      title: "ייעוץ אסטרטגי טכנולוגי",
      description: "ליווי עסקים בבחירת הטכנולוגיות המתאימות, תכנון אסטרטגיות דיגיטל ארוכות טווח, ובניית תשתיות IT שיוצרות יתרון תחרותי אמיתי ומקדמות צמיחה."
    },
    {
      icon: Shield,
      title: "אבטחת מידע ותמיכה שוטפת",
      description: "הגנה מקיפה על מערכות, גיבויים אוטומטיים, ניהול DNS, ותמיכה טכנית מרחוק ובאתר. זמינות גבוהה, מענה מהיר ופתרונות אבטחה מתקדמים לשמירה על רציפות עסקית."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-foreground">
          השירותים שלנו
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
