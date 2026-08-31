// ====================================================================
// ESTOY EN CLARO — GUÍA COMERCIAL Y TURÍSTICA DE CLAROMECÓ, ARGENTINA
// Datos maestros y funciones de negocio (Vanilla JS)
// ====================================================================

const PLANES_DATA = [
  {
    id: 'basico',
    nombre: 'Básico',
    muestra_redes: false,
    destacado_categoria: false,
    destacado_home: false,
    permite_promos: false,
    color_badge: 'slate'
  },
  {
    id: 'destacado_cat',
    nombre: 'Destacado',
    muestra_redes: true,
    destacado_categoria: true,
    destacado_home: false,
    permite_promos: false,
    color_badge: 'sky'
  },
  {
    id: 'premium',
    nombre: 'Recomendado Premium',
    muestra_redes: true,
    destacado_categoria: true,
    destacado_home: true,
    permite_promos: true,
    color_badge: 'amber'
  }
];

// Las 8 Categorías Oficiales (en orden estricto)
const CATEGORIAS_DATA = [
  {
    id: 'gastronomia',
    nombre: 'Gastronomía',
    orden: 1,
    icono: 'utensils',
    subcategorias: [
      'Parrillas y Asadores',
      'Pizzerías y Empanadas',
      'Restaurantes y Minutas',
      'Cafeterías y Desayunos',
      'Heladerías Artesanales',
      'Cervecerías y Hamburguesas',
      'Pastas Caseras'
    ],
    descripcion: 'Parrillas frente al mar, pescados frescos, restobares de playa, pizzerías y heladerías.',
    color: 'amber'
  },
  {
    id: 'alojamiento',
    nombre: 'Alojamiento',
    orden: 2,
    icono: 'hotel',
    subcategorias: [
      'Cabañas en Dunamar',
      'Hoteles y Hosterías',
      'Casas y Deptos Temporarios',
      'Campings y Complejos'
    ],
    descripcion: 'Cabañas en el bosque de pinos de Dunamar, hoteles céntricos y alquileres temporarios.',
    color: 'sky'
  },
  {
    id: 'inmobiliarias_alquileres',
    nombre: 'Inmobiliarias y Alquileres',
    orden: 3,
    icono: 'building-2',
    subcategorias: [
      'Alquileres de Temporada',
      'Venta de Propiedades',
      'Administración y Tasaciones',
      'Casas y Cabañas en Dunamar'
    ],
    descripcion: 'Alquileres temporarios de verano, venta de casas, terrenos en Dunamar y tasaciones inmobiliarias.',
    color: 'blue'
  },
  {
    id: 'almacenes_kioscos',
    nombre: 'Almacenes y Kioscos',
    orden: 4,
    icono: 'shopping-bag',
    subcategorias: [
      'Supermercados y Autoservicios',
      'Kioscos 24hs y Bebidas',
      'Panaderías y Confiterías',
      'Carnicerías y Pescaderías',
      'Verdulerías y Fruterías'
    ],
    descripcion: 'Comestibles, bebidas frías, hielo en bolsa para la heladera de playa y provisiones diarias.',
    color: 'emerald'
  },
  {
    id: 'servicios_oficios',
    nombre: 'Servicios y Oficios',
    orden: 5,
    icono: 'wrench',
    subcategorias: [
      'Ferretería',
      'Electricista',
      'Plomero',
      'Gasista',
      'Cerrajero',
      'Gomería y Auxilio 4x4',
      'Construcción/Corralón',
      'Veterinarias'
    ],
    descripcion: 'Profesionales, reparaciones, gomerías, auxilio mecánico en arena, corralones y veterinarias.',
    color: 'indigo'
  },
  {
    id: 'compras_regaleria',
    nombre: 'Compras & Regalos',
    orden: 6,
    icono: 'gift',
    subcategorias: [
      'Regalerías y Souvenirs',
      'Indumentaria y Mallas',
      'Artículos de Playa y Juguetes',
      'Artesanías y Decoración',
      'Bazar y Accesorios'
    ],
    descripcion: 'Recuerdos de Claromecó, artesanías, ropa de verano, sombrillas, reposeras y regalos.',
    color: 'rose'
  },
  {
    id: 'comercios_gral',
    nombre: 'Comercios en Gral.',
    orden: 7,
    icono: 'store',
    subcategorias: [
      'Casas de pesca (venta de equipos)',
      'Kioscos de diarios y revistas',
      'Librerías y Fotocopias',
      'Ópticas y Fotografía',
      'Varios'
    ],
    descripcion: 'Equipamiento para pesca de costa y embarcada, carnadas, diarios, revistas y comercios generales.',
    color: 'slate'
  },
  {
    id: 'turismo_deportes',
    nombre: 'Turismo y Ocio',
    orden: 8,
    icono: 'compass',
    subcategorias: [
      'Alquileres y excursiones (kayak, bicis, pesca embarcada)',
      'Entretenimiento y paseos',
      'Paradores de playa',
      'Deportes (cancha de pádel, fútbol 5)'
    ],
    descripcion: 'Paseos al Faro y Cascadas, kayak en el arroyo, paradores de playa con sunset y canchas de pádel.',
    color: 'cyan'
  }
];

