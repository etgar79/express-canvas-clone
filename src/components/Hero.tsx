import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft, Heart, Terminal } from "lucide-react";
import heroImage from "@/assets/hero-image.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["לתמוך", "להדריך", "להטמיע", "ללוות"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-background">
      {/* Soft gradient background */}
      <div className="absolute inset-0 grid-pattern"></div>
      
      {/* Warm floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/6 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
      
      <div className="container px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          {/* Image */}
          <div className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 animate-fade-in">
            <img src={heroImage} alt="תמונת Hero" className="w-full h-full object-contain rounded-2xl" />
          </div>

          {/* Text content */}
          <div className="text-center lg:text-right flex-1">
            {/* Warm welcome tag */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/25 bg-accent/8 mb-8 text-sm text-accent animate-fade-in">
              <Heart className="h-4 w-4" />
              <span>הטכנולוגיה שעובדת בשבילך</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in leading-tight tracking-tight">
              <span className="text-foreground">אנחנו כאן</span>{" "}
              <span 
                key={currentWord} 
                className="inline-block animate-word-slide-up text-accent"
              >
                {words[currentWord]}
              </span>
              <br />
              <span className="text-foreground/90">את הטכנולוגיה בעסק שלך</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-10 leading-relaxed text-foreground/60 animate-fade-in max-w-2xl mx-auto lg:mx-0" style={{ animationDelay: '0.2s' }}>
              ליווי אישי, פתרונות מותאמים ותמיכה אנושית - כי טכנולוגיה צריכה לשרת אתכם, לא להפך
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-accent text-accent-foreground shadow-lg"
                asChild
              >
                <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="ml-2 h-5 w-5" />
                  בואו נדבר
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-xl border-2 border-foreground/20 bg-transparent hover:bg-foreground/5 transition-all duration-300 hover:scale-105 text-foreground font-semibold"
                asChild
              >
                <Link to="/diagnostics">
                  <Terminal className="ml-2 h-5 w-5" />
                  אבחון תקלות חינם
                </Link>
              </Button>
            </div>
            
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                { value: "10+", label: "שנות ניסיון" },
                { value: "50+", label: "לקוחות מרוצים" },
                { value: "24/7", label: "תמיד כאן בשבילך" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-xl border border-foreground/10 bg-foreground/5">
                  <div className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-foreground/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
