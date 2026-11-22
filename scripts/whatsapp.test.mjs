import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whatsappUrl } from '../src/lib/whatsapp.mjs';

for (const [context, message] of [
  ['general', 'היי אתגר, הגעתי מהאתר ואשמח לשוחח'],
  ['fault', 'היי אתגר, יש לי תקלה ואשמח לעזרה'],
  ['ai', 'היי אתגר, אשמח לשמוע על AI לעסק שלי'],
  ['crm', 'היי אתגר, אשמח לשמוע על CRM מותאם לעסק שלי'],
  ['maintenance', 'היי אתגר, אשמח לשמוע על תחזוקת IT לעסק'],
]) {
  test(`WhatsApp ${context} action carries the specified encoded message`, () => {
    const url = new URL(whatsappUrl(context));
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, '/972545368629');
    assert.equal(url.searchParams.get('text'), message);
    assert.ok(url.search.includes('%D7'));
  });
}