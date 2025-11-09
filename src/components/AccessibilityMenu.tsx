import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accessibility, Plus, Minus, Eye, Link2, Moon, Sun, X } from "lucide-react";

export const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (highlightLinks) {
      document.body.classList.add("highlight-links");
    } else {
      document.body.classList.remove("highlight-links");
    }
  }, [highlightLinks]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const resetAll = () => {
    setFontSize(100);
    setHighContrast(false);
    setHighlightLinks(false);
    setIsDark(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-4 z-50 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        aria-label="תפריט נגישות"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Accessibility className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-40 left-4 z-50 p-6 shadow-2xl w-80 bg-background/95 backdrop-blur">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            תפריט נגישות
          </h2>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-2 block">גודל טקסט</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                  aria-label="הקטן טקסט"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm flex-1 text-center">{fontSize}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                  aria-label="הגדל טקסט"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* High Contrast */}
            <Button
              variant={highContrast ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setHighContrast(!highContrast)}
            >
              <Eye className="h-4 w-4 ml-2" />
              ניגודיות גבוהה
            </Button>

            {/* Highlight Links */}
            <Button
              variant={highlightLinks ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setHighlightLinks(!highlightLinks)}
            >
              <Link2 className="h-4 w-4 ml-2" />
              הדגש קישורים
            </Button>

            {/* Dark Mode */}
            <Button
              variant={isDark ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? <Sun className="h-4 w-4 ml-2" /> : <Moon className="h-4 w-4 ml-2" />}
              {isDark ? "מצב בהיר" : "מצב כהה"}
            </Button>

            {/* Reset */}
            <Button
              variant="secondary"
              className="w-full"
              onClick={resetAll}
            >
              אפס הגדרות
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};
