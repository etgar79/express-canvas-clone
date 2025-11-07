import { ServiceCard } from "./ServiceCard";
import { Laptop, Rocket, Bot, Cloud, Wrench, Shield } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Bot,
      title: "רוצה שהבינה המלאכותית תעבוד בשבילך?",
      question: "מרגיש שאתה מפספס הזדמנויות כי אין לך זמן לענות ללקוחות 24/7?",
      description: "נבנה לך צ'אטבוט חכם שעונה ללקוחות בכל שעה, מערכת חיזוי שמזהה הזדמנויות עסקיות, וכלי ניתוח שחוסכים לך שעות של עבודה ידנית. הכל מותאם בדיוק לעסק שלך.",
      benefit: "חיסכון של 15+ שעות שבועיות"
    },
    {
      icon: Rocket,
      title: "מרגיש שאתה מבזבז זמן על משימות חוזרות?",
      question: "עייף מלבצע את אותן הפעולות שוב ושוב?",
      description: "נזהה איפה אתה מבזבז זמן ונהפוך את זה לאוטומטי. דמיין שהמערכות שלך עובדות בשבילך בלי טעויות אנוש - בדיוק ככה שחסכת זמן וכסף.",
      benefit: "הפחתת עלויות תפעול ב-40%"
    },
    {
      icon: Cloud,
      title: "המערכות שלך לא מדברות אחת עם השנייה?",
      question: "מרגיש שאתה עובד יותר מדי קשה כדי לנהל את הנתונים?",
      description: "נטמיע לך מערכות (ERP, CRM, BI) שמחוברות ועובדות בצורה חלקה - בלי להפריע לעבודה השוטפת. כל המידע במקום אחד, זמין לך תמיד.",
      benefit: "שקט נפשי ונתונים מדויקים"
    },
    {
      icon: Wrench,
      title: "רוצה לעבוד מכל מקום בלי תלות במשרד?",
      question: "מרגיש מוגבל כי הקבצים שלך לא נגישים?",
      description: "נעביר אותך לענן בצורה חכמה - Office 365, SharePoint, כלי שיתוף פעולה מתקדמים. תוכל לעבוד מכל מקום, בכל זמן, עם כל המידע בהישג יד.",
      benefit: "גמישות מלאה ושיתוף פעולה קל"
    },
    {
      icon: Laptop,
      title: "לא בטוח איזו טכנולוגיה מתאימה לעסק שלך?",
      question: "מרגיש שאתה מאבד יתרון תחרותי?",
      description: "נלווה אותך בבחירת הטכנולוגיות הנכונות ונתכנן איתך אסטרטגיה דיגיטלית ארוכת טווח. נבנה תשתית IT שתעזור לך לצמוח ולהתקדם.",
      benefit: "יתרון תחרותי אמיתי"
    },
    {
      icon: Shield,
      title: "דואג שהמידע שלך מאובטח?",
      question: "מפחד שתאבד נתונים חשובים?",
      description: "נשמור על המערכות שלך עם הגנה מקיפה, גיבויים אוטומטיים ותמיכה מהירה בכל בעיה. זמינים בווטסאפ - כי אנחנו יודעים שזה הכי נוח לך.",
      benefit: "תשובה תוך שעה, שקט נפשי 24/7"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          איך נעזור לך?
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          זיהינו 6 אתגרים שעסקים כמו שלך מתמודדים איתם - בוא נראה איך נפתור אותם ביחד
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
