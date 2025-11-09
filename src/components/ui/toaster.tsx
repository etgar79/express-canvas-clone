import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="backdrop-blur-md border-primary/20 shadow-2xl animate-fade-in">
            <div className="grid gap-2">
              {title && <ToastTitle className="text-lg font-bold">{title}</ToastTitle>}
              {description && <ToastDescription className="text-base">{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose className="hover:bg-primary/10 transition-colors" />
          </Toast>
        );
      })}
      <ToastViewport className="top-0 right-0" />
    </ToastProvider>
  );
}
