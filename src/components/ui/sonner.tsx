import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      dir="rtl"
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-primary/20 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-base",
          actionButton: "group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:font-semibold group-[.toast]:shadow-lg",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
          success: "group-[.toaster]:border-green-500/30 group-[.toaster]:bg-green-500/5",
          error: "group-[.toaster]:border-red-500/30 group-[.toaster]:bg-red-500/5",
          warning: "group-[.toaster]:border-yellow-500/30 group-[.toaster]:bg-yellow-500/5",
          info: "group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-blue-500/5",
        },
        style: {
          background: 'linear-gradient(135deg, hsl(var(--background) / 0.98) 0%, hsl(220 20% 94% / 0.98) 100%)',
          border: '1px solid hsl(var(--primary) / 0.2)',
          boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.3), 0 0 60px rgba(147, 51, 234, 0.2)',
        }
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
