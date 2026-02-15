import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft, Shield, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["אוטומציה", "ייעוץ", "IT", "הטמעה"];
  
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
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-tech-blue/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
      
      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(transparent, transparent 2px, hsl(150 100% 50% / 0.02) 2px, hsl(150 100% 50% / 0.02) 4px)'
      }}></div>
      
      <div className="container px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Terminal tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 font-mono text-sm text-primary animate-fade-in">
            <Shield className="h-4 w-4" />
            <span>Cyber Security & IT Solutions</span>
            <span className="animate-flicker">_</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 animate-fade-in leading-tight">
            <span className="neon-text text-primary">אבטחה.</span>{" "}
            <span className="neon-text-cyan text-accent">רשתות.</span>{" "}
            <span className="text-foreground">פתרונות IT.</span>
          </h1>
          
          <div className="text-lg md:text-xl lg:text-2xl mb-10 leading-relaxed text-foreground/70 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            חברת IT מובילה המספקת פתרונות{" "}
            <span 
              key={currentWord} 
              className="inline-block animate-word-slide-up font-bold px-3 py-1 rounded-md border border-primary/40 bg-primary/10 text-primary font-mono"
            >
              {words[currentWord]}
            </span>
            {" "}לעסקים וארגונים
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-md font-bold neon-border transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--gradient-button)',
                color: 'hsl(220 20% 4%)',
              }}
              asChild
            >
              <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="ml-2 h-5 w-5" />
                דבר עם מומחה
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-md border-2 border-primary/40 bg-transparent hover:bg-primary/10 transition-all duration-300 hover:scale-105 text-primary font-semibold font-mono"
              asChild
            >
              <Link to="/diagnostics">
                <Terminal className="ml-2 h-5 w-5" />
                אבחון תקלות AI
              </Link>
            </Button>
          </div>
          
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {[
              { value: "10+", label: "שנות ניסיון" },
              { value: "50+", label: "לקוחות פעילים" },
              { value: "24/7", label: "זמינות" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-lg border border-primary/15 bg-primary/5">
                <div className="text-2xl md:text-3xl font-black text-primary neon-text font-mono">{stat.value}</div>
                <div className="text-sm text-foreground/50 font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
