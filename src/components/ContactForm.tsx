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
        description: "תודה שפנית אלינו. ניצור איתך קשר בהקדם 💬",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/70 font-mono text-sm">שם מלא *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="הכנס את שמך" 
                  {...field}
                  aria-required="true"
                  className="text-right bg-muted border-primary/20 focus:border-primary/50 font-mono"
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/70 font-mono text-sm">אימייל *</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="example@email.com" 
                  {...field}
                  aria-required="true"
                  className="text-right bg-muted border-primary/20 focus:border-primary/50 font-mono"
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/70 font-mono text-sm">טלפון *</FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  placeholder="050-1234567" 
                  {...field}
                  aria-required="true"
                  className="text-right bg-muted border-primary/20 focus:border-primary/50 font-mono"
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/70 font-mono text-sm">הודעה *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="ספר לנו על הצרכים שלך..." 
                  className="min-h-[100px] resize-none text-right bg-muted border-primary/20 focus:border-primary/50"
                  {...field}
                  aria-required="true"
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full font-bold transition-all duration-300 hover:scale-[1.02] neon-border"
          style={{
            background: 'var(--gradient-button)',
            color: 'hsl(220 20% 4%)',
          }}
          disabled={form.formState.isSubmitting}
          aria-label="שלח טופס יצירת קשר"
        >
          <Send className="ml-2 h-5 w-5" />
          {form.formState.isSubmitting ? "שולח..." : "שלח הודעה"}
        </Button>
      </form>
    </Form>
  );
};
