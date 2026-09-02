// ====================================================================
// ESTOY EN CLARO — Scripts Globales y Componentes Interactivos (Vanilla JS)
// ====================================================================

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Cargar header y footer compartidos desde /partials/ si existen placeholders
  await loadPartials();

  // 2. Inicializar iconos de Lucide si la librería está presente
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 3. Configurar eventos de modales y componentes interactivos
  initSearchModal();
  initMerchantModal();
  initStoryModal();
  initUrgenciasModal();
  initAvisosSection();
  initDynamicPromos();
  initRecommendedCarousel();
  initCategoryPage();
});

// --------------------------------------------------------------------
// 0. Carga de Partials Compartidos (Header y Footer / Modales)
// --------------------------------------------------------------------
async function loadPartials() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  const promises = [];

  if (headerPlaceholder) {
    promises.push(
      fetch('/partials/header.html')
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar header.html');
          return res.text();
        })
        .then(html => {
          headerPlaceholder.innerHTML = html;
          highlightActiveNav();
        })
        .catch(err => console.warn('Aviso: no se cargó partial header:', err))
    );
  }

  if (footerPlaceholder) {
    promises.push(
      fetch('/partials/footer.html')
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar footer.html');
          return res.text();
        })
        .then(html => {
          footerPlaceholder.innerHTML = html;
          highlightActiveBottomNav();
        })
        .catch(err => console.warn('Aviso: no se cargó partial footer:', err))
    );
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }
}

function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('#header-placeholder .nav-link');
  
  navLinks.forEach(link => {
    const navType = link.getAttribute('data-nav');
    let isActive = false;
    if (navType === 'inicio' && (currentPath === '/' || currentPath === '/index.html')) {
      isActive = true;
    } else if (navType === 'categorias' && currentPath.includes('/categorias')) {
      isActive = true;
    } else if (navType === 'promociones' && currentPath.includes('/promociones')) {
      isActive = true;
    } else if (navType === 'turismo' && currentPath.includes('/turismo')) {
      isActive = true;
    }

    if (isActive) {
      link.classList.remove('hover:text-slate-900', 'hover:bg-slate-100', 'text-slate-600');
      link.classList.add('text-sky-700', 'bg-sky-50', 'font-bold');
    }
  });
}

function highlightActiveBottomNav() {
  const currentPath = window.location.pathname;
  const bottomLinks = document.querySelectorAll('#footer-placeholder .nav-bottom-item');

  bottomLinks.forEach(link => {
    const navType = link.getAttribute('data-bottom');
    let isActive = false;
    if (navType === 'inicio' && (currentPath === '/' || currentPath === '/index.html')) {
      isActive = true;
    } else if (navType === 'categorias' && currentPath.includes('/categorias')) {
      isActive = true;
    } else if (navType === 'promociones' && currentPath.includes('/promociones')) {
      isActive = true;
    }

    if (isActive) {
      link.classList.remove('text-slate-300', 'text-slate-400', 'text-slate-600');
      link.classList.add('text-sky-400', 'font-bold');
      const icon = link.querySelector('i, svg');
      if (icon) {
        icon.classList.remove('text-slate-300', 'text-slate-400');
        icon.classList.add('text-sky-400');
      }
    }
  });
}

// --------------------------------------------------------------------
// 1. Modal de Búsqueda en tiempo real
// --------------------------------------------------------------------
function initSearchModal() {
  const searchModal = document.getElementById('search-modal');
  const openButtons = document.querySelectorAll('[data-open-search]');
  const closeButton = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchModal) return;

  function openSearch() {
    searchModal.classList.remove('hidden');
    searchModal.classList.add('flex');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeSearch() {
    searchModal.classList.add('hidden');
    searchModal.classList.remove('flex');
    if (searchInput) searchInput.value = '';
    renderSearchResults('');
  }

  openButtons.forEach(btn => btn.addEventListener('click', openSearch));
  if (closeButton) closeButton.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      renderSearchResults(q);
    });
  }

  function renderSearchResults(q) {
    if (!searchResults) return;
    if (!q) {
      searchResults.innerHTML = `
        <div class="py-6 text-center space-y-3">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Búsquedas populares en Claromecó
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
            <button onclick="setSearchTerm('Parrilla')" class="bg-slate-100 hover:bg-sky-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full transition cursor-pointer">Parrillas</button>
            <button onclick="setSearchTerm('Cabañas')" class="bg-slate-100 hover:bg-sky-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full transition cursor-pointer">Cabañas Dunamar</button>
            <button onclick="setSearchTerm('Kayak')" class="bg-slate-100 hover:bg-sky-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full transition cursor-pointer">Kayaks & Arroyo</button>
            <button onclick="setSearchTerm('Farmacia')" class="bg-slate-100 hover:bg-sky-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full transition cursor-pointer">Farmacias</button>
            <button onclick="setSearchTerm('Rabas')" class="bg-slate-100 hover:bg-sky-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full transition cursor-pointer">Rabas & Pescados</button>
          </div>
        </div>
      `;
      return;
    }

    if (typeof COMERCIOS_DATA === 'undefined') return;

    const matches = COMERCIOS_DATA.filter(c => {
      const enNombre = c.nombre && c.nombre.toLowerCase().includes(q);
      const enDesc = c.descripcion && c.descripcion.toLowerCase().includes(q);
      const enSubcat = c.subcategoria && c.subcategoria.toLowerCase().includes(q);
      const enZona = c.zona && c.zona.toLowerCase().includes(q);
      const enDir = c.direccion && c.direccion.toLowerCase().includes(q);
      const enServicios = c.servicios && Array.isArray(c.servicios) && c.servicios.some(s => s.toLowerCase().includes(q));
      const enPromos = c.promos && Array.isArray(c.promos) && c.promos.some(p => ((p.titulo || '') + ' ' + (p.descripcion || '')).toLowerCase().includes(q));
      const enTags = c.tags && Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(q));
      return enNombre || enDesc || enSubcat || enZona || enDir || enServicios || enPromos || enTags;
    });

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="py-8 text-center text-slate-500 text-xs">
          No encontramos comercios con "<strong>${q}</strong>". Probá buscar por rubro general.
        </div>
      `;
      return;
    }

    searchResults.innerHTML = `
      <div class="space-y-2">
        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Comercios encontrados (${matches.length})
        </div>
        ${matches.map(c => `
          <a href="/comercios/${c.slug}.html" class="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-sky-50/70 border border-slate-200 transition group">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                <img src="${c.imagen_portada_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200'}" alt="${c.nombre}" class="w-full h-full object-cover">
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-700">${c.nombre}</h4>
                  ${c.plan?.destacado_categoria ? '<span class="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded">Destacado</span>' : ''}
                </div>
                <div class="text-[11px] text-slate-500 mt-0.5">
                  <span class="font-semibold text-slate-700">${c.subcategoria}</span> • <span>${c.zona || 'Claromecó'}</span>
                </div>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition shrink-0"></i>
          </a>
        `).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  window.setSearchTerm = (term) => {
    if (searchInput) {
      searchInput.value = term;
      renderSearchResults(term.toLowerCase());
    }
  };

  window.openSearchWithTerm = (term) => {
    openSearch();
    if (term) {
      window.setSearchTerm(term);
    }
  };
}

