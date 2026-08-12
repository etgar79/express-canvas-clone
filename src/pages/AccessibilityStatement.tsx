import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { SkipLink } from "@/components/SkipLink";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Mail, Phone, MessageCircle } from "lucide-react";
import { useEffect } from "react";

const AccessibilityStatement = () => {
  useEffect(() => {
    document.title = "הצהרת נגישות | Tech Therapy - אתגר אהרוני";

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
      "הצהרת נגישות של אתר Tech Therapy - אתגר אהרוני. האתר נבנה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (הנגשת שירותי אינטרנט)."
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://1979.co.il/accessibility");
  }, []);

  return (
    <div className="min-h-screen" dir="rtl">
      <SkipLink />
      <Header />
      <main id="main-content" className="pt-[72px]">
        <section className="py-16 relative">
          <div className="container px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-sm mb-4">
              הצהרת נגישות
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              הצהרת <span className="text-accent">נגישות</span>
            </h1>
            <p className="text-lg text-foreground/70 mb-10 leading-relaxed">
              ב-Tech Therapy מחויבים להנגשת שירותינו ולאפשר גיש שוויוני לכל אדם, לרבות אנשים עם מוגבלות. כחלק ממחויבות זו, אתר זה נבנה ומתוחזק בהתאם לדרישות חוק שוויון זכויות לאנשים עם מוגבלות (תיקון: הנגשת שירותי אינטרנט), התשע"ד-2014 ולתקנות הנגישות שהותקנו מכוחו.
            </p>

            <Card className="p-8 border border-border bg-card shadow-sm rounded-2xl mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">אמצעי נגישות באתר</h2>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                על מנת להקל על הגלישה והשימוש באתר, הותאמו מגוון אמצעי נגישות:
              </p>
              <ul className="space-y-3">
                {[
                  "כפתור נגישות צף המאפשר הגדלת טקסט, החלפת ניגודיות, הדגשת קישורים ומעבר בין מצב בהיר לכהה.",
                  "ניווט מלא באמצעות מקלדת, כולל קישור \"דלג לתוכן\" לדילוג ישירות לתוכן העיקרי.",
                  "מבנה סמנטי תקין (כותרות היררכיות, תגיות ARIA, תוויות נגישות לכפתורים אייקוניים).",
                  "שפה וכיוון תקינים (lang=\"he\" ו-dir=\"rtl\") לתמיכה בקוראי מסך.",
                  "איזורי מגע מוגדלים וניגודיות צבעים העומדת בדרישות WCAG 2.1 AA.",
                  "התחשבות בהעדפת תנועה מופחתת (prefers-reduced-motion) למשתמשים רגישים לאנימציות.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground/70">
                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8 border border-border bg-card shadow-sm rounded-2xl mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">תאימות לתקנים</h2>
              <p className="text-foreground/70 leading-relaxed">
                האתר נבנה בהתאם להנחיות WCAG 2.1 ברמת AA של ארגון W3C, ומיושמות בו דרישות תקנות הנגישות הישראליות (תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירותי אינטרנט), התשע\"ה-2015). עם זאת, ייתכן שיימצאו באתר דפים או רכיבים שטרם הונגשו במלואם; אנו פועלים באופן שוטף לשפר ולהרחיב את הנגישות באתר.
              </p>
            </Card>

            <Card className="p-8 border border-accent/15 bg-accent/5 shadow-sm rounded-2xl">
              <h2 className="text-2xl font-bold mb-4 text-foreground">דיווח על בעיית נגישות</h2>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                נתקלתם בקושי בגלישה באתר? נשמח לקבל את הדיווח ולטפל בו בהקדם. ניתן לפנות אלינו בדרכים הבאות:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a href="tel:+972545368629" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-accent/15 bg-card hover:border-accent/30 transition-colors text-center">
                  <Phone className="h-6 w-6 text-accent" />
                  <span className="text-xs text-foreground/50">טלפון</span>
                  <span className="font-semibold text-foreground">054-536-8629</span>
                </a>
                <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-accent/15 bg-card hover:border-accent/30 transition-colors text-center">
                  <MessageCircle className="h-6 w-6 text-accent" />
                  <span className="text-xs text-foreground/50">וואטסאפ</span>
                  <span className="font-semibold text-foreground">שלחו הודעה</span>
                </a>
                <a href="mailto:info@1979.co.il" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-accent/15 bg-card hover:border-accent/30 transition-colors text-center">
                  <Mail className="h-6 w-6 text-accent" />
                  <span className="text-xs text-foreground/50">אימייל</span>
                  <span className="font-semibold text-foreground">info@1979.co.il</span>
                </a>
              </div>
              <p className="text-sm text-foreground/50 mt-6 text-center">
                רכז הנגישות: אתגר אהרוני · Tech Therapy Computers
              </p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <AccessibilityMenu />
    </div>
  );
};

export default AccessibilityStatement;
