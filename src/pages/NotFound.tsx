import { Link } from "react-router-dom";
import { Home, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkipLink } from "@/components/SkipLink";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center" dir="rtl">
      <SkipLink />
      <main id="main-content" className="text-center px-4">
        <p className="text-7xl md:text-8xl font-extrabold text-accent mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          העמוד לא נמצא
        </h1>
        <p className="text-foreground/60 mb-8 max-w-md mx-auto leading-relaxed">
          מצטערים, העמוד שחיפשת אינו קיים או הוסר. ניתן לחזור לדף הבית או להשתמש במאבחן התקלות.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="ml-2 h-5 w-5" />
              חזרה לדף הבית
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/diagnostics">
              <Terminal className="ml-2 h-5 w-5" />
              מאבחן תקלות
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