// --------------------------------------------------------------------
// 2. Modal "Sumá tu Comercio" (Formulario de 3 campos hacia WhatsApp)
// --------------------------------------------------------------------
function initMerchantModal() {
  const merchantModal = document.getElementById('merchant-modal');
  const openButtons = document.querySelectorAll('[data-open-merchant]');
  const closeButtons = document.querySelectorAll('[data-close-merchant]');
  const form = document.getElementById('merchant-form');
  const whatsappBtn = document.getElementById('merchant-whatsapp-submit');

  if (!merchantModal) return;

  function openMerchant() {
    merchantModal.classList.remove('hidden');
    merchantModal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }

  function closeMerchant() {
    merchantModal.classList.add('hidden');
    merchantModal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  openButtons.forEach(btn => btn.addEventListener('click', openMerchant));
  closeButtons.forEach(btn => btn.addEventListener('click', closeMerchant));

  merchantModal.addEventListener('click', (e) => {
    if (e.target === merchantModal) closeMerchant();
  });

  function sendMerchantWhatsApp(e) {
    if (e) e.preventDefault();
    const nombre = (document.getElementById('merchant-nombre')?.value || '').trim();
    const comercio = (document.getElementById('merchant-comercio')?.value || '').trim();
    const rubro = (document.getElementById('merchant-rubro')?.value || '').trim();

    let text = 'Hola Estoy en Claro!';
    if (nombre || comercio || rubro) {
      text += ` Soy ${nombre || 'un comerciante'}`;
      if (comercio) text += `, de "${comercio}"`;
      if (rubro) text += ` (Rubro: ${rubro})`;
      text += '. Quiero sumar mi comercio a la guía.';
    } else {
      text += ' Quiero sumar mi comercio a la guía.';
    }

    const waUrl = `https://wa.me/5492983552010?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  }

  if (form) {
    form.addEventListener('submit', sendMerchantWhatsApp);
  }
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', sendMerchantWhatsApp);
  }
}

// --------------------------------------------------------------------
// 2.1 Modal de Historias Verticales (9:16) - Plan Oro / Premium
// --------------------------------------------------------------------
let storyAnimFrame = null;
let storyStartTime = 0;
const STORY_DURATION_MS = 10000; // 10 segundos
let storyElapsed = 0;
let storyIsPaused = false;
let storyEventsAttached = false;

function ensureStoryModalInDom() {
  let modal = document.getElementById('story-modal');
  if (!modal) {
    const div = document.createElement('div');
    div.innerHTML = `
      <div id="story-modal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md hidden items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
        <div id="story-card-box" class="relative w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] aspect-[9/16] max-h-[90vh] sm:max-h-[88vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-950 flex flex-col justify-between select-none animate-in fade-in zoom-in-95 duration-200" style="-webkit-touch-callout: none; -webkit-user-select: none; user-select: none;">
          <div class="absolute top-0 left-0 right-0 z-30 p-3.5 pt-4 flex flex-col gap-2.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-auto">
            <div class="w-full h-1 bg-white/30 rounded-full overflow-hidden">
              <div id="story-progress-bar" class="h-full bg-white rounded-full w-0"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div id="story-logo-container" class="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-sm shrink-0">
                  <div class="p-0.5 bg-slate-900 rounded-full">
                    <img id="story-merchant-logo" src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150" alt="Comercio" class="w-7 h-7 rounded-full object-cover">
                  </div>
                </div>
                <div class="leading-tight text-white drop-shadow">
                  <div class="flex items-center gap-1.5">
                    <span id="story-merchant-name" class="font-extrabold text-xs sm:text-sm text-white truncate max-w-[170px]">Comercio</span>
                    <span id="story-plan-badge" class="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">Destacado</span>
                  </div>
                  <span id="story-badge-time" class="text-[10px] text-amber-200 font-medium">Promo Vigente · 10 seg</span>
                </div>
              </div>
              <button id="story-close-btn" class="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition border border-white/20 cursor-pointer" title="Cerrar Historia">
                <i data-lucide="x" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
          <div class="absolute inset-0 z-10 bg-slate-950 flex items-center justify-center overflow-hidden">
            <img id="story-image" src="" alt="Historia de Comercio" class="w-full h-full object-cover pointer-events-none select-none" oncontextmenu="return false;" style="-webkit-touch-callout: none; -webkit-user-select: none; user-select: none; pointer-events: none;">
          </div>
          <div class="relative z-30 p-4 pt-12 pb-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col gap-2.5 mt-auto pointer-events-auto">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span id="story-promo-badge" class="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <i data-lucide="tag" class="w-3 h-3"></i>
                  <span id="story-promo-discount">20% OFF</span>
                </span>
                <span id="story-promo-range" class="text-[10px] font-bold text-amber-200 bg-black/40 border border-amber-400/30 px-2 py-0.5 rounded-md">
                  Vigente
                </span>
              </div>
              <h3 id="story-promo-title" class="font-extrabold text-white text-sm sm:text-base leading-snug drop-shadow line-clamp-2">
                Título de la promo
              </h3>
              <p id="story-promo-desc" class="text-[11px] sm:text-xs text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
                Descripción de la promoción
              </p>
            </div>

            <!-- Contenedor de Botones de Acción -->
            <div id="story-actions-container" class="w-full">
              <!-- Botón único para Avisos -->
              <a id="story-aviso-btn" href="#" target="_blank" rel="noopener noreferrer" class="hidden w-full text-white font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm transition items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-98">
                <i data-lucide="external-link" class="w-4 h-4"></i>
                <span>Más información acá</span>
              </a>

              <!-- Botones gemelos 50/50 para Comercio -->
              <div id="story-merchant-buttons" class="grid grid-cols-2 gap-2.5 w-full">
                <!-- Botón 1: WhatsApp (Verde esmeralda) -->
                <a id="story-whatsapp-btn" href="#" target="_blank" rel="noopener noreferrer" class="w-full bg-emerald-600/95 hover:bg-emerald-500 active:scale-98 backdrop-blur-md text-white font-extrabold py-3 px-2 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-xl border border-emerald-400/30 cursor-pointer text-center">
                  <i data-lucide="message-circle" class="w-4 h-4 shrink-0"></i>
                  <span class="truncate">WhatsApp</span>
                </a>

                <!-- Botón 2: Ficha completa (Ícono store/tienda) -->
                <a id="story-merchant-link" href="#" class="w-full bg-indigo-600/95 hover:bg-indigo-500 active:scale-98 backdrop-blur-md text-white font-extrabold py-3 px-2 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-xl border border-indigo-400/30 cursor-pointer text-center">
                  <i data-lucide="store" class="w-4 h-4 shrink-0"></i>
                  <span class="truncate">Ficha completa</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(div.firstElementChild);
    modal = document.getElementById('story-modal');
  }

  // Vincular eventos de pausa e interacción una sola vez
  if (modal && !storyEventsAttached) {
    const cardBox = document.getElementById('story-card-box');
    const closeBtn = document.getElementById('story-close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.closeStoryModal();
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeStoryModal();
      }
    });

    // Pausar barra de progreso y congelar historia al presionar (touch y mouse)
    const pauseStory = (e) => {
      // Si el toque es sobre botones o enlaces clickeables interactivos, no interferir con la apertura
      if (e.target.closest('a') || e.target.closest('button')) return;
      storyIsPaused = true;
    };

    const resumeStory = () => {
      storyIsPaused = false;
    };

    if (cardBox) {
      // Touch events (móviles)
      cardBox.addEventListener('touchstart', pauseStory, { passive: true });
      cardBox.addEventListener('touchend', resumeStory, { passive: true });
      cardBox.addEventListener('touchcancel', resumeStory, { passive: true });

      // Mouse events (escritorio)
      cardBox.addEventListener('mousedown', pauseStory);
      cardBox.addEventListener('mouseup', resumeStory);
      cardBox.addEventListener('mouseleave', resumeStory);

      // Prevenir menú contextual de clic derecho o touch sostenido
      cardBox.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
    }

    storyEventsAttached = true;
  }

  return modal;
}

window.initStoryModal = () => {
  ensureStoryModalInDom();
};

