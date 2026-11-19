import { whatsappUrl } from "@/lib/whatsapp.mjs";
import { Button } from "@/components/ui/button";
import { Mail, Home, Briefcase, Users, Phone, Sparkles, MessageCircle, Menu, X, Smartphone, Apple, UserCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xl border-b border-border bg-background/95">
      <div className="container px-3 py-3 flex justify-between items-center">
        {/* Navigation Links */}
        <nav className="hidden lg:flex gap-0.5 items-center">
          <Button variant="ghost" size="sm" className="min-h-11 text-foreground/70 hover:text-primary hover:bg-primary/10 text-xs" asChild>
            <a href="/#hero">
              <Home className="ml-1 h-4 w-4" />
              בית
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 text-foreground/70 hover:text-primary hover:bg-primary/10 text-xs" asChild>
            <Link to="/ai-services">
              <Sparkles className="ml-1 h-4 w-4" />
              AI לעסקים
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 text-primary/80 hover:text-primary hover:bg-primary/10 text-xs border border-primary/30" asChild>
            <Link to="/it-maintenance">
              <Briefcase className="ml-1 h-4 w-4" />
              תחזוקה לעסקים
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 text-foreground/70 hover:text-primary hover:bg-primary/10 text-xs" asChild>
            <a href="/#about">
              <Users className="ml-1 h-4 w-4" />
              אודות
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 text-foreground/70 hover:text-primary hover:bg-primary/10 text-xs" asChild>
            <a href="/#contact">
              <Phone className="ml-1 h-4 w-4" />
              צור קשר
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 text-foreground/70 hover:text-primary hover:bg-primary/10 text-xs" asChild>
            <Link to="/support">
              <UserCheck className="ml-1 h-4 w-4" />
              ללקוחות קיימים
            </Link>
          </Button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex gap-1 items-center">
          <Button
            variant="default"
            size="default"
            className="min-h-11 px-3 font-bold shadow-lg transition-all duration-300 hover:shadow-xl bg-primary text-primary-foreground"
            asChild
          >
            <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer">
              <Mail className="ml-2 h-5 w-5" />
              תמיכה מרחוק
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 min-w-11 text-foreground/60 hover:text-primary hover:bg-primary/10 text-xs" asChild title="תמיכה מרחוק לאנדרואיד">
            <a href="https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid" target="_blank" rel="noopener noreferrer" aria-label="תמיכה מרחוק לאנדרואיד">
              <Smartphone className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="min-h-11 min-w-11 text-foreground/60 hover:text-primary hover:bg-primary/10 text-xs" asChild title="תמיכה מרחוק לאייפון">
            <a href="https://apps.apple.com/us/app/anydesk-remote-desktop/id1176131273" target="_blank" rel="noopener noreferrer" aria-label="תמיכה מרחוק לאייפון">
              <Apple className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden min-h-11 min-w-11 text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Logo & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-lg md:text-xl lg:text-2xl font-extrabold leading-tight tracking-tight text-accent-text">
              Tech Therapy
            </span>
            <p className="text-xs md:text-sm text-foreground/50">
              ייעוץ · אוטומציה · IT
            </p>
          </div>
          <div className="relative group shrink-0">
            <div className="absolute inset-0 rounded-lg blur-lg transition-all duration-500 group-hover:blur-xl bg-primary/20"></div>
            <div className="relative z-10 p-1.5 rounded-lg border border-primary/30 bg-background/80">
              <img
                src={logo}
                alt="Tech Therapy Computers לוגו"
                className="h-10 w-10 md:h-12 md:w-12 rounded-md transition-transform duration-300 motion-safe:group-hover:scale-105 shrink-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile quick actions */}
      <div className="lg:hidden grid grid-cols-2 gap-2 px-4 py-2 bg-background/95 border-t border-border/50">
        <Button variant="default" size="sm" className="min-h-11 font-bold bg-primary text-primary-foreground text-xs" asChild>
          <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer"><Mail className="ml-1 h-4 w-4" />תמיכה מרחוק</a>
        </Button>
        <Button variant="outline" size="sm" className="min-h-11 text-xs border-primary/40" asChild>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle className="ml-1 h-4 w-4" />וואטסאפ</a>
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav id="mobile-menu" className="lg:hidden border-t border-border p-4 space-y-2 bg-background/95 max-h-[60vh] overflow-y-auto" aria-label="תפריט ניווט">
          {[
            { label: "בית", href: "/#hero" },
            { label: "AI לעסקים", href: "/ai-services" },
            { label: "תחזוקה לעסקים", href: "/it-maintenance" },
            { label: "אודות", href: "/#about" },
            { label: "צור קשר", href: "/#contact" },
            { label: "ללקוחות קיימים", href: "/support" },
          ].map(item => <Button key={item.href} variant="ghost" asChild className="min-h-11 w-full justify-start text-foreground/70"><a href={item.href} onClick={() => setMobileMenuOpen(false)}>{item.label}</a></Button>)}
          <div className="flex gap-2">
            <Button variant="outline" className="min-h-11 flex-1" asChild><a href="https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid" target="_blank" rel="noopener noreferrer"><Smartphone className="ml-1 h-4 w-4" />אנדרואיד</a></Button>
            <Button variant="outline" className="min-h-11 flex-1" asChild><a href="https://apps.apple.com/us/app/anydesk-remote-desktop/id1176131273" target="_blank" rel="noopener noreferrer"><Apple className="ml-1 h-4 w-4" />אייפון</a></Button>
          </div>
        </nav>
      )}
    </header>
  );
};
