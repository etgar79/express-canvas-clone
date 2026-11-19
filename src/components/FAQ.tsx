import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    question: "איך עובדת התמיכה מרחוק?",
    answer: "אני מתחבר למחשב שלכם דרך תוכנה מאובטחת (מוצפנת AES-256). אתם רואים את כל מה שאני עושה ויכולים לנתק בכל רגע. הכל מתועד."
  },
  {
    question: "מה כולל שירות הייעוץ הטכנולוגי?",
    answer: "מיפוי צרכים, בחירת מערכות מתאימות, תכנון תשתיות, הטמעה מלאה, הדרכת עובדים וליווי שוטף."
  },
  {
    question: "כמה זמן לוקח להקים תשתית רשת?",
    answer: "תלוי בהיקף – משרד קטן: 1-2 ימים. ארגון בינוני: 3-5 ימים. כולל תכנון, התקנה, קונפיגורציה ובדיקות."
  },
  {
    question: "האם אתה עובד גם עם עסקים קטנים?",
    answer: "בהחלט! יש לי חבילות מותאמות לכל גודל עסק. מעסק של אדם אחד ועד ארגון של מאות עובדים."
  },
  {
    question: "מה כוללות חבילות התחזוקה?",
    answer: "ניטור מערכות שוטף, עדכוני אבטחה, גיבויים אוטומטיים, תמיכה טלפונית ובוואטסאפ, וביקור טכנאי חודשי (בחבילות פרימיום)."
  },
  {
    question: "מה המחירים שלך?",
    answer: "המחירים שלי שקופים ותחרותיים. צרו איתי קשר לשיחת ייעוץ חינם – אבין את הצרכים ואתאים הצעה."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent-text text-sm mb-4">
            שאלות ותשובות
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            שאלתם? <span className="text-accent">אני עונה</span>
          </h2>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
            הנה תשובות לשאלות שהכי שואלים אותי
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-2xl px-6 overflow-hidden bg-card shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary py-5 text-right">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/50 pb-5 leading-relaxed">
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