window.openStoryModal = (data) => {
  if (!data) return;
  const modal = ensureStoryModalInDom();
  if (!modal) return;

  const imgEl = document.getElementById('story-image');
  const logoEl = document.getElementById('story-merchant-logo');
  const nameEl = document.getElementById('story-merchant-name');
  const planBadgeEl = document.getElementById('story-plan-badge');
  const badgeTimeEl = document.getElementById('story-badge-time');
  const discountEl = document.getElementById('story-promo-discount');
  const rangeEl = document.getElementById('story-promo-range');
  const titleEl = document.getElementById('story-promo-title');
  const descEl = document.getElementById('story-promo-desc');
  const avisoBtn = document.getElementById('story-aviso-btn');
  const merchantButtons = document.getElementById('story-merchant-buttons');
  const waBtn = document.getElementById('story-whatsapp-btn');
  const merchantLink = document.getElementById('story-merchant-link');
  const progressBar = document.getElementById('story-progress-bar');
  const logoContainer = document.getElementById('story-logo-container');

  const { comercio, promo, imagen_historia_url, is_aviso, aviso } = data;

  if (is_aviso && aviso) {
    // ----------------------------------------------------
    // HISTORIA DE AVISO (Institucional o Novedad de terceros)
    // ----------------------------------------------------
    const isInst = Boolean(aviso.institucional);
    if (imgEl) imgEl.src = aviso.imagen_historia_url || '';
    if (logoEl) {
      logoEl.src = isInst 
        ? 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150' 
        : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150';
    }
    if (nameEl) nameEl.textContent = isInst ? 'Claromecó Oficial' : 'Evento en Claro';
    if (planBadgeEl) {
      planBadgeEl.textContent = isInst ? 'Institucional' : 'Novedad';
      planBadgeEl.className = isInst 
        ? 'bg-sky-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded font-mono uppercase tracking-tighter shadow-xs' 
        : 'bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded font-mono uppercase tracking-tighter shadow-xs';
    }
    if (logoContainer) {
      logoContainer.className = isInst
        ? 'p-0.5 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-cyan-300 shadow-sm shrink-0'
        : 'p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-sm shrink-0';
    }
    if (badgeTimeEl) badgeTimeEl.textContent = 'Novedad Vigente · 10 seg';
    if (discountEl) discountEl.textContent = isInst ? 'Oficial' : 'Destacado';
    if (rangeEl) rangeEl.textContent = 'Vigente';
    if (titleEl) titleEl.textContent = aviso.titulo;
    if (descEl) descEl.textContent = aviso.descripcion_corta;

    // Mostrar SOLO el botón de aviso y ocultar botones de comercio
    if (merchantButtons) merchantButtons.classList.add('hidden');
    if (avisoBtn) {
      avisoBtn.href = aviso.link_externo || '#';
      avisoBtn.classList.remove('hidden');
      avisoBtn.classList.add('flex');
      avisoBtn.className = isInst
        ? 'flex w-full bg-sky-600 hover:bg-sky-500 active:scale-98 backdrop-blur-md text-white font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm transition items-center justify-center gap-2 shadow-xl border border-sky-400/30 cursor-pointer'
        : 'flex w-full bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-95 active:scale-98 backdrop-blur-md text-white font-extrabold py-3 px-4 rounded-2xl text-xs sm:text-sm transition items-center justify-center gap-2 shadow-xl border border-amber-400/30 cursor-pointer';
    }
  } else {
    // ----------------------------------------------------
    // HISTORIA DE COMERCIO (Plan Oro / Promociones)
    // ----------------------------------------------------
    const imageUrl = imagen_historia_url || (promo && promo.imagen_historia_url) || (comercio && comercio.imagen_historia_url) || (comercio && comercio.imagen_portada_url);

    if (imgEl) imgEl.src = imageUrl || '';
    if (logoEl) logoEl.src = (comercio && (comercio.logo_url || comercio.imagen_portada_url)) || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150';
    if (nameEl) nameEl.textContent = (comercio && comercio.nombre) || 'Comercio';
    if (planBadgeEl) {
      planBadgeEl.textContent = 'Destacado';
      planBadgeEl.className = 'bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs';
    }
    if (logoContainer) {
      logoContainer.className = 'p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-sm shrink-0';
    }
    if (badgeTimeEl) badgeTimeEl.textContent = 'Promo Vigente · 10 seg';
    
    if (discountEl) {
      if (promo && promo.descuento_porcentaje) {
        discountEl.textContent = `${promo.descuento_porcentaje}% OFF`;
      } else {
        discountEl.textContent = 'Beneficio Exclusivo';
      }
    }

    if (rangeEl) rangeEl.textContent = (promo && promo.rango_texto) || 'Vigente';
    if (titleEl) titleEl.textContent = (promo && promo.titulo) || (comercio && comercio.nombre) || 'Promoción';
    if (descEl) descEl.textContent = (promo && promo.descripcion) || (comercio && comercio.descripcion) || '';

    // Mostrar botones gemelos de Comercio y ocultar botón de aviso
    if (avisoBtn) {
      avisoBtn.classList.add('hidden');
      avisoBtn.classList.remove('flex');
    }
    if (merchantButtons) {
      merchantButtons.classList.remove('hidden');
    }

    // Botón 1: WhatsApp
    if (waBtn && comercio) {
      const pTitle = (promo && promo.titulo) ? promo.titulo : 'su promoción';
      const waText = `Hola ${comercio.nombre}, vi su Historia/Promo "${pTitle}" en Estoy en Claro y quería consultarles/reservar.`;
      waBtn.href = `https://wa.me/${comercio.whatsapp || '5492983552010'}?text=${encodeURIComponent(waText)}`;
    }

    // Botón 2: Ficha completa
    if (merchantLink && comercio) {
      merchantLink.href = `/comercios/${comercio.slug}.html`;
    }
  }

  if (progressBar) {
    progressBar.style.width = '0%';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');

  if (window.lucide) window.lucide.createIcons();

  // Animación del progreso de 10 segundos
  cancelAnimationFrame(storyAnimFrame);
  storyStartTime = performance.now();
  storyElapsed = 0;
  storyIsPaused = false;

  function tickStory(now) {
    if (!storyIsPaused) {
      const delta = now - storyStartTime;
      storyElapsed += delta;
      storyStartTime = now;

      const progress = Math.min(storyElapsed / STORY_DURATION_MS, 1);
      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      if (storyElapsed >= STORY_DURATION_MS) {
        closeStoryModal();
        return;
      }
    } else {
      storyStartTime = now;
    }
    storyAnimFrame = requestAnimationFrame(tickStory);
  }

  storyAnimFrame = requestAnimationFrame(tickStory);
};

window.openStoryModalById = (comercioId, promoId) => {
  if (typeof COMERCIOS_DATA === 'undefined') return;
  const comercio = COMERCIOS_DATA.find(c => c.id === comercioId || c.slug === comercioId);
  if (!comercio) return;
  
  let promo = null;
  if (promoId && comercio.promos) {
    promo = comercio.promos.find(p => p.id === promoId);
  }
  if (!promo && comercio.promos && comercio.promos.length > 0) {
    promo = comercio.promos[0];
  }
  if (!promo) {
    promo = {
      titulo: comercio.nombre,
      descripcion: comercio.descripcion,
      descuento_porcentaje: null,
      rango_texto: 'Vigente'
    };
  }

  const storyUrl = (promo && promo.imagen_historia_url) || comercio.imagen_historia_url || comercio.imagen_portada_url;
  
  window.openStoryModal({
    imagen_historia_url: storyUrl,
    comercio,
    promo
  });
};

window.openStoryModalByAvisoId = (avisoId) => {
  if (typeof AVISOS_DATA === 'undefined') return;
  const aviso = AVISOS_DATA.find(a => a.id === avisoId);
  if (!aviso) return;
  window.openStoryModal({
    is_aviso: true,
    aviso
  });
};

window.closeStoryModal = () => {
  const modal = document.getElementById('story-modal');
  cancelAnimationFrame(storyAnimFrame);
  if (!modal) return;

  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');

  const progressBar = document.getElementById('story-progress-bar');
  if (progressBar) progressBar.style.width = '0%';
};

// --------------------------------------------------------------------
// 2.5 Sección Independiente de Avisos / Novedades y Eventos (Carrusel)
// - Móvil: 1 tarjeta visible (snap), auto-avance 5s, flechas, swipe táctil y dots
// - PC: varias tarjetas (3 visibles en pantalla), flechas prev/next
// - Si hay 1 solo aviso: tarjeta única centrada, sin flechas ni controles
// --------------------------------------------------------------------
function initAvisosSection() {
  const seccion = document.getElementById('seccion-avisos');
  const track = document.getElementById('carousel-avisos-track');
  const grid = document.getElementById('avisos-grid');
  const prevBtn = document.getElementById('carousel-avisos-prev-btn');
  const nextBtn = document.getElementById('carousel-avisos-next-btn');
  const dotsContainer = document.getElementById('carousel-avisos-dots');

  if (!seccion) return;

  const avisos = typeof obtenerAvisosActivosHoy === 'function'
    ? obtenerAvisosActivosHoy()
    : (typeof AVISOS_DATA !== 'undefined' ? AVISOS_DATA.filter(a => typeof avisoActivoHoy === 'function' ? avisoActivoHoy(a) : true) : []);

  if (avisos.length === 0) {
    seccion.classList.add('hidden');
    return;
  }

  seccion.classList.remove('hidden');

  // Helper para generar el HTML de una tarjeta de aviso
  const renderAvisoCardHtml = (aviso, isCarousel = true, isSingle = false) => {
    const isInst = Boolean(aviso.institucional);
    const storyUrl = aviso.imagen_historia_url;
    const itemWrapperClass = isCarousel
      ? (isSingle 
          ? "carousel-aviso-item w-full max-w-xl mx-auto" 
          : "carousel-aviso-item flex-none w-[88vw] sm:w-[50vw] md:w-[calc(50%-10px)] lg:w-[calc(33.333%-11px)] snap-start")
      : "";

    return `
      <div class="${itemWrapperClass}">
        <article 
          onclick="openStoryModalByAvisoId('${aviso.id}')"
          class="h-full relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer border ${isInst ? 'border-sky-300/80 ring-2 ring-sky-400/20' : 'border-amber-300/80 ring-2 ring-amber-400/25'} bg-slate-950"
          style="min-height: 250px;"
        >
          <!-- Imagen de fondo con gradiente optimizado para legibilidad -->
          <div class="absolute inset-0 z-0">
            <img src="${storyUrl}" alt="${aviso.titulo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40"></div>
          </div>

          <!-- Header de la tarjeta -->
          <div class="relative z-10 p-4 sm:p-5 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <!-- Tag Novedad con destello/shimmer sutil con movimiento -->
              <div class="relative overflow-hidden inline-flex items-center gap-1.5 bg-slate-900/85 text-amber-300 border border-amber-400/50 text-[11px] font-black px-2.5 py-1 rounded-lg backdrop-blur-md shadow-xs uppercase tracking-wider">
                <span class="absolute inset-0 -translate-x-full animate-shimmer-badge bg-gradient-to-r from-transparent via-amber-300/35 to-transparent pointer-events-none"></span>
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i>
                <span class="relative z-10">Novedad</span>
              </div>
            </div>

            <div>
              <h3 class="font-extrabold text-white text-base group-hover:text-amber-300 transition line-clamp-2 drop-shadow-md leading-snug">
                ${aviso.titulo}
              </h3>
              <p class="text-xs text-slate-200 mt-1 leading-snug line-clamp-1 sm:line-clamp-2 drop-shadow-xs">
                ${aviso.descripcion_corta}
              </p>
            </div>
          </div>

          <!-- Footer de acciones -->
          <div class="relative z-10 p-4 sm:p-5 pt-0 flex items-center justify-between gap-2 border-t border-white/15 mt-2">
            <button 
              type="button"
              onclick="event.stopPropagation(); openStoryModalByAvisoId('${aviso.id}')"
              class="text-xs font-extrabold text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Ver más</span>
            </button>
          </div>
        </article>
      </div>
    `;
  };

  // Si aún existe el contenedor estático de grilla
  if (grid) {
    grid.innerHTML = avisos.map(a => renderAvisoCardHtml(a, false)).join('');
  }

  // Carrusel en el track
  if (track) {
    const isSingle = avisos.length === 1;
    const isDesktop = () => window.innerWidth >= 768;

    track.innerHTML = avisos.map(a => renderAvisoCardHtml(a, true, isSingle)).join('');

    // Si hay un solo aviso: ocultar controles y no iniciar auto-avance
    if (isSingle) {
      if (prevBtn) prevBtn.classList.add('hidden');
      if (nextBtn) nextBtn.classList.add('hidden');
      if (dotsContainer) dotsContainer.classList.add('hidden');
      track.classList.remove('overflow-x-auto', 'snap-x', 'snap-mandatory');
      track.classList.add('justify-center');
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Si hay más de un aviso: activar controles de carrusel
    if (prevBtn) prevBtn.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
    if (dotsContainer) dotsContainer.classList.remove('hidden');
    track.classList.remove('justify-center');
    track.classList.add('overflow-x-auto', 'snap-x', 'snap-mandatory');

    // Dots indicators para vista móvil
    if (dotsContainer) {
      dotsContainer.innerHTML = avisos.map((_, i) => `
        <button data-aviso-index="${i}" class="carousel-aviso-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-indigo-600 w-5' : 'bg-slate-300'}" aria-label="Ir a aviso ${i + 1}"></button>
      `).join('');

      const dots = dotsContainer.querySelectorAll('.carousel-aviso-dot');
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.getAttribute('data-aviso-index') || '0', 10);
          scrollToAvisoCard(index);
        });
      });
    }

    function getAvisoCardWidth() {
      const firstCard = track.querySelector('.carousel-aviso-item');
      if (!firstCard) return 300;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 16;
      return firstCard.offsetWidth + gap;
    }

    function scrollToAvisoCard(index) {
      const cardWidth = getAvisoCardWidth();
      track.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      updateActiveAvisoDot(index);
    }

    function updateActiveAvisoDot(index) {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.carousel-aviso-dot');
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.className = 'carousel-aviso-dot w-5 h-2 rounded-full bg-indigo-600 transition-all duration-300';
        } else {
          dot.className = 'carousel-aviso-dot w-2 h-2 rounded-full bg-slate-300 transition-all duration-300';
        }
      });
    }

    let currentAvisoIdx = 0;

    function nextAvisoSlide() {
      const step = isDesktop() ? (avisos.length >= 3 ? 2 : 1) : 1;
      currentAvisoIdx = (currentAvisoIdx + step) >= avisos.length ? 0 : currentAvisoIdx + step;
      scrollToAvisoCard(currentAvisoIdx);
    }

    function prevAvisoSlide() {
      const step = isDesktop() ? (avisos.length >= 3 ? 2 : 1) : 1;
      currentAvisoIdx = (currentAvisoIdx - step < 0) ? Math.max(0, avisos.length - step) : currentAvisoIdx - step;
      scrollToAvisoCard(currentAvisoIdx);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextAvisoSlide(); resetAvisoTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevAvisoSlide(); resetAvisoTimer(); });

    // Auto-advance de 5 segundos en móvil
    let autoAvisoTimer = setInterval(nextAvisoSlide, 5000);

    function resetAvisoTimer() {
      clearInterval(autoAvisoTimer);
      autoAvisoTimer = setInterval(nextAvisoSlide, 5000);
    }

    track.addEventListener('mouseenter', () => clearInterval(autoAvisoTimer));
    track.addEventListener('mouseleave', () => resetAvisoTimer());

    // Swipe táctil en móvil para avisos
    let aTouchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      aTouchStartX = e.touches[0].clientX;
      clearInterval(autoAvisoTimer);
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const aTouchEndX = e.changedTouches[0].clientX;
      const diff = aTouchStartX - aTouchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextAvisoSlide();
        } else {
          prevAvisoSlide();
        }
      }
      resetAvisoTimer();
    }, { passive: true });

    // Scroll listener sincronizado con debounce
    let avisoScrollDebounce;
    track.addEventListener('scroll', () => {
      clearTimeout(avisoScrollDebounce);
      avisoScrollDebounce = setTimeout(() => {
        const cardWidth = getAvisoCardWidth();
        const activeIdx = Math.round(track.scrollLeft / cardWidth);
        if (activeIdx >= 0 && activeIdx < avisos.length) {
          currentAvisoIdx = activeIdx;
          updateActiveAvisoDot(activeIdx);
        }
      }, 100);
    }, { passive: true });
  }

  if (window.lucide) window.lucide.createIcons();
}

