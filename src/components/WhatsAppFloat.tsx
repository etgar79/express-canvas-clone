import { whatsappUrl } from "@/lib/whatsapp.mjs";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhatsAppFloat = () => {
  return (
    <Button asChild className="whatsapp-float fixed bottom-6 left-6 z-50 h-auto min-h-11 min-w-11 p-4 rounded-md shadow-2xl transition-shadow duration-300 hover:shadow-lg bg-accent text-accent-foreground neon-border">
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      style={{ background: 'var(--gradient-button)' }}
      aria-label="שלח הודעת וואטסאפ"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
    </Button>
  );
};
