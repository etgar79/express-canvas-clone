import { useState, useEffect, useRef } from "react";
import { HardDrive, Shield, Activity } from "lucide-react";

export const BackupCounter = () => {
  const [totalTB, setTotalTB] = useState(300);
  const [totalGB, setTotalGB] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Counter animation - adds 2GB every second
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTotalGB((prev) => {
        const next = prev + 2;
        if (next >= 1000) {
          setTotalTB((t) => t + 1);
          return next - 1000;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const displayValue = `${totalTB.toLocaleString()}.${String(Math.floor(totalGB / 100)).padStart(1, "0")}`;

  return (
    <div ref={ref} className="py-16 relative overflow-hidden">
      <div className="container px-4">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">גיבויים בזמן אמת</h2>
            <Shield className="h-6 w-6 text-accent" />
          </div>

          {/* Main counter */}
          <div className="relative inline-block">
            <div className="bg-card border border-border rounded-2xl px-10 py-8 shadow-lg neon-border-cyan">
              <div className="flex items-center justify-center gap-3 mb-2">
                <HardDrive className="h-8 w-8 text-accent animate-pulse-glow" />
                <span className="text-6xl md:text-7xl font-black text-foreground tabular-nums tracking-tight" dir="ltr">
                  {displayValue}
                </span>
                <span className="text-2xl md:text-3xl font-bold text-accent mt-3">TB</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">נתונים מגובים ומוגנים</p>

              {/* Live indicator */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/60 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                </span>
                <span className="text-xs text-accent font-medium">פעיל עכשיו</span>
                <Activity className="h-3.5 w-3.5 text-accent" />
              </div>
            </div>

            {/* Flying GB badges */}
            <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full animate-bounce-subtle shadow-md">
              +2GB/s
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg mx-auto">
            {[
              { label: "זמן פעילות", value: "99.9%", icon: "🟢" },
              { label: "לקוחות מוגנים", value: "500+", icon: "🛡️" },
              { label: "שחזורים מוצלחים", value: "100%", icon: "✅" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card/50 border border-border rounded-xl p-3">
                <div className="text-lg mb-0.5">{stat.icon}</div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