function initStoryModal() {
  const modal = ensureStoryModalInDom();
  if (!modal) return;

  const closeBtn = document.getElementById('story-close-btn');
  const cardBox = document.getElementById('story-card-box');

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeStoryModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeStoryModal();
    }
  });

  if (cardBox) {
    const pauseStory = () => {
      storyIsPaused = true;
    };
    const resumeStory = () => {
      storyIsPaused = false;
      storyStartTime = performance.now();
    };

    cardBox.addEventListener('pointerdown', pauseStory);
    cardBox.addEventListener('pointerup', resumeStory);
    cardBox.addEventListener('pointercancel', resumeStory);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeStoryModal();
    }
  });
}

// Helper para renderizar tarjetas de promos (soporta tarjeta estándar y tarjeta Historia 9:16)
function renderPromoCard(promo, comercio, isCarousel = false) {
  const storyUrl = promo.imagen_historia_url || comercio.imagen_historia_url;
  const isPlanOro = comercio.plan_id === 'oro' || comercio.plan_id === 'premium';
  const hasStory = isPlanOro && Boolean(storyUrl);

  const cardBaseClass = isCarousel 
    ? "carousel-promo-item flex-none w-[88vw] sm:w-[50vw] md:w-[calc(50%-10px)] lg:w-[calc(33.333%-12px)] snap-start"
    : "";

  if (hasStory) {
    return `
      <div class="${cardBaseClass}">
        <article 
          onclick="openStoryModalById('${comercio.id}', '${promo.id || ''}')"
          class="h-full relative rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer border border-amber-300/80 ring-2 ring-amber-400/25"
          style="min-height: 240px;"
        >
          <!-- Fondo de la tarjeta con imagen de historia (object-fit: cover, recortada al tamaño de tarjeta) -->
          <div class="absolute inset-0 z-0 bg-slate-950">
            <img src="${storyUrl}" alt="${promo.titulo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90">
            <!-- Gradiente oscuro para máxima legibilidad tipográfica -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40"></div>
          </div>

          <!-- Contenido superpuesto -->
          <div class="relative z-10 p-4 sm:p-5 space-y-3">
            <!-- Barra superior con Anillo de historia en el logo + Badges -->
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <!-- Anillo de color degradado estilo Historia de Instagram -->
                <div class="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-md shrink-0">
                  <div class="p-0.5 bg-slate-900 rounded-full">
                    <img src="${comercio.logo_url || comercio.imagen_portada_url}" alt="${comercio.nombre}" class="w-7 h-7 rounded-full object-cover">
                  </div>
                </div>
                <!-- Badge indicador de Promo -->
                <span class="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs tracking-tight">
                  <i data-lucide="sparkles" class="w-3 h-3 text-amber-200"></i> Promo
                </span>
              </div>

              <!-- Badge Descuento -->
              <span class="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-black px-2.5 py-0.5 rounded-lg shadow-xs">
                <i data-lucide="tag" class="w-3 h-3"></i>
                ${promo.descuento_porcentaje ? `${promo.descuento_porcentaje}% OFF` : 'Beneficio'}
              </span>
            </div>

            <div>
              <h3 class="font-extrabold text-white text-base group-hover:text-amber-300 transition line-clamp-2 drop-shadow-md">
                ${promo.titulo}
              </h3>
              <p class="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed line-clamp-2 drop-shadow">
                ${promo.descripcion}
              </p>
            </div>

            <div class="pt-2 border-t border-white/15 flex items-center justify-between text-white">
              <span class="font-black text-xs sm:text-sm truncate drop-shadow flex items-center gap-1.5">
                <span class="text-amber-400 font-bold">★</span> ${comercio.nombre}
              </span>
            </div>
          </div>

          <!-- Footer con Acciones -->
          <div class="relative z-10 p-4 sm:p-5 pt-0 flex items-center justify-between gap-2 border-t border-white/15 mt-2">
            <button 
              type="button"
              onclick="event.stopPropagation(); openStoryModalById('${comercio.id}', '${promo.id || ''}')"
              class="text-xs font-extrabold text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            >
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Ver más</span>
            </button>

            <div class="flex items-center gap-2">
              <a 
                href="/comercios/${comercio.slug}.html" 
                onclick="event.stopPropagation()"
                class="text-xs font-bold text-slate-300 hover:text-white transition"
              >
                Ficha &rarr;
              </a>
              ${comercio.whatsapp ? `
                <a 
                  href="https://wa.me/${comercio.whatsapp}?text=${encodeURIComponent(`Hola ${comercio.nombre}, vi su historia/promo "${promo.titulo}" en Estoy en Claro y quería consultarles.`)}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onclick="event.stopPropagation()" 
                  class="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                >
                  <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                  <span>WhatsApp</span>
                </a>
              ` : ''}
            </div>
          </div>
        </article>
      </div>
    `;
  }

  // Tarjeta Estándar
  return `
    <div class="${cardBaseClass}">
      <article 
        onclick="window.location.href='/comercios/${comercio.slug}.html'"
        class="h-full bg-white rounded-2xl border border-amber-300/90 ring-1 ring-amber-100 p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-xs">
              <i data-lucide="tag" class="w-3.5 h-3.5"></i>
              ${promo.descuento_porcentaje ? `${promo.descuento_porcentaje}% OFF` : 'Beneficio'}
            </span>
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 text-base group-hover:text-amber-800 transition line-clamp-2">
              ${promo.titulo}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">${promo.descripcion}</p>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="font-black text-slate-900 text-sm sm:text-base truncate">${comercio.nombre}</span>
          </div>
        </div>
        <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span class="text-xs sm:text-sm font-bold text-sky-600 group-hover:text-sky-700 inline-flex items-center gap-1">
            <span>Ver Ficha</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"></i>
          </span>
          ${comercio.whatsapp ? `
            <a href="https://wa.me/${comercio.whatsapp}?text=${encodeURIComponent(`Hola ${comercio.nombre}, vi su promo "${promo.titulo}" en Estoy en Claro y quería hacerles una consulta.`)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs">
              <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
              <span>Aprovechar</span>
            </a>
          ` : ''}
        </div>
      </article>
    </div>
  `;
}

