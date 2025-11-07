import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import woodBg from "@/assets/wood-elegant.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden" style={{ 
      backgroundImage: `url(${woodBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* Lightning effects - flowing along wood grain (vertical) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lightning 1 - Vertical flow along wood grain */}
        <svg className="absolute top-0 left-[12%] w-2 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.08s', animationIterationCount: '2', animationDelay: '0s' }}>
          <path d="M 1 0 L 1.2 80 L 0.8 160 L 1.3 240 L 0.7 320 L 1.1 400 L 0.9 480 L 1.2 560" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none" filter="drop-shadow(0 0 15px rgba(255,255,255,0.95)) drop-shadow(0 0 30px rgba(180,220,255,0.8))" />
          <path d="M 1.2 100 L 2.5 110 L 3.8 120" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none" filter="drop-shadow(0 0 8px rgba(255,255,255,0.7))" />
          <path d="M 0.8 200 L -0.5 210 L -1.2 220" stroke="rgba(255,255,255,0.65)" strokeWidth="1" fill="none" filter="drop-shadow(0 0 6px rgba(255,255,255,0.6))" />
          <path d="M 1.3 350 L 2.2 360 L 3 370" stroke="rgba(255,255,255,0.68)" strokeWidth="1.1" fill="none" />
        </svg>
        
        {/* Lightning 2 */}
        <svg className="absolute top-0 left-[28%] w-2 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.09s', animationIterationCount: '3', animationDelay: '3s' }}>
          <path d="M 1 0 L 0.9 90 L 1.1 180 L 0.8 270 L 1.2 360 L 0.95 450 L 1.05 540" stroke="rgba(255,255,255,0.88)" strokeWidth="2.1" fill="none" filter="drop-shadow(0 0 14px rgba(255,255,255,0.9)) drop-shadow(0 0 28px rgba(180,220,255,0.75))" />
          <path d="M 0.9 120 L -0.3 130 L -1 140" stroke="rgba(255,255,255,0.68)" strokeWidth="1.15" fill="none" filter="drop-shadow(0 0 7px rgba(255,255,255,0.65))" />
          <path d="M 1.2 380 L 2.3 390 L 3.1 400" stroke="rgba(255,255,255,0.66)" strokeWidth="1.05" fill="none" />
        </svg>
        
        {/* Lightning 3 */}
        <svg className="absolute top-0 right-[35%] w-2 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.07s', animationIterationCount: '2', animationDelay: '6s' }}>
          <path d="M 1 0 L 1.1 85 L 0.9 170 L 1.2 255 L 0.85 340 L 1.15 425 L 0.95 510" stroke="rgba(255,255,255,0.92)" strokeWidth="2.2" fill="none" filter="drop-shadow(0 0 16px rgba(255,255,255,0.92)) drop-shadow(0 0 32px rgba(180,220,255,0.82))" />
          <path d="M 1.1 110 L 2.4 120 L 3.5 130" stroke="rgba(255,255,255,0.72)" strokeWidth="1.25" fill="none" filter="drop-shadow(0 0 8px rgba(255,255,255,0.68))" />
          <path d="M 0.85 300 L -0.4 310 L -1.1 320" stroke="rgba(255,255,255,0.67)" strokeWidth="1.1" fill="none" />
        </svg>
        
        {/* Lightning 4 */}
        <svg className="absolute top-0 right-[18%] w-2 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.085s', animationIterationCount: '3', animationDelay: '9s' }}>
          <path d="M 1 0 L 0.95 88 L 1.05 176 L 0.92 264 L 1.08 352 L 0.98 440 L 1.02 528" stroke="rgba(255,255,255,0.91)" strokeWidth="2.15" fill="none" filter="drop-shadow(0 0 15px rgba(255,255,255,0.93)) drop-shadow(0 0 30px rgba(180,220,255,0.78))" />
          <path d="M 0.95 130 L -0.2 140 L -0.9 150" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none" filter="drop-shadow(0 0 7px rgba(255,255,255,0.66))" />
          <path d="M 1.08 370 L 2.1 380 L 2.9 390" stroke="rgba(255,255,255,0.69)" strokeWidth="1.12" fill="none" />
        </svg>
        
        {/* Lightning 5 */}
        <svg className="absolute top-0 left-[45%] w-2 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.075s', animationIterationCount: '2', animationDelay: '12s' }}>
          <path d="M 1 0 L 1.05 82 L 0.95 164 L 1.1 246 L 0.9 328 L 1.03 410 L 0.97 492" stroke="rgba(255,255,255,0.89)" strokeWidth="2.05" fill="none" filter="drop-shadow(0 0 14px rgba(255,255,255,0.91)) drop-shadow(0 0 28px rgba(180,220,255,0.76))" />
          <path d="M 1.05 140 L 2.2 150 L 3.2 160" stroke="rgba(255,255,255,0.71)" strokeWidth="1.18" fill="none" filter="drop-shadow(0 0 7px rgba(255,255,255,0.67))" />
          <path d="M 0.9 310 L -0.3 320 L -1 330" stroke="rgba(255,255,255,0.68)" strokeWidth="1.08" fill="none" />
        </svg>
        
        {/* Lightning 6 */}
        <svg className="absolute top-0 right-[8%] w-2 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.08s', animationIterationCount: '2', animationDelay: '15s' }}>
          <path d="M 1 0 L 0.97 86 L 1.03 172 L 0.94 258 L 1.06 344 L 0.99 430 L 1.01 516" stroke="rgba(255,255,255,0.9)" strokeWidth="2.08" fill="none" filter="drop-shadow(0 0 15px rgba(255,255,255,0.92)) drop-shadow(0 0 29px rgba(180,220,255,0.77))" />
          <path d="M 0.97 115 L -0.25 125 L -0.95 135" stroke="rgba(255,255,255,0.69)" strokeWidth="1.16" fill="none" filter="drop-shadow(0 0 7px rgba(255,255,255,0.65))" />
        </svg>
        
        {/* Lightning 7 */}
        <svg className="absolute top-0 left-[65%] w-2 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.09s', animationIterationCount: '3', animationDelay: '18s' }}>
          <path d="M 1 0 L 1.04 84 L 0.96 168 L 1.09 252 L 0.91 336 L 1.02 420 L 0.98 504" stroke="rgba(255,255,255,0.88)" strokeWidth="2.12" fill="none" filter="drop-shadow(0 0 14px rgba(255,255,255,0.9)) drop-shadow(0 0 27px rgba(180,220,255,0.74))" />
          <path d="M 1.09 270 L 2.15 280 L 3 290" stroke="rgba(255,255,255,0.7)" strokeWidth="1.14" fill="none" />
        </svg>
      </div>
      <div className="container px-4 py-20 text-center relative z-10">
        <div className="inline-block px-12 py-8 mb-4 rounded-3xl border-2" style={{ 
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
          backdropFilter: 'blur(15px)',
          borderColor: 'rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ 
            background: 'var(--gradient-metallic)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(255,255,255,0.3))'
          }}>
            ייעוץ טכנולוגי מתקדם לעסקים וארגונים
          </h1>
          <p className="text-xl md:text-2xl mb-0 max-w-3xl mx-auto leading-relaxed" style={{ 
            background: 'linear-gradient(135deg, hsl(0 0% 95%) 0%, hsl(0 0% 85%) 50%, hsl(0 0% 95%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.3))'
          }}>
          ממנפים בינה מלאכותית, אוטומציה והטמעת מערכות חכמות כדי להפוך את התהליכים בארגון שלך ליעילים ורווחיים יותר – בשירות אישי המותאם בדיוק לצרכים שלך
          </p>
        </div>
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
