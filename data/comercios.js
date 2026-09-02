// ====================================================================
// ESTOY EN CLARO — GUÍA COMERCIAL Y TURÍSTICA DE CLAROMECÓ, ARGENTINA
// Datos maestros y funciones de negocio (Vanilla JS)
// ====================================================================

const PLANES_DATA = [
  {
    id: 'gratis',
    nombre: 'Gratis',
    muestra_redes: false,
    destacado_categoria: false,
    destacado_home: false,
    permite_promos: false,
    permite_imagen_historia: false,
    color_badge: 'slate'
  },
  {
    id: 'bronce',
    nombre: 'Bronce',
    muestra_redes: true,
    destacado_categoria: false,
    destacado_home: false,
    permite_promos: false,
    permite_imagen_historia: false,
    color_badge: 'amber-700'
  },
  {
    id: 'plata',
    nombre: 'Plata',
    muestra_redes: true,
    destacado_categoria: true,
    destacado_home: false,
    permite_promos: true,
    permite_imagen_historia: false,
    color_badge: 'slate-400'
  },
  {
    id: 'oro',
    nombre: 'Oro',
    muestra_redes: true,
    destacado_categoria: true,
    destacado_home: true,
    permite_promos: true,
    permite_imagen_historia: true,
    color_badge: 'amber-400'
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
    "id": "c-la-barra",
    "nombre": "La Barra Restó & Café",
    "slug": "la-barra-resto-cafe",
    "categoria_id": "gastronomia",
    "subcategoria": "Restaurantes y Minutas",
    "descripcion": "Pescados frescos del Atlántico, rabas crocantes, pastas caseras y tablas de mariscos con vista panorámica a la costanera.",
    "telefono": "02983 48-1234",
    "whatsapp": "5492983552010",
    "direccion": "Costanera y Calle 28, Claromecó",
    "lat": -38.8612,
    "lng": -60.0715,
    "horario": "Todos los días de 11:30 a 16:00 y de 20:00 a 01:00 hs",
    "plan_id": "oro",
    "fijado_home": true,
    "logo_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80",
    "imagen_historia_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1080&h=1920&auto=format&fit=crop&q=80",
    "fotos": [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
    ],
    "instagram": "labarra.claromeco",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Costanera",
    "promos": [
      {
        "id": "p-1",
        "comercio_id": "c-la-barra",
        "titulo": "20% OFF en Tabla de Pescados & Rabas de la Costa",
        "descripcion": "Válido para almuerzos y cenas mencionando la guía Estoy en Claro.",
        "tipo": "rango_fecha",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2027-04-30",
        "rango_texto": "Todo el año 2026/2027",
        "activa": true,
        "descuento_porcentaje": 20,
        "imagen_historia_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1080&h=1920&auto=format&fit=crop&q=80"
      }
    ],
    plan: PLANES_DATA[3]
  },
  {
    "id": "c-gastro-7",
    "nombre": "Pizzería La Casona de Piedra",
    "slug": "pizzeria-la-casona-de-piedra",
    "categoria_id": "gastronomia",
    "subcategoria": "Pizzerías y Empanadas",
    "descripcion": "Pizzas a la piedra en horno a leña. Fugazzeta rellena, cuatro quesos, calzones rústicos y cerveza tirada.",
    "telefono": "02983 48-1755",
    "whatsapp": "5492983517550",
    "direccion": "Calle 9 entre 22 y 24, Claromecó",
    "lat": -38.8578,
    "lng": -60.0722,
    "horario": "Todos los días de 20:00 a 01:00 hs",
    "plan_id": "gratis",
    "fijado_home": false,
    "logo_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80",
    "fotos": [],
    "instagram": "",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [],
    plan: PLANES_DATA[0]
  },
  {
    "id": "c-medano-blanco",
    "nombre": "Cabañas Médano Blanco Dunamar",
    "slug": "cabanas-medano-blanco-dunamar",
    "categoria_id": "alojamiento",
    "subcategoria": "Cabañas en Dunamar",
    "descripcion": "Complejo de cabañas en el bosque de pinos de Dunamar a 200m del mar. Deck privado, parrilla individual, piscina y Wi-Fi.",
    "telefono": "02983 48-0990",
    "whatsapp": "5492983582230",
    "direccion": "Calle Río Paraná 450, Barrio Dunamar",
    "lat": -38.8621,
    "lng": -60.0812,
    "horario": "Recepción y reservas de 08:00 a 22:00 hs",
    "plan_id": "oro",
    "fijado_home": true,
    "logo_url": "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
    "imagen_historia_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1080&h=1920&auto=format&fit=crop&q=80",
    "fotos": [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80"
    ],
    "instagram": "medanoblancocabanas",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Dunamar Bosque",
    "promos": [
      {
        "id": "p-3",
        "comercio_id": "c-medano-blanco",
        "titulo": "15% OFF en Estadías de 4 o más noches",
        "descripcion": "Válido para reservas directas por WhatsApp mencionando la guía Estoy en Claro.",
        "tipo": "rango_fecha",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2027-04-30",
        "rango_texto": "Temporada 2026/2027",
        "activa": true,
        "descuento_porcentaje": 15,
        "imagen_historia_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1080&h=1920&auto=format&fit=crop&q=80"
      }
    ],
    plan: PLANES_DATA[3]
  },
  {
    "id": "c-aloj-5",
    "nombre": "Cabañas El Remanso del Arroyo",
    "slug": "cabanas-el-remanso-del-arroyo",
    "categoria_id": "alojamiento",
    "subcategoria": "Cabañas en Dunamar",
    "descripcion": "Cabañas con bajada directa al arroyo Claromecó. Muelle privado, kayaks de cortesía, hidromasaje y ambiente súper tranquilo.",
    "telefono": "02983 48-2940",
    "whatsapp": "5492983529400",
    "direccion": "Paseo de la Ribera 850, Dunamar",
    "lat": -38.86,
    "lng": -60.076,
    "horario": "Atención de 08:30 a 21:00 hs",
    "plan_id": "gratis",
    "fijado_home": false,
    "logo_url": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000&auto=format&fit=crop&q=80",
    "fotos": [],
    "instagram": "",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Dunamar Bosque",
    "promos": [],
    plan: PLANES_DATA[0]
  },
  {
    "id": "c-klaromeko-inmo",
    "nombre": "Klaromeko Inmobiliaria",
    "slug": "klaromeko-inmobiliaria",
    "categoria_id": "inmobiliarias_alquileres",
    "subcategoria": "Alquileres de Temporada",
    "descripcion": "Alquileres de casas, chalets frente al mar y cabañas en Dunamar. Venta de propiedades, lotes en el bosque y tasaciones profesionales.",
    "telefono": "02983 48-0280",
    "whatsapp": "5492983556677",
    "direccion": "Avenida 26 esquina Calle 15, Claromecó",
    "lat": -38.856,
    "lng": -60.072,
    "horario": "Lunes a Domingos de 09:00 a 13:00 y 16:30 a 20:30 hs",
    "plan_id": "oro",
    "fijado_home": true,
    "logo_url": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
    "imagen_historia_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
    "fotos": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
    ],
    "instagram": "klaromekoinmobiliaria",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [
      {
        "id": "p-7",
        "comercio_id": "c-klaromeko-inmo",
        "titulo": "10% OFF en Reservas Anticipadas de Alquiler de Verano",
        "descripcion": "Consultá catálogo de casas con pileta y cabañas en Dunamar para la temporada.",
        "tipo": "rango_fecha",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2027-04-30",
        "rango_texto": "Temporada Verano",
        "activa": true,
        "descuento_porcentaje": 10
      }
    ],
    plan: PLANES_DATA[3]
  },
  {
    "id": "c-inmo-2",
    "nombre": "Alquileres Claromecó Express",
    "slug": "alquileres-claromeco-express",
    "categoria_id": "inmobiliarias_alquileres",
    "subcategoria": "Alquileres de Temporada",
    "descripcion": "Gestión ágil de alquileres turísticos de chalets y departamentos. Fotos reales, inventario verificado y atención personalizada durante la estadía.",
    "telefono": "02983 48-3250",
    "whatsapp": "5492983532500",
    "direccion": "Calle 9 entre 24 y 26, Claromecó",
    "lat": -38.8572,
    "lng": -60.0726,
    "horario": "Lunes a Domingos 09:00 a 20:00 hs",
    "plan_id": "gratis",
    "fijado_home": false,
    "logo_url": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1000&auto=format&fit=crop&q=80",
    "fotos": [],
    "instagram": "",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [],
    plan: PLANES_DATA[0]
  },
  {
    "id": "c-almacen-1",
    "nombre": "Autoservicio & Carnicería San Cayetano",
    "slug": "autoservicio-carniceria-san-cayetano",
    "categoria_id": "almacenes_kioscos",
    "subcategoria": "Supermercados y Autoservicios",
    "descripcion": "Cortes de novillito de exportación para el asado, chorizos caseros, fiambres de primera línea, bebidas por bulto y fiambrería completa.",
    "telefono": "02983 48-3500",
    "whatsapp": "5492983535000",
    "direccion": "Calle 28 y Calle 17, Claromecó",
    "lat": -38.8566,
    "lng": -60.0733,
    "horario": "Lunes a Sábados 08:30 a 13:30 y 17:00 a 21:30 hs | Dom 09:00 a 13:30 hs",
    "plan_id": "oro",
    "fijado_home": true,
    "logo_url": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1000&auto=format&fit=crop&q=80",
    "imagen_historia_url": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1000&auto=format&fit=crop&q=80",
    "fotos": [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1000&auto=format&fit=crop&q=80"
    ],
    "instagram": "sancayetano.autoservicio",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [
      {
        "id": "p-almacen-1",
        "titulo": "15% OFF en Asado de Tira y Vacío abonando con Transferencia",
        "descripcion": "El mejor asado para las vacaciones con carbón de quebracho de regalo por compra superior a 15kg.",
        "tipo": "rango_fecha",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2027-04-30",
        "rango_texto": "Temporada Verano",
        "activa": true,
        "descuento_porcentaje": 15
      }
    ],
    plan: PLANES_DATA[3]
  },
  {
    "id": "c-kiosco-caracol",
    "nombre": "Kiosco & Minishop El Caracol 24hs",
    "slug": "kiosco-el-caracol-24hs",
    "categoria_id": "almacenes_kioscos",
    "subcategoria": "Kioscos 24hs y Bebidas",
    "descripcion": "Hielo en bolsa, bebidas heladas, golosinas, cigarrillos, carbón, artículos de playa y provisiones las 24 horas.",
    "telefono": "02983 48-0555",
    "whatsapp": "5492983499201",
    "direccion": "Av. 26 esquina Calle 28, Claromecó",
    "lat": -38.8568,
    "lng": -60.0729,
    "horario": "Abierto 24 Horas en temporada",
    "plan_id": "gratis",
    "fijado_home": false,
    "logo_url": "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1000&auto=format&fit=crop&q=80",
    "fotos": [],
    "instagram": "",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [],
    plan: PLANES_DATA[0]
  },
  {
    "id": "c-serv-6",
    "nombre": "Mecánica Ligera & Auxilio 4x4 Claromecó",
    "slug": "mecanica-ligera-auxilio-4x4",
    "categoria_id": "servicios_oficios",
    "subcategoria": "Gomería y Auxilio 4x4",
    "descripcion": "Especialistas en rescate y desatasco de camionetas 4x4 y cuatriciclos en arena blanda. Mecánica de urgencia, frenos, correas y baterías.",
    "telefono": "02983 48-6630",
    "whatsapp": "5492983566300",
    "direccion": "Avenida 26 y Calle 35, Claromecó",
    "lat": -38.854,
    "lng": -60.071,
    "horario": "Servicio de Rescate 24 Horas",
    "plan_id": "oro",
    "fijado_home": true,
    "logo_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1000&auto=format&fit=crop&q=80",
    "imagen_historia_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1080&h=1920&auto=format&fit=crop&q=80",
    "fotos": [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=800&auto=format&fit=crop&q=80"
    ],
    "instagram": "auxilio4x4.claro",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó",
    "promos": [
      {
        "id": "p-serv-6",
        "titulo": "Calibrado de neumáticos para médanos y arena GRATIS",
        "descripcion": "Pasá por el taller antes de entrar a la playa para calibrar tus cubiertas en las libras exactas.",
        "tipo": "rango_fecha",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2027-04-30",
        "rango_texto": "Temporada Verano",
        "activa": true,
        "descuento_porcentaje": 100
      }
    ],
    plan: PLANES_DATA[3]
  },
  {
    "id": "c-serv-1",
    "nombre": "Electricista Matriculado Claromecó - Guardias 24hs",
    "slug": "electricista-matriculado-claromeco-24hs",
    "categoria_id": "servicios_oficios",
    "subcategoria": "Electricista",
    "descripcion": "Instalaciones eléctricas residenciales y comerciales, tableros con disyuntor, bombas de agua, grupos electrógenos y urgencias por cortocircuitos.",
    "telefono": "02983 48-4100",
    "whatsapp": "5492983541000",
    "direccion": "",
    "lat": null,
    "lng": null,
    "horario": "Guardias y urgencias 24 Horas",
    "plan_id": "gratis",
    "fijado_home": false,
    "logo_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&auto=format&fit=crop&q=80",
    "fotos": [],
    "instagram": "",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [],
    plan: PLANES_DATA[0]
  },
  {
    "id": "c-comp-1",
    "nombre": "Boutique del Sol - Mallas & Indumentaria",
    "slug": "boutique-del-sol-mallas-indumentaria",
    "categoria_id": "compras_regaleria",
    "subcategoria": "Indumentaria y Mallas",
    "descripcion": "Bikinis, enterizas, bermudas de baño, vestidos playeros de lino, sombreros de paja, anteojos de sol con filtro UV y bolsos de playa.",
    "telefono": "02983 48-4650",
    "whatsapp": "5492983546500",
    "direccion": "Calle 28 entre 9 y 11, Claromecó",
    "lat": -38.8573,
    "lng": -60.073,
    "horario": "Todos los días de 10:00 a 14:00 y 18:00 a 00:30 hs",
    "plan_id": "oro",
    "fijado_home": true,
    "logo_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&auto=format&fit=crop&q=80",
    "imagen_historia_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&auto=format&fit=crop&q=80",
    "fotos": [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&auto=format&fit=crop&q=80"
    ],
    "instagram": "boutiquedelsol.claro",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [
      {
        "id": "p-comp-1",
        "titulo": "20% OFF en Segunda Prenda de Playa",
        "descripcion": "Combiná mallas, vestidos de lino y pareos artesanales de verano.",
        "tipo": "rango_fecha",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2027-04-30",
        "rango_texto": "Temporada Verano",
        "activa": true,
        "descuento_porcentaje": 20
      }
    ],
    plan: PLANES_DATA[3]
  },
  {
    "id": "c-comp-4",
    "nombre": "Regalería & Souvenirs Playa Hermosa",
    "slug": "regaleria-souvenirs-playa-hermosa",
    "categoria_id": "compras_regaleria",
    "subcategoria": "Regalerías y Souvenirs",
    "descripcion": "Llaveros, remeras estampadas de Claromecó, mates de madera grabados, termos, tazas de cerámica y recuerdos del balneario.",
    "telefono": "02983 48-8060",
    "whatsapp": "5492983580600",
    "direccion": "Calle 9 N° 980, Claromecó",
    "lat": -38.8573,
    "lng": -60.0721,
    "horario": "Todos los días 09:30 a 13:00 y 18:00 a 00:00 hs",
    "plan_id": "gratis",
    "fijado_home": false,
    "logo_url": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=80",
    "fotos": [],
    "instagram": "",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [],
    plan: PLANES_DATA[0]
  },
  {
    "id": "c-pesca-el-faro",
    "nombre": "Casa de Pesca & Carnadas El Anzuelo",
    "slug": "casa-de-pesca-el-anzuelo",
    "categoria_id": "comercios_gral",
    "subcategoria": "Casas de pesca (venta de equipos)",
    "descripcion": "Cañas, reeles, líneas armadas para variada de mar y corvina negra, plomadas, waders y la mejor carnada fresca de Claromecó.",
    "telefono": "02983 48-0888",
    "whatsapp": "5492983512345",
    "direccion": "Calle 28 entre 15 y 17, Claromecó",
    "lat": -38.857,
    "lng": -60.0735,
    "horario": "Todos los días de 07:00 a 22:00 hs",
    "plan_id": "oro",
    "fijado_home": true,
    "logo_url": "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=1000&auto=format&fit=crop&q=80",
    "imagen_historia_url": "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=1000&auto=format&fit=crop&q=80",
    "fotos": [
      "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=1000&auto=format&fit=crop&q=80"
    ],
    "instagram": "pescaelanzuelo.claro",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [
      {
        "id": "p-pesca-1",
        "comercio_id": "c-pesca-el-faro",
        "titulo": "15% OFF en Líneas de Mar & Carnada Fresca",
        "descripcion": "Mencionando Estoy en Claro en tus compras mayores a 5.000.",
        "tipo": "rango_fecha",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2027-04-30",
        "rango_texto": "Toda la Temporada",
        "activa": true,
        "descuento_porcentaje": 15,
        "imagen_historia_url": "https://images.unsplash.com/photo-1529230117010-b6c436154f25?w=1000&auto=format&fit=crop&q=80"
      }
    ],
    plan: PLANES_DATA[3]
  },
  {
    "id": "c-gral-2",
    "nombre": "Kiosco de Diarios, Revistas & Crucigramas El Faro",
    "slug": "kiosco-diarios-revistas-el-faro",
    "categoria_id": "comercios_gral",
    "subcategoria": "Kioscos de diarios y revistas",
    "descripcion": "Diarios nacionales y regionales temprano en la mañana, revistas de interés general, crucigramas y sudokus para la playa.",
    "telefono": "02983 48-4980",
    "whatsapp": "5492983549800",
    "direccion": "Calle 28 y Calle 9, Claromecó",
    "lat": -38.8577,
    "lng": -60.0731,
    "horario": "Todos los días de 07:00 a 14:00 y 18:00 a 22:00 hs",
    "plan_id": "gratis",
    "fijado_home": false,
    "logo_url": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80",
    "fotos": [],
    "instagram": "",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó Centro",
    "promos": [],
    plan: PLANES_DATA[0]
  },
  {
    "id": "c-kayak-arroyo",
    "nombre": "Aventuras Arroyo & Kayaks Claromecó",
    "slug": "aventuras-arroyo-kayaks-claromeco",
    "categoria_id": "turismo_deportes",
    "subcategoria": "Alquileres y excursiones (kayak, bicis, pesca embarcada)",
    "descripcion": "Alquiler de kayaks simples y dobles, tablas de SUP, bicicletas de paseo y salidas guiadas a las 7 Cascadas del arroyo Claromecó.",
    "telefono": "02983 48-0777",
    "whatsapp": "5492983577889",
    "direccion": "Paseo del Arroyo y Puente Peatonal Dunamar",
    "lat": -38.8592,
    "lng": -60.0691,
    "horario": "Todos los días de 09:00 a 20:00 hs",
    "plan_id": "oro",
    "fijado_home": true,
    "logo_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80",
    "imagen_historia_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&auto=format&fit=crop&q=80",
    "fotos": [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80"
    ],
    "instagram": "kayaksclaromeco",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Paseo del Arroyo",
    "promos": [
      {
        "id": "p-5",
        "comercio_id": "c-kayak-arroyo",
        "titulo": "2da Hora de Kayak al 50% OFF en Familia",
        "descripcion": "Promo especial para recorrer el arroyo hasta los saltos de las cascadas.",
        "tipo": "rango_fecha",
        "fecha_inicio": "2026-01-01",
        "fecha_fin": "2027-04-30",
        "rango_texto": "Temporada 2026/2027",
        "activa": true,
        "descuento_porcentaje": 50
      }
    ],
    plan: PLANES_DATA[3]
  },
  {
    "id": "c-tur-5",
    "nombre": "Canchas de Fútbol 5 & Padel El Médano",
    "slug": "canchas-futbol-5-padel-el-medano",
    "categoria_id": "turismo_deportes",
    "subcategoria": "Deportes (cancha de pádel, fútbol 5)",
    "descripcion": "Canchas de césped sintético iluminadas para fútbol 5 y pádel de blindex. Buffet con bebidas frías, pizzas y vestuarios con duchas.",
    "telefono": "02983 48-8610",
    "whatsapp": "5492983586100",
    "direccion": "Calle 15 entre 40 y 42, Claromecó",
    "lat": -38.859,
    "lng": -60.077,
    "horario": "Lunes a Domingos de 14:00 a 01:00 hs",
    "plan_id": "gratis",
    "fijado_home": false,
    "logo_url": "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=150&auto=format&fit=crop&q=80",
    "imagen_portada_url": "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1000&auto=format&fit=crop&q=80",
    "fotos": [],
    "instagram": "",
    "facebook": "",
    "web": "",
    "activo": true,
    "zona": "Claromecó",
    "promos": [],
    plan: PLANES_DATA[0]
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
// SECCIÓN INDEPENDIENTE: AVISOS (Eventos, Novedades e Institucionales)
// Para anunciantes que NO son comercios fijos del directorio (Municipalidad, CELCLA, eventos externos)
// ====================================================================

const AVISOS_DATA = [
  {
    id: 'aviso-muni-recoleccion-diferenciada',
    titulo: 'Puntos Limpios y Recolección Diferenciada en Claromecó',
    descripcion_corta: 'Nuevos días de recolección de reciclables, ramas y secos en la villa.',
    imagen_historia_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=720&auto=format&fit=crop&q=80',
    link_externo: 'https://www.tresarroyos.gov.ar',
    fecha_inicio: '2026-08-01',
    fecha_fin: '2026-12-31',
    institucional: true
  },
  {
    id: 'aviso-celcla-guardia-digital',
    titulo: 'CELCLA: Guardia 24hs de Energía y Fibra Óptica',
    descripcion_corta: 'Canales de atención digital y números de guardia técnica 24hs.',
    imagen_historia_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=720&auto=format&fit=crop&q=80',
    link_externo: 'https://wa.me/5492983552010?text=Hola%20CELCLA%20Claromec%C3%B3%2C%20necesito%20comunicarme%20con%20la%20guardia',
    fecha_inicio: '2026-08-15',
    fecha_fin: '2026-11-30',
    institucional: true
  },
  {
    id: 'aviso-clinica-4x4-medanos',
    titulo: 'Clínica de Manejo en Arena y Punto de Inflado 4x4 Gratuito',
    descripcion_corta: 'Manejo seguro en dunas, inflado gratis y test drive en Posta del Sur.',
    imagen_historia_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=720&auto=format&fit=crop&q=80',
    link_externo: 'https://instagram.com/claromeco4x4',
    fecha_inicio: '2026-08-20',
    fecha_fin: '2026-09-30',
    institucional: false
  }
];

// ====================================================================
// FUNCIONES DE LÓGICA DE NEGOCIO (VANILLA JS)
// ====================================================================

// 0. Evalúa si un aviso no-comercial está activo hoy
function avisoActivoHoy(aviso, fecha = new Date()) {
  if (!aviso) return false;
  if (!aviso.fecha_inicio || !aviso.fecha_fin) return true;
  const ahora = fecha.toISOString().split('T')[0];
  return ahora >= aviso.fecha_inicio && ahora <= aviso.fecha_fin;
}

// 0.1 Obtiene los avisos activos hoy
function obtenerAvisosActivosHoy() {
  const hoy = new Date();
  if (typeof AVISOS_DATA === 'undefined' || !Array.isArray(AVISOS_DATA)) return [];
  return AVISOS_DATA.filter(a => avisoActivoHoy(a, hoy));
}

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

// 3. Obtiene comercios para el carrusel de recomendados del Home:
// EXCLUSIVO Plan Oro (destacado_home: true / plan_id === 'oro') según PLANES.md
function obtenerComerciosRecomendadosCarrusel(limite = 12) {
  const soloOro = COMERCIOS_DATA.filter(c => 
    c.activo && (c.plan_id === 'oro' || c.plan_id === 'premium' || (c.plan && c.plan.destacado_home) || c.fijado_home)
  );

  // Mezclar aleatoriamente para rotar visualización en cada carga, respetando exclusividad Oro
  const mezclados = [...soloOro].sort(() => 0.5 - Math.random());
  return mezclados.slice(0, limite);
}

// Helper: Prioridad numérica según plan (1° Oro, 2° Plata, 3° Bronce, 4° Gratis)
function getPlanPriority(planId) {
  if (planId === 'oro' || planId === 'premium') return 4;
  if (planId === 'plata' || planId === 'destacado_cat') return 3;
  if (planId === 'bronce') return 2;
  return 1; // gratis
}

// 4. Ordena comercios en categorías: 1° Oro, 2° Plata, 3° Bronce y 4° Gratis (orden alfabético dentro de cada tier)
function ordenarComercios(listaComercios) {
  return [...listaComercios].sort((a, b) => {
    const aPri = getPlanPriority(a.plan_id || a.plan?.id);
    const bPri = getPlanPriority(b.plan_id || b.plan?.id);
    if (aPri !== bPri) return bPri - aPri;
    return (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' });
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
