import { MessageCircle } from "lucide-react";

export const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/972545368629"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 p-4 rounded-md shadow-2xl transition-all duration-300 hover:scale-110 neon-border"
      style={{
        background: 'var(--gradient-button)',
        color: 'hsl(220 20% 4%)',
      }}
      aria-label="שלח הודעת וואטסאפ"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};
