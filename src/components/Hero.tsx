import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

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
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden" style={{ 
      background: 'var(--gradient-hero)'
    }}>
      {/* Animated tech grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(210 100% 70% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(210 100% 70% / 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container px-4 py-24 text-center relative z-10">
        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in" style={{
            color: 'white',
            textShadow: '0 0 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(168, 85, 247, 0.3)'
          }}>
            אנחנו כאן לתמוך, להדריך ולהטמיע את הטכנולוגיה בעסק שלך
          </h1>
          <div className="text-xl md:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed text-white/90">
            מלווים אתכם בכל שלב - מאפיון הצורך ועד הטמעה מלאה של{" "}
            <span 
              key={currentWord} 
              className="inline-block animate-word-slide-up font-bold px-4 py-1 rounded-lg"
              style={{
                background: 'var(--gradient-tech)',
                color: 'white'
              }}
            >
              {words[currentWord]}
            </span>
            {" "}בעסק שלכם
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            size="lg"
            className="text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 animate-bounce-slow"
            style={{
              background: 'var(--gradient-tech)',
              color: 'white'
            }}
            asChild
          >
            <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="ml-2 h-6 w-6" />
              נשמח לשמוע על הצרכים שלכם
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};
