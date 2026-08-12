import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { SkipLink } from "@/components/SkipLink";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

const LAST_UPDATED = "12 באוגוסט 2026";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "מדיניות פרטיות | Tech Therapy - אתגר אהרוני";

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
      "מדיניות הפרטיות של אתר Tech Therapy - אתגר אהרוני: אילו נתונים נאספים, למה, כמה זמן הם נשמרים וכיצד לממש זכות עיון ומחיקה לפי חוק הגנת הפרטיות."
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://1979.co.il/privacy");
  }, []);

  const sections: { title: string; body: string[]; list?: string[] }[] = [
    {
      title: "כללי",
      body: [
        "מדיניות פרטיות זו מתארת כיצד Tech Therapy Computers (אתגר אהרוני), מפרדס חנה, אוספת, שומרת ומשתמשת במידע אישי של מבקרים באתר 1979.co.il. השימוש באתר מהווה הסכמה למדיניות זו. המדיניות נכתבה בלשון זכר מטעמי נוחות אך מתייחסת לכל המינים.",
      ],
    },
    {
      title: "אילו נתונים נאספים",
      body: ["האתר אינו מחייב הרשמה. איסוף מידע אישי נעשה רק כאשר אתה בוחר ליצור קשר או להשתמש בכלי ייעודי באתר:"],
      list: [
        "פרטי קשר שאתה מספק ביוזמתך – שם, טלפון, כתובת דוא\"ל ותוכן ההודעה – כאשר אתה שולח הודעה בוואטסאפ, בדוא\"ל או ממלא טופס בעמוד \"מאבחן תקלות\".",
        "מידע שאתה מזין בצ'אט ה-AI שבאתר (תוכן השאלות), לצורך מתן מענה בזמן אמת.",
        "מידע טכני בסיסי הנוצר בעת גלישה (כתובת IP, סוג דפדפן, עמודים שנצפו) לצורכי אבטחה, תקינות האתר וזיהוי תקלות.",
      ],
    },
    {
      title: "למה הנתונים נאספים",
      body: [],
      list: [
        "מענה לפניות, מתן שירות טכני, ייעוץ והצעות מחיר.",
        "אבחון תקלות ותמיכה מרחוק לפי בקשתך.",
        "שיפור האתר, השירותים והתוכן.",
        "עמידה בדרישות חוק ושמירה על אבטחת המידע.",
        "איננו מבצעים פרסום ממוקד ואיננו מוכרים או משכירים מידע אישי לצדדים שלישיים.",
      ],
    },
    {
      title: "העברת מידע לצדדים שלישיים",
      body: [
        "לצורך הפעלת האתר והשירותים אנו נעזרים בספקי תשתית ותוכנה. מידע עשוי לעבור אליהם רק במידה הנדרשת לתפעול השירות:",
      ],
      list: [
        "WhatsApp / Meta – כאשר אתה בוחר לפנות אלינו בוואטסאפ, ההודעה כפופה גם למדיניות הפרטיות של WhatsApp.",
        "שירותי ענן ואחסון נתונים (Supabase / Lovable Cloud) – אחסון מאובטח של פניות ונתוני שירות.",
        "שירותי Google (לרבות Google Sheets / Google Apps Script) – ניהול פניות ורשומות שירות פנימיות.",
        "ספקי מודלי AI – עיבוד השאלות שנשלחות בצ'אט לצורך יצירת תשובה.",
        "מסירת מידע נדרשת על פי דין, צו בית משפט או להגנה על זכויותינו החוקיות.",
      ],
    },
    {
      title: "אבטחת מידע ותקופת שמירה",
      body: [
        "המידע נשמר בסביבות מאובטחות עם הצפנת תעבורה (HTTPS), הרשאות גישה מוגבלות לבעל העסק בלבד ומדיניות סיסמאות. אנו נוקטים באמצעים סבירים ומקובלים להגנה על המידע, אך אין באפשרותנו להבטיח חסינות מוחלטת מפני חדירה בלתי מורשית.",
        "פניות ונתוני שירות נשמרים לתקופה הנדרשת לצורך מתן השירות ולמשך עד 24 חודשים לאחר סיום הטיפול, או לתקופה ארוכה יותר אם קיימת חובה חוקית (למשל דרישות מיסוי). לאחר מכן המידע נמחק או עובר אנונימיזציה.",
      ],
    },
    {
      title: "עוגיות (Cookies)",
      body: [
        "האתר אינו משתמש בעוגיות פרסום, בכלי מדידה חיצוניים (כגון Google Analytics) או בפיקסלים של רשתות חברתיות. נעשה שימוש באחסון מקומי בדפדפן (localStorage) רק לצורך שמירת העדפות נגישות שבחרת (גודל טקסט, ניגודיות, מצב כהה) ולשמירת מצב התחברות באזורים מוגנים. מידע זה נשאר במחשב שלך וניתן למחוק אותו בכל עת דרך הגדרות הדפדפן.",
        "אם בעתיד יוטמעו כלי אנליטיקה או פרסום, יוצג באתר באנר הסכמה שיאפשר לך לבחור אילו סוגי עוגיות לאשר.",
      ],
    },
    {
      title: "זכות עיון, תיקון ומחיקה",
      body: [
        "בהתאם לחוק הגנת הפרטיות, התשמ\"א-1981 ולתיקון 13 לחוק (שנכנס לתוקף באוגוסט 2025), אתה זכאי לעיין במידע האישי שנאסף עליך, לבקש את תיקונו אם אינו נכון או מעודכן, ולבקש את מחיקתו. ניתן לפנות בבקשה בכל אחת מדרכי ההתקשרות המפורטות בהמשך; נטפל בבקשה בתוך 30 ימים.",
        "כמו כן ניתן לבטל בכל עת הסכמה לקבלת הודעות שירות או עדכונים מאיתנו.",
      ],
    },
    {
      title: "טפסים והסכמה",
      body: [
        "בכל טופס באתר שאוסף פרטים אישיים (לרבות עמוד \"מאבחן תקלות\") תופיע תיבת הסכמה מפורשת, שאינה מסומנת מראש, לתנאי מדיניות פרטיות זו. שליחת הטופס מתאפשרת רק לאחר סימון ההסכמה. מסירת הפרטים היא וולונטרית ואינה מחויבת על פי חוק.",
      ],
    },
    {
      title: "קטינים",
      body: [
        "האתר אינו מיועד לאיסוף מידע מקטינים מתחת לגיל 16 ביודעין. אם נמסר מידע כאמור, ניתן לפנות אלינו לצורך מחיקתו.",
      ],
    },
    {
      title: "שינויים במדיניות",
      body: [
        "אנו עשויים לעדכן מדיניות זו מעת לעת. גרסה מעודכנת תפורסם בעמוד זה בצירוף תאריך העדכון האחרון.",
      ],
    },
  ];

  return (
    <div className="min-h-screen" dir="rtl">
      <SkipLink />
      <Header />
      <main id="main-content" className="pt-[72px]">
        <section className="py-16 relative">
          <div className="container px-4 max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent text-sm mb-4">
              מדיניות פרטיות
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              מדיניות <span className="text-accent">פרטיות</span>
            </h1>
            <p className="text-sm text-foreground/50 mb-8">עודכן לאחרונה: {LAST_UPDATED}</p>

            <div className="space-y-6">
              {sections.map((section) => (
                <Card key={section.title} className="p-8 border border-border bg-card shadow-sm rounded-2xl">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">{section.title}</h2>
                  {section.body.map((p, i) => (
                    <p key={i} className="text-foreground/70 leading-relaxed mb-3">
                      {p}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="space-y-3 mt-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-foreground/70">
                          <ShieldCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              ))}

              <Card className="p-8 border border-accent/15 bg-accent/5 shadow-sm rounded-2xl">
                <h2 className="text-2xl font-bold mb-4 text-foreground">פניות בנושא פרטיות</h2>
                <p className="text-foreground/70 mb-6 leading-relaxed">
                  אחראי הגנת הפרטיות ומידע: אתגר אהרוני · Tech Therapy Computers, פרדס חנה-כרכור. לכל בקשת עיון, תיקון או מחיקה של מידע:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <a href="tel:+972545368629" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-accent/15 bg-card hover:border-accent/30 transition-colors text-center">
                    <Phone className="h-6 w-6 text-accent" aria-hidden="true" />
                    <span className="text-xs text-foreground/50">טלפון</span>
                    <span className="font-semibold text-foreground">054-536-8629</span>
                  </a>
                  <a href="https://wa.me/972545368629" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-accent/15 bg-card hover:border-accent/30 transition-colors text-center">
                    <MessageCircle className="h-6 w-6 text-accent" aria-hidden="true" />
                    <span className="text-xs text-foreground/50">וואטסאפ</span>
                    <span className="font-semibold text-foreground">שלחו הודעה</span>
                  </a>
                  <a href="mailto:info@1979.co.il" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-accent/15 bg-card hover:border-accent/30 transition-colors text-center">
                    <Mail className="h-6 w-6 text-accent" aria-hidden="true" />
                    <span className="text-xs text-foreground/50">אימייל</span>
                    <span className="font-semibold text-foreground">info@1979.co.il</span>
                  </a>
                </div>
              </Card>
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

export default PrivacyPolicy;