// --------------------------------------------------------------------
// 3. Renderizado y Carrusel de "Promociones y Eventos Vigentes"
// - PC: 2-3 tarjetas visibles, flechas prev/next a los costados
// - Móvil: 1 tarjeta visible (snap), auto-avance 5s, flechas, swipe táctil y dots
// --------------------------------------------------------------------
function initDynamicPromos() {
  const promosCarouselTrack = document.getElementById('carousel-promos-track');
  const promosGrid = document.getElementById('promos-hoy-grid');
  const prevBtn = document.getElementById('carousel-promos-prev-btn');
  const nextBtn = document.getElementById('carousel-promos-next-btn');
  const dotsContainer = document.getElementById('carousel-promos-dots');

  if (typeof obtenerPromosActivasHoy === 'undefined') return;
  const promos = obtenerPromosActivasHoy();

  // Caso 1: Grid estático para la página dedicada /promociones.html
  if (promosGrid) {
    if (promos.length === 0) {
      promosGrid.innerHTML = `
        <div class="col-span-full bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs sm:text-sm">
          No hay promociones especiales vigentes en este momento. Volvé a consultar pronto.
        </div>
      `;
    } else {
      promosGrid.innerHTML = promos.map(({ promo, comercio }) => renderPromoCard(promo, comercio, false)).join('');
    }
  }

  // Caso 2: Carrusel horizontal para el Home (index.html)
  if (promosCarouselTrack) {
    if (promos.length === 0) {
      promosCarouselTrack.innerHTML = `
        <div class="w-full bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs sm:text-sm">
          No hay promociones especiales vigentes en este momento. Volvé a consultar pronto.
        </div>
      `;
      return;
    }

    const isDesktop = () => window.innerWidth >= 768;

    promosCarouselTrack.innerHTML = promos.map(({ promo, comercio }) => renderPromoCard(promo, comercio, true)).join('');

    // Dots indicators para vista móvil
    if (dotsContainer) {
      dotsContainer.innerHTML = promos.map((_, i) => `
        <button data-promo-index="${i}" class="carousel-promo-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-amber-500 w-5' : 'bg-slate-300'}" aria-label="Ir a promo ${i + 1}"></button>
      `).join('');

      const dots = dotsContainer.querySelectorAll('.carousel-promo-dot');
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.getAttribute('data-promo-index') || '0', 10);
          scrollToPromoCard(index);
        });
      });
    }

    function getPromoCardWidth() {
      const firstCard = promosCarouselTrack.querySelector('.carousel-promo-item');
      if (!firstCard) return 300;
      const style = window.getComputedStyle(promosCarouselTrack);
      const gap = parseFloat(style.gap) || 16;
      return firstCard.offsetWidth + gap;
    }

    function scrollToPromoCard(index) {
      const cardWidth = getPromoCardWidth();
      promosCarouselTrack.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      updateActivePromoDot(index);
    }

    function updateActivePromoDot(index) {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.carousel-promo-dot');
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.className = 'carousel-promo-dot w-5 h-2 rounded-full bg-amber-500 transition-all duration-300';
        } else {
          dot.className = 'carousel-promo-dot w-2 h-2 rounded-full bg-slate-300 transition-all duration-300';
        }
      });
    }

    let currentPromoIdx = 0;

    function nextPromoSlide() {
      const step = isDesktop() ? 2 : 1;
      currentPromoIdx = (currentPromoIdx + step) >= promos.length ? 0 : currentPromoIdx + step;
      scrollToPromoCard(currentPromoIdx);
    }

    function prevPromoSlide() {
      const step = isDesktop() ? 2 : 1;
      currentPromoIdx = (currentPromoIdx - step < 0) ? Math.max(0, promos.length - step) : currentPromoIdx - step;
      scrollToPromoCard(currentPromoIdx);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextPromoSlide(); resetPromoTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevPromoSlide(); resetPromoTimer(); });

    // Auto-advance de 5 segundos en móvil
    let autoPromoTimer = setInterval(nextPromoSlide, 5000);

    function resetPromoTimer() {
      clearInterval(autoPromoTimer);
      autoPromoTimer = setInterval(nextPromoSlide, 5000);
    }

    promosCarouselTrack.addEventListener('mouseenter', () => clearInterval(autoPromoTimer));
    promosCarouselTrack.addEventListener('mouseleave', () => resetPromoTimer());

    // Swipe táctil en móvil para promos
    let pTouchStartX = 0;
    promosCarouselTrack.addEventListener('touchstart', (e) => {
      pTouchStartX = e.touches[0].clientX;
      clearInterval(autoPromoTimer);
    }, { passive: true });

    promosCarouselTrack.addEventListener('touchend', (e) => {
      const pTouchEndX = e.changedTouches[0].clientX;
      const diff = pTouchStartX - pTouchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          nextPromoSlide();
        } else {
          prevPromoSlide();
        }
      }
      resetPromoTimer();
    }, { passive: true });

    // Scroll listener sincronizado
    let promoScrollDebounce;
    promosCarouselTrack.addEventListener('scroll', () => {
      clearTimeout(promoScrollDebounce);
      promoScrollDebounce = setTimeout(() => {
        const cardWidth = getPromoCardWidth();
        const activeIdx = Math.round(promosCarouselTrack.scrollLeft / cardWidth);
        if (activeIdx >= 0 && activeIdx < promos.length) {
          currentPromoIdx = activeIdx;
          updateActivePromoDot(activeIdx);
        }
      }, 100);
    }, { passive: true });
  }

  if (window.lucide) window.lucide.createIcons();
}

