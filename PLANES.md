# Especificación de Planes y Visibilidad — Estoy en Claro

Este archivo es la fuente de verdad definitiva sobre las características, visibilidad y reglas de negocio para los distintos planes de comercios en el portal.

| Elemento | Gratis | Bronce | Plata | Oro |
|---|:---:|:---:|:---:|:---:|
| Nombre del plan visible al público | Nunca | Nunca | Nunca | Nunca |
| WhatsApp / Llamar (link funcional) | Sí | Sí | Sí | Sí |
| Botón "Cómo llegar" | Solo si hay dirección cargada (regla igual para los 4 planes) |
| Redes sociales | No | Sí | Sí | Sí |
| Galería de fotos | No | Sí | Sí | Sí |
| Descripción | Breve | Completa | Completa | Completa |
| Badge "Destacado" | No | No | Sí | Sí |
| Prioridad de orden en su categoría | No | No | Sí (segundo) | Sí (primero) |
| Puede cargar Promos/Eventos | No | No | Sí (categoría y ficha propia) | Sí (+ Home) |
| Carrusel "Recomendados" del Home | No | No | No | Sí |
| Imagen tipo Historia 9:16 | No | No | No | Sí |

---

### REGLA DE ORO DE VISIBILIDAD

> **REGLA DE ORO**: El **ÚNICO** indicador visual de plan permitido en todo el sitio es el badge **"Destacado"**, condicionado a `destacado_categoria: true` (Plata y Oro). **NUNCA** se debe renderizar el nombre del plan (`plan.nombre`, `plan.id`, `plan_id`, "ORO", "PLATA", "BRONCE", "GRATIS") como texto visible en ningún componente público del sitio (ni en fichas, ni en tarjetas de categoría, ni en carruseles del home, ni en modales o listas).
