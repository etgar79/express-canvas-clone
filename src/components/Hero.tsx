import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-white/80 rounded-full animate-pulse" style={{ boxShadow: '0 0 10px 2px rgba(255,255,255,0.6)' }}></div>
        <div className="absolute top-[25%] right-[25%] w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s', boxShadow: '0 0 8px 2px rgba(255,255,255,0.5)' }}></div>
        <div className="absolute top-[40%] left-[15%] w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1s', boxShadow: '0 0 6px 1px rgba(255,255,255,0.4)' }}></div>
        <div className="absolute top-[60%] right-[30%] w-1 h-1 bg-white/75 rounded-full animate-pulse" style={{ animationDelay: '1.5s', boxShadow: '0 0 10px 2px rgba(255,255,255,0.5)' }}></div>
        <div className="absolute top-[35%] left-[40%] w-0.5 h-0.5 bg-white/65 rounded-full animate-pulse" style={{ animationDelay: '2s', boxShadow: '0 0 8px 1px rgba(255,255,255,0.4)' }}></div>
        <div className="absolute top-[70%] left-[35%] w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '2.5s', boxShadow: '0 0 10px 2px rgba(255,255,255,0.5)' }}></div>
        <div className="absolute top-[50%] right-[20%] w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '3s', boxShadow: '0 0 6px 1px rgba(255,255,255,0.3)' }}></div>
        <div className="absolute top-[20%] left-[50%] w-1 h-1 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.7s', boxShadow: '0 0 10px 2px rgba(255,255,255,0.6)' }}></div>
        <div className="absolute top-[80%] right-[40%] w-0.5 h-0.5 bg-white/65 rounded-full animate-pulse" style={{ animationDelay: '1.2s', boxShadow: '0 0 8px 1px rgba(255,255,255,0.4)' }}></div>
      </div>
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
