import { ServiceCard } from "./ServiceCard";
import { Network, Monitor, Camera, Shield, Server, Wifi, Home, Bot, Wrench } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Shield,
      title: "אבטחת סייבר",
      question: "האם העסק שלך מוגן מפני איומי סייבר?",
      description: "הגנה מקיפה: Firewall, אנטי-וירוס ארגוני, ניטור איומים בזמן אמת, הדרכות עובדים ותגובה לאירועי אבטחה.",
      benefit: "הגנה 360° על העסק"
    },
    {
      icon: Network,
      title: "תשתיות רשת",
      question: "הרשת שלך איטית או לא יציבה?",
      description: "תכנון והקמת תשתיות רשת מתקדמות: LAN/WAN, ניהול Switch ו-Router, VPN מאובטח, ואופטימיזציה לביצועים מקסימליים.",
      benefit: "רשת מהירה ויציבה"
    },
    {
      icon: Monitor,
      title: "תיקון מחשבים",
      question: "המחשב תקוע? איטי? לא נדלק?",
      description: "אבחון ותיקון מחשבים ושרתים, שדרוגי חומרה, התקנת מערכות הפעלה, שחזור מידע ותחזוקה מונעת.",
      benefit: "תיקון מהיר ואמין"
    },
    {
      icon: Camera,
      title: "מצלמות אבטחה",
      question: "רוצים עיניים על העסק 24/7?",
      description: "התקנת מערכות מצלמות IP מתקדמות, DVR/NVR, גישה מרחוק דרך הנייד, ואינטגרציה עם מערכות אזעקה.",
      benefit: "שקט נפשי מלא"
    },
    {
      icon: Server,
      title: "שרתים וענן",
      question: "צריכים שרת אמין או מעבר לענן?",
      description: "הקמת שרתים, ניהול Active Directory, מעבר ל-Office 365 ו-Azure/AWS, גיבויים אוטומטיים ו-Disaster Recovery.",
      benefit: "תשתית ענן מאובטחת"
    },
    {
      icon: Home,
      title: "בית חכם",
      question: "רוצים לשלוט בבית מהטלפון?",
      description: "התקנת מערכות בית חכם: תאורה, מזגנים, תריסים, מצלמות ומנעולים חכמים - הכל מאפליקציה אחת.",
      benefit: "שליטה מלאה מכל מקום"
    },
    {
      icon: Wifi,
      title: "תקשורת אלחוטית",
      question: "WiFi חלש או כתמים מתים?",
      description: "סקר אלחוטי, התקנת Access Points, Mesh WiFi, אופטימיזציית כיסוי ופתרונות לבעיות קליטה.",
      benefit: "כיסוי WiFi מושלם"
    },
    {
      icon: Bot,
      title: "אוטומציה ו-AI",
      question: "רוצים שהטכנולוגיה תעבוד בשבילכם?",
      description: "הטמעת כלי AI, צ'אטבוטים, אוטומציה של תהליכים עסקיים, וחיבור מערכות לעבודה יעילה יותר.",
      benefit: "חיסכון בזמן ומשאבים"
    },
    {
      icon: Wrench,
      title: "תחזוקה שוטפת",
      question: "רוצים שמישהו ידאג לטכנולוגיה?",
      description: "חבילות תחזוקה חודשיות: ניטור מערכות, עדכוני אבטחה, גיבויים, ותמיכה טכנית בזמינות מלאה.",
      benefit: "ראש שקט מהטכנולוגיה"
    }
  ];

  return (
    <section id="services" className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-tech-light)' }}>
      {/* Grid pattern */}
      <div className="absolute inset-0 hex-pattern"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary font-mono text-sm mb-4">
            // services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text text-primary">
            השירותים שלנו
          </h2>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto font-mono">
            פתרונות IT מקצועיים מקצה לקצה - מאבטחת סייבר ועד בית חכם
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