// Comercios Oficiales de Claromecó y Dunamar
const COMERCIOS_DATA = [
  {
    id: 'c-la-barra',
    nombre: 'La Barra Restó & Café',
    slug: 'la-barra-resto-cafe',
    categoria_id: 'gastronomia',
    subcategoria: 'Restaurantes y Minutas',
    descripcion: 'Pescados frescos del Atlántico, rabas crocantes, pastas caseras y tablas de mariscos con vista panorámica a la costanera.',
    telefono: '02983 48-1234',
    whatsapp: '5492983552010',
    direccion: 'Costanera y Calle 28, Claromecó',
    lat: -38.8612,
    lng: -60.0715,
    horario: 'Todos los días de 11:30 a 16:00 y de 20:00 a 01:00 hs',
    plan_id: 'premium',
    fijado_home: true,
    logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    instagram: 'labarra.claromeco',
    activo: true,
    zona: 'Claromecó Costanera',
    plan: PLANES_DATA[2],
    promos: [
      {
        id: 'p-1',
        comercio_id: 'c-la-barra',
        titulo: '20% OFF en Tabla de Pescados & Rabas de la Costa',
        descripcion: 'Válido para almuerzos y cenas mencionando la guía Estoy en Claro.',
        tipo: 'rango_fecha',
        fecha_inicio: '2026-01-01',
        fecha_fin: '2027-04-30',
        rango_texto: 'Todo el año 2026/2027',
        activa: true,
        descuento_porcentaje: 20
      }
    ]
  },
  {
    id: 'c-parrilla-faro',
    nombre: 'Parrilla El Faro',
    slug: 'parrilla-el-faro',
    categoria_id: 'gastronomia',
    subcategoria: 'Parrillas y Asadores',
    descripcion: 'El asado tradicional de Claromecó: costillares a la leña, vacío, achuras frescas, pescados de la costa y postres caseros.',
    telefono: '02983 48-3344',
    whatsapp: '5492983441190',
    direccion: 'Calle 9 entre 26 y 28, Claromecó',
    lat: -38.8559,
    lng: -60.0725,
    horario: 'Mediodía 12:00 a 15:30 hs / Noche 20:30 a 00:30 hs',
    plan_id: 'premium',
    fijado_home: true,
    logo_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80'
    ],
    instagram: 'parrillaelfaro.claro',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[2],
    promos: [
      {
        id: 'p-2',
        comercio_id: 'c-parrilla-faro',
        titulo: 'Parrillada Completa con Vino Artesanal de Regalo',
        descripcion: 'Incluye tira de asado, vacío, chorizo, morcilla, ensalada mixta y vino artesanal los fines de semana.',
        tipo: 'dia_semana',
        dias_semana: [0, 5, 6], // Viernes, Sábado y Domingo
        dia_semana: 0,
        rango_texto: 'Viernes a Domingos',
        activa: true,
        descuento_porcentaje: 15
      }
    ]
  },
  {
    id: 'c-medano-blanco',
    nombre: 'Cabañas Médano Blanco Dunamar',
    slug: 'cabanas-medano-blanco-dunamar',
    categoria_id: 'alojamiento',
    subcategoria: 'Cabañas en Dunamar',
    descripcion: 'Complejo de cabañas en el bosque de pinos de Dunamar a 200m del mar. Deck privado, parrilla individual, piscina y Wi-Fi.',
    telefono: '02983 48-0990',
    whatsapp: '5492983582230',
    direccion: 'Calle Río Paraná 450, Barrio Dunamar',
    lat: -38.8621,
    lng: -60.0812,
    horario: 'Recepción y reservas de 08:00 a 22:00 hs',
    plan_id: 'premium',
    fijado_home: true,
    logo_url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80'
    ],
    instagram: 'medanoblancocabanas',
    activo: true,
    zona: 'Dunamar Bosque',
    plan: PLANES_DATA[2],
    promos: [
      {
        id: 'p-3',
        comercio_id: 'c-medano-blanco',
        titulo: '15% OFF en Estadías de 4 o más noches',
        descripcion: 'Válido para reservas directas por WhatsApp mencionando la guía Estoy en Claro.',
        tipo: 'rango_fecha',
        fecha_inicio: '2026-01-01',
        fecha_fin: '2027-04-30',
        rango_texto: 'Temporada 2026/2027',
        activa: true,
        descuento_porcentaje: 15
      }
    ]
  },
  {
    id: 'c-napoles',
    nombre: 'Pizzería Nápoles & Empanadas',
    slug: 'pizzeria-napoles-claromeco',
    categoria_id: 'gastronomia',
    subcategoria: 'Pizzerías y Empanadas',
    descripcion: 'Pizzas al horno a la piedra elaboradas con masa madre, empanadas cortadas a cuchillo y cerveza artesanal tirada.',
    telefono: '02983 48-0340',
    whatsapp: '5492983601244',
    direccion: 'Calle 28 entre 11 y 13, Claromecó',
    lat: -38.8564,
    lng: -60.0731,
    horario: 'Todos los días de 19:30 a 01:30 hs',
    plan_id: 'premium',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80'
    ],
    instagram: 'napolespizzaclaro',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[2],
    promos: [
      {
        id: 'p-4',
        comercio_id: 'c-napoles',
        titulo: '2da Pizza al 40% OFF + Fainá de Regalo',
        descripcion: 'Válido para consumo en salón y pedidos de delivery por WhatsApp de martes a domingos.',
        tipo: 'dia_semana',
        dias_semana: [0, 2, 3, 4, 5, 6], // Martes a Domingos (0 es Domingo)
        dia_semana: 0,
        rango_texto: 'Martes a Domingos',
        activa: true,
        descuento_porcentaje: 40
      }
    ]
  },
  {
    id: 'c-kayak-arroyo',
    nombre: 'Aventuras Arroyo & Kayaks Claromecó',
    slug: 'aventuras-arroyo-kayaks-claromeco',
    categoria_id: 'turismo_deportes',
    subcategoria: 'Alquileres y excursiones (kayak, bicis, pesca embarcada)',
    descripcion: 'Alquiler de kayaks simples y dobles, tablas de SUP, bicicletas de paseo y salidas guiadas a las 7 Cascadas del arroyo Claromecó.',
    telefono: '02983 48-0777',
    whatsapp: '5492983577889',
    direccion: 'Paseo del Arroyo y Puente Peatonal Dunamar',
    lat: -38.8592,
    lng: -60.0691,
    horario: 'Todos los días de 09:00 a 20:00 hs',
    plan_id: 'premium',
    fijado_home: true,
    logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80'
    ],
    instagram: 'kayaksclaromeco',
    activo: true,
    zona: 'Paseo del Arroyo',
    plan: PLANES_DATA[2],
    promos: [
      {
        id: 'p-5',
        comercio_id: 'c-kayak-arroyo',
        titulo: '2da Hora de Kayak al 50% OFF en Familia',
        descripcion: 'Promo especial para recorrer el arroyo hasta los saltos de las cascadas.',
        tipo: 'rango_fecha',
        fecha_inicio: '2026-01-01',
        fecha_fin: '2027-04-30',
        rango_texto: 'Temporada 2026/2027',
        activa: true,
        descuento_porcentaje: 50
      }
    ]
  },
  {
    id: 'c-kiosco-caracol',
    nombre: 'Kiosco & Minishop El Caracol 24hs',
    slug: 'kiosco-el-caracol-24hs',
    categoria_id: 'almacenes_kioscos',
    subcategoria: 'Kioscos 24hs y Bebidas',
    descripcion: 'Hielo en bolsa, bebidas heladas, golosinas, cigarrillos, carbón, artículos de playa y provisiones las 24 horas.',
    telefono: '02983 48-0555',
    whatsapp: '5492983499201',
    direccion: 'Av. 26 esquina Calle 28, Claromecó',
    lat: -38.8568,
    lng: -60.0729,
    horario: 'Abierto 24 Horas en temporada',
    plan_id: 'destacado_cat',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'elcaracol24hs',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[1],
    promos: []
  },
  {
    id: 'c-pesca-el-faro',
    nombre: 'Casa de Pesca & Carnadas El Anzuelo',
    slug: 'casa-de-pesca-el-anzuelo',
    categoria_id: 'comercios_gral',
    subcategoria: 'Casas de pesca (venta de equipos)',
    descripcion: 'Cañas, reeles, líneas armadas para variada de mar y corvina negra, plomadas, waders y la mejor carnada fresca de Claromecó.',
    telefono: '02983 48-0888',
    whatsapp: '5492983512345',
    direccion: 'Calle 28 entre 15 y 17, Claromecó',
    lat: -38.8570,
    lng: -60.0735,
    horario: 'Todos los días de 07:00 a 22:00 hs',
    plan_id: 'destacado_cat',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'pescaelanzuelo.claro',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[1],
    promos: []
  },
  {
    id: 'c-regaleria-mar',
    nombre: 'Regalería y Artesanías Estrella de Mar',
    slug: 'regaleria-artesanias-estrella-de-mar',
    categoria_id: 'compras_regaleria',
    subcategoria: 'Regalerías y Souvenirs',
    descripcion: 'Souvenirs artesanales de Claromecó, caracoles decorativos, mates grabados, pareos, mallas y juguetes de arena para chicos.',
    telefono: '02983 48-0412',
    whatsapp: '5492983598765',
    direccion: 'Calle 28 entre 9 y 11, Claromecó',
    lat: -38.8575,
    lng: -60.0732,
    horario: 'Lunes a Domingo de 09:30 a 13:30 y de 17:30 a 00:00 hs',
    plan_id: 'destacado_cat',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'estrellademar.claro',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[1],
    promos: []
  },
  {
    id: 'c-parador-claro',
    nombre: 'Parador Playa Posta del Sur',
    slug: 'parador-playa-posta-del-sur',
    categoria_id: 'turismo_deportes',
    subcategoria: 'Paradores de playa',
    descripcion: 'Tragos de autor, licuados naturales, rabas, música al atardecer y alquiler de sombrillas y carpas frente al mar.',
    telefono: '02983 48-0222',
    whatsapp: '5492983534567',
    direccion: 'Costanera y Calle 38, Claromecó',
    lat: -38.8605,
    lng: -60.0702,
    horario: 'Abierto todos los días de 08:30 al atardecer',
    plan_id: 'premium',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'postadelsur.claro',
    activo: true,
    zona: 'Claromecó Playa',
    plan: PLANES_DATA[2],
    promos: [
      {
        id: 'p-6',
        comercio_id: 'c-parador-claro',
        titulo: '2x1 en Tragos de Autor al Sunset (18:30 a 20:30 hs)',
        descripcion: 'Disfrutá la mejor puesta de sol en la playa con música y buena compañía.',
        tipo: 'rango_fecha',
        fecha_inicio: '2026-01-01',
        fecha_fin: '2027-04-30',
        rango_texto: 'Todos los días al Sunset',
        activa: true,
        descuento_porcentaje: 50
      }
    ]
  },
  {
    id: 'c-auxilio-arena',
    nombre: 'Gomería y Auxilio Mecánico El Gaucho',
    slug: 'gomeria-auxilio-el-gaucho',
    categoria_id: 'servicios_oficios',
    subcategoria: 'Gomería',
    descripcion: 'Calibración, desinflado e inflado rápido de neumáticos para arena. Desencaje y auxilio vehicular en Claromecó y Dunamar.',
    telefono: '02983 48-0666',
    whatsapp: '5492983533441',
    direccion: 'Av. 26 y Calle 35, Claromecó',
    lat: -38.8541,
    lng: -60.0710,
    horario: 'Guardia y auxilio de rescate 24 Horas',
    plan_id: 'destacado_cat',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'auxilioelgaucho.claro',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[1],
    promos: []
  },
  {
    id: 'c-ferreteria-claro',
    nombre: 'Ferretería & Corralón La Central',
    slug: 'ferreteria-corralon-la-central',
    categoria_id: 'servicios_oficios',
    subcategoria: 'Ferretería',
    descripcion: 'Herramientas, pinturas, elementos de plomería, electricidad, garrafas, eslingas y materiales para reparaciones rápidas.',
    telefono: '02983 48-0333',
    whatsapp: '5492983567890',
    direccion: 'Calle 28 N° 1200, Claromecó',
    lat: -38.8550,
    lng: -60.0740,
    horario: 'Lunes a Sábados 08:00 a 13:00 y 16:00 a 20:30 hs',
    plan_id: 'destacado_cat',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'ferreterialacentral.claro',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[1],
    promos: []
  },
  {
    id: 'c-padel-claro',
    nombre: 'Complejo Deportivo & Pádel Claromecó',
    slug: 'complejo-deportivo-padel-claromeco',
    categoria_id: 'turismo_deportes',
    subcategoria: 'Deportes (cancha de pádel, fútbol 5)',
    descripcion: 'Canchas de pádel de césped sintético y vidrio templado, cancha de fútbol 5 con iluminación LED, buffet y alquiler de paletas.',
    telefono: '02983 48-0911',
    whatsapp: '5492983576543',
    direccion: 'Calle 15 entre 34 y 36, Claromecó',
    lat: -38.8580,
    lng: -60.0750,
    horario: 'Todos los días de 09:00 a 01:00 hs',
    plan_id: 'destacado_cat',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'padelclaromeco',
    activo: true,
    zona: 'Claromecó',
    plan: PLANES_DATA[1],
    promos: []
  },
  {
    id: 'c-klaromeko-inmo',
    nombre: 'Klaromeko Inmobiliaria',
    slug: 'klaromeko-inmobiliaria',
    categoria_id: 'inmobiliarias_alquileres',
    subcategoria: 'Alquileres de Temporada',
    descripcion: 'Alquileres de casas, chalets frente al mar y cabañas en Dunamar. Venta de propiedades, lotes en el bosque y tasaciones profesionales.',
    telefono: '02983 48-0280',
    whatsapp: '5492983556677',
    direccion: 'Avenida 26 esquina Calle 15, Claromecó',
    lat: -38.8560,
    lng: -60.0720,
    horario: 'Lunes a Domingos de 09:00 a 13:00 y 16:30 a 20:30 hs',
    plan_id: 'premium',
    fijado_home: true,
    logo_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ],
    instagram: 'klaromekoinmobiliaria',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[2],
    promos: [
      {
        id: 'p-7',
        comercio_id: 'c-klaromeko-inmo',
        titulo: '10% OFF en Reservas Anticipadas de Alquiler de Verano',
        descripcion: 'Consultá catálogo de casas con pileta y cabañas en Dunamar para la temporada.',
        tipo: 'rango_fecha',
        fecha_inicio: '2026-01-01',
        fecha_fin: '2027-04-30',
        rango_texto: 'Temporada Verano',
        activa: true,
        descuento_porcentaje: 10
      }
    ]
  },
  {
    id: 'c-claromeconet-prop',
    nombre: 'ClaromecoNet Propiedades',
    slug: 'claromeconet-propiedades',
    categoria_id: 'inmobiliarias_alquileres',
    subcategoria: 'Casas y Cabañas en Dunamar',
    descripcion: 'Alquileres temporarios y venta de casas en Claromecó y Dunamar. Asesoramiento integral, administración de alquileres y tasaciones.',
    telefono: '02983 48-0320',
    whatsapp: '5492983518899',
    direccion: 'Avenida 26 N° 672 (entre 15 y 17), Claromecó',
    lat: -38.8565,
    lng: -60.0722,
    horario: 'Lunes a Domingo de 09:00 a 13:00 y 15:00 a 20:00 hs',
    plan_id: 'destacado_cat',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'claromeconet_prop',
    activo: true,
    zona: 'Claromecó Centro',
    plan: PLANES_DATA[1],
    promos: []
  },
  {
    id: 'c-mg-dunamar',
    nombre: 'MG Dunamar Inmobiliaria & Alquileres',
    slug: 'mg-dunamar-inmobiliaria',
    categoria_id: 'inmobiliarias_alquileres',
    subcategoria: 'Casas y Cabañas en Dunamar',
    descripcion: 'Especialistas en propiedades en Barrio Parque Dunamar: cabañas entre los pinos, casas modernas cerca del arroyo y terrenos forestados.',
    telefono: '02983 48-0115',
    whatsapp: '5492983549911',
    direccion: 'San Martín esquina Neuquén, Dunamar',
    lat: -38.8615,
    lng: -60.0790,
    horario: 'Todos los días de 09:30 a 13:00 y 16:00 a 20:00 hs',
    plan_id: 'destacado_cat',
    fijado_home: false,
    logo_url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=150&auto=format&fit=crop&q=80',
    imagen_portada_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80',
    fotos: [],
    instagram: 'mgdunamar.propiedades',
    activo: true,
    zona: 'Dunamar Bosque',
    plan: PLANES_DATA[1],
    promos: []
  }
];

