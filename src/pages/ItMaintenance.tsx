import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/components/FAQ";
import { whatsappUrl } from "@/lib/whatsapp.mjs";
import { CheckCircle2, MapPin, MessageCircle, Phone, Monitor, Building2, Users } from "lucide-react";

const included = ["ניטור מערכות שוטף", "עדכוני אבטחה", "גיבויים אוטומטיים", "תמיכה טלפונית ובוואטסאפ", "תמיכה מרחוק", "Office 365 ופתרונות ענן", "ניהול רשתות ושרתים", "ביקור טכנאי חודשי בחבילות פרימיום"];
const steps = ["שיחת היכרות ללא עלות", "מיפוי המחשבים והמערכות בעסק", "הצעה לחבילה מותאמת", "ליווי שוטף"];
const audiences = [{ name: "עסקים קטנים", icon: Monitor }, { name: "עסקים בינוניים", icon: Building2 }, { name: "ארגונים", icon: Users }];
const maintenanceFaqs = [faqs[4], faqs[3], faqs[5]];
const canonicalUrl = "https://1979.co.il/it-maintenance/";

const ItMaintenance = () => {
  useEffect(() => {
    document.title = "תחזוקת IT לעסקים בפרדס חנה | אתגר אהרוני – Tech Therapy";
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = "תחזוקת IT שוטפת לעסקים בפרדס חנה ובסביבה עם אתגר אהרוני: ניטור מערכות, גיבויים אוטומטיים, תמיכה מרחוק, Office 365 ופתרונות ענן, ישירות מול המומחה.";
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
    const schemas = [
      { id: "it-maintenance-faq", data: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: maintenanceFaqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) } },
      { id: "it-maintenance-service", data: { "@context": "https://schema.org", "@type": "Service", name: "תחזוקת IT שוטפת לעסקים", serviceType: "תחזוקת IT לעסקים", url: canonicalUrl, provider: { "@type": "LocalBusiness", name: "Tech Therapy", url: "https://1979.co.il/", founder: { "@type": "Person", name: "אתגר אהרוני" } }, areaServed: ["פרדס חנה-כרכור", "חדרה", "בנימינה", "זכרון יעקב", "קיסריה"], description: included.join(", ") } },
    ];
    const elements = schemas.map(({ id, data }) => {
      // Replace a prerendered copy before mounting the current schema.
      document.getElementById(id)?.remove();
      const script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      return script;
    });
    // The root FAQ describes the homepage, not this service page.
    const homepageFaq = [...document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')].find(script => !script.id && JSON.parse(script.textContent || '{}')["@type"] === "FAQPage");
    const savedFaq = homepageFaq?.textContent;
    homepageFaq?.remove();
    return () => {
      elements.forEach(element => element.remove());
      if (savedFaq) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = savedFaq;
        document.head.appendChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen" dir="rtl">
      <SkipLink /><Header />
      <main id="main-content" className="pt-[132px] lg:pt-[72px]">
        <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
          <div className="container px-4 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"><MapPin className="h-4 w-4" aria-hidden="true" /><span className="text-sm">פרדס חנה-כרכור והאזור</span></div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">תחזוקת IT שוטפת לעסקים<br /><span className="text-primary">בפרדס חנה ובסביבה</span></h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">אני אתגר אהרוני, מייסד Tech Therapy. כל לקוח עובד ישירות מולי, בלי מוקד ובלי העברות. אני מכיר את העסק שלכם ויודע בדיוק מה אתם צריכים.</p>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 max-w-5xl"><h2 className="text-3xl md:text-4xl font-bold text-center mb-10">מה כלול?</h2>
            <ul className="grid sm:grid-cols-2 gap-5">{included.map(item => <li key={item} className="flex items-start gap-3 border-b border-border pb-5"><CheckCircle2 className="h-6 w-6 text-primary shrink-0" aria-hidden="true" /><span className="text-lg">{item}</span></li>)}</ul>
          </div>
        </section>
        <section className="py-16 md:py-24 bg-muted"><div className="container px-4 max-w-5xl"><h2 className="text-3xl md:text-4xl font-bold text-center mb-10">למי זה מתאים?</h2><div className="grid sm:grid-cols-3 gap-8">{audiences.map(audience => <div key={audience.name} className="text-center"><audience.icon className="h-8 w-8 mx-auto text-primary mb-4" aria-hidden="true" /><h3 className="text-xl font-bold">{audience.name}</h3></div>)}</div></div></section>
        <section className="py-16 md:py-24 bg-background"><div className="container px-4 max-w-5xl"><h2 className="text-3xl md:text-4xl font-bold text-center mb-10">איך זה עובד?</h2><ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">{steps.map((step, index) => <li key={step} className="border-t border-border pt-5"><span className="text-3xl font-bold text-accent">{index + 1}</span><h3 className="text-lg font-semibold mt-3">{step}</h3></li>)}</ol></div></section>
        <section className="py-16 md:py-24 bg-muted"><div className="container px-4 max-w-3xl"><h2 className="text-3xl md:text-4xl font-bold text-center mb-10">שאלות ותשובות</h2><Accordion type="single" collapsible>{maintenanceFaqs.map((faq, index) => <AccordionItem key={faq.question} value={`faq-${index}`}><AccordionTrigger className="text-lg text-right min-h-11">{faq.question}</AccordionTrigger><AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>
        <section className="py-16 md:py-20 bg-primary text-primary-foreground"><div className="container px-4 max-w-3xl text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">תחזוקת IT לעסק שלכם</h2><p className="text-lg mb-8">שיחת היכרות ללא עלות – אשמע על העסק ואציע פתרון שמתאים בדיוק לכם.</p><div className="flex flex-wrap gap-4 justify-center"><Button asChild size="lg" variant="secondary" className="min-h-11"><a href={whatsappUrl('maintenance')} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5 ml-2" />דברו איתי בוואטסאפ</a></Button><Button asChild size="lg" variant="outline" className="min-h-11 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href="tel:+972545368629"><Phone className="h-5 w-5 ml-2" />054-536-8629</a></Button></div></div></section>
      </main>
      <Footer /><WhatsAppFloat /><AccessibilityMenu />
    </div>
  );
};

export default ItMaintenance;