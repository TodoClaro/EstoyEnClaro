import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateHtmlPage } from './html_generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read existing data/comercios.js to get COMERCIOS_DATA
const comerciosJsPath = path.join(rootDir, 'data', 'comercios.js');
const comerciosJsContent = fs.readFileSync(comerciosJsPath, 'utf8');

const startMarker = 'const COMERCIOS_DATA = [';
const endMarker = 'const PUNTOS_TURISTICOS = [';

const startIndex = comerciosJsContent.indexOf(startMarker);
const endIndex = comerciosJsContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Error finding COMERCIOS_DATA markers in data/comercios.js');
  process.exit(1);
}

const existingComerciosStr = comerciosJsContent.substring(startIndex + startMarker.length - 1, endIndex).trim().replace(/;\s*$/, '');
const evalWrapper = new Function(`
  const PLANES_DATA = [
    { id: 'gratis', nombre: 'Gratis', muestra_redes: false, destacado_categoria: false, destacado_home: false, permite_promos: false, permite_imagen_historia: false, color_badge: 'slate' },
    { id: 'bronce', nombre: 'Bronce', muestra_redes: true, destacado_categoria: false, destacado_home: false, permite_promos: false, permite_imagen_historia: false, color_badge: 'amber-700' },
    { id: 'plata', nombre: 'Plata', muestra_redes: true, destacado_categoria: true, destacado_home: false, permite_promos: true, permite_imagen_historia: false, color_badge: 'slate-400' },
    { id: 'oro', nombre: 'Oro', muestra_redes: true, destacado_categoria: true, destacado_home: true, permite_promos: true, permite_imagen_historia: true, color_badge: 'amber-400' }
  ];
  return ${existingComerciosStr};
`);

const allComercios = evalWrapper();
console.log(`Loaded ${allComercios.length} merchants from data/comercios.js.`);

// 2. Generate HTML files for all merchants in /comercios/
const comerciosHtmlDir = path.join(rootDir, 'comercios');
if (!fs.existsSync(comerciosHtmlDir)) {
  fs.mkdirSync(comerciosHtmlDir, { recursive: true });
}

const validSlugs = new Set();
let generatedCount = 0;

for (const c of allComercios) {
  const htmlFileName = `${c.slug}.html`;
  validSlugs.add(htmlFileName);
  const filePath = path.join(comerciosHtmlDir, htmlFileName);
  const htmlContent = generateHtmlPage(c);
  fs.writeFileSync(filePath, htmlContent, 'utf8');
  generatedCount++;
}

// Remove any orphan / obsolete HTML files in /comercios/
const existingFiles = fs.readdirSync(comerciosHtmlDir).filter(f => f.endsWith('.html'));
for (const file of existingFiles) {
  if (!validSlugs.has(file)) {
    fs.unlinkSync(path.join(comerciosHtmlDir, file));
    console.log(`Removed orphan HTML file: comercios/${file}`);
  }
}

console.log(`Merchant HTML Pages: Generated/Updated ${generatedCount} merchant pages.`);

// 3. Generate updated sitemap.xml
const baseUrl = 'https://estoyenclaro.com.ar';
const today = new Date().toISOString().split('T')[0];

const staticUrls = [
  { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${baseUrl}/index.html`, priority: '1.0', changefreq: 'daily' },
  { loc: `${baseUrl}/urgencias.html`, priority: '0.9', changefreq: 'hourly' },
  { loc: `${baseUrl}/turismo.html`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${baseUrl}/promociones.html`, priority: '0.8', changefreq: 'daily' },
  { loc: `${baseUrl}/categorias/index.html`, priority: '0.9', changefreq: 'daily' },
  { loc: `${baseUrl}/categorias/gastronomia.html`, priority: '0.9', changefreq: 'daily' },
  { loc: `${baseUrl}/categorias/alojamiento.html`, priority: '0.9', changefreq: 'daily' },
  { loc: `${baseUrl}/categorias/inmobiliarias_alquileres.html`, priority: '0.8', changefreq: 'daily' },
  { loc: `${baseUrl}/categorias/almacenes_kioscos.html`, priority: '0.8', changefreq: 'daily' },
  { loc: `${baseUrl}/categorias/servicios_oficios.html`, priority: '0.8', changefreq: 'daily' },
  { loc: `${baseUrl}/categorias/compras_regaleria.html`, priority: '0.7', changefreq: 'weekly' },
  { loc: `${baseUrl}/categorias/comercios_gral.html`, priority: '0.7', changefreq: 'weekly' },
  { loc: `${baseUrl}/categorias/turismo_deportes.html`, priority: '0.8', changefreq: 'weekly' }
];

function getPriorityForPlan(planId) {
  switch (planId) {
    case 'oro':
    case 'premium':
      return '0.9';
    case 'plata':
    case 'destacado_cat':
      return '0.8';
    case 'bronce':
      return '0.7';
    case 'gratis':
    case 'basico':
    default:
      return '0.6';
  }
}

const merchantUrls = allComercios.map(c => ({
  loc: `${baseUrl}/comercios/${c.slug}.html`,
  priority: getPriorityForPlan(c.plan_id),
  changefreq: 'weekly'
}));

const allUrls = [...staticUrls, ...merchantUrls];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`Successfully updated sitemap.xml with ${allUrls.length} URLs.`);