// Puntos de interés turístico
const PUNTOS_TURISTICOS = [
  {
    id: 'faro-claromeco',
    nombre: 'Faro Claromecó',
    categoria: 'Monumento',
    ubicacion: 'Costanera Sur a 2 km del centro',
    descripcion_corta: 'Inaugurado en 1922 con 54 metros de altura, es uno de los faros más altos de Sudamérica con vistas panorámicas increíbles.',
    descripcion_larga: 'El Faro Claromecó es el símbolo identitario del balneario. Posee franjas horizontales blancas y negras. Desde su base se obtienen postales imponentes del océano y los atardeceres. Cuenta con un parque forestado circundante ideal para matear y descansar.',
    imagen_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    como_llegar: 'Por Av. Costanera hacia el sur, camino asfaltado y señalizado.',
    recomendaciones: ['Llevar cámara o celular con batería', 'Excelente punto para ver la puesta de sol en el mar', 'Consultar días de apertura para subir al mirador'],
    gratis: true
  },
  {
    id: 'estacion-forestal',
    nombre: 'Estación Forestal Ing. Paolucci (El Vivero)',
    categoria: 'Naturaleza',
    ubicacion: 'Acceso a Claromecó por Ruta 73',
    descripcion_corta: 'Reserva forestal de casi 3000 hectáreas con senderos para caminatas, fogones habilitados y circuitos ecuestres.',
    descripcion_larga: 'Conocido localmente como "El Vivero", es un pulmón verde impresionante que fijó los médanos vivos de la región. Cuenta con eucaliptos, acacias y pinos marítimos.',
    imagen_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    como_llegar: 'Sobre la Ruta 73 a 3 km antes de ingresar al casco urbano de Claromecó.',
    recomendaciones: ['Ideal para días ventosos o descanso bajo la sombra', 'Llevar repelente y bolsa para llevarse los residuos'],
    gratis: true
  },
  {
    id: 'cascada-claromeco',
    nombre: 'Paseo de las 7 Cascadas (Arroyo Claromecó)',
    categoria: 'Paseo',
    ubicacion: 'Margen del Arroyo Claromecó hacia Dunamar',
    descripcion_corta: 'Desniveles naturales sobre el lecho de roca del arroyo, ideal para kayak, pesca de orilla y picnics en familia.',
    descripcion_larga: 'El arroyo Claromecó serpentea dividiendo Claromecó de Dunamar y desemboca en el mar. A lo largo de su curso se forman saltos de agua y piletones naturales.',
    imagen_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80',
    como_llegar: 'Bordeando el arroyo desde el puente peatonal hacia aguas arriba por camino vecinal consolidado.',
    recomendaciones: ['Alquiler de kayaks disponible en los paradores ribereños', 'Aguas calmas ideales para niños'],
    gratis: true
  },
  {
    id: 'el-caracolero',
    nombre: 'El Caracolero & Playas Vírgenes',
    categoria: 'Playa & Dunas',
    ubicacion: 'Zona de playa virgen hacia el este del Faro',
    descripcion_corta: 'Playa agreste donde el mar deposita miles de caracoles y fósiles marinos. Paraíso de la pesca deportiva y caminatas.',
    descripcion_larga: 'Un recorrido costero único. Pasando el Faro hacia el este, se llega a una franja de playa solitaria y virgen caracterizada por su paz inigualable.',
    imagen_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    como_llegar: 'Acceso por playa hacia el este del Faro.',
    recomendaciones: ['Consultar tabla de mareas antes de salir', 'Llevar agua fresca y protección solar', 'Respetar el entorno natural y llevarse los residuos'],
    gratis: true
  }
];

