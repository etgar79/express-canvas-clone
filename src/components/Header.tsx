import { Button } from "@/components/ui/button";
import { Mail, Bot, FileText } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container px-4 py-4 flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <a href="https://898.tv/sos1979" target="_blank" rel="noopener noreferrer">
              <Mail className="ml-2 h-4 w-4" />
              תמיכה מרחוק
            </a>
          </Button>
          <Button variant="default" size="sm" asChild>
            <a href="https://script.google.com/macros/s/AKfycbyD2n-9G0ncG_fEYvvN9ZzeJQqQ5QVdRBge4Jz1PCnRejUojUb33bUaTjfEbpo8dcLmDQ/exec" target="_blank" rel="noopener noreferrer">
              <Bot className="ml-2 h-4 w-4" />
              בוט טכנאים
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="https://ilanmitzpe.sharepoint.com/:f:/g/test/EjbE5ycmGrlInMZXY1g_dggBaf0P-aHPkJLvrBoNoe9Swg?e=9PO514" target="_blank" rel="noopener noreferrer">
              <FileText className="ml-2 h-4 w-4" />
              קבצי עזר לטכנאי
            </a>
          </Button>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          Tech Therapy Computers
        </h1>
      </div>
    </header>
  );
};
