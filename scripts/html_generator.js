import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to escape HTML strings
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 1. Template for Generating merchant HTML files (Supports 4 Plans: Gratis, Bronce, Plata, Oro)
function generateHtmlPage(c) {
  let schemaType = 'LocalBusiness';
  if (c.categoria_id === 'gastronomia') schemaType = 'Restaurant';
  if (c.categoria_id === 'alojamiento') schemaType = 'LodgingBusiness';
  if (c.categoria_id === 'inmobiliarias_alquileres') schemaType = 'RealEstateAgent';
  if (c.categoria_id === 'almacenes_kioscos') schemaType = 'ConvenienceStore';
  if (c.categoria_id === 'servicios_oficios') {
    if (c.subcategoria.includes('Gomería') || c.subcategoria.includes('Mecánico')) schemaType = 'AutoRepair';
    else if (c.subcategoria.includes('Ferretería')) schemaType = 'HardwareStore';
    else schemaType = 'HomeAndConstructionBusiness';
  }
  if (c.categoria_id === 'turismo_deportes') schemaType = 'SportsActivityLocation';

  const categoryNameMap = {
    gastronomia: 'Gastronomía',
    alojamiento: 'Alojamiento',
    inmobiliarias_alquileres: 'Inmobiliarias y Alquileres',
    almacenes_kioscos: 'Almacenes y Kioscos',
    servicios_oficios: 'Servicios y Oficios',
    compras_regaleria: 'Compras & Regalos',
    comercios_gral: 'Comercios en Gral.',
    turismo_deportes: 'Turismo y Ocio'
  };

  const catName = categoryNameMap[c.categoria_id] || 'Comercio';

  // Normalizar plan_id
  const planId = c.plan_id || 'gratis';
  const isOro = planId === 'oro' || planId === 'premium';
  const isPlata = planId === 'plata' || planId === 'destacado_cat';
  const isBronce = planId === 'bronce';
  const isGratis = planId === 'gratis' || planId === 'basico';

  // Badges reconocibles y diferenciados por color para los 4 planes
  let planBadge = '';
  if (isOro) {
    planBadge = `<span class="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black px-3 py-1 rounded-lg shadow-md ring-1 ring-amber-300 flex items-center gap-1.5"><i data-lucide="star" class="w-3.5 h-3.5 fill-slate-950 text-slate-950"></i><span>Plan Oro · Recomendado</span></span>`;
  } else if (isPlata) {
    planBadge = `<span class="bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-800 text-xs font-black px-3 py-1 rounded-lg shadow-2xs border border-slate-300 flex items-center gap-1.5"><i data-lucide="award" class="w-3.5 h-3.5 text-slate-700"></i><span>Plan Plata · Destacado</span></span>`;
  } else if (isBronce) {
    planBadge = `<span class="bg-amber-800 text-amber-100 text-xs font-bold px-3 py-1 rounded-lg shadow-xs flex items-center gap-1.5 border border-amber-700"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-amber-300"></i><span>Plan Bronce</span></span>`;
  } else {
    planBadge = `<span class="bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-slate-400"></i><span>Plan Gratis</span></span>`;
  }

  // Sección de Promociones (Solo Plata y Oro)
  const permitePromos = isOro || isPlata;
  const activePromo = (permitePromos && c.promos && c.promos.length > 0) ? c.promos[0] : null;
  const storyUrl = (activePromo && activePromo.imagen_historia_url) || c.imagen_historia_url;

  let storyThumbnailHtml = '';
  // Historias verticales 9:16 (Solo Plan Oro)
  if (isOro && storyUrl) {
    storyThumbnailHtml = `
          <!-- MINIATURA INTERACTIVA DE HISTORIA VERTICAL (PLAN ORO) -->
          <div class="mt-4 pt-4 border-t border-white/25 flex flex-col sm:flex-row items-center gap-4 bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl">
            <button 
              type="button"
              onclick="openStoryModalById('${c.id}', '${activePromo ? activePromo.id : ''}')"
              class="relative group cursor-pointer shrink-0 focus:outline-none"
              title="Tocar para ver Historia vertical (9:16)"
            >
              <!-- Anillo de color degradado estilo Instagram -->
              <div class="p-1 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-md group-hover:scale-105 transition-transform duration-200">
                <div class="w-16 h-28 sm:w-20 sm:h-36 rounded-xl overflow-hidden relative bg-slate-900">
                  <img src="${escapeHtml(storyUrl)}" alt="Historia ${escapeHtml(c.nombre)}" class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition flex items-center justify-center">
                    <div class="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <i data-lucide="play" class="w-4 h-4 fill-slate-900 ml-0.5"></i>
                    </div>
                  </div>
                </div>
              </div>
              <span class="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-tighter">
                9:16
              </span>
            </button>

            <div class="space-y-1 text-center sm:text-left flex-1">
              <div class="flex items-center justify-center sm:justify-start gap-1.5 text-amber-200 text-xs font-bold">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-300"></i>
                <span>Historia Oficial Plan Oro</span>
              </div>
              <h4 class="font-extrabold text-white text-xs sm:text-sm">
                Formato vertical interactivo con reservas
              </h4>
              <p class="text-[11px] text-amber-100/90 leading-relaxed">
                Tocá la miniatura para ver la historia completa (con barra de 7s) o enviar WhatsApp directo.
              </p>
              <button 
                type="button"
                onclick="openStoryModalById('${c.id}', '${activePromo ? activePromo.id : ''}')"
                class="inline-flex items-center gap-1.5 mt-1 text-xs font-extrabold text-white bg-black/40 hover:bg-black/60 border border-white/30 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
              >
                <i data-lucide="play-circle" class="w-3.5 h-3.5 text-amber-300"></i>
                <span>Abrir Historia Completa</span>
              </button>
            </div>
          </div>`;
  }

  const promoSection = activePromo ? `
          <!-- PROMO ACTIVA -->
          <div class="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
            <div class="flex items-center gap-2">
              <span class="bg-black/30 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded">
                🔥 Promo Destacada
              </span>
              ${activePromo.descuento_porcentaje ? `<span class="text-xs font-bold text-amber-100">${activePromo.descuento_porcentaje}% OFF</span>` : ''}
            </div>
            <h2 class="text-base sm:text-lg font-extrabold font-display">
              ${escapeHtml(activePromo.titulo)}
            </h2>
            <p class="text-xs sm:text-sm text-amber-50 leading-relaxed">
              ${escapeHtml(activePromo.descripcion)}
            </p>
            ${storyThumbnailHtml}
          </div>` : '';

  // Galería de Fotos extra (Solo Bronce, Plata y Oro)
  let galeriaFotosHtml = '';
  if (!isGratis && c.fotos && Array.isArray(c.fotos) && c.fotos.length > 0) {
    galeriaFotosHtml = `
          <!-- GALERÍA DE FOTOS (PLANES BRONCE, PLATA Y ORO) -->
          <section class="space-y-3 pt-2">
            <h2 class="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <i data-lucide="image" class="w-5 h-5 text-sky-600"></i>
              <span>Galería de Fotos</span>
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              ${c.fotos.map(fotoUrl => `
                <div class="rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 border border-slate-200">
                  <img src="${escapeHtml(fotoUrl)}" alt="Foto de ${escapeHtml(c.nombre)}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy">
                </div>
              `).join('')}
            </div>
          </section>`;
  }

  // ACCIONES RÁPIDAS: EN TODOS LOS PLANES (INCLUIDO GRATIS) SON LINKS 100% REALES Y FUNCIONALES
  const waBtn = c.whatsapp ? `
          <a href="https://wa.me/${c.whatsapp}?text=Hola%20${encodeURIComponent(c.nombre)}%2C%20los%20encontr%C3%A9%20en%20Estoy%20en%20Claro." target="_blank" rel="noopener noreferrer" class="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-5 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
            <span>WhatsApp Directo</span>
          </a>` : '';

  const phoneBtn = c.telefono ? `
          <a href="tel:${c.telefono.replace(/\s+/g, '').replace(/-/g, '')}" class="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-slate-700" title="Llamar">
            <i data-lucide="phone" class="w-4 h-4 text-emerald-400"></i>
            <span class="hidden sm:inline">Llamar (${escapeHtml(c.telefono)})</span>
            <span class="sm:hidden">Llamar</span>
          </a>` : '';

  const mapBtn = (c.lat && c.lng) ? `
          <a href="https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}" target="_blank" rel="noopener noreferrer" class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs">
            <i data-lucide="navigation" class="w-4 h-4 text-cyan-200"></i>
            <span>Cómo Llegar (GPS)</span>
          </a>` : '';

  // Redes Sociales: solo si muestra_redes es true (Bronce, Plata, Oro)
  const redesCardHtml = (!isGratis && c.instagram) ? `
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Instagram Oficial</span>
              <p class="font-bold text-sky-700">
                <a href="https://instagram.com/${escapeHtml(c.instagram)}" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1">
                  <span>@${escapeHtml(c.instagram)}</span>
                  <i data-lucide="external-link" class="w-3 h-3 text-sky-500"></i>
                </a>
              </p>
            </div>` : `
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Contacto Telefónico</span>
              <p class="font-bold text-slate-800">${escapeHtml(c.telefono || 'Ver WhatsApp')}</p>
            </div>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": c.nombre,
    "description": c.descripcion,
    "image": c.imagen_portada_url,
    "url": `https://estoyenclaro.com.ar/comercios/${c.slug}.html`,
    "telephone": c.telefono ? `+54${c.telefono.replace(/\D/g, '')}` : undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": c.direccion,
      "addressLocality": "Claromecó",
      "addressRegion": "Buenos Aires",
      "postalCode": "B7505",
      "addressCountry": "AR"
    },
    "geo": (c.lat && c.lng) ? {
      "@type": "GeoCoordinates",
      "latitude": c.lat,
      "longitude": c.lng
    } : undefined
  };

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>${escapeHtml(c.nombre)} en Claromecó | Info, WhatsApp y Ubicación</title>
    <meta name="description" content="${escapeHtml(c.descripcion)}" />
    <meta property="og:title" content="${escapeHtml(c.nombre)} | Claromecó" />
    <meta property="og:description" content="${escapeHtml(c.descripcion)}" />
    <meta property="og:image" content="${escapeHtml(c.imagen_portada_url)}" />
    <meta property="og:type" content="place" />
    <meta property="og:locale" content="es_AR" />
    <meta name="theme-color" content="#0284c7" />

    <!-- Datos Estructurados JSON-LD Schema.org -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 4)}
    </script>

    <!-- Fuentes Google -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['"Plus Jakarta Sans"', 'sans-serif'],
              display: ['Outfit', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <script src="https://unpkg.com/lucide@latest"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-cyan-100 selection:text-cyan-900 min-h-screen flex flex-col pb-20 md:pb-0">

    <!-- HEADER / NAVBAR COMPARTIDO -->
    <div id="header-placeholder"></div>

    <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 space-y-6">
      <article class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <!-- PORTADA -->
        <div class="relative h-64 sm:h-80 bg-slate-900">
          <img src="${escapeHtml(c.imagen_portada_url)}" alt="${escapeHtml(c.nombre)}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

          <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div class="flex items-center gap-2 flex-wrap">
              ${planBadge}
              <span class="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
                ${escapeHtml(catName)}
              </span>
            </div>

            <button onclick="compartirFicha()" class="bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition">
              <i data-lucide="share-2" class="w-4 h-4 text-cyan-600"></i>
              <span class="hidden sm:inline">Compartir</span>
            </button>
          </div>

          <div class="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <span class="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              ${escapeHtml(c.subcategoria)}
            </span>
            <h1 class="text-2xl sm:text-4xl font-extrabold font-display">
              ${escapeHtml(c.nombre)}
            </h1>
            <div class="flex items-center gap-1.5 text-xs text-slate-200 pt-0.5">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>${c.direccion && c.direccion.includes('Claromecó') ? escapeHtml(c.direccion) : `${escapeHtml(c.direccion || '')}, Claromecó`}</span>
            </div>
          </div>
        </div>

        <!-- ACCIONES RÁPIDAS: LINKS REALES Y FUNCIONALES EN TODOS LOS PLANES -->
        <div class="p-4 sm:p-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2.5">
          ${waBtn}
          ${phoneBtn}
          ${mapBtn}
        </div>

        <!-- CONTENIDO PRINCIPAL -->
        <div class="p-5 sm:p-8 space-y-8">
          ${promoSection}

          <!-- SOBRE EL COMERCIO -->
          <section class="space-y-3">
            <h2 class="text-lg font-bold text-slate-900 font-display">Sobre Nosotros</h2>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
              ${escapeHtml(c.descripcion)}
            </p>
          </section>

          ${galeriaFotosHtml}

          <!-- DATOS CLAVE -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Horarios de Atención</span>
              <p class="font-bold text-slate-800">${escapeHtml(c.horario || 'Consultar por WhatsApp')}</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
              <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Zona / Ubicación</span>
              <p class="font-bold text-slate-800">${escapeHtml(c.zona || 'Claromecó')}</p>
            </div>
            ${redesCardHtml}
          </div>
        </div>
      </article>
    </main>

    <!-- FOOTER, BARRA MÓVIL Y MODALES COMPARTIDOS -->
    <div id="footer-placeholder"></div>

    <!-- Data and Application Scripts (Vanilla JS) -->
    <script src=/data/comercios.js></script>
    <script src=/js/app.js></script>
  </body>
</html>
`;
}

export { generateHtmlPage };
