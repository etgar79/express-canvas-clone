import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import heroIllustration from "@/assets/hero-illustration.png";

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
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden" style={{ 
      background: 'var(--gradient-hero)'
    }}>
      {/* Animated tech grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(190 100% 42% / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(190 100% 42% / 0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-tech-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-right order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in text-white" style={{
              textShadow: '0 0 40px hsl(190 100% 42% / 0.4), 0 0 80px hsl(260 80% 55% / 0.2)'
            }}>
              תמיכה טכנית חכמה לעסק שלך
            </h1>
            <div className="text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed text-white/90">
              מלווים אותך בכל שלב - מאפיון הצורך ועד הטמעה מלאה של{" "}
              <span 
                key={currentWord} 
                className="inline-block animate-word-slide-up font-bold px-3 py-1 rounded-lg"
                style={{
                  background: 'var(--gradient-button)',
                  color: 'white'
                }}
              >
                {words[currentWord]}
              </span>
              {" "}בעסק שלך
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 animate-bounce-slow font-bold"
                style={{
                  background: 'var(--gradient-button)',
                  color: 'white'
                }}
                asChild
              >
                <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="ml-2 h-5 w-5" />
                  התחל עכשיו
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full border-2 border-primary/50 bg-transparent hover:bg-primary/10 transition-all duration-300 hover:scale-105 text-white font-semibold"
                asChild
              >
                <a href="#contact">
                  <ArrowLeft className="ml-2 h-5 w-5" />
                  נשמח לשמוע על הצרכים שלך
                </a>
              </Button>
            </div>
          </div>
          
          {/* Hero Illustration */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40" style={{
                background: 'var(--gradient-button)',
                transform: 'scale(0.9)'
              }}></div>
              <img 
                src={heroIllustration} 
                alt="תמיכה טכנית מקצועית" 
                className="relative z-10 w-full max-w-md lg:max-w-lg rounded-2xl shadow-2xl"
                style={{
                  boxShadow: '0 25px 50px -12px hsl(190 100% 42% / 0.3)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
