import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  question?: string;
  description: string;
  benefit?: string;
}

export const ServiceCard = ({ icon: Icon, title, question, description, benefit }: ServiceCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-[360px] [perspective:1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <Card className="absolute inset-0 p-8 text-center flex flex-col items-center justify-center border border-primary/15 [backface-visibility:hidden] transition-all duration-300 hover:border-primary/40 neon-border" style={{ background: 'var(--gradient-card)' }}>
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 animate-bounce-subtle">
              <Icon className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-foreground leading-tight font-mono">{title}</h3>
          {question && (
            <p className="text-sm text-foreground/40 italic">{question}</p>
          )}
          <div className="mt-4 text-xs text-primary/50 font-mono">[ hover לפרטים ]</div>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 p-6 flex flex-col justify-between border border-accent/30 [backface-visibility:hidden] [transform:rotateY(180deg)] neon-border-cyan" style={{ background: 'var(--gradient-card-hover)' }}>
          <div>
            <div className="mb-3 flex justify-center">
              <div className="p-2.5 rounded-lg border border-accent/20 bg-accent/5">
                <Icon className="h-7 w-7 text-accent" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3 text-center text-accent font-mono">{title}</h3>
            <p className="text-foreground/60 leading-relaxed text-sm">{description}</p>
          </div>
          {benefit && (
            <div className="flex items-center gap-2 justify-center p-3 rounded-md border border-primary/30 bg-primary/5 mt-3">
              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-primary font-mono">{benefit}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