// Teléfonos de urgencia y servicios esenciales (Guardia Médica, Bomberos, Policía, Guardavidas, Farmacias, Veterinaria y CELCLA)
const URGENCIAS_DATA = [
  // 1. Destacados directos de urgencia inmediata
  {
    id: 'u-1',
    nombre: 'Guardia Médica · Hospitalito Claromecó',
    tipo: 'salud',
    es_destacado: true,
    icono: 'heart-pulse',
    color: 'rose',
    numero: '107',
    numero_secundario: '02983 48-0020',
    whatsapp: '5492983480020',
    direccion: 'Calle 28 entre 21 y 23, Claromecó',
    horario: 'Guardia Médica 24 Horas',
    descripcion: 'Ambulancia de traslado, emergencias médicas y primeros auxilios.'
  },
  {
    id: 'u-2',
    nombre: 'Bomberos Voluntarios Claromecó',
    tipo: 'bomberos',
    es_destacado: true,
    icono: 'flame',
    color: 'amber',
    numero: '100',
    numero_secundario: '02983 48-0100',
    whatsapp: '5492983480100',
    direccion: 'Calle 24 entre 11 y 13, Claromecó',
    horario: 'Emergencias 24 Horas',
    descripcion: 'Incendios forestales, rescates en médanos y emergencias.'
  },
  {
    id: 'u-3',
    nombre: 'Policía Comunal Claromecó',
    tipo: 'policia',
    es_destacado: true,
    icono: 'shield',
    color: 'blue',
    numero: '911',
    numero_secundario: '02983 48-0111',
    whatsapp: '',
    direccion: 'Calle 28 y Calle 13, Claromecó',
    horario: 'Atención 24 Horas',
    descripcion: 'Seguridad ciudadana y prevención comunal.'
  },
  {
    id: 'u-guardavidas',
    nombre: 'Cuerpo de Guardavidas Claromecó & Dunamar',
    tipo: 'guardavidas',
    es_destacado: true,
    icono: 'life-buoy',
    color: 'teal',
    numero: '02983 48-0120',
    numero_secundario: '100 (Bomberos)',
    whatsapp: '',
    direccion: 'Puestos en Costanera Claromecó y Dunamar',
    horario: 'Temporada de Playa de 09:00 a 20:00 hs',
    descripcion: 'Seguridad en el mar, rescate acuático y primeros auxilios en zona de baño.'
  },
  // 2. Servicios de urgencia y guardia secundaria
  {
    id: 'u-farmacia-1',
    nombre: 'Farmacia Claromecó',
    tipo: 'farmacia',
    es_destacado: false,
    icono: 'cross',
    color: 'emerald',
    numero: '02983 48-0123',
    whatsapp: '5492983500330',
    direccion: 'Calle 28 N° 850 (entre 13 y 15)',
    horario: 'Turnos rotativos de guardia',
    descripcion: 'Medicamentos, primeros auxilios y perfumería.'
  },
  {
    id: 'u-farmacia-2',
    nombre: 'Farmacia del Balneario',
    tipo: 'farmacia',
    es_destacado: false,
    icono: 'cross',
    color: 'emerald',
    numero: '02983 48-0456',
    whatsapp: '5492983511223',
    direccion: 'Calle 9 N° 1250 (entre 28 y 30)',
    horario: 'Turnos rotativos de guardia',
    descripcion: 'Atención farmacéutica, recetas y atención de guardia.'
  },
  {
    id: 'u-vet',
    nombre: 'Veterinaria Claromecó (Urgencias)',
    tipo: 'veterinaria',
    es_destacado: false,
    icono: 'paw',
    color: 'purple',
    numero: '02983 48-0555',
    whatsapp: '5492983544332',
    direccion: 'Calle 28 y Calle 11, Claromecó',
    horario: 'Guardia de Urgencia Mascotas',
    descripcion: 'Atención clínica veterinaria, picaduras, heridas y emergencias.'
  },
  {
    id: 'u-celcla',
    nombre: 'CELCLA Guardia Eléctrica (Cooperativa)',
    tipo: 'servicios',
    es_destacado: false,
    icono: 'zap',
    color: 'amber',
    numero: '02983 48-0001',
    numero_secundario: '02983 48-0000',
    whatsapp: '',
    direccion: 'Calle 28 N° 1035, Claromecó',
    horario: 'Guardia Técnica Eléctrica 24 Horas',
    descripcion: 'Guardia técnica de energía eléctrica, cortes de suministro y alumbrado público.'
  }
];

