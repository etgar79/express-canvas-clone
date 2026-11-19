import { type LucideIcon, CheckCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  question?: string;
  description: string;
  benefit?: string;
  href?: string;
}

export const ServiceCard = ({ icon: Icon, title, question, description, benefit, href }: ServiceCardProps) => (
  <Card className="p-6 flex flex-col border border-border bg-card shadow-sm rounded-2xl">
    <div className="p-3 rounded-xl border border-accent/15 bg-accent/8 w-fit mb-5">
      <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-foreground leading-tight">{title}</h3>
    {question && <p className="text-sm text-muted-foreground mb-3">{question}</p>}
    <p className="text-foreground/70 leading-relaxed text-sm mb-5 flex-1">{description}</p>
    {benefit && <div className="flex items-center gap-2 p-3 rounded-xl border border-accent/20 bg-accent/8">
      <CheckCircle className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
      <span className="text-sm font-semibold text-accent-text">{benefit}</span>
    </div>}
    {href && <Button variant="link" asChild className="min-h-11 px-0 mt-3 self-start text-accent-text">
      <Link to={href} aria-label={`לפרטים על ${title}`}>לפרטים <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" /></Link>
    </Button>}
  </Card>
);