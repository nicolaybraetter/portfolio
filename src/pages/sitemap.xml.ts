import { getCollection } from 'astro:content';

export async function GET() {
  const tracks = [
    { slug: 'bound-beneath-heavens', updated: '2026-08-01' },
    { slug: 'ghost-of-a-garden', updated: '2026-08-01' },
    { slug: 'my-way-to-breathe', updated: '2026-08-01' },
  ];

  const urls = [
    { loc: 'https://djexcept4.de/de/', lastmod: '2026-08-01', changefreq: 'weekly', priority: 1.0 },
    { loc: 'https://djexcept4.de/en/', lastmod: '2026-08-01', changefreq: 'weekly', priority: 1.0 },
    { loc: 'https://djexcept4.de/de/tracks/', lastmod: '2026-08-01', changefreq: 'weekly', priority: 0.9 },
    { loc: 'https://djexcept4.de/en/tracks/', lastmod: '2026-08-01', changefreq: 'weekly', priority: 0.9 },
    { loc: 'https://djexcept4.de/de/bio/', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://djexcept4.de/en/bio/', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://djexcept4.de/de/contact/', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://djexcept4.de/en/contact/', lastmod: '2026-08-01', changefreq: 'monthly', priority: 0.7 },
    { loc: 'https://djexcept4.de/de/impressum/', lastmod: '2026-08-01', changefreq: 'yearly', priority: 0.3 },
    { loc: 'https://djexcept4.de/en/impressum/', lastmod: '2026-08-01', changefreq: 'yearly', priority: 0.3 },
    { loc: 'https://djexcept4.de/de/datenschutz/', lastmod: '2026-08-01', changefreq: 'yearly', priority: 0.3 },
    { loc: 'https://djexcept4.de/en/datenschutz/', lastmod: '2026-08-01', changefreq: 'yearly', priority: 0.3 },
  ];

  tracks.forEach((track) => {
    urls.push({ loc: `https://djexcept4.de/de/tracks/${track.slug}/`, lastmod: track.updated, changefreq: 'monthly', priority: 0.8 });
    urls.push({ loc: `https://djexcept4.de/en/tracks/${track.slug}/`, lastmod: track.updated, changefreq: 'monthly', priority: 0.8 });
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="https://www.w3.org/1999/xhtml">\n';

  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="de" href="${url.loc.replace('https://djexcept4.de/', 'https://djexcept4.de/de/').replace('https://djexcept4.de/en/', 'https://djexcept4.de/en/')}" />\n`;
    const otherLang = url.loc.includes('/de/') ? url.loc.replace('/de/', '/en/') : url.loc.replace('/en/', '/de/');
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${otherLang}" />\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
