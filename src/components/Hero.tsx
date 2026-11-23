import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Sparkles, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { whatsappUrl } from "@/lib/whatsapp.mjs";

export const Hero = () => {
  return (
    <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-background">
      {/* Soft gradient background */}
      <div className="absolute inset-0 grid-pattern"></div>
      
      {/* Warm floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/6 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
      
      <div className="container px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
            {/* Warm welcome tag */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/25 bg-accent/8 mb-8 text-sm text-accent-text animate-fade-in">
              <Heart className="h-4 w-4 text-accent" />
              <span>שירותי AI וטכנאי מחשבים בפרדס חנה ובאזור</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in leading-tight tracking-tight">
              <span className="text-foreground">תמיכת IT ו-AI לעסקים</span>
              <br />
              <span className="text-foreground/90">ישירות מול המומחה, בלי מוקד</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-4 leading-relaxed text-foreground/60 animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
              תחזוקת IT שוטפת, הטמעת AI ואוטומציות לעסקים בפרדס חנה-כרכור, חדרה, בנימינה, זכרון יעקב וקיסריה. כי טכנולוגיה צריכה לשרת אתכם, לא להפך
            </p>
            <p className="text-xl md:text-2xl font-bold mb-10 text-accent-text animate-fade-in" style={{ animationDelay: '0.3s' }}>
              מהפכת ה-AI מגיעה ישירות אליכם
            </p>
            
            <div className="flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button
                size="lg"
                className="btn-shine min-h-14 w-full sm:w-auto text-lg px-8 py-6 rounded-xl font-bold transition-shadow duration-300 hover:shadow-xl bg-accent text-accent-foreground"
                asChild
              >
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle className="ml-2 h-5 w-5" />דברו איתי בוואטסאפ</a>
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl px-16 sm:px-0">
                <Button variant="outline" className="h-11 w-full text-sm px-3 rounded-xl border-2 border-foreground/20 bg-transparent hover:bg-foreground/5 text-foreground font-semibold" asChild>
                  <Link to="/ai-services/"><Sparkles className="ml-2 h-4 w-4" />AI לעסק</Link>
                </Button>
                <Button variant="outline" className="h-11 w-full text-sm px-3 rounded-xl border-2 border-foreground/20 bg-transparent hover:bg-foreground/5 text-foreground font-semibold" asChild>
                  <Link to="/it-maintenance/"><Briefcase className="ml-2 h-4 w-4" />תחזוקת IT</Link>
                </Button>
                <Button variant="outline" className="h-11 w-full text-sm px-3 rounded-xl border-2 border-foreground/20 bg-transparent hover:bg-foreground/5 text-foreground font-semibold" asChild>
                  <a href={whatsappUrl('fault')} target="_blank" rel="noopener noreferrer"><MessageCircle className="ml-2 h-4 w-4" />יש לי תקלה עכשיו</a>
                </Button>
              </div>
            </div>
            <Link to="/diagnostics/" className="inline-flex items-center min-h-11 mt-3 text-sm text-muted-foreground underline underline-offset-4">או נסו את מאבחן התקלות החינמי</Link>
            
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-8 mt-16 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                { value: "10+", label: "שנות ניסיון" },
                { value: "50+", label: "לקוחות מרוצים" },
                { value: "מענה מהיר", label: "בוואטסאפ" },
              ].map((stat, i) => (
                <div key={i} className="min-w-0 text-center p-2 sm:p-4 rounded-xl border border-foreground/10 bg-foreground/5">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-text">{stat.value}</div>
                  <div className="text-sm text-foreground/50 mt-1">{stat.label}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};
