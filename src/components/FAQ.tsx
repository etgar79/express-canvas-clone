import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "איך עובדת התמיכה מרחוק?",
    answer: "התמיכה מרחוק מתבצעת באמצעות תוכנה מאובטחת שמאפשרת לנו להתחבר למחשב שלך ולפתור בעיות בזמן אמת. אתה רואה את כל מה שאנחנו עושים ויכול לעצור את החיבור בכל רגע."
  },
  {
    question: "מה זמני התגובה שלכם?",
    answer: "אנחנו זמינים בוואטסאפ 24/7 להודעות. בימי עבודה (ראשון-חמישי) אנחנו מגיבים תוך שעה לכל היותר, ובמקרים דחופים - מיידית."
  },
  {
    question: "האם אתם מציעים חבילות תחזוקה חודשיות?",
    answer: "כן! יש לנו מגוון חבילות תחזוקה המותאמות לגודל העסק והצרכים שלו. החבילות כוללות תמיכה שוטפת, גיבויים, עדכוני אבטחה ועוד."
  },
  {
    question: "מה סוגי העסקים שאתם עובדים איתם?",
    answer: "אנחנו עובדים עם עסקים מכל הגדלים - מעסקים קטנים ועד ארגונים גדולים. יש לנו ניסיון עם משרדי עורכי דין, רואי חשבון, חברות הייטק, רשתות קמעונאיות ועוד."
  },
  {
    question: "האם אתם מספקים הדרכות לעובדים?",
    answer: "בהחלט! אנחנו מאמינים שהדרכה נכונה חוסכת בעיות בעתיד. אנחנו מציעים הדרכות מותאמות אישית על מערכות חדשות, אבטחת מידע, וכלי עבודה."
  },
  {
    question: "מה המחירים שלכם?",
    answer: "המחירים שלנו שקופים ומותאמים לצרכים שלכם. צרו איתנו קשר לקבלת הצעת מחיר מותאמת אישית ללא התחייבות."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-tech-light)' }}>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white" style={{
          textShadow: '0 0 30px hsl(190 100% 42% / 0.4)'
        }}>
          שאלות נפוצות
        </h2>
        <p className="text-lg text-white/70 text-center mb-16 max-w-2xl mx-auto">
          תשובות לשאלות הנפוצות ביותר שאנחנו מקבלים
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-primary/20 rounded-xl px-6 overflow-hidden"
                style={{ background: 'var(--gradient-card)' }}
              >
                <AccordionTrigger className="text-lg font-semibold text-white hover:text-primary py-6 text-right">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
