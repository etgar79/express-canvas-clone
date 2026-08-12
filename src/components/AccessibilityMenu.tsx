import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Accessibility, Plus, Minus, Eye, Link2, Moon, Sun } from "lucide-react";

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
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-50 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        aria-label="פתח תפריט נגישות"
      >
        <Accessibility className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Accessibility className="h-5 w-5 text-accent" />
              תפריט נגישות
            </DialogTitle>
            <DialogDescription>
              התאם את האתר לצרכיך: גודל טקסט, ניגודיות, הדגשת קישורים ומצב תצוגה.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-2 block" htmlFor="a11y-fontsize-label">
                גודל טקסט
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                  aria-label="הקטן טקסט"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span id="a11y-fontsize-label" className="text-sm flex-1 text-center" aria-live="polite">
                  {fontSize}%
                </span>
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
              aria-pressed={highContrast}
            >
              <Eye className="h-4 w-4 ml-2" />
              ניגודיות גבוהה
            </Button>

            {/* Highlight Links */}
            <Button
              variant={highlightLinks ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setHighlightLinks(!highlightLinks)}
              aria-pressed={highlightLinks}
            >
              <Link2 className="h-4 w-4 ml-2" />
              הדגש קישורים
            </Button>

            {/* Dark Mode */}
            <Button
              variant={isDark ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setIsDark(!isDark)}
              aria-pressed={isDark}
            >
              {isDark ? <Sun className="h-4 w-4 ml-2" /> : <Moon className="h-4 w-4 ml-2" />}
              {isDark ? "מצב בהיר" : "מצב כהה"}
            </Button>

            {/* Reset */}
            <Button variant="secondary" className="w-full" onClick={resetAll}>
              אפס הגדרות
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
