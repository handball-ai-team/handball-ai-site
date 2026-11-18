// SEO checks. Run with: node --test tests/*.test.mjs
// The site has no build step, so the Elsa price lives in several places.
// This test fails if any copy of the price stops matching.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = path => readFileSync(new URL(`../site/${path}`, import.meta.url), 'utf8');
const home = read('index.html');
const elsa = read('elsa/index.html');

const count = (html, re) => (html.match(re) || []).length;
const graph = html => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1, 'one JSON-LD block');
  return JSON.parse(blocks[0][1])['@graph'];
};
const node = (html, type) => graph(html).find(n => n['@type'] === type);
const decode = s => s.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<');

const pages = { 'home': [home, 'https://handballai.tech/'], 'elsa': [elsa, 'https://handballai.tech/elsa/'] };

for (const [name, [html, url]] of Object.entries(pages)) {
  test(`${name}: one H1, canonical, share tags and business schema`, () => {
    assert.equal(count(html, /<h1[\s>]/g), 1);
    assert.equal(count(html, /rel="canonical"/g), 1);
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    assert.ok(html.includes(`<meta property="og:url" content="${url}">`));
    for (const tag of ['og:title', 'og:description', 'og:image', 'twitter:card', 'twitter:image']) {
      assert.ok(html.includes(`"${tag}"`), `missing ${tag}`);
    }
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const desc = html.match(/<meta name="description" content="([^"]*)">/)[1];
    assert.match(title + desc, /AI receptionist/);
    assert.match(title + desc, /Australia/);
    const biz = node(html, 'ProfessionalService');
    assert.equal(biz.address.addressLocality, 'Torquay');
    assert.equal(biz.areaServed.name, 'Australia');
  });
}

test('Elsa price matches everywhere', () => {
  const monthly = elsa.match(/<p class="ep-price"><strong>\$(\d+)<\/strong> <span>a month<\/span><\/p>/)[1];
  const setup = elsa.match(/plus \$(\d+) one-off setup/)[1];
  const desc = elsa.match(/<meta name="description" content="([^"]*)">/)[1];
  assert.ok(desc.includes(`$${setup} setup, $${monthly} a month`), 'meta description price');
  assert.ok(elsa.includes(`>$${monthly} a month. See pricing<`), 'hero price link');

  const offer = node(elsa, 'Service').offers;
  assert.equal(offer.priceCurrency, 'AUD');
  assert.equal(offer.price, monthly);
  const spec = Object.fromEntries(offer.priceSpecification.map(s => [s.name, s.price]));
  assert.equal(spec['Monthly fee'], monthly);
  assert.equal(spec['One-off setup fee'], setup);

  const homePrice = home.match(/<p class="wwd-price"><strong>\$(\d+)<\/strong> <span>a month \+ \$(\d+) setup<\/span><\/p>/);
  assert.deepEqual([homePrice[1], homePrice[2]], [monthly, setup], 'homepage What we do price');
});

test('FAQ schema matches the visible FAQ', () => {
  const visible = [...elsa.matchAll(/<summary>(.*?)<\/summary>\s*<p>(.*?)<\/p>/g)].map(m => [decode(m[1]), decode(m[2])]);
  const schema = node(elsa, 'FAQPage').mainEntity.map(q => [q.name, q.acceptedAnswer.text]);
  assert.ok(visible.length >= 4 && visible.length <= 5);
  assert.deepEqual(visible, schema);
});

test('sitemap, robots and 404 page', () => {
  const sitemap = read('sitemap.xml');
  for (const [, url] of Object.values(pages)) assert.ok(sitemap.includes(`<loc>${url}</loc>`));
  assert.match(read('robots.txt'), /Sitemap: https:\/\/handballai\.tech\/sitemap\.xml/);
  const nf = read('404.html');
  assert.equal(count(nf, /<h1[\s>]/g), 1);
  assert.ok(nf.includes('name="robots" content="noindex"'));
});
