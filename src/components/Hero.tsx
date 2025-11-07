import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import woodBg from "@/assets/wood-bg.avif";

export const Hero = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden" style={{ 
      backgroundImage: `url(${woodBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Lightning effects - realistic branching bolts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lightning 1 - Complex branching */}
        <svg className="absolute top-[10%] left-[15%] w-64 h-96 opacity-0 animate-pulse" style={{ animationDuration: '0.1s', animationIterationCount: '2', animationDelay: '0s' }}>
          <path d="M 30 10 L 32 25 L 35 45 L 33 65 L 38 95 L 35 125 L 40 160" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" fill="none" filter="drop-shadow(0 0 12px rgba(255,255,255,0.9)) drop-shadow(0 0 25px rgba(180,220,255,0.7))" />
          <path d="M 32 30 L 40 35 L 48 38 L 55 42" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none" filter="drop-shadow(0 0 8px rgba(255,255,255,0.7))" />
          <path d="M 35 50 L 28 55 L 22 58 L 18 63" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" fill="none" filter="drop-shadow(0 0 6px rgba(255,255,255,0.6))" />
          <path d="M 38 100 L 45 105 L 50 112" stroke="rgba(255,255,255,0.68)" strokeWidth="1.2" fill="none" />
          <path d="M 35 130 L 28 135 L 20 142" stroke="rgba(255,255,255,0.65)" strokeWidth="1.1" fill="none" />
          <path d="M 48 42 L 52 48 L 56 55" stroke="rgba(255,255,255,0.6)" strokeWidth="0.9" fill="none" />
        </svg>
        
        {/* Lightning 2 */}
        <svg className="absolute top-[20%] right-[20%] w-56 h-80 opacity-0 animate-pulse" style={{ animationDuration: '0.12s', animationIterationCount: '3', animationDelay: '3s' }}>
          <path d="M 25 8 L 28 30 L 30 55 L 32 80 L 35 110" stroke="rgba(255,255,255,0.92)" strokeWidth="2.2" fill="none" filter="drop-shadow(0 0 10px rgba(255,255,255,0.85)) drop-shadow(0 0 20px rgba(180,220,255,0.65))" />
          <path d="M 28 35 L 35 38 L 42 42 L 48 46" stroke="rgba(255,255,255,0.72)" strokeWidth="1.4" fill="none" filter="drop-shadow(0 0 7px rgba(255,255,255,0.65))" />
          <path d="M 30 60 L 24 65 L 18 70" stroke="rgba(255,255,255,0.68)" strokeWidth="1.2" fill="none" />
          <path d="M 32 85 L 38 90 L 43 96" stroke="rgba(255,255,255,0.65)" strokeWidth="1.1" fill="none" />
          <path d="M 42 44 L 46 50 L 50 58" stroke="rgba(255,255,255,0.6)" strokeWidth="0.85" fill="none" />
        </svg>
        
        {/* Lightning 3 */}
        <svg className="absolute top-[40%] left-[35%] w-52 h-88 opacity-0 animate-pulse" style={{ animationDuration: '0.11s', animationIterationCount: '2', animationDelay: '6s' }}>
          <path d="M 22 5 L 25 28 L 27 52 L 30 78 L 32 105" stroke="rgba(255,255,255,0.9)" strokeWidth="2.3" fill="none" filter="drop-shadow(0 0 11px rgba(255,255,255,0.88)) drop-shadow(0 0 22px rgba(180,220,255,0.68))" />
          <path d="M 25 32 L 32 36 L 38 40 L 44 45" stroke="rgba(255,255,255,0.7)" strokeWidth="1.35" fill="none" filter="drop-shadow(0 0 7px rgba(255,255,255,0.6))" />
          <path d="M 27 58 L 20 62 L 14 68" stroke="rgba(255,255,255,0.66)" strokeWidth="1.15" fill="none" />
          <path d="M 30 82 L 36 88 L 41 95" stroke="rgba(255,255,255,0.63)" strokeWidth="1.05" fill="none" />
        </svg>
        
        {/* Lightning 4 */}
        <svg className="absolute top-[60%] right-[30%] w-60 h-92 opacity-0 animate-pulse" style={{ animationDuration: '0.13s', animationIterationCount: '3', animationDelay: '9s' }}>
          <path d="M 28 6 L 30 32 L 33 58 L 35 86 L 38 118" stroke="rgba(255,255,255,0.94)" strokeWidth="2.4" fill="none" filter="drop-shadow(0 0 12px rgba(255,255,255,0.9)) drop-shadow(0 0 24px rgba(180,220,255,0.7))" />
          <path d="M 30 38 L 38 42 L 45 46 L 52 51" stroke="rgba(255,255,255,0.74)" strokeWidth="1.45" fill="none" filter="drop-shadow(0 0 8px rgba(255,255,255,0.68))" />
          <path d="M 33 64 L 26 68 L 20 74" stroke="rgba(255,255,255,0.69)" strokeWidth="1.25" fill="none" />
          <path d="M 35 92 L 42 98 L 48 105" stroke="rgba(255,255,255,0.66)" strokeWidth="1.15" fill="none" />
          <path d="M 45 48 L 50 54 L 55 62" stroke="rgba(255,255,255,0.62)" strokeWidth="0.95" fill="none" />
        </svg>
        
        {/* Lightning 5 */}
        <svg className="absolute top-[30%] left-[55%] w-58 h-86 opacity-0 animate-pulse" style={{ animationDuration: '0.1s', animationIterationCount: '2', animationDelay: '12s' }}>
          <path d="M 26 7 L 29 30 L 31 54 L 34 80 L 36 108" stroke="rgba(255,255,255,0.91)" strokeWidth="2.25" fill="none" filter="drop-shadow(0 0 11px rgba(255,255,255,0.87)) drop-shadow(0 0 21px rgba(180,220,255,0.67))" />
          <path d="M 29 35 L 36 39 L 42 43 L 48 48" stroke="rgba(255,255,255,0.71)" strokeWidth="1.4" fill="none" filter="drop-shadow(0 0 7px rgba(255,255,255,0.64))" />
          <path d="M 31 60 L 24 64 L 18 70" stroke="rgba(255,255,255,0.67)" strokeWidth="1.2" fill="none" />
          <path d="M 34 85 L 40 91 L 45 98" stroke="rgba(255,255,255,0.64)" strokeWidth="1.1" fill="none" />
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