// --------------------------------------------------------------------
// 4. Carrusel Horizontal de Comercios Recomendados
// - PC: 4 tarjetas visibles, flechas a los costados, sin dots
// - Móvil: 1 tarjeta visible (ancho completo / snap), auto-avance 3.5s, dots compactos
// --------------------------------------------------------------------
function initRecommendedCarousel() {
  const track = document.getElementById('carousel-recomendados-track');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track || typeof obtenerComerciosRecomendadosCarrusel === 'undefined') return;

  // Obtener entre 10 y 12 comercios con fijado_home + aleatorios
  const items = obtenerComerciosRecomendadosCarrusel(12);
  if (items.length === 0) return;

  const isDesktop = () => window.innerWidth >= 768;

  // Renderizar tarjetas en el track: ancho adaptable (1 tarjeta en móvil, 4 en PC)
  track.innerHTML = items.map(c => `
    <div class="carousel-item flex-none w-[88vw] sm:w-[50vw] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] snap-start">
      <article 
        onclick="window.location.href='/comercios/${c.slug}.html'"
        class="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-sky-300 transition flex flex-col justify-between group cursor-pointer"
      >
        <div>
          <div class="h-40 sm:h-44 bg-slate-900 relative overflow-hidden">
            <img src="${c.imagen_portada_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'}" alt="${c.nombre}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
            ${(c.plan_id === 'oro' || c.plan_id === 'premium' || c.fijado_home) ? `
              <span class="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                ★ Recomendado
              </span>
            ` : (c.plan_id === 'plata' || c.plan_id === 'destacado_cat') ? `
              <span class="absolute top-3 left-3 bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold px-2.5 py-0.5 rounded shadow-xs">
                Destacado
              </span>
            ` : ''}
            ${(c.imagen_historia_url && (c.plan_id === 'oro' || c.plan_id === 'premium')) ? `
              <button 
                type="button"
                onclick="event.stopPropagation(); openStoryModalById('${c.id}')"
                class="absolute top-3 right-3 p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 shadow-md hover:scale-105 transition cursor-pointer z-10"
                title="Ver promo destacada"
              >
                <div class="bg-slate-950/90 hover:bg-slate-950 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <i data-lucide="sparkles" class="w-2.5 h-2.5 text-amber-300"></i>
                  <span>Promo</span>
                </div>
              </button>
            ` : ''}
            <span class="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-bold px-2 py-0.5 rounded">
              ${c.subcategoria}
            </span>
          </div>
          <div class="p-4 space-y-1.5">
            <h3 class="font-black text-slate-900 text-base sm:text-lg group-hover:text-sky-600 transition line-clamp-1">
              ${c.nombre}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              ${c.descripcion}
            </p>
            <div class="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-sky-600 shrink-0"></i>
              <span class="truncate">${c.direccion}</span>
            </div>
          </div>
        </div>
        <div class="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
          <span class="text-xs sm:text-sm font-bold text-sky-600 group-hover:text-sky-700 inline-flex items-center gap-1">
            <span>Ver Ficha</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"></i>
          </span>
          ${c.whatsapp ? `
            <a href="https://wa.me/${c.whatsapp}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-xs" title="Enviar WhatsApp">
              <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
              <span>WhatsApp</span>
            </a>
          ` : ''}
        </div>
      </article>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();

  // Generar indicadores (dots) solo para vista móvil
  if (dotsContainer) {
    dotsContainer.innerHTML = items.map((_, i) => `
      <button data-index="${i}" class="carousel-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-sky-600 w-5' : 'bg-slate-300'}" aria-label="Ir al comercio ${i + 1}"></button>
    `).join('');

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index') || '0', 10);
        scrollToCard(index);
      });
    });
  }

  function getCardWidth() {
    const firstCard = track.querySelector('.carousel-item');
    if (!firstCard) return 280;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 16;
    return firstCard.offsetWidth + gap;
  }

  function scrollToCard(index) {
    const cardWidth = getCardWidth();
    track.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    updateActiveDot(index);
  }

  function updateActiveDot(index) {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.className = 'carousel-dot w-5 h-2 rounded-full bg-sky-600 transition-all duration-300';
      } else {
        dot.className = 'carousel-dot w-2 h-2 rounded-full bg-slate-300 transition-all duration-300';
      }
    });
  }

  let currentIndex = 0;

  function nextSlide() {
    const step = isDesktop() ? 4 : 1;
    currentIndex = (currentIndex + step) >= items.length ? 0 : currentIndex + step;
    scrollToCard(currentIndex);
  }

  function prevSlide() {
    const step = isDesktop() ? 4 : 1;
    currentIndex = (currentIndex - step < 0) ? Math.max(0, items.length - step) : currentIndex - step;
    scrollToCard(currentIndex);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

  // Auto-slide: 3.5 segundos en móvil (más rápido), 7 segundos en PC
  const getIntervalTime = () => isDesktop() ? 7000 : 3500;
  let autoSlideTimer = setInterval(nextSlide, getIntervalTime());

  function resetTimer() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, getIntervalTime());
  }

  // Pausa con hover en PC
  track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  track.addEventListener('mouseleave', () => resetTimer());

  // Arrastre con mouse (drag)
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('cursor-grabbing');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    clearInterval(autoSlideTimer);
  });

  track.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      track.classList.remove('cursor-grabbing');
      resetTimer();
    }
  });

  track.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      track.classList.remove('cursor-grabbing');
      resetTimer();
    }
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });

  // Swipe táctil en dispositivos móviles
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    clearInterval(autoSlideTimer);
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    resetTimer();
  }, { passive: true });

  // Sincronizar dot activo durante el scroll táctil nativo
  let scrollDebounce;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
      const cardWidth = getCardWidth();
      const activeIdx = Math.round(track.scrollLeft / cardWidth);
      if (activeIdx >= 0 && activeIdx < items.length) {
        currentIndex = activeIdx;
        updateActiveDot(activeIdx);
      }
    }, 100);
  }, { passive: true });
}

// --------------------------------------------------------------------
// 5. Modal Centralizado de Urgencias
// --------------------------------------------------------------------
function initUrgenciasModal() {
  const modal = document.getElementById('urgencias-modal');
  const openButtons = document.querySelectorAll('[data-open-urgencias]');
  const closeButtons = document.querySelectorAll('[data-close-urgencias]');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// --------------------------------------------------------------------
// 6. Renderizado de Páginas de Categorías (/categorias/*.html)
// --------------------------------------------------------------------
function initCategoryPage() {
  // Manejo de búsqueda en el índice general de rubros (/categorias/index.html)
  const directorySearchInput = document.getElementById('directorio-buscador-input');
  if (directorySearchInput) {
    directorySearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.directorio-categoria-card');
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  const categoryGrid = document.getElementById('categoria-comercios-grid');
  if (!categoryGrid || typeof COMERCIOS_DATA === 'undefined') return;

  const currentCatId = document.body.dataset.categoriaId || '';
  const currentCatObj = typeof CATEGORIAS_DATA !== 'undefined' ? CATEGORIAS_DATA.find(c => c.id === currentCatId) : null;
  const currentCatNombre = currentCatObj ? currentCatObj.nombre : 'esta categoría';

  const filterPillsContainer = document.getElementById('categoria-subcategorias-filtro');
  const searchInput = document.getElementById('categoria-buscador-input');
  const searchClearBtn = document.getElementById('categoria-buscador-clear');
  const countBadge = document.getElementById('categoria-total-comercios');
  const searchChips = document.querySelectorAll('[data-search-chip]');

  // Obtener comercios de la categoría
  const comerciosCategoria = currentCatId 
    ? COMERCIOS_DATA.filter(c => c.activo && c.categoria_id === currentCatId)
    : COMERCIOS_DATA.filter(c => c.activo);

  let activeSubcategoria = 'todas';
  let searchTerm = '';

  function renderizarComercios() {
    let filtrados = comerciosCategoria;

    if (activeSubcategoria !== 'todas') {
      filtrados = filtrados.filter(c => c.subcategoria === activeSubcategoria);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtrados = filtrados.filter(c => {
        const enNombre = c.nombre && c.nombre.toLowerCase().includes(term);
        const enDesc = c.descripcion && c.descripcion.toLowerCase().includes(term);
        const enSubcat = c.subcategoria && c.subcategoria.toLowerCase().includes(term);
        const enZona = c.zona && c.zona.toLowerCase().includes(term);
        const enDir = c.direccion && c.direccion.toLowerCase().includes(term);
        const enServicios = c.servicios && Array.isArray(c.servicios) && c.servicios.some(s => s.toLowerCase().includes(term));
        const enPromos = c.promos && Array.isArray(c.promos) && c.promos.some(p => ((p.titulo || '') + ' ' + (p.descripcion || '')).toLowerCase().includes(term));
        const enTags = c.tags && Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(term));
        return enNombre || enDesc || enSubcat || enZona || enDir || enServicios || enPromos || enTags;
      });
    }

    if (countBadge) {
      countBadge.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'comercio encontrado' : 'comercios encontrados'}`;
    }

    // Toggle visibilidad botón de limpiar búsqueda
    if (searchClearBtn) {
      if (searchTerm.trim() !== '') {
        searchClearBtn.classList.remove('hidden');
      } else {
        searchClearBtn.classList.add('hidden');
      }
    }

    // Actualizar visual de chips
    searchChips.forEach(chip => {
      const chipVal = (chip.dataset.searchChip || '').toLowerCase().trim();
      if (searchTerm.toLowerCase().trim() === chipVal && chipVal !== '') {
        chip.classList.remove('bg-slate-100', 'text-slate-600');
        chip.classList.add('bg-sky-600', 'text-white', 'font-bold');
      } else {
        chip.classList.remove('bg-sky-600', 'text-white', 'font-bold');
        chip.classList.add('bg-slate-100', 'text-slate-600');
      }
    });

    if (filtrados.length === 0) {
      categoryGrid.innerHTML = `
        <div class="col-span-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
            <i data-lucide="search" class="w-7 h-7"></i>
          </div>
          <div class="space-y-1.5 max-w-md mx-auto">
            <h3 class="font-extrabold text-slate-900 text-base sm:text-lg">
              ${searchTerm ? `No encontramos comercios para "${searchTerm}" en ${currentCatNombre}` : 'No se encontraron comercios'}
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              ${searchTerm 
                ? 'Podés buscar en todos los rubros de Claromecó y Dunamar o probar con otra palabra.' 
                : 'Probá seleccionando "Todas" o limpiando el filtro de búsqueda.'}
            </p>
          </div>
          
          <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
            ${searchTerm ? `
              <button 
                id="search-all-guide-btn" 
                class="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                <i data-lucide="sparkles" class="w-4 h-4 text-cyan-200"></i>
                <span>Buscar "${searchTerm}" en toda la guía</span>
              </button>
            ` : ''}
            <button 
              id="reset-cat-filters-btn" 
              class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      `;

      const searchAllBtn = document.getElementById('search-all-guide-btn');
      if (searchAllBtn && window.openSearchWithTerm) {
        searchAllBtn.addEventListener('click', () => {
          window.openSearchWithTerm(searchTerm);
        });
      }

      const resetBtn = document.getElementById('reset-cat-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeSubcategoria = 'todas';
          searchTerm = '';
          if (searchInput) searchInput.value = '';
          renderizarPills();
          renderizarComercios();
        });
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Ordenar comercios según prioridad estricta de planes (1° Oro, 2° Plata, 3° Bronce, 4° Gratis) y alfabético
    const comerciosOrdenados = typeof ordenarComercios === 'function' ? ordenarComercios(filtrados) : filtrados;

    categoryGrid.innerHTML = comerciosOrdenados.map(comercio => {
      const tieneDestacado = (comercio.plan_id === 'oro' || comercio.plan_id === 'plata' || comercio.plan_id === 'premium' || comercio.plan_id === 'destacado_cat' || (comercio.plan && comercio.plan.destacado_categoria));
      
      return `
      <article 
        onclick="window.location.href='/comercios/${comercio.slug}.html'"
        class="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-sky-300 transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
      >
        <div>
          <!-- Portada -->
          <div class="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
            <img 
              src="${comercio.imagen_portada_url || comercio.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'}" 
              alt="${comercio.nombre}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span class="bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-xs">
                ${comercio.subcategoria}
              </span>
              ${tieneDestacado ? `
                <span class="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                  <i data-lucide="star" class="w-3.5 h-3.5 fill-slate-950 text-slate-950"></i> Destacado
                </span>
              ` : ''}
            </div>

            <div class="absolute bottom-3 left-3 right-3 text-white">
              <h3 class="font-black text-base sm:text-lg leading-snug drop-shadow-sm group-hover:text-cyan-200 transition-colors">
                ${comercio.nombre}
              </h3>
              <p class="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-cyan-300 shrink-0"></i>
                <span class="truncate">${comercio.zona || comercio.direccion}</span>
              </p>
            </div>
          </div>

          <!-- Contenido / Info -->
          <div class="p-4 sm:p-5 space-y-3">
            <p class="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              ${comercio.descripcion}
            </p>

            <div class="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div class="flex items-start gap-1.5">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0"></i>
                <span class="text-xs text-slate-600 truncate">${comercio.horario || 'Consultar horario'}</span>
              </div>
              <div class="flex items-start gap-1.5">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0"></i>
                <span class="text-xs text-slate-600 truncate">${comercio.direccion}</span>
              </div>
            </div>

            ${comercio.promos && comercio.promos.length > 0 ? `
              <div class="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 flex items-center gap-2 text-amber-900 text-xs">
                <i data-lucide="tag" class="w-4 h-4 text-amber-600 shrink-0"></i>
                <span class="font-bold text-xs truncate">${comercio.promos[0].titulo}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Acciones Inferiores -->
        <div class="p-4 sm:p-5 pt-0 flex items-center justify-between gap-2">
          <span 
            class="flex-1 bg-slate-100 group-hover:bg-sky-50 group-hover:text-sky-700 text-slate-800 text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl transition text-center"
          >
            Ver Ficha Completa &rarr;
          </span>
          ${comercio.whatsapp ? `
            <a 
              href="https://wa.me/${comercio.whatsapp}?text=${encodeURIComponent(`Hola ${comercio.nombre}, los encontré en la guía Estoy en Claro y quería hacerles una consulta.`)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              onclick="event.stopPropagation()"
              class="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition shadow-xs flex items-center justify-center shrink-0" 
              title="Contactar por WhatsApp"
            >
              <i data-lucide="message-circle" class="w-4 h-4"></i>
            </a>
          ` : ''}
        </div>
      </article>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  function renderizarPills() {
    if (!filterPillsContainer) return;
    
    // Obtener subcategorías únicas con comercios
    const subcats = Array.from(new Set(comerciosCategoria.map(c => c.subcategoria).filter(Boolean)));
    
    filterPillsContainer.innerHTML = `
      <button 
        data-subcat="todas" 
        class="subcat-pill px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${activeSubcategoria === 'todas' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
      >
        Todas (${comerciosCategoria.length})
      </button>
      ${subcats.map(sub => {
        const count = comerciosCategoria.filter(c => c.subcategoria === sub).length;
        const isActive = activeSubcategoria === sub;
        return `
          <button 
            data-subcat="${sub}" 
            class="subcat-pill px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${isActive ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
          >
            ${sub} (${count})
          </button>
        `;
      }).join('')}
    `;

    filterPillsContainer.querySelectorAll('.subcat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubcategoria = btn.dataset.subcat;
        renderizarPills();
        renderizarComercios();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderizarComercios();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchTerm = '';
      if (searchInput) searchInput.value = '';
      renderizarComercios();
      if (searchInput) searchInput.focus();
    });
  }

  searchChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const chipVal = chip.dataset.searchChip || chip.textContent.trim();
      if (searchTerm.toLowerCase().trim() === chipVal.toLowerCase().trim()) {
        searchTerm = '';
        if (searchInput) searchInput.value = '';
      } else {
        searchTerm = chipVal;
        if (searchInput) searchInput.value = chipVal;
      }
      renderizarComercios();
    });
  });

  renderizarPills();
  renderizarComercios();
}

