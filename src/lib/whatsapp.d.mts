export const WHATSAPP_MESSAGES: Record<'general' | 'fault' | 'ai' | 'crm' | 'maintenance', string>;
export function whatsappUrl(context?: keyof typeof WHATSAPP_MESSAGES): string;