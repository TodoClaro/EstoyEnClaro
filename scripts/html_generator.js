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
    if (c.subcategoria && (c.subcategoria.includes('Gomería') || c.subcategoria.includes('Mecánico'))) schemaType = 'AutoRepair';
    else if (c.subcategoria && c.subcategoria.includes('Ferretería')) schemaType = 'HardwareStore';
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

  // Normalizar plan_id (información interna, NUNCA mostrar el nombre del plan al público)
  const planId = c.plan_id || 'gratis';
  const isOro = planId === 'oro' || planId === 'premium';
  const isPlata = planId === 'plata' || planId === 'destacado_cat';
  const isBronce = planId === 'bronce';
  const isGratis = planId === 'gratis' || planId === 'basico';

  // 1) INDICADOR VISUAL: Únicamente "Destacado" y SOLO para Plata u Oro (nunca Bronce ni Gratis)
  let destacadoBadge = '';
  const tieneDestacado = (isOro || isPlata) && (c.destacado_categoria === true || (c.plan && c.plan.destacado_categoria === true) || c.plan_id === 'oro' || c.plan_id === 'plata');
  if (tieneDestacado && !isBronce && !isGratis) {
    destacadoBadge = `<span class="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5"><i data-lucide="star" class="w-3.5 h-3.5 fill-slate-950 text-slate-950"></i><span>Destacado</span></span>`;
  }

  // Dirección real y completa (nunca 'Zona' genérica)
  const hasRealAddress = Boolean(
    (c.direccion && c.direccion.trim().length > 0 && !c.direccion.toLowerCase().includes('a domicilio')) ||
    (c.lat && c.lng)
  );

  const direccionCompleta = c.direccion 
    ? (c.direccion.includes('Claromecó') || c.direccion.includes('Dunamar') ? c.direccion : `${c.direccion}, Claromecó`)
    : (c.zona || 'Claromecó, Buenos Aires');

  // Sección de Promociones (Solo Plata y Oro)
  const permitePromos = isOro || isPlata;
  const activePromo = (permitePromos && c.promos && c.promos.length > 0) ? c.promos[0] : null;
  const storyUrl = (activePromo && activePromo.imagen_historia_url) || c.imagen_historia_url;

  let storyThumbnailHtml = '';
  // Historias / Promo vertical destacada (Solo Plan Oro)
  if (isOro && storyUrl) {
    storyThumbnailHtml = `
          <!-- MINIATURA INTERACTIVA DE PROMO -->
          <div class="mt-4 pt-4 border-t border-white/25 flex flex-col sm:flex-row items-center gap-4 bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl">
            <button 
              type="button"
              onclick="openStoryModalById('${c.id}', '${activePromo ? activePromo.id : ''}')"
              class="relative group cursor-pointer shrink-0 focus:outline-none"
              title="Tocar para ver la promo completa"
            >
              <!-- Anillo de color degradado estilo historia -->
              <div class="p-1 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-md group-hover:scale-105 transition-transform duration-200">
                <div class="w-16 h-28 sm:w-20 sm:h-36 rounded-xl overflow-hidden relative bg-slate-900">
                  <img src="${escapeHtml(storyUrl)}" alt="Promo ${escapeHtml(c.nombre)}" class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition flex items-center justify-center">
                    <div class="w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <i data-lucide="play" class="w-4 h-4 fill-slate-900 ml-0.5"></i>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            <div class="space-y-2 text-center sm:text-left flex-1">
              <button 
                type="button"
                onclick="openStoryModalById('${c.id}', '${activePromo ? activePromo.id : ''}')"
                class="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-black/40 hover:bg-black/60 border border-white/30 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-xs active:scale-98"
              >
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-300"></i>
                <span>Mirá la promo completa</span>
              </button>
            </div>
          </div>`;
  }

  const promoSection = activePromo ? `
          <!-- PROMO ACTIVA -->
          <div class="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
            <div class="flex items-center gap-2">
              <span class="bg-black/30 text-white text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded">
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

  // 2) BOTONES DE ACCIÓN RÁPIDA: Si no hay dirección cargada, se muestran 2 botones bien distribuidos
  const cleanPhone = (c.telefono || '').replace(/\D/g, '');
  const cleanWa = (c.whatsapp || '').replace(/\D/g, '') || cleanPhone;
  const waUrl = cleanWa 
    ? `https://wa.me/${cleanWa.startsWith('54') ? cleanWa : `549${cleanWa}`}?text=Hola%20${encodeURIComponent(c.nombre)}%2C%20los%20encontr%C3%A9%20en%20Estoy%20en%20Claro.` 
    : '#';

  const telUrl = c.telefono 
    ? `tel:${c.telefono.replace(/\s+/g, '').replace(/-/g, '')}` 
    : (cleanWa ? `tel:+${cleanWa}` : '#');

  const mapUrl = (c.lat && c.lng)
    ? `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.nombre + ' ' + (c.direccion || 'Claromecó'))}`;

  const quickActionsHtml = `
        <!-- ACCIONES RÁPIDAS (${hasRealAddress ? '3 BOTONES' : '2 BOTONES'}) -->
        <div class="p-3 sm:p-4 bg-slate-900 text-white grid ${hasRealAddress ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 sm:gap-3">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 sm:py-3 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-1 sm:gap-2 shadow-md whitespace-nowrap text-center">
            <i data-lucide="message-circle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"></i>
            <span>WhatsApp</span>
          </a>
          <a href="${telUrl}" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 sm:py-3 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-1 sm:gap-2 border border-slate-700 whitespace-nowrap text-center" title="Llamar">
            <i data-lucide="phone" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0"></i>
            <span>Llamar</span>
          </a>
          ${hasRealAddress ? `
          <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 sm:py-3 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-1 sm:gap-2 shadow-xs whitespace-nowrap text-center">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200 shrink-0"></i>
            <span>Cómo llegar</span>
          </a>` : ''}
        </div>`;

  // 3) c) Redes Sociales y Enlaces (Solo Bronce, Plata y Oro; NO aparece en Gratis)
  let redesHtml = '';
  if (!isGratis) {
    const redesLinks = [];
    if (c.instagram) {
      const igUser = c.instagram.replace(/^@/, '').trim();
      const igUrl = c.instagram.startsWith('http') ? c.instagram : `https://instagram.com/${igUser}`;
      redesLinks.push(`
        <a href="${escapeHtml(igUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-tr from-pink-500/10 via-rose-500/15 to-amber-500/15 hover:from-pink-500/25 hover:to-rose-500/25 text-rose-700 border border-rose-200 hover:border-rose-400 text-xs sm:text-sm font-bold transition-all duration-150 shadow-xs hover:shadow-sm active:scale-95 group" title="Instagram: @${escapeHtml(igUser)}" aria-label="Instagram @${escapeHtml(igUser)}">
          <svg class="w-6 h-6 sm:w-4 sm:h-4 text-pink-600 fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span class="hidden sm:inline">@${escapeHtml(igUser)}</span>
          <svg class="hidden sm:inline w-3.5 h-3.5 text-rose-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      `);
    }
    if (c.facebook) {
      const fbUrl = c.facebook.startsWith('http') ? c.facebook : `https://facebook.com/${c.facebook}`;
      redesLinks.push(`
        <a href="${escapeHtml(fbUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-400 text-xs sm:text-sm font-bold transition-all duration-150 shadow-xs hover:shadow-sm active:scale-95 group" title="Facebook" aria-label="Facebook">
          <svg class="w-6 h-6 sm:w-4 sm:h-4 text-blue-600 fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span class="hidden sm:inline">Facebook</span>
          <svg class="hidden sm:inline w-3.5 h-3.5 text-blue-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      `);
    }
    const webSite = c.web || c.sitio_web || c.website;
    if (webSite) {
      const webUrl = webSite.startsWith('http') ? webSite : `https://${webSite}`;
      redesLinks.push(`
        <a href="${escapeHtml(webUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-slate-800 border border-sky-200 hover:border-sky-400 text-xs sm:text-sm font-bold transition-all duration-150 shadow-xs hover:shadow-sm active:scale-95 group" title="Sitio Web" aria-label="Sitio Web">
          <svg class="w-6 h-6 sm:w-4 sm:h-4 text-sky-600 fill-none stroke-current stroke-2 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span class="hidden sm:inline">Sitio Web</span>
          <svg class="hidden sm:inline w-3.5 h-3.5 text-slate-400 stroke-current fill-none stroke-2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
      `);
    }

    if (redesLinks.length > 0) {
      redesHtml = `
        <!-- REDES SOCIALES (PLANES BRONCE, PLATA Y ORO) -->
        <section class="space-y-2.5 pt-2">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="share-2" class="w-3.5 h-3.5 text-sky-600"></i>
            <span>Redes Sociales y Enlaces Oficiales</span>
          </h3>
          <div class="flex flex-wrap items-center gap-3">
            ${redesLinks.join('')}
          </div>
        </section>`;
    }
  }

  // 5) Galería de Fotos interactiva con Lightbox (Solo Bronce, Plata y Oro)
  let galeriaFotosHtml = '';
  if (!isGratis && c.fotos && Array.isArray(c.fotos) && c.fotos.length > 0) {
    galeriaFotosHtml = `
        <!-- GALERÍA DE FOTOS (LIGHTBOX INTERACTIVO) -->
        <section class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <h2 class="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <i data-lucide="images" class="w-5 h-5 text-sky-600"></i>
              <span>Galería de Fotos</span>
            </h2>
            <span class="text-xs font-medium text-slate-500">Tocar para ampliar</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            ${c.fotos.map((fotoUrl, idx) => `
              <button 
                type="button" 
                onclick="openGalleryLightbox(${idx})" 
                class="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-4/3 border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 block text-left w-full shadow-2xs hover:shadow-md transition"
                title="Ver foto ${idx + 1} en tamaño completo"
              >
                <img src="${escapeHtml(fotoUrl)}" alt="Foto ${idx + 1} de ${escapeHtml(c.nombre)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div class="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <i data-lucide="maximize-2" class="w-4 h-4"></i>
                  </div>
                </div>
              </button>
            `).join('')}
          </div>
        </section>`;
  }

  // 3) d) Descripción "Sobre Nosotros" (al final de este bloque)
  // Para planes Gratis: descripción breve
  let descripcionRender = c.descripcion || '';
  if (isGratis) {
    descripcionRender = c.descripcion_corta || (c.descripcion && c.descripcion.length > 130 ? c.descripcion.slice(0, 125) + '...' : c.descripcion);
  }

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

    <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 space-y-4">
      
      <!-- 4) BOTÓN VOLVER BIEN VISIBLE -->
      <div class="flex items-center justify-between gap-3">
        <a 
          href="/categorias/${c.categoria_id ? `${c.categoria_id}.html` : 'index.html'}" 
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 hover:text-slate-950 border border-slate-200 text-xs sm:text-sm font-extrabold shadow-xs transition active:scale-95 group"
        >
          <i data-lucide="arrow-left" class="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform"></i>
          <span>Volver a ${escapeHtml(catName)}</span>
        </a>
        <a 
          href="/" 
          class="text-xs font-semibold text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
        >
          <i data-lucide="home" class="w-3.5 h-3.5 text-slate-400"></i>
          <span>Inicio</span>
        </a>
      </div>

      <article class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <!-- PORTADA -->
        <div class="relative h-64 sm:h-80 bg-slate-900">
          <img src="${escapeHtml(c.imagen_portada_url)}" alt="${escapeHtml(c.nombre)}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

          <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div class="flex items-center gap-2 flex-wrap">
              ${destacadoBadge}
              <span class="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg">
                ${escapeHtml(catName)}
              </span>
            </div>

            <button onclick="compartirFicha()" class="bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition">
              <i data-lucide="share-2" class="w-4 h-4 text-cyan-600"></i>
              <span class="hidden sm:inline">Compartir</span>
            </button>
          </div>

          <div class="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
            <span class="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider drop-shadow-sm">
              ${escapeHtml(c.subcategoria)}
            </span>
            <h1 class="text-2xl sm:text-4xl font-extrabold font-display drop-shadow-md">
              ${escapeHtml(c.nombre)}
            </h1>
            <div class="pt-0.5 flex">
              <div class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shadow-md max-w-full">
                <i data-lucide="${hasRealAddress ? 'map-pin' : 'truck'}" class="w-4 h-4 text-cyan-300 shrink-0"></i>
                <span class="truncate">${escapeHtml(hasRealAddress ? direccionCompleta : `${c.zona || 'Claromecó'} (A domicilio / Consultar)`)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2) ACCIONES RÁPIDAS -->
        ${quickActionsHtml}

        <!-- 3) CONTENIDO PRINCIPAL REORDENADO -->
        <div class="p-5 sm:p-8 space-y-6 sm:space-y-7">
          ${promoSection}

          <!-- a) HORARIOS Y b) DIRECCIÓN REAL O MODALIDAD -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <i data-lucide="clock" class="w-5 h-5 text-amber-700"></i>
              </div>
              <div class="space-y-0.5">
                <span class="text-slate-500 font-bold uppercase tracking-wider text-xs">Horarios de Atención</span>
                <p class="font-bold text-slate-900 text-sm sm:text-base">${escapeHtml(c.horario || 'Consultar por WhatsApp')}</p>
              </div>
            </div>

            <div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                <i data-lucide="${hasRealAddress ? 'map-pin' : 'truck'}" class="w-5 h-5 text-sky-700"></i>
              </div>
              <div class="space-y-0.5">
                <span class="text-slate-500 font-bold uppercase tracking-wider text-xs">${hasRealAddress ? 'Dirección' : 'Modalidad de Atención'}</span>
                <p class="font-bold text-slate-900 text-sm sm:text-base">${escapeHtml(hasRealAddress ? direccionCompleta : `Servicio a domicilio en ${c.zona || 'Claromecó y Dunamar'}`)}</p>
              </div>
            </div>
          </div>

          <!-- c) REDES SOCIALES Y ENLACES (SOLO SI EL PLAN LO INCLUYE) -->
          ${redesHtml}

          <!-- 5) GALERÍA DE FOTOS -->
          ${galeriaFotosHtml}

          <!-- d) SOBRE NOSOTROS (AL FINAL DEL BLOQUE) -->
          <section class="space-y-2 pt-3 border-t border-slate-100">
            <h2 class="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <i data-lucide="info" class="w-5 h-5 text-sky-600"></i>
              <span>Sobre Nosotros</span>
            </h2>
            <p class="text-sm sm:text-base text-slate-700 leading-relaxed">
              ${escapeHtml(descripcionRender)}
            </p>
          </section>
        </div>
      </article>
    </main>

    <!-- FOOTER, BARRA MÓVIL Y MODALES COMPARTIDOS -->
    <div id="footer-placeholder"></div>

    <script>
      window.CURRENT_MERCHANT_PHOTOS = ${JSON.stringify(c.fotos || [])};
    </script>
    <!-- Data and Application Scripts (Vanilla JS) -->
    <script src=/data/comercios.js></script>
    <script src=/js/app.js></script>
  </body>
</html>
`;
}

export { generateHtmlPage };
