import { Button } from "@/components/ui/button";
import { Mail, Bot, FileText } from "lucide-react";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md border-b" style={{
      background: 'linear-gradient(135deg, hsl(var(--background) / 0.95) 0%, hsl(220 20% 94% / 0.95) 100%)',
      borderColor: 'hsl(var(--primary) / 0.1)'
    }}>
      <div className="container px-4 py-4 flex justify-between items-center">
        <div className="flex gap-2 flex-wrap items-center">
          <Button 
            variant="default" 
            size="default" 
            className="font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(210 100% 55%) 0%, hsl(250 90% 60%) 100%)',
              color: 'hsl(0 0% 100%)',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            asChild
          >
            <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer">
              <Mail className="ml-2 h-5 w-5" />
              תמיכה מרחוק
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <a href="https://script.google.com/macros/s/AKfycbyD2n-9G0ncG_fEYvvN9ZzeJQqQ5QVdRBge4Jz1PCnRejUojUb33bUaTjfEbpo8dcLmDQ/exec" target="_blank" rel="noopener noreferrer">
              <Bot className="ml-2 h-4 w-4" />
              בוט טכנאים
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <a href="https://ilanmitzpe.sharepoint.com/:f:/g/test/EjbE5ycmGrlInMZXY1g_dggBaf0P-aHPkJLvrBoNoe9Swg?e=9PO514" target="_blank" rel="noopener noreferrer">
              <FileText className="ml-2 h-4 w-4" />
              קבצי עזר לטכנאי
            </a>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Tech Therapy Computers" className="h-10 w-10 md:h-12 md:w-12" />
          <h1 className="text-xl md:text-2xl font-bold" style={{
            background: 'var(--gradient-tech)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Tech Therapy Computers
          </h1>
        </div>
      </div>
    </header>
  );
};
