import { Suspense, lazy, useEffect, useState, type ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Diagnostics = lazy(() => import("./pages/Diagnostics"));
const TechDashboard = lazy(() => import("./pages/TechDashboard"));

const queryClient = new QueryClient();

const AppLoading = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="text-sm text-muted-foreground">טוען...</div>
  </div>
);

const DeferredAiChatBot = () => {
  const [AiChatBotComponent, setAiChatBotComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    let isMounted = true;

    import("@/components/AiChatBot")
      .then((module) => {
        if (isMounted) {
          setAiChatBotComponent(() => module.AiChatBot);
        }
      })
      .catch((error) => {
        console.error("Failed to load AI chat bot:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return AiChatBotComponent ? <AiChatBotComponent /> : null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/diagnostics"
            element={
              <Suspense fallback={<AppLoading />}>
                <Diagnostics />
              </Suspense>
            }
          />
          <Route
            path="/tech-dashboard"
            element={
              <Suspense fallback={<AppLoading />}>
                <TechDashboard />
              </Suspense>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <DeferredAiChatBot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
