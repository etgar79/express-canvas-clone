import { Phone, Mail, MapPin, Facebook, Linkedin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-primary/20" style={{ background: 'hsl(236 97% 8%)' }}>
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Tech Therapy Computers" className="h-12 w-12 rounded-lg" />
              <div>
                <h3 className="text-xl font-bold text-white">Tech Therapy Computers</h3>
                <p className="text-primary text-sm">ליווי טכנולוגי מקצועי</p>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed max-w-md">
              אנחנו מספקים פתרונות IT מתקדמים לעסקים וארגונים. תמיכה טכנית, ייעוץ טכנולוגי, 
              אוטומציה והטמעת מערכות - הכל בליווי אישי ומקצועי.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">קישורים מהירים</h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="text-white/60 hover:text-primary transition-colors">בית</a>
              </li>
              <li>
                <a href="#services" className="text-white/60 hover:text-primary transition-colors">שירותים</a>
              </li>
              <li>
                <a href="#about" className="text-white/60 hover:text-primary transition-colors">אודות</a>
              </li>
              <li>
                <a href="#contact" className="text-white/60 hover:text-primary transition-colors">צור קשר</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">יצירת קשר</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+972545368629" className="hover:text-primary transition-colors">054-536-8629</a>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2 text-white/60">
                <Mail className="h-4 w-4 text-primary" />
                <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">תמיכה מרחוק</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-primary/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {currentYear} Tech Therapy Computers. כל הזכויות שמורות.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://wa.me/972545368629" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-primary/30 text-white/60 hover:text-primary hover:border-primary transition-all"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full border border-primary/30 text-white/60 hover:text-primary hover:border-primary transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full border border-primary/30 text-white/60 hover:text-primary hover:border-primary transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
