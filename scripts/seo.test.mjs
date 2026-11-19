import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
const business = schemas.find(schema => schema['@type'] === 'LocalBusiness');

test('structured business hours are Sunday through Thursday, 09:00–18:00', () => {
  assert.deepEqual(business.openingHoursSpecification.dayOfWeek, ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']);
  assert.equal(business.openingHoursSpecification.opens, '09:00');
  assert.equal(business.openingHoursSpecification.closes, '18:00');
});
test('structured data lists exactly the five specified service areas', () => {
  assert.deepEqual(business.areaServed, ['פרדס חנה-כרכור', 'חדרה', 'בנימינה', 'זכרון יעקב', 'קיסריה']);
});
test('unverified address, coordinates, social profiles and ratings are omitted', () => {
  for (const property of ['address', 'geo', 'sameAs', 'aggregateRating']) assert.equal(property in business, false);
});
test('every crawler is allowed public pages and denied the technician dashboard', async () => {
  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8');
  const groups = robots.trim().split(/\n\s*\n/).filter(group => group.startsWith('User-agent:'));
  for (const agent of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', '*']) {
    const group = groups.find(group => group.split('\n')[0] === `User-agent: ${agent}`);
    assert.ok(group, `Missing ${agent}`);
    assert.ok(group.split('\n').includes('Allow: /'), `${agent} is not allowed`);
    assert.ok(group.split('\n').includes('Disallow: /tech-dashboard'), `${agent} can crawl dashboard`);
  }
  for (const group of groups) assert.ok(group.split('\n').includes('Disallow: /tech-dashboard'));
});