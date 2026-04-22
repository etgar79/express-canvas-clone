import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const Diagnostics = lazy(() => import("./pages/Diagnostics"));
const TechDashboard = lazy(() => import("./pages/TechDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AiChatBot = lazy(() =>
  import("@/components/AiChatBot").then((module) => ({ default: module.AiChatBot }))
);

const queryClient = new QueryClient();

const AppLoading = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="text-sm text-muted-foreground">טוען...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<AppLoading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/tech-dashboard" element={<TechDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AiChatBot />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
