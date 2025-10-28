import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ServiceCard = ({ icon: Icon, title, description }: ServiceCardProps) => {
  return (
    <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-0" style={{ background: 'var(--gradient-card)' }}>
      <div className="mb-6 flex justify-center">
        <div className="p-4 bg-primary/10 rounded-full">
          <Icon className="h-12 w-12 text-primary" />
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  );
};
