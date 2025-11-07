import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Lightning streak effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Diagonal lightning streaks */}
        <div className="absolute top-[10%] left-[15%] w-32 h-0.5 bg-gradient-to-r from-transparent via-white/70 to-transparent rotate-45 animate-pulse" style={{ boxShadow: '0 0 20px 3px rgba(255,255,255,0.5)', animationDuration: '3s' }}></div>
        <div className="absolute top-[30%] right-[20%] w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent -rotate-45 animate-pulse" style={{ boxShadow: '0 0 15px 2px rgba(255,255,255,0.4)', animationDelay: '1s', animationDuration: '2.5s' }}></div>
        <div className="absolute top-[50%] left-[25%] w-28 h-0.5 bg-gradient-to-r from-transparent via-white/65 to-transparent rotate-12 animate-pulse" style={{ boxShadow: '0 0 18px 3px rgba(255,255,255,0.45)', animationDelay: '2s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-[65%] right-[30%] w-20 h-0.5 bg-gradient-to-r from-transparent via-white/70 to-transparent -rotate-30 animate-pulse" style={{ boxShadow: '0 0 20px 3px rgba(255,255,255,0.5)', animationDelay: '0.5s', animationDuration: '2.8s' }}></div>
        <div className="absolute top-[40%] left-[40%] w-16 h-0.5 bg-gradient-to-r from-transparent via-white/55 to-transparent rotate-60 animate-pulse" style={{ boxShadow: '0 0 12px 2px rgba(255,255,255,0.35)', animationDelay: '1.5s', animationDuration: '3.2s' }}></div>
        <div className="absolute top-[75%] left-[35%] w-26 h-0.5 bg-gradient-to-r from-transparent via-white/68 to-transparent -rotate-15 animate-pulse" style={{ boxShadow: '0 0 18px 3px rgba(255,255,255,0.48)', animationDelay: '2.5s', animationDuration: '3s' }}></div>
        <div className="absolute top-[20%] right-[35%] w-22 h-0.5 bg-gradient-to-r from-transparent via-white/62 to-transparent rotate-25 animate-pulse" style={{ boxShadow: '0 0 16px 2px rgba(255,255,255,0.42)', animationDelay: '3s', animationDuration: '2.7s' }}></div>
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
