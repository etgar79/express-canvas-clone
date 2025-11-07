import { MessageCircle } from "lucide-react";

export const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/972545368629"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce text-white"
      style={{
        background: 'var(--gradient-tech)',
        boxShadow: '0 8px 32px hsl(var(--primary) / 0.5)'
      }}
      aria-label="שלח הודעת וואטסאפ"
    >
      <MessageCircle className="h-8 w-8" />
    </a>
  );
};
