import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Lightning effects - animated electric bolts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lightning bolt 1 */}
        <svg className="absolute top-[15%] left-[20%] w-48 h-48 opacity-0 animate-pulse" style={{ animationDuration: '0.15s', animationIterationCount: '3', animationDelay: '0s' }}>
          <path d="M 20 10 L 25 30 L 22 30 L 28 60 L 15 35 L 18 35 L 12 10 Z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" filter="drop-shadow(0 0 8px rgba(255,255,255,0.8)) drop-shadow(0 0 15px rgba(200,230,255,0.6))" />
        </svg>
        
        {/* Lightning bolt 2 */}
        <svg className="absolute top-[35%] right-[15%] w-40 h-40 opacity-0 animate-pulse" style={{ animationDuration: '0.12s', animationIterationCount: '2', animationDelay: '1.5s' }}>
          <path d="M 15 5 L 18 25 L 16 25 L 22 50 L 12 28 L 14 28 L 10 5 Z" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" filter="drop-shadow(0 0 8px rgba(255,255,255,0.7)) drop-shadow(0 0 12px rgba(200,230,255,0.5))" />
        </svg>
        
        {/* Lightning bolt 3 */}
        <svg className="absolute top-[55%] left-[30%] w-52 h-52 opacity-0 animate-pulse" style={{ animationDuration: '0.18s', animationIterationCount: '4', animationDelay: '3s' }}>
          <path d="M 25 8 L 30 35 L 27 35 L 35 70 L 20 42 L 23 42 L 15 8 Z" fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="1.6" filter="drop-shadow(0 0 10px rgba(255,255,255,0.85)) drop-shadow(0 0 18px rgba(200,230,255,0.65))" />
        </svg>
        
        {/* Lightning bolt 4 */}
        <svg className="absolute top-[25%] left-[55%] w-36 h-36 opacity-0 animate-pulse" style={{ animationDuration: '0.14s', animationIterationCount: '2', animationDelay: '4.5s' }}>
          <path d="M 12 6 L 16 22 L 14 22 L 20 45 L 10 25 L 12 25 L 8 6 Z" fill="none" stroke="rgba(255,255,255,0.88)" strokeWidth="1.4" filter="drop-shadow(0 0 8px rgba(255,255,255,0.75)) drop-shadow(0 0 14px rgba(200,230,255,0.55))" />
        </svg>
        
        {/* Lightning bolt 5 */}
        <svg className="absolute top-[70%] right-[25%] w-44 h-44 opacity-0 animate-pulse" style={{ animationDuration: '0.16s', animationIterationCount: '3', animationDelay: '6s' }}>
          <path d="M 18 7 L 22 28 L 20 28 L 26 55 L 14 32 L 16 32 L 11 7 Z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" filter="drop-shadow(0 0 9px rgba(255,255,255,0.8)) drop-shadow(0 0 16px rgba(200,230,255,0.6))" />
        </svg>
        
        {/* Lightning bolt 6 */}
        <svg className="absolute top-[45%] right-[40%] w-38 h-38 opacity-0 animate-pulse" style={{ animationDuration: '0.13s', animationIterationCount: '2', animationDelay: '7.5s' }}>
          <path d="M 14 5 L 17 20 L 15 20 L 21 42 L 11 23 L 13 23 L 9 5 Z" fill="none" stroke="rgba(255,255,255,0.87)" strokeWidth="1.3" filter="drop-shadow(0 0 7px rgba(255,255,255,0.72)) drop-shadow(0 0 13px rgba(200,230,255,0.52))" />
        </svg>
      </div>
      <div className="container px-4 py-20 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ 
          background: 'var(--gradient-metallic)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.2)',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(255,255,255,0.3))'
        }}>
          ייעוץ טכנולוגי מתקדם לעסקים וארגונים
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ 
          background: 'var(--gradient-metallic)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4)) drop-shadow(0 0 15px rgba(255,255,255,0.2))'
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
