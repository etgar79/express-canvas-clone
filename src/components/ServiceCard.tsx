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
      className="group h-[380px] [perspective:1000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        {/* Front */}
        <Card className="absolute inset-0 p-8 text-center flex flex-col items-center justify-center border-0 [backface-visibility:hidden]" style={{ background: 'var(--gradient-card)' }}>
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full animate-bounce-subtle">
              <Icon className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-foreground leading-tight">{title}</h3>
          {question && (
            <p className="text-sm text-muted-foreground/80 italic">{question}</p>
          )}
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 p-8 flex flex-col justify-between border-0 [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ background: 'var(--gradient-card-hover)' }}>
          <div>
            <div className="mb-4 flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm mb-4">{description}</p>
          </div>
          {benefit && (
            <div className="flex items-center gap-2 justify-center p-3 bg-primary/5 rounded-lg border border-primary/20">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-primary">{benefit}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
