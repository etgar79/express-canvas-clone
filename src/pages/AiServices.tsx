import { whatsappUrl } from "@/lib/whatsapp.mjs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Brain, Bot, Workflow, GraduationCap, MessageSquare, Database, MapPin, CheckCircle2 } from "lucide-react";

const AiServices = () => {
  useEffect(() => {
    document.title = "שירותי AI בפרדס חנה | אתגר אהרוני – Tech Therapy";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "שירותי AI ובינה מלאכותית בפרדס חנה ובאזור – אתגר אהרוני מ-Tech Therapy מציע ייעוץ AI, הטמעת כלים, אוטומציה, צ'אטבוטים והדרכות אישיות לעסקים ולפרטיים."
    );
    setMeta(
      "keywords",
      "שירותי AI, בינה מלאכותית, AI פרדס חנה, אתגר אהרוני, ייעוץ AI, הטמעת AI, אוטומציה AI, צ'אטבוט, ChatGPT, Gemini, Tech Therapy, 1979"
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://1979.co.il/ai-services/");
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://1979.co.il/ai-services/");
  }, []);

  const services = [
    {
      icon: Brain,
      title: "ייעוץ AI אישי לעסקים",
      desc: "מיפוי תהליכים בעסק שלכם וזיהוי איפה AI יחסוך לכם זמן וכסף – בגובה העיניים, בלי באזוורדס.",
    },
    {
      icon: Workflow,
      title: "אוטומציה חכמה",
      desc: "חיבור בין הכלים שלכם (Gmail, WhatsApp, Excel, CRM) עם AI שעושה את העבודה השחורה במקומכם.",
    },
    {
      icon: Bot,
      title: "בניית צ'אטבוטים",
      desc: "צ'אטבוט מותאם אישית לאתר או לעסק שלכם, שעונה ללקוחות 24/7 בעברית טבעית.",
    },
    {
      icon: GraduationCap,
      title: "הדרכות AI 1-על-1",
      desc: "לומדים יחד איך להשתמש ב-ChatGPT, Gemini, Claude וכלי AI מתקדמים – בקצב שלכם, בבית או בזום.",
    },
    {
      icon: MessageSquare,
      title: "הטמעת AI בארגון",
      desc: "ליווי צוותים ועובדים בהטמעת כלי AI יומיומיים – מהבחירה, דרך ההדרכה ועד הליווי השוטף.",
    },
  ];

  const benefits = [
    "ניסיון מעשי עם עשרות לקוחות בפרדס חנה ובסביבה",
    "הסבר אנושי, בלי ז'רגון טכני מבלבל",
    "מחיר הוגן ושקוף – בלי הפתעות",
    "זמינות גבוהה ותמיכה גם אחרי הפרויקט",
    "התאמה אישית לכל לקוח – אין פתרון 'אחד מתאים לכולם'",
    "שירות מקומי בפרדס חנה-כרכור, חדרה, בנימינה, זכרון יעקב וקיסריה",
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      <SkipLink />
      <Header />
      <main id="main-content" className="pt-[132px] lg:pt-[72px]">
        {/* Hero */}
        <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">פרדס חנה-כרכור והאזור</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              שירותי <span className="text-primary">AI ובינה מלאכותית</span>
              <br />
              בפרדס חנה ובסביבה
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
              אני <strong className="text-foreground">אתגר אהרוני</strong>, מייסד{" "}
              <strong className="text-foreground">Tech Therapy</strong>, ועוזר לעסקים ולפרטיים בפרדס חנה
              ובאזור לרתום את כוח ה-AI לטובתם – בצורה אנושית, פשוטה ומותאמת אישית.
            </p>
            <p className="text-xl md:text-2xl font-bold mb-8 text-accent-text">
              מהפכת ה-AI מגיעה ישירות אליכם
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="btn-shine min-h-14 whitespace-normal bg-accent px-8 py-4 text-lg font-bold text-foreground hover:bg-accent/90 dark:text-accent-foreground">
                <a href={whatsappUrl('ai')} target="_blank" rel="noopener noreferrer">
                  דברו איתי בוואטסאפ
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/#contact">צרו קשר</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              מה כולל שירות ה-AI שלי?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              פתרונות AI מעשיים שמייצרים ערך אמיתי – מהיום הראשון.
            </p>
            <Card className="mb-6 grid gap-8 border-primary bg-primary p-8 text-primary-foreground md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-10">
              <div>
                <p className="mb-3 text-sm font-medium">פתרון מותאם אישית</p>
                <h3 className="mb-4 text-2xl font-bold md:text-3xl">מערכת CRM בהתאמה אישית</h3>
                <p className="mb-6 max-w-3xl text-lg leading-relaxed">
                  מערכת שנבנית סביב העסק שלכם – ולא להפך: לקוחות, פניות, משימות והצעות מחיר במקום אחד, עם אוטומציות ו-AI שחוסכים עבודה ידנית.
                </p>
                <Button asChild size="lg" className="h-auto min-h-11 w-full whitespace-normal bg-primary-foreground px-5 py-3 text-primary hover:bg-primary-foreground/90 md:w-auto">
                  <a href={whatsappUrl('crm')} target="_blank" rel="noopener noreferrer">
                    ספרו לי מה העסק צריך
                  </a>
                </Button>
              </div>
              <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-foreground/10 md:h-32 md:w-32">
                <Database className="h-12 w-12 md:h-16 md:w-16" />
              </div>
            </Card>
            <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-6">
              {services.map((s, index) => (
                <Card key={s.title} className={`p-6 hover:shadow-lg transition-shadow md:col-span-2 ${index === 3 ? "lg:col-start-2" : ""} ${index === 4 ? "md:col-start-2 lg:col-start-auto" : ""}`}>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why me */}
        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              למה לבחור באתגר אהרוני ל-AI שלכם?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3 bg-background p-5 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local SEO content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              AI בפרדס חנה – שירות מקומי, חשיבה גלובלית
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4">
              <p>
                העולם משתנה מהר, ו-AI כבר לא טרנד עתידי – הוא כאן, בכל עסק וכל בית. אבל בין הכותרות
                המרעישות לבין מה שבאמת עוזר לכם ביום-יום יש פער גדול. בדיוק שם אני נכנס.
              </p>
              <p>
                <strong className="text-foreground">Tech Therapy</strong> נולדה מתוך אהבה לטכנולוגיה
                ורצון לעזור לאנשים אמיתיים – בעלי עסקים קטנים, פרילנסרים, משפחות וקשישים בפרדס חנה-כרכור, חדרה, בנימינה, זכרון יעקב וקיסריה. אני בא אליכם הביתה או למשרד,
                מבין מה אתם צריכים, ובונה איתכם פתרון AI שעובד עבורכם – לא נגדכם.
              </p>
              <p>
                בין אם זה אוטומציה ששולחת הצעות מחיר לבד, צ'אטבוט שמטפל בלקוחות בזמן שאתם ישנים,
                או פשוט להבין סוף סוף איך ChatGPT יכול לעזור לכם – אני כאן בשבילכם.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">מוכנים להתחיל עם AI?</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href={whatsappUrl('ai')} target="_blank" rel="noopener noreferrer">
                  וואטסאפ: 054-536-8629
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <a href="mailto:info@1979.co.il">info@1979.co.il</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <AccessibilityMenu />
    </div>
  );
};

export default AiServices;
