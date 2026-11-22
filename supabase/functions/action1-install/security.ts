import { timingSafeEqual, createHash, createHmac } from 'node:crypto';

export function allowedOrigin(origin: string): boolean {
  if (origin === 'https://1979.co.il') return true;
  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && !url.port && url.origin === origin &&
      /^(?:id-preview--[a-z0-9-]+|preview--[a-z0-9-]+)\.lovable\.app$/.test(url.hostname);
  } catch { return false; }
}
export function passwordMatches(input: string, expected: string): boolean {
  return timingSafeEqual(createHash('sha256').update(input).digest(), createHash('sha256').update(expected).digest());
}
export function hashIp(ip: string, salt: string): string {
  return createHmac('sha256', salt).update('action1-install-ip\0').update(ip).digest('hex');
}
