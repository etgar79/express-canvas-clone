import { MessageCircle } from "lucide-react";

export const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/972545368629"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-accent hover:bg-accent/90 text-accent-foreground p-4 rounded-full shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-110 animate-bounce"
      aria-label="שלח הודעת וואטסאפ"
    >
      <MessageCircle className="h-8 w-8" />
    </a>
  );
};
