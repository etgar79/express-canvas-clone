import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "יוסי כהן",
    company: "חברת הייטק בע״מ",
    text: "שירות מקצועי ואדיב. פתרו לנו בעיה שגרמה לנו כאב ראש במשך חודשים תוך שעות ספורות!",
    rating: 5
  },
  {
    name: "מיכל לוי",
    company: "משרד עורכי דין",
    text: "הליווי הטכנולוגי שקיבלנו היה מעולה. הצוות זמין תמיד ומבין את הצרכים של העסק.",
    rating: 5
  },
  {
    name: "דוד אברהם",
    company: "רשת חנויות",
    text: "חסכו לנו זמן וכסף עם האוטומציה שהטמיעו. ממליץ בחום לכל עסק!",
    rating: 5
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white" style={{
          textShadow: '0 0 30px hsl(190 100% 42% / 0.4)'
        }}>
          מה הלקוחות אומרים
        </h2>
        <p className="text-lg text-white/70 text-center mb-16 max-w-2xl mx-auto">
          הצלחנו לעזור למאות עסקים - הנה מה שהם אומרים עלינו
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="p-6 border border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              style={{ background: 'var(--gradient-card)' }}
            >
              <Quote className="h-8 w-8 text-primary/40 mb-4" />
              <p className="text-white/80 leading-relaxed mb-6 text-lg italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <div className="border-t border-primary/20 pt-4">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-white/60 text-sm">{testimonial.company}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
