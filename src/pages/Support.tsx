import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Mail, Smartphone, Apple, FileText, Package, Bot, Terminal, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const tools = [
  {
    icon: Mail,
    title: "תמיכה מרחוק",
    description: "חיבור מרחוק למחשב שלך דרך תוכנה מאובטחת - אתה רואה הכל ויכול לנתק בכל רגע.",
    href: "https://898.tv/sos1979",
    external: true,
    cta: "התחבר עכשיו",
  },
  {
    icon: Smartphone,
    title: "AnyDesk לאנדרואיד",
    description: "הורדת אפליקציית AnyDesk לטלפון אנדרואיד, לתמיכה מרחוק גם בנייד.",
    href: "https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid",
    external: true,
    cta: "הורדה מ-Google Play",
  },
  {
    icon: Apple,
    title: "AnyDesk לאייפון",
    description: "הורדת אפליקציית AnyDesk לאייפון ולאייפד, לתמיכה מרחוק גם בנייד.",
    href: "https://apps.apple.com/us/app/anydesk-remote-desktop/id1176131273",
    external: true,
    cta: "הורדה מ-App Store",
  },
  {
    icon: FileText,
    title: "קבצי עזר",
    description: "מדריכים, טפסים וקבצי עזר שימושיים - הכל במקום אחד.",
    href: "https://ilanmitzpe.sharepoint.com/:f:/g/test/IgA2xOcnJhq5SJzGV2NYP3YIAWn9D_mhz5CS76waDaHvUsI",
    external: true,
    cta: "פתח את התיקייה",
  },
  {
    icon: Package,
    title: "תוכנות זמניות",
    description: "תוכנות וכלים זמניים להורדה, לפי הצורך ובהתאמה אישית.",
    href: "https://ilanmitzpe.sharepoint.com/:f:/g/test/IgBkQ8-w-QnbRo_jt4-DeWD5AWP4ugZANXLok7VPr6UhYcM",
    external: true,
    cta: "פתח את התיקייה",
  },
  {
    icon: Bot,
    title: "בוט טכנאים",
    description: "הבוט החכם שלנו לטכנאים - תשובות מהירות וכלים מקצועיים.",
    href: "https://script.google.com/macros/s/AKfycbyD2n-9G0ncG_fEYvvN9ZzeJQqQ5QVdRBge4Jz1PCnRejUojUb33bUaTjfEbpo8dcLmDQ/exec",
    external: true,
    cta: "פתח את הבוט",
  },
  {
    icon: Terminal,
    title: "מאבחן תקלות",
    description: "אבחון תקלות חכם מבוסס AI - מתארים את הבעיה ומקבלים כיוון לפתרון.",
    href: "/diagnostics",
    external: false,
    cta: "לאבחון תקלות",
  },
];

const Support = () => {
  useEffect(() => {
    document.title = "ללקוחות קיימים | Tech Therapy - אתגר אהרוני";
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = "כל הכלים ללקוחות Tech Therapy של אתגר אהרוני: תמיכה מרחוק, AnyDesk לאנדרואיד ולאייפון, קבצי עזר וכלים נוספים במקום אחד.";
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://1979.co.il/support";
  }, []);

  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      <main id="main-content" className="pt-[72px]">
        <section className="py-20 relative overflow-hidden bg-background">
          <div className="absolute inset-0 grid-pattern"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>

          <div className="container px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-sm mb-4">
                <UserCheck className="h-4 w-4" />
                ללקוחות קיימים
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                כל הכלים <span className="text-accent">שלך</span> במקום אחד
              </h1>
              <p className="text-lg text-foreground/50 max-w-2xl mx-auto">
                תמיכה מרחוק, קבצי עזר וכלים נוספים - הכל מרוכז כאן בשבילך
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {tools.map((tool, index) => (
                <Card
                  key={index}
                  className="p-6 hover:border-accent/30 transition-all duration-300 border border-border group bg-card shadow-sm rounded-2xl flex flex-col"
                >
                  <div className="p-3 rounded-xl border border-accent/15 bg-accent/8 w-fit mb-4 group-hover:bg-accent/12 transition-colors">
                    <tool.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{tool.title}</h2>
                  <p className="text-foreground/50 leading-relaxed text-sm mb-6 flex-1">{tool.description}</p>
                  {tool.external ? (
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 bg-accent text-accent-foreground shadow-lg"
                    >
                      {tool.cta}
                    </a>
                  ) : (
                    <Link
                      to={tool.href}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 bg-accent text-accent-foreground shadow-lg"
                    >
                      {tool.cta}
                    </Link>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
