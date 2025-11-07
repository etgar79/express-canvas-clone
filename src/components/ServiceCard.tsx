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
        <Card className="absolute inset-0 p-8 text-center flex flex-col items-center justify-center border border-primary/10 [backface-visibility:hidden] transition-all duration-300" style={{ background: 'var(--gradient-card)' }}>
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-2xl animate-bounce-subtle" style={{
              background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.1) 0%, hsl(var(--tech-purple) / 0.1) 100%)',
              boxShadow: '0 4px 16px hsl(var(--primary) / 0.1)'
            }}>
              <Icon className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4 text-foreground leading-tight">{title}</h3>
          {question && (
            <p className="text-sm text-muted-foreground/80 italic">{question}</p>
          )}
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 p-8 flex flex-col justify-between border border-primary/20 [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all duration-300" style={{ background: 'var(--gradient-card-hover)' }}>
          <div>
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-xl" style={{
                background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.15) 0%, hsl(var(--tech-purple) / 0.15) 100%)'
              }}>
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm mb-4">{description}</p>
          </div>
          {benefit && (
            <div className="flex items-center gap-2 justify-center p-3 rounded-xl border" style={{
              background: 'linear-gradient(135deg, hsl(var(--tech-blue) / 0.05) 0%, hsl(var(--tech-purple) / 0.05) 100%)',
              borderColor: 'hsl(var(--primary) / 0.2)'
            }}>
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-semibold text-primary">{benefit}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