// ====================================================================
// FUNCIONES DE LÓGICA DE NEGOCIO (VANILLA JS)
// ====================================================================

// 1. Evalúa si una promo está activa hoy (prioriza rango_fecha o dia_semana)
function promoActivaHoy(promo, fecha = new Date()) {
  if (!promo || !promo.activa) return false;
  if (promo.tipo === 'rango_fecha') {
    if (!promo.fecha_inicio || !promo.fecha_fin) return true;
    const ahora = fecha.toISOString().split('T')[0];
    return ahora >= promo.fecha_inicio && ahora <= promo.fecha_fin;
  }
  if (promo.tipo === 'dia_semana') {
    const diaActual = fecha.getDay(); // 0: Dom, 1: Lun ... 6: Sab
    if (Array.isArray(promo.dias_semana)) {
      return promo.dias_semana.includes(diaActual);
    }
    return promo.dia_semana === diaActual;
  }
  return true;
}

// 2. Obtiene promociones y eventos vigentes junto a su comercio
function obtenerPromosActivasHoy() {
  const activas = [];
  const hoy = new Date();
  for (const c of COMERCIOS_DATA) {
    if (c.promos && c.promos.length > 0 && c.plan && c.plan.permite_promos) {
      for (const p of c.promos) {
        if (promoActivaHoy(p, hoy)) {
          activas.push({ promo: p, comercio: c });
        }
      }
    }
  }
  return activas;
}

