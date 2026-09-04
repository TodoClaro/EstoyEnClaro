import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const faviconAndOgBlock = `    <meta property="og:image" content="/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="/og-image.png" />
    <meta name="theme-color" content="#0284C7" />

    <!-- Favicons y App Icons -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />`;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('<!doctype html>') && !content.includes('<!DOCTYPE html>')) return;
  
  // Replace old theme-color or add favicon block if not present
  if (!content.includes('/favicon-16x16.png')) {
    // Look for </head> or <link rel="preconnect"
    if (content.includes('<meta name="theme-color"')) {
      content = content.replace(/<meta name="theme-color"[^>]*>/i, faviconAndOgBlock);
    } else if (content.includes('<link rel="preconnect"')) {
      content = content.replace('<link rel="preconnect"', `${faviconAndOgBlock}\n\n    <link rel="preconnect"`);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated head in: ${filePath}`);
  }
}

// 1. Root files
['index.html', 'turismo.html', 'urgencias.html', 'promociones.html'].forEach(f => {
  const fp = path.join(rootDir, f);
  if (fs.existsSync(fp)) updateFile(fp);
});

// 2. Categorias files
const catDir = path.join(rootDir, 'categorias');
if (fs.existsSync(catDir)) {
  fs.readdirSync(catDir).forEach(f => {
    if (f.endsWith('.html')) {
      updateFile(path.join(catDir, f));
    }
  });
}

// 3. Comercios files
const comDir = path.join(rootDir, 'comercios');
if (fs.existsSync(comDir)) {
  fs.readdirSync(comDir).forEach(f => {
    if (f.endsWith('.html')) {
      updateFile(path.join(comDir, f));
    }
  });
}

console.log('All HTML files verified and updated with complete branding head tags!');
