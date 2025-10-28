import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container px-4 py-4 flex justify-between items-center">
        <Button variant="outline" size="sm" asChild>
          <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer">
            <Mail className="ml-2 h-4 w-4" />
            תמיכה מרחוק
          </a>
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          Tech Therapy Computers
        </h1>
      </div>
    </header>
  );
};
