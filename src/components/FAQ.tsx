import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "איך עובדת התמיכה מרחוק?",
    answer: "אנחנו מתחברים למחשב שלך דרך תוכנה מאובטחת (מוצפנת AES-256). אתה רואה את כל מה שאנחנו עושים ויכול לנתק בכל רגע. הכל מתועד."
  },
  {
    question: "מה כולל שירות אבטחת הסייבר?",
    answer: "הגנה מקיפה: Firewall מתקדם, EDR (ניטור נקודות קצה), סינון דואר, הדרכות Phishing לעובדים, תגובה לאירועים, וניטור 24/7."
  },
  {
    question: "כמה זמן לוקח להקים תשתית רשת?",
    answer: "תלוי בהיקף - משרד קטן: 1-2 ימים. ארגון בינוני: 3-5 ימים. כולל תכנון, התקנה, קונפיגורציה ובדיקות."
  },
  {
    question: "האם אתם עובדים גם עם עסקים קטנים?",
    answer: "בהחלט! יש לנו חבילות מותאמות לכל גודל עסק. מעסק של אדם אחד ועד ארגון של מאות עובדים."
  },
  {
    question: "מה כוללות חבילות התחזוקה?",
    answer: "ניטור מערכות 24/7, עדכוני אבטחה, גיבויים אוטומטיים, תמיכה טלפונית ובוואטסאפ, וביקור טכנאי חודשי (בחבילות פרימיום)."
  },
  {
    question: "מה המחירים שלכם?",
    answer: "המחירים שלנו שקופים ותחרותיים. צרו איתנו קשר לשיחת ייעוץ חינם - נבין את הצרכים ונתאים הצעה."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-tech-light)' }}>
      <div className="absolute inset-0 grid-pattern"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary font-mono text-sm mb-4">
            // FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text text-primary">
            שאלות נפוצות
          </h2>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
            תשובות לשאלות שאנחנו מקבלים הכי הרבה
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-primary/15 rounded-lg px-6 overflow-hidden neon-border"
                style={{ background: 'var(--gradient-card)' }}
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
