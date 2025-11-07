import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      <div className="container px-4 py-20 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ 
          background: 'var(--gradient-metallic)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }}>
          ייעוץ טכנולוגי מתקדם לעסקים וארגונים
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ 
          background: 'var(--gradient-metallic)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
        }}>
          ממנפים בינה מלאכותית, אוטומציה והטמעת מערכות חכמות כדי להפוך את התהליכים בארגון שלך ליעילים ורווחיים יותר – בשירות אישי המותאם בדיוק לצרכים שלך
        </p>
        <Button 
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          asChild
        >
          <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="ml-2 h-5 w-5" />
            התייעצו איתנו
          </a>
        </Button>
      </div>
    </section>
  );
};
