import { Phone, Mail, MessageCircle, Facebook, Linkedin, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-muted">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Tech Therapy" className="h-12 w-12 rounded-md border border-primary/20" />
              <div>
                <h3 className="text-xl font-bold neon-text text-primary">Tech Therapy</h3>
                <p className="text-accent text-sm">Consulting • Automation • IT</p>
              </div>
            </div>
            <p className="text-foreground/40 leading-relaxed max-w-md text-sm">
              חברת ייעוץ והטמעת טכנולוגיה מובילה. פתרונות מקצועיים לעסקים - ייעוץ טכנולוגי, אוטומציות, 
              הטמעת מערכות וליווי טכנולוגי מלא.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">ניווט</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-foreground/40 hover:text-primary transition-colors text-sm">בית</a></li>
              <li><a href="#services" className="text-foreground/40 hover:text-primary transition-colors text-sm">שירותים</a></li>
              <li><a href="#about" className="text-foreground/40 hover:text-primary transition-colors text-sm">אודות</a></li>
              <li><a href="#contact" className="text-foreground/40 hover:text-primary transition-colors text-sm">צור קשר</a></li>
              <li>
                <Link to="/diagnostics" className="text-primary/70 hover:text-primary transition-colors text-sm flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  מאבחן תקלות AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-foreground mb-4">יצירת קשר</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-foreground/40">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+972545368629" className="hover:text-primary transition-colors text-sm">054-536-8629</a>
              </li>
              <li className="flex items-center gap-2 text-foreground/40">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-sm">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2 text-foreground/40">
                <Mail className="h-4 w-4 text-primary" />
                <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-sm">תמיכה מרחוק</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-foreground/30 text-sm">
              © {currentYear} Tech Therapy Computers. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-md border border-primary/20 text-foreground/40 hover:text-primary hover:border-primary/50 transition-all">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-md border border-primary/20 text-foreground/40 hover:text-primary hover:border-primary/50 transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-md border border-primary/20 text-foreground/40 hover:text-primary hover:border-primary/50 transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
