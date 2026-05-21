// Remove duplicatas do array de URLs do sitemap.xml após build
import fs from 'fs';
import path from 'path';

const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml');

if (fs.existsSync(sitemapPath)) {
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  // Remove URLs duplicadas (baseado em <loc>...)
  xml = xml.replace(/(<url><loc>https:\/\/www\.consudes\.com\/><lastmod>.*?<\/url>)(?=[\s\S]*<url><loc>https:\/\/www\.consudes\.com\/><lastmod>)/, '');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log('Sitemap.xml deduplicado com sucesso!');
} else {
  console.error('sitemap.xml não encontrado. Rode o build antes.');
}
