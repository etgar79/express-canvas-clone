import { allowedOrigin, hashIp, passwordMatches } from './security.ts';
function assert(value: boolean) { if (!value) throw new Error('Security assertion failed'); }
Deno.test('constant-time digest comparison accepts only the identical runtime value', () => {
 const value = crypto.randomUUID();
 assert(passwordMatches(value, value));
 assert(!passwordMatches(crypto.randomUUID(), value));
 assert(!passwordMatches('', value));
});
Deno.test('IP identifiers are salted and domain-separated', () => {
 const salt = crypto.randomUUID();
 const ip = '192.0.2.1';
 assert(hashIp(ip, salt) === hashIp(ip, salt));
 assert(hashIp(ip, salt) !== hashIp(ip, crypto.randomUUID()));
 assert(hashIp(ip, salt) !== hashIp('192.0.2.2', salt));
});
Deno.test('CORS rejects lookalike and insecure origins', () => {
 assert(allowedOrigin('https://1979.co.il'));
 assert(allowedOrigin('https://id-preview--example.lovable.app'));
 for (const origin of ['https://1979.co.il.evil.test','http://1979.co.il','https://evil.lovable.app','https://id-preview--example.lovable.app.evil.test','null','']) assert(!allowedOrigin(origin));
});
