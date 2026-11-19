export const WHATSAPP_MESSAGES = {
  general: 'היי אתגר, הגעתי מהאתר ואשמח לשוחח',
  fault: 'היי אתגר, יש לי תקלה ואשמח לעזרה',
  ai: 'היי אתגר, אשמח לשמוע על AI לעסק שלי',
  maintenance: 'היי אתגר, אשמח לשמוע על תחזוקת IT לעסק',
};

export function whatsappUrl(context = 'general') {
  return `https://wa.me/972545368629?text=${encodeURIComponent(WHATSAPP_MESSAGES[context])}`;
}