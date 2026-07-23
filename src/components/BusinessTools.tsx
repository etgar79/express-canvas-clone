import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  Building2, 
  Factory, 
  Rocket, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

const businessSizes = [
  {
    icon: Store,
    title: "עסקים קטנים",
    subtitle: "בוטיק, משרד, עצמאי",
    description: "פתרונות קלים ליישום שחוסכים זמן וכסף: אוטומציה של חשבוניות, גיבוי אוטומטי, תמיכה מרחוק וכלי AI פשוטים לשימוש יומיומי.",
    benefits: ["ללא השקעה גדולה בהתחלה", "תמיכה אנושית וסבלנית", "התאמה לתקציב קטן"]
  },
  {
    icon: Building2,
    title: "עסקים בינוניים",
    subtitle: "10–50 עובדים",
    description: "חיבור בין מערכות, ניהול הרשאות, שרתים וענן, דוחות אוטומטיים וצ'אטבוטים שמטפלים בלקוחות בזמן שאתם עסוקים בגדילה.",
    benefits: ["ייעול תהליכים מרכזיים", "שקיפות ושליטה", "ליווי שוטף לאורך זמן"]
  },
  {
    icon: Factory,
    title: "ארגונים גדולים",
    subtitle: "50+ עובדים",
    description: "תשתיות IT יציבות, אבטחת מידע, מדיניות גיבויים, אינטגרציות מורכבות וכלי AI שמסייעים לצוותים גדולים לעבוד ביעילות.",
    benefits: ["תכנון לטווח ארוך", "תאימות ואבטחה", "צוותים מרובים - פתרון אחד"]
  },
  {
    icon: Rocket,
    title: "מוצרים וסטארטאפים",
    subtitle: "חדשנות בשיא המהירות",
    description: "בניית אב טיפוס, אוטומציה של פיילוטים, חיבור APIים, כלי AI למוצר ותמיכה טכנית שמאפשרת לך להתמקד בחזון ולא בבעיות טכניות.",
    benefits: ["זמן לשוק קצר", "גמישות טכנולוגית", "ייעוץ אסטרטגי"]
  }
];

export const BusinessTools = () => {
  return (
    <section id="business-tools" className="py-20 relative overflow-hidden bg-background">
      <div className="absolute inset-0 grid-pattern"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-sm mb-4">
            פתרונות לכל עסק
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            כלים חכמים לעסקים <span className="text-accent">קטנים וגדולים</span>
          </h2>
          <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
            אנחנו מתאימים את הטכנולוגיה בדיוק לצרכים שלך — בלי פתרונות מיותרים ובלי להתפשר על מה שחשוב.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          {businessSizes.map((size, index) => (
            <Card 
              key={index} 
              className="p-6 md:p-8 border border-border bg-card/50 backdrop-blur-sm rounded-2xl hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-2xl border border-accent/15 bg-accent/8 group-hover:scale-105 transition-transform">
                  <size.icon className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{size.title}</h3>
                  <p className="text-sm text-foreground/40">{size.subtitle}</p>
                </div>
              </div>
              
              <p className="text-foreground/60 leading-relaxed mb-5">
                {size.description}
              </p>
              
              <ul className="space-y-2">
                {size.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-accent/20">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            אנחנו פה כדי לייעל
          </h3>
          <p className="text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            בין אם אתה עסק קטן שרוצה לחסוך שעות יקרות, ובין אם אתה ארגון שצריך תשתית יציבה — נבנה יחד את הפתרון המדויק בשבילך.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer">
                דברו איתנו בוואטסאפ
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/#contact">
                צרו קשר
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
