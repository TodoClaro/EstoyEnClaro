import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 680" width="512" height="680">
  <defs>
    <!-- Gradients -->
    <linearGradient id="pinOuterGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#58B8DC"/>
      <stop offset="35%" stop-color="#2D7B9E"/>
      <stop offset="70%" stop-color="#144C6A"/>
      <stop offset="100%" stop-color="#092B40"/>
    </linearGradient>

    <linearGradient id="pinRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8CD3EB" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#3187A9" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0B3047" stop-opacity="0.9"/>
    </linearGradient>

    <linearGradient id="innerSkyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="40%" stop-color="#E1F3F9"/>
      <stop offset="80%" stop-color="#BEE2F0"/>
      <stop offset="100%" stop-color="#9BCDE3"/>
    </linearGradient>

    <linearGradient id="lighthouseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#F0F8FB"/>
      <stop offset="100%" stop-color="#D2E8F2"/>
    </linearGradient>

    <linearGradient id="blueStripeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3A8EAF"/>
      <stop offset="50%" stop-color="#226685"/>
      <stop offset="100%" stop-color="#113F55"/>
    </linearGradient>

    <linearGradient id="domeGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#3B8FAA"/>
      <stop offset="50%" stop-color="#19536E"/>
      <stop offset="100%" stop-color="#0C2F42"/>
    </linearGradient>

    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#297A9B"/>
      <stop offset="50%" stop-color="#154B68"/>
      <stop offset="100%" stop-color="#0B2D40"/>
    </linearGradient>

    <filter id="subtleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#031622" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Pin Body (Outer Location Pin) with Drop Shadow -->
  <g filter="url(#subtleShadow)">
    <path d="M 256,12
             C 126,12 20,118 20,248
             C 20,360 135,490 256,660
             C 377,490 492,360 492,248
             C 492,118 386,12 256,12 Z"
          fill="url(#pinOuterGrad)" />

    <!-- Outer Bevel Rim -->
    <path d="M 256,16
             C 128,16 24,120 24,248
             C 24,358 137,486 256,652
             C 375,486 488,358 488,248
             C 488,120 384,16 256,16 Z"
          fill="none" stroke="url(#pinRimGrad)" stroke-width="8" />

    <!-- Inner Circle Cutout Background (Sky behind Lighthouse) -->
    <circle cx="256" cy="246" r="162" fill="url(#innerSkyGrad)" />
    
    <!-- Inner Rim of Pin Window -->
    <circle cx="256" cy="246" r="162" fill="none" stroke="#0F384F" stroke-width="14" opacity="0.6"/>
    <circle cx="256" cy="246" r="155" fill="none" stroke="#6EC2DE" stroke-width="4" opacity="0.8"/>

    <!-- Lighthouse Scene inside Window -->
    <g id="lighthouse-group">
      <!-- Lighthouse Tower Base -->
      <path d="M 226,380 L 236,230 L 276,230 L 286,380 Z" fill="url(#lighthouseGrad)" />

      <!-- Stripes on Tower (Claromecó Lighthouse diagonal/navy stripes) -->
      <!-- Stripe 1 (Middle-Lower) -->
      <path d="M 228,348 L 284,332 L 285,358 L 227,370 Z" fill="url(#blueStripeGrad)" />
      
      <!-- Stripe 2 (Middle-Upper) -->
      <path d="M 232,286 L 280,270 L 282,298 L 230,314 Z" fill="url(#blueStripeGrad)" />

      <!-- Tower Details / Door / Arched Window -->
      <path d="M 251,378 L 251,354 C 251,350 261,350 261,354 L 261,378 Z" fill="#0C2F42" />
      <path d="M 253,248 L 253,240 C 253,238 259,238 259,240 L 259,248 Z" fill="#0C2F42" />
      
      <!-- Gallery / Balcony Platform -->
      <rect x="228" y="222" width="56" height="8" rx="2" fill="url(#domeGrad)" />
      <line x1="228" y1="222" x2="284" y2="222" stroke="#6DC1DC" stroke-width="2" />
      <!-- Balcony Railing -->
      <line x1="230" y1="216" x2="282" y2="216" stroke="#0F394F" stroke-width="3" />
      <line x1="234" y1="222" x2="234" y2="216" stroke="#0F394F" stroke-width="2" />
      <line x1="244" y1="222" x2="244" y2="216" stroke="#0F394F" stroke-width="2" />
      <line x1="256" y1="222" x2="256" y2="216" stroke="#0F394F" stroke-width="2" />
      <line x1="268" y1="222" x2="268" y2="216" stroke="#0F394F" stroke-width="2" />
      <line x1="278" y1="222" x2="278" y2="216" stroke="#0F394F" stroke-width="2" />

      <!-- Lantern Room (Glass & Struts) -->
      <rect x="236" y="180" width="40" height="36" fill="#F8FDFF" />
      <rect x="236" y="180" width="40" height="36" fill="none" stroke="#0F394F" stroke-width="3" />
      <line x1="249" y1="180" x2="249" y2="216" stroke="#0F394F" stroke-width="2.5" />
      <line x1="263" y1="180" x2="263" y2="216" stroke="#0F394F" stroke-width="2.5" />

      <!-- Lantern Light Core (Soft warm glow) -->
      <circle cx="256" cy="198" r="8" fill="#FDE047" opacity="0.8" />
      <circle cx="256" cy="198" r="4" fill="#FFFFFF" />

      <!-- Roof / Dome of Lighthouse -->
      <path d="M 233,180 C 233,148 279,148 279,180 Z" fill="url(#domeGrad)" />
      <!-- Finial / Top Spire -->
      <circle cx="256" cy="144" r="5" fill="#0C2F42" />
      <rect x="254" y="146" width="4" height="6" fill="#0C2F42" />

      <!-- Coastal Wave & Dune base sweeping across the window bottom -->
      <path d="M 98,300
               C 160,340 210,380 256,380
               C 320,380 390,320 414,300
               L 414,400 L 98,400 Z"
            fill="url(#waveGrad)" />

      <!-- Highlight wave arc -->
      <path d="M 120,320 C 180,360 220,382 256,382 C 300,382 360,340 400,312"
            fill="none" stroke="#48A0C2" stroke-width="4" opacity="0.6" />
      <path d="M 140,340 C 200,375 235,390 256,390 C 285,390 340,360 380,335"
            fill="none" stroke="#71C5E2" stroke-width="2" opacity="0.4" />
    </g>

    <!-- Bottom Tip Highlight -->
    <circle cx="256" cy="654" r="3" fill="#8FD7EF" opacity="0.8" />
  </g>