// 3. Obtiene comercios para el carrusel de recomendados:
// - Comercios con fijado_home: true aparecen SIEMPRE
// - El resto de cupos hasta 10-12 se eligen aleatoriamente en cada carga
function obtenerComerciosRecomendadosCarrusel(limite = 10) {
  const elegibles = COMERCIOS_DATA.filter(c => c.activo);
  const fijados = elegibles.filter(c => c.fijado_home);
  const noFijados = elegibles.filter(c => !c.fijado_home);

  // Mezclar aleatoriamente los no fijados
  const mezclados = [...noFijados].sort(() => 0.5 - Math.random());

  const seleccion = [...fijados];
  for (const c of mezclados) {
    if (seleccion.length >= limite) break;
    if (!seleccion.some(item => item.id === c.id)) {
      seleccion.push(c);
    }
  }

  return seleccion;
}

// 4. Ordena comercios: Destacados primero, luego alfabéticamente
function ordenarComercios(listaComercios) {
  return [...listaComercios].sort((a, b) => {
    const aDest = a.plan?.destacado_categoria ? 1 : 0;
    const bDest = b.plan?.destacado_categoria ? 1 : 0;
    if (aDest !== bDest) return bDest - aDest;
    return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
  });
}

// 5. Obtiene comercios por categoría ordenados
function getComerciosPorCategoria(categoriaId, subcategoria = 'Todas') {
  let filtrados = COMERCIOS_DATA.filter(c => c.categoria_id === categoriaId && c.activo);
  if (subcategoria && subcategoria !== 'Todas') {
    filtrados = filtrados.filter(c => c.subcategoria === subcategoria);
  }
  return ordenarComercios(filtrados);
}

// 6. Generador de JSON-LD Schema.org (LocalBusiness / Restaurant) para SEO
function generarJsonLd(comercio, baseUrl = 'https://estoyenclaro.com.ar') {
  let type = 'LocalBusiness';
  if (comercio.categoria_id === 'gastronomia') type = 'Restaurant';
  if (comercio.categoria_id === 'alojamiento') type = 'LodgingBusiness';

  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: comercio.nombre,
    description: comercio.descripcion,
    url: `${baseUrl}/comercios/${comercio.slug}.html`,
    telephone: comercio.telefono || undefined,
    image: comercio.imagen_portada_url || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: comercio.direccion,
      addressLocality: 'Claromecó',
      addressRegion: 'Buenos Aires',
      postalCode: 'B7505',
      addressCountry: 'AR'
    },
    geo: (comercio.lat && comercio.lng) ? {
      '@type': 'GeoCoordinates',
      latitude: comercio.lat,
      longitude: comercio.lng
    } : undefined
  };
}