// --------------------------------------------------------------------
// 7. Utilidad para Compartir Ficha de Comercio & Notificaciones Toast
// --------------------------------------------------------------------
function showToast(message) {
  let toast = document.getElementById('app-toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast-notification';
    toast.className = 'fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 transition-all duration-300 opacity-0 pointer-events-none transform translate-y-2';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
  }, 2500);
}

window.compartirFicha = function(titulo, texto, url) {
  const shareData = {
    title: titulo || document.title,
    text: texto || 'Te comparto este comercio de Claromecó en Estoy en Claro:',
    url: url || window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareData.url).then(() => {
      showToast('¡Enlace copiado al portapapeles!');
    }).catch(() => {});
  }
};

// --------------------------------------------------------------------
// 8. Visor de Galería a Pantalla Completa (Lightbox / Carrusel)
// --------------------------------------------------------------------
let currentLightboxIndex = 0;
let currentLightboxPhotos = [];
let touchStartX = 0;
let touchEndX = 0;

function handleLightboxKeyDown(e) {
  if (e.key === 'Escape') {
    closeGalleryLightbox();
  } else if (e.key === 'ArrowRight') {
    nextGalleryPhoto();
  } else if (e.key === 'ArrowLeft') {
    prevGalleryPhoto();
  }
}

