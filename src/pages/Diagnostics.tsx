import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Laptop, Building2, Lightbulb, Bot, ArrowRight, ArrowLeft, Terminal, 
  MessageCircle, Shield, Loader2, CheckCircle, Home
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

type Category = {
  id: string;
  label: string;
  icon: React.ElementType;
  questions: { question: string; options: string[] }[];
};

const categories: Category[] = [
  {
    id: "business-it",
    label: "תמיכה במחשוב עסקי",
    icon: Laptop,
    questions: [
      {
        question: "מה סוג הבעיה?",
        options: ["תחנות עבודה / מחשבים", "שרתים ותשתיות", "תוכנות ארגוניות (ERP/CRM)", "גיבויים ושחזור מידע"]
      },
      {
        question: "כמה עובדים מושפעים?",
        options: ["עובד בודד", "צוות / מחלקה", "כל הארגון", "לא ברור"]
      },
      {
        question: "מה דחיפות הטיפול?",
        options: ["קריטי - עצירת עבודה", "גבוה - פוגע בפרודוקטיביות", "בינוני - ניתן לעבוד בינתיים", "נמוך - שיפור עתידי"]
      }
    ]
  },
  {
    id: "enterprise",
    label: "תמיכה במפעלים וארגונים",
    icon: Building2,
    questions: [
      {
        question: "מה תחום הפעילות?",
        options: ["ייצור / מפעל", "לוגיסטיקה ושרשרת אספקה", "שירותים / משרדים", "חינוך / בריאות"]
      },
      {
        question: "מהי הבעיה העיקרית?",
        options: ["תשתית רשת לא יציבה", "מערכות מידע לא מתחברות", "אבטחת מידע", "ביצועים ויעילות נמוכים"]
      },
      {
        question: "האם יש צוות IT פנימי?",
        options: ["כן, צוות מלא", "כן, אדם אחד", "לא, אין צוות IT", "יש אבל צריך חיזוק"]
      }
    ]
  },
  {
    id: "consulting",
    label: "ייעוץ טכנולוגי והטמעה",
    icon: Lightbulb,
    questions: [
      {
        question: "מה אתם מחפשים?",
        options: ["ייעוץ אסטרטגי טכנולוגי", "בחירת מערכות ותוכנות", "מעבר לענן", "שדרוג תשתיות קיימות"]
      },
      {
        question: "מה שלב הפרויקט?",
        options: ["רק מתחילים לחשוב על זה", "כבר בחרנו כיוון, צריכים הטמעה", "באמצע הטמעה ויש בעיות", "רוצים לשפר מערכת קיימת"]
      },
      {
        question: "מהו התקציב המשוער?",
        options: ["עד 10,000 ₪", "10,000 - 50,000 ₪", "50,000 - 200,000 ₪", "מעל 200,000 ₪ / לא מוגדר"]
      }
    ]
  },
  {
    id: "ai",
    label: "פתרונות AI והטמעת טכנולוגיה",
    icon: Bot,
    questions: [
      {
        question: "מה מעניין אתכם?",
        options: ["צ'אטבוטים ושירות לקוחות אוטומטי", "אוטומציה של תהליכים עסקיים", "ניתוח נתונים ו-BI חכם", "כלי AI לעובדים (כתיבה, תמלול, תרגום)"]
      },
      {
        question: "מה רמת הניסיון שלכם עם AI?",
        options: ["אין ניסיון, רוצים להתחיל", "השתמשנו בכלים בסיסיים (ChatGPT וכו')", "יש לנו ניסיון, רוצים להרחיב", "רוצים פתרון מותאם אישית"]
      },
      {
        question: "מה היעד המרכזי?",
        options: ["חיסכון בזמן ועלויות", "שיפור שירות הלקוחות", "קבלת החלטות מבוססות דאטה", "יתרון תחרותי בשוק"]
      }
    ]
  }
];

