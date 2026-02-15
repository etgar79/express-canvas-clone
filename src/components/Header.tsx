import { Button } from "@/components/ui/button";
import { Mail, Bot, FileText, Home, Briefcase, Users, Phone, Shield, Terminal, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xl border-b border-primary/20 scanline-effect" style={{
      background: 'hsl(220 20% 4% / 0.92)'
    }}>
      <div className="container px-4 py-3 flex justify-between items-center">
        {/* Navigation Links */}
        <nav className="hidden md:flex gap-1 items-center">
          <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-primary hover:bg-primary/10 font-mono text-xs" asChild>
            <a href="#hero">
              <Home className="ml-1 h-4 w-4" />
              בית
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-primary hover:bg-primary/10 font-mono text-xs" asChild>
            <a href="#services">
              <Briefcase className="ml-1 h-4 w-4" />
              שירותים
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-primary hover:bg-primary/10 font-mono text-xs" asChild>
            <a href="#about">
              <Users className="ml-1 h-4 w-4" />
              אודות
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-primary hover:bg-primary/10 font-mono text-xs" asChild>
            <a href="#contact">
              <Phone className="ml-1 h-4 w-4" />
              צור קשר
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-primary/80 hover:text-primary hover:bg-primary/10 font-mono text-xs border border-primary/30" asChild>
            <Link to="/diagnostics">
              <Terminal className="ml-1 h-4 w-4" />
              מאבחן תקלות
            </Link>
          </Button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex gap-2 items-center">
          <Button 
            variant="default" 
            size="default" 
            className="font-bold shadow-lg transition-all duration-300 hover:scale-105 neon-border"
            style={{
              background: 'var(--gradient-button)',
              color: 'hsl(220 20% 4%)',
            }}
            asChild
          >
            <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer">
              <Mail className="ml-2 h-5 w-5" />
              תמיכה מרחוק
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-primary hover:bg-primary/10 font-mono text-xs" asChild>
            <a href="https://script.google.com/macros/s/AKfycbyD2n-9G0ncG_fEYvvN9ZzeJQqQ5QVdRBge4Jz1PCnRejUojUb33bUaTjfEbpo8dcLmDQ/exec" target="_blank" rel="noopener noreferrer">
              <Bot className="ml-2 h-4 w-4" />
              בוט טכנאים
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5 text-left">
            <h1 className="text-lg md:text-xl lg:text-2xl font-extrabold leading-tight tracking-tight neon-text font-mono text-primary">
              Tech Therapy
            </h1>
            <p className="text-xs md:text-sm font-mono text-accent">
              Cyber • Network • IT
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 rounded-lg blur-lg transition-all duration-500 group-hover:blur-xl bg-primary/20"></div>
            <div className="relative z-10 p-1.5 rounded-lg border border-primary/30 bg-background/80">
              <img 
                src={logo} 
                alt="Tech Therapy Computers לוגו" 
                className="h-10 w-10 md:h-12 md:w-12 rounded-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary/20 p-4 space-y-2" style={{ background: 'hsl(220 20% 4% / 0.98)' }}>
          <a href="#hero" className="block py-2 px-4 text-foreground/70 hover:text-primary font-mono text-sm" onClick={() => setMobileMenuOpen(false)}>בית</a>
          <a href="#services" className="block py-2 px-4 text-foreground/70 hover:text-primary font-mono text-sm" onClick={() => setMobileMenuOpen(false)}>שירותים</a>
          <a href="#about" className="block py-2 px-4 text-foreground/70 hover:text-primary font-mono text-sm" onClick={() => setMobileMenuOpen(false)}>אודות</a>
          <a href="#contact" className="block py-2 px-4 text-foreground/70 hover:text-primary font-mono text-sm" onClick={() => setMobileMenuOpen(false)}>צור קשר</a>
          <Link to="/diagnostics" className="block py-2 px-4 text-primary font-mono text-sm border border-primary/30 rounded-md text-center" onClick={() => setMobileMenuOpen(false)}>
            <Terminal className="inline ml-1 h-4 w-4" />
            מאבחן תקלות AI
          </Link>
        </div>
      )}
    </header>
  );
};