function updateLightboxDisplay() {
  const modal = document.getElementById('gallery-lightbox-modal');
  if (!modal) return;
  const imgEl = modal.querySelector('#gallery-lightbox-img');
  const counterEl = modal.querySelector('#gallery-lightbox-counter');
  const prevBtn = modal.querySelector('#gallery-lightbox-prev');
  const nextBtn = modal.querySelector('#gallery-lightbox-next');

  if (imgEl && currentLightboxPhotos.length > 0) {
    imgEl.src = currentLightboxPhotos[currentLightboxIndex];
  }
  if (counterEl) {
    counterEl.textContent = `${currentLightboxIndex + 1} / ${currentLightboxPhotos.length}`;
  }
  if (prevBtn && nextBtn) {
    const showNav = currentLightboxPhotos.length > 1;
    prevBtn.style.display = showNav ? 'flex' : 'none';
    nextBtn.style.display = showNav ? 'flex' : 'none';
  }
}

window.openGalleryLightbox = function(initialIndex = 0, photos = null) {
  if (Array.isArray(photos) && photos.length > 0) {
    currentLightboxPhotos = photos;
  } else if (Array.isArray(window.CURRENT_MERCHANT_PHOTOS) && window.CURRENT_MERCHANT_PHOTOS.length > 0) {
    currentLightboxPhotos = window.CURRENT_MERCHANT_PHOTOS;
  } else if (typeof COMERCIOS_DATA !== 'undefined') {
    const currentPath = window.location.pathname;
    const slug = currentPath.split('/').pop().replace('.html', '');
    const com = COMERCIOS_DATA.find(c => c.slug === slug);
    if (com && Array.isArray(com.fotos) && com.fotos.length > 0) {
      currentLightboxPhotos = com.fotos;
    }
  }

  if (!currentLightboxPhotos || currentLightboxPhotos.length === 0) return;

  currentLightboxIndex = Math.max(0, Math.min(initialIndex, currentLightboxPhotos.length - 1));

  let modal = document.getElementById('gallery-lightbox-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'gallery-lightbox-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white select-none transition-opacity duration-200';
    modal.innerHTML = `
      <!-- Barra Superior -->
      <div class="flex items-center justify-between z-10">
        <span id="gallery-lightbox-counter" class="text-xs sm:text-sm font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-xs">
          1 / 1
        </span>
        <button 
          type="button" 
          onclick="closeGalleryLightbox()" 
          class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer border border-white/20 focus:outline-none"
          title="Cerrar visor (Esc)"
        >
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Contenedor Principal de Imagen con Flechas -->
      <div class="relative flex-1 flex items-center justify-center my-2 overflow-hidden" id="gallery-lightbox-container">
        <button 
          type="button" 
          id="gallery-lightbox-prev"
          onclick="prevGalleryPhoto()" 
          class="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition border border-white/20 cursor-pointer shadow-xl focus:outline-none"
          title="Foto anterior"
        >
          <i data-lucide="chevron-left" class="w-6 h-6"></i>
        </button>

        <img 
          id="gallery-lightbox-img" 
          src="" 
          alt="Foto ampliada" 
          class="max-h-[78vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl transition-all duration-200"
        >

        <button 
          type="button" 
          id="gallery-lightbox-next"
          onclick="nextGalleryPhoto()" 
          class="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition border border-white/20 cursor-pointer shadow-xl focus:outline-none"
          title="Foto siguiente"
        >
          <i data-lucide="chevron-right" class="w-6 h-6"></i>
        </button>
      </div>

      <!-- Pie con Indicaciones -->
      <div class="text-center text-slate-400 text-xs py-1 z-10">
        <span class="hidden sm:inline">Usá las flechas del teclado o hacé clic para navegar · Tecla Esc para cerrar</span>
        <span class="sm:hidden">Deslizá hacia los lados para navegar</span>
      </div>
    `;
    document.body.appendChild(modal);

    const container = modal.querySelector('#gallery-lightbox-container');
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextGalleryPhoto();
        } else {
          prevGalleryPhoto();
        }
      }
    }, { passive: true });
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', handleLightboxKeyDown);

  updateLightboxDisplay();

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
};

window.closeGalleryLightbox = function() {
  const modal = document.getElementById('gallery-lightbox-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
  document.body.style.overflow = '';
  window.removeEventListener('keydown', handleLightboxKeyDown);
};

window.nextGalleryPhoto = function() {
  if (currentLightboxPhotos.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxPhotos.length;
  updateLightboxDisplay();
};

window.prevGalleryPhoto = function() {
  if (currentLightboxPhotos.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxPhotos.length) % currentLightboxPhotos.length;
  updateLightboxDisplay();
};