export default function Diagnostics() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat);
    setCurrentQuestion(0);
    setAnswers([]);
    setDiagnosis(null);
    setError(null);
  };

  const handleAnswer = async (answer: string) => {
    if (!selectedCategory) return;
    
    const newAnswers = [...answers, { 
      question: selectedCategory.questions[currentQuestion].question, 
      answer 
    }];
    setAnswers(newAnswers);

    if (currentQuestion < selectedCategory.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, get AI diagnosis
      setLoading(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke('diagnose-issue', {
          body: { category: selectedCategory.label, answers: newAnswers }
        });
        
        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);
        
        setDiagnosis(data.diagnosis);
      } catch (e: any) {
        setError(e.message || "שגיאה בקבלת אבחנה. נסה שוב.");
      } finally {
        setLoading(false);
      }
    }
  };

  const reset = () => {
    setSelectedCategory(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setDiagnosis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative" dir="rtl" style={{ background: 'var(--gradient-hero)' }}>
      <div className="absolute inset-0 grid-pattern"></div>
      
      {/* Header */}
      <div className="border-b border-primary/15 backdrop-blur-xl" style={{ background: 'hsl(220 20% 4% / 0.9)' }}>
        <div className="container px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors font-mono text-sm">
            <ArrowRight className="h-4 w-4" />
            חזרה לאתר
          </Link>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold neon-text text-primary font-mono">מאבחן תקלות AI</h1>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          
          {/* Step 1: Category Selection */}
          {!selectedCategory && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-primary/30 bg-primary/5 mb-4">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-primary font-mono text-sm">AI-Powered Diagnostics</span>
                </div>
                <h2 className="text-3xl font-bold neon-text text-primary mb-2 font-mono">מה הבעיה?</h2>
                <p className="text-foreground/50">בחר קטגוריה ונאבחן את התקלה בשבילך</p>
              </div>

              <div className="grid gap-4">
                {categories.map((cat) => (
                  <Card 
                    key={cat.id}
                    className="p-6 border border-primary/15 hover:border-primary/40 transition-all duration-300 cursor-pointer group neon-border"
                    style={{ background: 'var(--gradient-card)' }}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                        <cat.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{cat.label}</h3>
                        <p className="text-foreground/40 text-sm font-mono">{cat.questions.length} שאלות → אבחנה</p>
                      </div>
                      <ArrowLeft className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {selectedCategory && !diagnosis && !loading && !error && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <button onClick={reset} className="text-foreground/40 hover:text-primary transition-colors font-mono text-sm flex items-center gap-1">
                  <ArrowRight className="h-4 w-4" />
                  חזרה
                </button>
                <span className="text-primary font-mono text-sm">
                  {currentQuestion + 1} / {selectedCategory.questions.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((currentQuestion + 1) / selectedCategory.questions.length) * 100}%`,
                    background: 'var(--gradient-button)' 
                  }}
                />
              </div>

              <Card className="p-8 border border-primary/15 neon-border" style={{ background: 'var(--gradient-card)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <selectedCategory.icon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedCategory.questions[currentQuestion].question}
                  </h3>
                </div>

                <div className="grid gap-3">
                  {selectedCategory.questions[currentQuestion].options.map((option, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-start text-right p-4 h-auto border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-foreground/70 hover:text-foreground transition-all"
                      onClick={() => handleAnswer(option)}
                    >
                      <span className="text-primary font-mono text-xs ml-3">{String.fromCharCode(65 + i)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <Card className="p-12 border border-primary/15 text-center neon-border animate-fade-in" style={{ background: 'var(--gradient-card)' }}>
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-primary font-mono text-lg neon-text">מאבחן את התקלה...</p>
              <p className="text-foreground/40 mt-2 font-mono text-sm">AI מנתח את המידע</p>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card className="p-8 border border-destructive/30 text-center" style={{ background: 'var(--gradient-card)' }}>
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={reset} variant="outline" className="border-primary/30">
                נסה שוב
              </Button>
            </Card>
          )}

          {/* Step 3: Diagnosis */}
          {diagnosis && (
            <div className="space-y-6 animate-fade-in">
              <Card className="p-8 border border-primary/30 neon-border" style={{ background: 'var(--gradient-card)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-primary font-mono">אבחנה</h3>
                </div>
                
                <div className="prose prose-invert prose-sm max-w-none text-foreground/80 leading-relaxed mb-6">
                  <ReactMarkdown>{diagnosis}</ReactMarkdown>
                </div>

                <div className="border-t border-primary/15 pt-6 space-y-3">
                  <p className="text-foreground/50 text-sm font-mono">רוצה שטכנאי יטפל בזה?</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 neon-border font-bold"
                      style={{ background: 'var(--gradient-button)', color: 'hsl(220 20% 4%)' }}
                      asChild
                    >
                      <a href="https://wa.me/972545368629?text=שלום, השתמשתי במאבחן התקלות ואשמח לקבל טיפול מקצועי" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="ml-2 h-4 w-4" />
                        הזמן טכנאי
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-primary/30"
                      onClick={reset}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                      אבחון חדש
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <Link to="/" className="text-foreground/40 hover:text-primary transition-colors font-mono text-sm inline-flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  חזרה לדף הבית
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
