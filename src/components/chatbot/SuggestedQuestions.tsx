import { Wifi, Printer, Lock, Phone, Zap, MonitorOff } from "lucide-react";

export type SuggestedQuestion = {
  icon: JSX.Element;
  label: string;
  text: string;
};

// Tech-support focused starter questions (per user choice)
export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    icon: <Zap className="h-3.5 w-3.5" />,
    label: "המחשב איטי",
    text: "המחשב שלי איטי, מה אפשר לעשות?",
  },
  {
    icon: <Wifi className="h-3.5 w-3.5" />,
    label: "אין אינטרנט",
    text: "אני לא מצליח להתחבר לאינטרנט",
  },
  {
    icon: <Printer className="h-3.5 w-3.5" />,
    label: "המדפסת לא עובדת",
    text: "המדפסת שלי לא מדפיסה",
  },
  {
    icon: <Phone className="h-3.5 w-3.5" />,
    label: "לדבר עם טכנאי",
    text: "אני רוצה לדבר עם טכנאי אנושי",
  },
];

// Idle prompt suggestions (shown after 30s of silence)
export const IDLE_SUGGESTIONS = [
  "צריך עזרה נוספת? 😊",
  "יש עוד תקלה שאני יכול לעזור איתה?",
  "מעדיף לדבר עם טכנאי? אני יכול לחבר אותך לוואטסאפ.",
];
