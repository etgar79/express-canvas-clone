import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

export const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["אוטומציה", "בינה מלאכותית", "יעילות", "חדשנות"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden" style={{ 
      background: 'var(--gradient-hero)'
    }}>
      {/* Logo as background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
        <img 
          src={logo} 
          alt="" 
          className="w-[500px] h-auto object-contain"
        />
      </div>
      
      {/* Lightning effects - dramatic bolts like in photo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lightning 1 - Main bolt left side */}
        <svg className="absolute top-0 left-[8%] w-3 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.06s', animationIterationCount: '4', animationDelay: '0s' }}>
          <path d="M 1.5 0 L 1.6 90 L 1.4 180 L 1.7 270 L 1.3 360 L 1.5 450 L 1.6 540 L 1.4 630" stroke="rgba(255,255,255,0.98)" strokeWidth="3" fill="none" filter="drop-shadow(0 0 20px rgba(255,255,255,1)) drop-shadow(0 0 40px rgba(200,220,255,1)) drop-shadow(0 0 60px rgba(180,210,255,0.8))" />
          <path d="M 1.6 100 L 3.5 110 L 5 120 L 6.5 130" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" fill="none" filter="drop-shadow(0 0 12px rgba(255,255,255,0.9))" />
          <path d="M 1.4 190 L -0.5 200 L -2 210 L -3 220" stroke="rgba(255,255,255,0.82)" strokeWidth="1.6" fill="none" filter="drop-shadow(0 0 10px rgba(255,255,255,0.85))" />
          <path d="M 1.7 280 L 3.8 290 L 5.5 300" stroke="rgba(255,255,255,0.78)" strokeWidth="1.4" fill="none" />
          <path d="M 1.3 370 L -0.8 380 L -2.2 390" stroke="rgba(255,255,255,0.75)" strokeWidth="1.3" fill="none" />
          <path d="M 5 125 L 6.5 132 L 8 140" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1" fill="none" />
          <path d="M -2 215 L -3.5 222 L -4.5 230" stroke="rgba(255,255,255,0.68)" strokeWidth="1" fill="none" />
        </svg>
        
        {/* Lightning 2 - Center dramatic */}
        <svg className="absolute top-0 left-[35%] w-4 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.08s', animationIterationCount: '5', animationDelay: '2s' }}>
          <path d="M 2 0 L 2.1 85 L 1.9 170 L 2.2 255 L 1.8 340 L 2 425 L 2.1 510 L 1.9 595" stroke="rgba(255,255,255,0.99)" strokeWidth="3.5" fill="none" filter="drop-shadow(0 0 25px rgba(255,255,255,1)) drop-shadow(0 0 50px rgba(200,220,255,1)) drop-shadow(0 0 75px rgba(180,210,255,0.9))" />
          <path d="M 2.1 95 L 4.5 105 L 6.5 115 L 8 125 L 9.5 135" stroke="rgba(255,255,255,0.88)" strokeWidth="2" fill="none" filter="drop-shadow(0 0 15px rgba(255,255,255,0.95))" />
          <path d="M 1.9 180 L -0.5 190 L -2.5 200 L -4 210" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" fill="none" filter="drop-shadow(0 0 12px rgba(255,255,255,0.9))" />
          <path d="M 2.2 265 L 4.8 275 L 7 285 L 9 295" stroke="rgba(255,255,255,0.82)" strokeWidth="1.7" fill="none" />
          <path d="M 1.8 350 L -0.8 360 L -2.8 370 L -4.5 380" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" fill="none" />
          <path d="M 8 130 L 9.5 138 L 11 147 L 12.5 156" stroke="rgba(255,255,255,0.75)" strokeWidth="1.3" fill="none" />
          <path d="M 6.5 120 L 8 127 L 9.5 135" stroke="rgba(255,255,255,0.72)" strokeWidth="1.2" fill="none" />
          <path d="M -2.5 205 L -4 212 L -5.5 220 L -7 228" stroke="rgba(255,255,255,0.7)" strokeWidth="1.15" fill="none" />
        </svg>
        
        {/* Lightning 3 - Right side */}
        <svg className="absolute top-0 right-[12%] w-3 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.07s', animationIterationCount: '3', animationDelay: '4s' }}>
          <path d="M 1.5 0 L 1.4 88 L 1.6 176 L 1.3 264 L 1.7 352 L 1.5 440 L 1.4 528" stroke="rgba(255,255,255,0.97)" strokeWidth="2.8" fill="none" filter="drop-shadow(0 0 18px rgba(255,255,255,0.98)) drop-shadow(0 0 36px rgba(200,220,255,0.95)) drop-shadow(0 0 54px rgba(180,210,255,0.8))" />
          <path d="M 1.4 98 L -0.8 108 L -2.5 118 L -4 128" stroke="rgba(255,255,255,0.84)" strokeWidth="1.7" fill="none" filter="drop-shadow(0 0 11px rgba(255,255,255,0.88))" />
          <path d="M 1.6 186 L 3.5 196 L 5 206 L 6.5 216" stroke="rgba(255,255,255,0.81)" strokeWidth="1.5" fill="none" filter="drop-shadow(0 0 10px rgba(255,255,255,0.84))" />
          <path d="M 1.3 274 L -0.7 284 L -2.3 294" stroke="rgba(255,255,255,0.77)" strokeWidth="1.35" fill="none" />
          <path d="M 5 211 L 6.5 219 L 8 228" stroke="rgba(255,255,255,0.73)" strokeWidth="1.15" fill="none" />
        </svg>
        
        {/* Lightning 4 - Left center */}
        <svg className="absolute top-0 left-[22%] w-3 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.075s', animationIterationCount: '4', animationDelay: '6s' }}>
          <path d="M 1.5 0 L 1.55 92 L 1.45 184 L 1.6 276 L 1.4 368 L 1.5 460 L 1.55 552" stroke="rgba(255,255,255,0.96)" strokeWidth="2.9" fill="none" filter="drop-shadow(0 0 19px rgba(255,255,255,0.97)) drop-shadow(0 0 38px rgba(200,220,255,0.94)) drop-shadow(0 0 57px rgba(180,210,255,0.78))" />
          <path d="M 1.55 102 L 3.3 112 L 4.8 122 L 6.2 132" stroke="rgba(255,255,255,0.83)" strokeWidth="1.65" fill="none" filter="drop-shadow(0 0 11px rgba(255,255,255,0.87))" />
          <path d="M 1.45 194 L -0.3 204 L -1.8 214" stroke="rgba(255,255,255,0.79)" strokeWidth="1.45" fill="none" />
          <path d="M 4.8 127 L 6.2 135 L 7.5 144" stroke="rgba(255,255,255,0.74)" strokeWidth="1.2" fill="none" />
        </svg>
        
        {/* Lightning 5 - Right center */}
        <svg className="absolute top-0 right-[28%] w-3 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.065s', animationIterationCount: '3', animationDelay: '8s' }}>
          <path d="M 1.5 0 L 1.48 87 L 1.52 174 L 1.46 261 L 1.54 348 L 1.5 435 L 1.48 522" stroke="rgba(255,255,255,0.98)" strokeWidth="3.2" fill="none" filter="drop-shadow(0 0 22px rgba(255,255,255,1)) drop-shadow(0 0 44px rgba(200,220,255,0.98)) drop-shadow(0 0 66px rgba(180,210,255,0.85))" />
          <path d="M 1.48 97 L -0.7 107 L -2.3 117 L -3.8 127" stroke="rgba(255,255,255,0.86)" strokeWidth="1.75" fill="none" filter="drop-shadow(0 0 12px rgba(255,255,255,0.9))" />
          <path d="M 1.52 184 L 3.4 194 L 5 204 L 6.5 214" stroke="rgba(255,255,255,0.83)" strokeWidth="1.6" fill="none" filter="drop-shadow(0 0 11px rgba(255,255,255,0.86))" />
          <path d="M -2.3 122 L -3.8 130 L -5.2 139" stroke="rgba(255,255,255,0.76)" strokeWidth="1.25" fill="none" />
          <path d="M 5 209 L 6.5 217 L 8 226 L 9.5 235" stroke="rgba(255,255,255,0.72)" strokeWidth="1.18" fill="none" />
        </svg>
        
        {/* Lightning 6 - Far left */}
        <svg className="absolute top-0 left-[50%] w-3 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.07s', animationIterationCount: '4', animationDelay: '10s' }}>
          <path d="M 1.5 0 L 1.52 89 L 1.48 178 L 1.54 267 L 1.46 356 L 1.5 445 L 1.52 534" stroke="rgba(255,255,255,0.97)" strokeWidth="3" fill="none" filter="drop-shadow(0 0 20px rgba(255,255,255,0.99)) drop-shadow(0 0 40px rgba(200,220,255,0.96)) drop-shadow(0 0 60px rgba(180,210,255,0.82))" />
          <path d="M 1.52 99 L 3.5 109 L 5.2 119 L 6.8 129" stroke="rgba(255,255,255,0.84)" strokeWidth="1.7" fill="none" filter="drop-shadow(0 0 12px rgba(255,255,255,0.88))" />
          <path d="M 1.48 188 L -0.5 198 L -2.2 208" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" />
          <path d="M 5.2 124 L 6.8 132 L 8.3 141" stroke="rgba(255,255,255,0.75)" strokeWidth="1.22" fill="none" />
        </svg>
        
        {/* Lightning 7 - Far right */}
        <svg className="absolute top-0 right-[45%] w-3 h-full opacity-0 animate-pulse" style={{ animationDuration: '0.08s', animationIterationCount: '5', animationDelay: '12s' }}>
          <path d="M 1.5 0 L 1.47 86 L 1.53 172 L 1.45 258 L 1.55 344 L 1.5 430 L 1.47 516" stroke="rgba(255,255,255,0.98)" strokeWidth="3.1" fill="none" filter="drop-shadow(0 0 21px rgba(255,255,255,1)) drop-shadow(0 0 42px rgba(200,220,255,0.97)) drop-shadow(0 0 63px rgba(180,210,255,0.83))" />
          <path d="M 1.47 96 L -0.6 106 L -2.4 116 L -4 126 L -5.5 136" stroke="rgba(255,255,255,0.87)" strokeWidth="1.85" fill="none" filter="drop-shadow(0 0 13px rgba(255,255,255,0.91))" />
          <path d="M 1.53 182 L 3.6 192 L 5.4 202 L 7 212" stroke="rgba(255,255,255,0.84)" strokeWidth="1.65" fill="none" filter="drop-shadow(0 0 11px rgba(255,255,255,0.87))" />
          <path d="M -4 131 L -5.5 139 L -7 148 L -8.5 157" stroke="rgba(255,255,255,0.77)" strokeWidth="1.3" fill="none" />
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
            אנחנו כאן לתמוך, להדריך ולהטמיע את הטכנולוגיה בעסק שלך
          </h1>
          <div className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto leading-relaxed min-h-[120px] flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, hsl(0 0% 95%) 0%, hsl(0 0% 85%) 50%, hsl(0 0% 95%) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.3))'
          }}>
            <span>
              מלווים אתכם בכל שלב - מאפיון הצורך ועד הטמעה מלאה של{" "}
              <span key={currentWord} className="inline-block animate-word-slide-up font-bold">
                {words[currentWord]}
              </span>
              {" "}בעסק שלכם
            </span>
          </div>
        </div>
        <Button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-slow"
          asChild
        >
          <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="ml-2 h-5 w-5" />
            נשמח לשמוע על הצרכים שלכם
          </a>
        </Button>
      </div>
    </section>
  );
};
