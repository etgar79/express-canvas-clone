import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "השם חייב להכיל לפחות 2 תווים" }).max(100, { message: "השם ארוך מדי" }),
  email: z.string().email({ message: "כתובת אימייל לא תקינה" }).max(255, { message: "האימייל ארוך מדי" }),
  phone: z.string().min(9, { message: "מספר טלפון חייב להכיל לפחות 9 ספרות" }).max(15, { message: "מספר טלפון ארוך מדי" }),
  message: z.string().min(10, { message: "ההודעה חייבת להכיל לפחות 10 תווים" }).max(1000, { message: "ההודעה ארוכה מדי" }),
});

type FormValues = z.infer<typeof formSchema>;

export const ContactForm = () => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const whatsappMessage = `שלום, שמי ${data.name}%0A` +
        `אימייל: ${data.email}%0A` +
        `טלפון: ${data.phone}%0A` +
        `הודעה: ${data.message}`;
      
      window.open(`https://wa.me/972545368629?text=${whatsappMessage}`, '_blank');
      
      toast({
        title: "✅ ההודעה נשלחה בהצלחה!",
        description: "תודה שפנית אלינו. ניצור איתך קשר בהקדם האפשרי 💬",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "❌ שגיאה בשליחת ההודעה",
        description: "אנא נסה שוב מאוחר יותר או צור קשר בוואטסאפ ישירות",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">שם מלא *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="הכנס את שמך המלא" 
                  {...field}
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.name}
                  aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                  className="text-right"
                />
              </FormControl>
              <FormMessage id="name-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">כתובת אימייל *</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="example@email.com" 
                  {...field}
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.email}
                  aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                  className="text-right"
                />
              </FormControl>
              <FormMessage id="email-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">מספר טלפון *</FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  placeholder="050-1234567" 
                  {...field}
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.phone}
                  aria-describedby={form.formState.errors.phone ? "phone-error" : undefined}
                  className="text-right"
                />
              </FormControl>
              <FormMessage id="phone-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">הודעה *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="ספר לנו על הצרכים שלך..." 
                  className="min-h-[120px] resize-none text-right"
                  {...field}
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.message}
                  aria-describedby={form.formState.errors.message ? "message-error" : undefined}
                />
              </FormControl>
              <FormMessage id="message-error" role="alert" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          style={{
            background: 'var(--gradient-tech)',
            color: 'hsl(0 0% 100%)',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)'
          }}
          disabled={form.formState.isSubmitting}
          aria-label="שלח טופס יצירת קשר"
        >
          <Send className="ml-2 h-5 w-5" />
          {form.formState.isSubmitting ? "שולח..." : "שלח הודעה"}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          * שדות חובה
        </p>
      </form>
    </Form>
  );
};
