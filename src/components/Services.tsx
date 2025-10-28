import { ServiceCard } from "./ServiceCard";
import { Laptop, Rocket, Bot, Cloud, Wrench, Shield } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Laptop,
      title: "תיקוני מחשבים",
      description: "אבחון ותיקון תקלות חומרה ותוכנה, שדרוגי מערכות, ותחזוקה שוטפת למחשבים אישיים ועסקיים."
    },
    {
      icon: Rocket,
      title: "ייעוץ טכנולוגי",
      description: "ליווי עסקים בבחירת טכנולוגיות מתקדמות, אסטרטגיות דיגיטל, ותכנון תשתיות IT אופטימליות."
    },
    {
      icon: Bot,
      title: "אוטומציה ו-AI",
      description: "פיתוח מערכות CRM מותאמות, אינטגרציות WhatsApp Business, ואוטומציות חכמות עם Office 365."
    },
    {
      icon: Cloud,
      title: "פתרונות ענן",
      description: "מעבר לענן, ניהול Office 365, SharePoint, Power Automate, והטמעת כלי שיתוף פעולה מתקדמים."
    },
    {
      icon: Wrench,
      title: "תמיכה טכנית",
      description: "תמיכה מרחוק ובאתר, ניהול מערכות IT, ופתרון בעיות בזמן אמת עם זמינות גבוהה."
    },
    {
      icon: Shield,
      title: "אבטחת מידע",
      description: "הגנה על מערכות, גיבויים אוטומטיים, ניהול DNS, ופתרונות אבטחה מתקדמים לארגונים."
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
