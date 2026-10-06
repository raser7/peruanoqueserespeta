# Publicación e indexación en Google

Dominio principal: https://www.peruanoqueserespeta.com/
El dominio sin www debe mantener su redirección 308 hacia www en Vercel.
Las mejoras están enfocadas en la marca, apuestas deportivas en Telegram y entretenimiento en Perú.
La primera pantalla conserva los cuatro accesos; debajo hay contenido visible para explicar la página y cómo usar los canales.
No garantizan una posición: Google decide cuándo indexa y cómo ordena los resultados.

## Después de fusionar y desplegar

1. Abre https://search.google.com/search-console y añade una propiedad de tipo **Dominio**: `peruanoqueserespeta.com` (sin https ni www).
2. Copia el registro TXT de verificación que Google te entregue.
3. En Namecheap, abre Domain List → Manage → Advanced DNS → Add New Record. Añade un **TXT Record**, Host `@`, Value el código completo de Google, TTL Automatic. Conserva los registros A, CNAME y TXT existentes.
4. Guarda el registro y pulsa **Verificar** en Search Console. Si aún no lo detecta, espera a que el DNS se propague y vuelve a intentarlo.
5. En **Sitemaps**, envía `https://www.peruanoqueserespeta.com/sitemap.xml`.
6. En **Inspección de URLs**, introduce `https://www.peruanoqueserespeta.com/`, ejecuta **Probar URL publicada** y, cuando sea accesible e indexable, pulsa **Solicitar indexación**.
7. Revisa después **Indexación de páginas** y **Rendimiento** para conocer las búsquedas, impresiones y clics reales. Solicitar indexación no garantiza que Google la incluya ni un plazo concreto.

## Mantenimiento

- Los metadatos y el dominio canónico se definen en `src/data/site.ts`; el dominio de Astro también está en `astro.config.mjs`.
- Sitemap y robots se generan durante el build, sin servicios adicionales.
- La imagen para compartir y el logo de Organization se generan con `node scripts/generate-social-image.mjs` y se entregan en `public/social-preview.png` y `public/logo.png`.
- Mantén enlaces a esta web desde los perfiles y canales reales de la marca, con su nombre correcto.
- Para ampliar la captación, una fase posterior puede incorporar guías sobre canales de apuestas en Telegram y conceptos deportivos. Cada guía debe responder a una pregunta distinta con contenido útil, ejemplos y revisión del responsable de la marca; no publicar páginas duplicadas que solo cambien palabras clave.
- No agregues listas ocultas de palabras clave ni afirmaciones, reseñas o datos estructurados inventados.

Referencias: https://developers.google.com/search/docs/fundamentals/seo-starter-guide y https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
