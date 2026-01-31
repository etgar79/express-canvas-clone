import { Button } from "@/components/ui/button";
import { Mail, Bot, FileText, Home, Briefcase, Users, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md border-b border-primary/20" style={{
      background: 'linear-gradient(135deg, hsl(236 97% 12% / 0.95) 0%, hsl(236 80% 18% / 0.95) 100%)'
    }}>
      <div className="container px-4 py-3 flex justify-between items-center">
        {/* Navigation Links */}
        <nav className="hidden md:flex gap-1 items-center">
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-primary/20" asChild>
            <a href="#hero">
              <Home className="ml-1 h-4 w-4" />
              בית
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-primary/20" asChild>
            <a href="#services">
              <Briefcase className="ml-1 h-4 w-4" />
              שירותים
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-primary/20" asChild>
            <a href="#about">
              <Users className="ml-1 h-4 w-4" />
              אודות
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-primary/20" asChild>
            <a href="#contact">
              <Phone className="ml-1 h-4 w-4" />
              צור קשר
            </a>
          </Button>
        </nav>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap items-center">
          <Button 
            variant="default" 
            size="default" 
            className="font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            style={{
              background: 'var(--gradient-button)',
              color: 'white',
              boxShadow: '0 8px 24px hsl(190 100% 42% / 0.4), 0 0 40px hsl(260 80% 55% / 0.2)',
              border: '1px solid hsl(190 100% 42% / 0.3)'
            }}
            asChild
          >
            <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer">
              <Mail className="ml-2 h-5 w-5" />
              תמיכה מרחוק
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-primary/20" asChild>
            <a href="https://script.google.com/macros/s/AKfycbyD2n-9G0ncG_fEYvvN9ZzeJQqQ5QVdRBge4Jz1PCnRejUojUb33bUaTjfEbpo8dcLmDQ/exec" target="_blank" rel="noopener noreferrer">
              <Bot className="ml-2 h-4 w-4" />
              בוט טכנאים
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-primary/20" asChild>
            <a href="https://ilanmitzpe.sharepoint.com/:f:/g/test/EjbE5ycmGrlInMZXY1g_dggBaf0P-aHPkJLvrBoNoe9Swg?e=9PO514" target="_blank" rel="noopener noreferrer">
              <FileText className="ml-2 h-4 w-4" />
              קבצי עזר לטכנאי
            </a>
          </Button>
        </div>

        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5 text-left">
            <h1 className="text-lg md:text-xl lg:text-2xl font-extrabold leading-tight tracking-tight text-white" style={{
              textShadow: '0 0 20px hsl(190 100% 42% / 0.5)'
            }}>
              Tech Therapy Computers
            </h1>
            <p className="text-xs md:text-sm font-medium text-primary">
              ליווי טכנולוגי מקצועי
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 rounded-xl blur-lg transition-all duration-500 group-hover:blur-xl" style={{
              background: 'var(--gradient-button)',
              opacity: 0.3,
              transform: 'scale(1.1)'
            }}></div>
            <div className="relative z-10 p-1.5 rounded-xl" style={{
              background: 'linear-gradient(135deg, hsl(236 85% 16% / 0.9) 0%, hsl(236 85% 12% / 0.9) 100%)',
              border: '1px solid hsl(190 100% 42% / 0.3)'
            }}>
              <img 
                src={logo} 
                alt="Tech Therapy Computers לוגו" 
                className="h-10 w-10 md:h-12 md:w-12 rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
