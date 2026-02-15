import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "אבי כהן",
    company: "חברת הייטק, 120 עובדים",
    text: "Tech Therapy הקימו לנו תשתית רשת מאובטחת עם מערכת אבטחת סייבר מתקדמת. מאז - אפס תקלות אבטחה.",
    rating: 5
  },
  {
    name: "מיכל לוי",
    company: "משרד עורכי דין",
    text: "מעבר חלק לענן עם Office 365, מצלמות אבטחה ו-VPN מאובטח. הזמינות שלהם בוואטסאפ פשוט יוצאת דופן.",
    rating: 5
  },
  {
    name: "דוד אברהם",
    company: "רשת חנויות, 8 סניפים",
    text: "חיברו את כל הסניפים לרשת אחת מאובטחת, התקינו מצלמות אבטחה ומערכת בית חכם. חיסכון של 40% בזמן ניהול.",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      <div className="absolute inset-0 hex-pattern"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary font-mono text-sm mb-4">
            // testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text text-primary">
            מה הלקוחות אומרים
          </h2>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
            לקוחות שסמכו עלינו ושידרגו את ה-IT שלהם
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="p-6 border border-primary/15 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2 neon-border"
              style={{ background: 'var(--gradient-card)' }}
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-foreground/60 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <div className="border-t border-primary/15 pt-4">
                <p className="font-bold text-foreground">{testimonial.name}</p>
                <p className="text-foreground/40 text-sm font-mono">{testimonial.company}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