</svg>`;

const faviconSquareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>
    <linearGradient id="pinOuterGradFav" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E0F2FE"/>
    </linearGradient>
  </defs>
  
  <!-- Outer Rounded Square Background for App Icon / Manifest -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Pin Logo Scaled & Centered -->
  <g transform="translate(64, 28) scale(0.75)">
    ${logoSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
</svg>`;

async function generateAssets() {
  console.log('Generando branding assets...');
  
  // Guardar SVG principal
  fs.writeFileSync('logo.svg', logoSvg);
  fs.writeFileSync('favicon.svg', faviconSquareSvg);

  // Helper para renderizar SVG a PNG con Resvg y Sharp
  async function renderSvgToPng(svgString, targetWidth, targetHeight, outputPath) {
    const resvg = new Resvg(svgString, {
      fitTo: {
        mode: 'width',
        value: targetWidth,
      },
    });
    const pngData = resvg.render().asPng();
    await sharp(pngData)
      .resize(targetWidth, targetHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(outputPath);
    console.log(`Creado: ${outputPath} (${targetWidth}x${targetHeight})`);
  }

  // 1. logo.png (alta resolución)
  await renderSvgToPng(logoSvg, 512, 680, 'logo.png');

  // 2. Favicons y App Icons
  await renderSvgToPng(faviconSquareSvg, 16, 16, 'favicon-16x16.png');
  await renderSvgToPng(faviconSquareSvg, 32, 32, 'favicon-32x32.png');
  await renderSvgToPng(faviconSquareSvg, 96, 96, 'favicon-96x96.png');
  await renderSvgToPng(faviconSquareSvg, 180, 180, 'apple-touch-icon.png');
  await renderSvgToPng(faviconSquareSvg, 192, 192, 'web-app-manifest-192x192.png');
  await renderSvgToPng(faviconSquareSvg, 512, 512, 'web-app-manifest-512x512.png');

  // 3. favicon.ico (32x32 PNG)
  await renderSvgToPng(faviconSquareSvg, 32, 32, 'favicon.ico');

  // 4. og-image.png (1200x630) para redes sociales
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#082F49"/>
        <stop offset="40%" stop-color="#0369A1"/>
        <stop offset="100%" stop-color="#0284C7"/>
      </linearGradient>
      <radialGradient id="ogSun" cx="70%" cy="25%" r="60%">
        <stop offset="0%" stop-color="#BAE6FD" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#0369A1" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#ogBg)"/>
    <rect width="1200" height="630" fill="url(#ogSun)"/>

    <!-- Decorative background elements -->
    <circle cx="1050" cy="150" r="320" fill="#38BDF8" opacity="0.1"/>
    <circle cx="150" cy="550" r="280" fill="#0284C7" opacity="0.3"/>

    <!-- Logo on Left -->
    <g transform="translate(100, 75) scale(0.7)">
      ${logoSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}
    </g>

    <!-- Typography on Right -->
    <g transform="translate(520, 150)">
      <!-- Badge -->
      <rect x="0" y="0" width="360" height="42" rx="21" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2"/>
      <text x="24" y="27" font-family="sans-serif" font-size="16" font-weight="bold" fill="#7DD3FC" letter-spacing="2">
        CLAROMECÓ &amp; DUNAMAR
      </text>

      <!-- Main Title -->
      <text x="0" y="125" font-family="sans-serif" font-size="76" font-weight="900" fill="#FFFFFF" letter-spacing="-2">
        Estoy en <tspan fill="#38BDF8">Claro</tspan>
      </text>

      <!-- Subtitle -->
      <text x="0" y="190" font-family="sans-serif" font-size="34" font-weight="700" fill="#F0F9FF">
        Tu Guía Comercial y Turística Web
      </text>

      <text x="0" y="240" font-family="sans-serif" font-size="22" font-weight="400" fill="#BAE6FD">
        Comercios abiertos • Gastronomía • Paseos • Urgencias • Promociones
      </text>

      <!-- Action Pill -->
      <g transform="translate(0, 280)">
        <rect width="280" height="56" rx="28" fill="#FFFFFF"/>
        <text x="32" y="36" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0369A1">
          estoyenclaro.com.ar →
        </text>
      </g>
    </g>
  </svg>`;

  await renderSvgToPng(ogSvg, 1200, 630, 'og-image.png');
  console.log('✅ Todos los branding assets fueron creados exitosamente!');
}

generateAssets().catch(console.error);
