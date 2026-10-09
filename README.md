# Peruano que se respeta

Microsite one-page en Astro 7, TypeScript y Tailwind CSS 4, ubicada en la raíz del repositorio. Cinco enlaces de Telegram en una composición de afiche chicha/editorial.

## Desarrollo

Requiere Node.js compatible con Astro (verificado con Node.js 24) y npm.

```sh
npm install
npm run dev
```

Abre la dirección que muestre Astro en la terminal, normalmente http://localhost:4321.

## Producción y Vercel

```sh
npm run build
npm run preview
```

El adaptador oficial de Vercel genera la salida para funciones y archivos estáticos. Importa este repositorio en Vercel usando la raíz como directorio del proyecto y deja la carpeta de salida en automático. La home y el panel se ejecutan en el servidor para leer y actualizar Cloudinary; robots y sitemap siguen siendo estáticos.

## Panel del cliente

Completa los campos de `.env`, reinicia `npm run dev` y entra en `/admin`. El panel permite crear, editar, ordenar, ocultar y eliminar tarjetas. Pulsa **Importar las 5 tarjetas originales** para migrar el contenido inicial a Cloudinary. Consulta [docs/ADMIN.md](docs/ADMIN.md) para configurar las credenciales y el despliegue.

Ejecuta `npm run test:admin` para comprobar sesiones, permisos de origen, enlaces y operaciones Cloudinary con respuestas simuladas. Las pruebas no suben imágenes ni utilizan credenciales reales. Después de `npm run build`, ejecuta `npm run test:vercel` para comprobar el paquete real de despliegue sin permitir que cargue herramientas nativas de compilación.

## Editar contenido

- `src/data/campaigns.ts`: los cinco enlaces, CTA y fotografías. Las fotos se asignaron por hora ascendente a los enlaces en el orden proporcionado.
- `src/components/CampaignLink.astro`: pieza visual reutilizable; todo el bloque es un enlace accesible.
- `src/pages/index.astro`: logo, cabecera y composición general.
- `src/styles/global.css`: Tailwind, paleta, tipografía y composición responsive.
- `src/layouts/Layout.astro`: HTML y metadatos.
- `src/assets/images/`: imágenes originales y logo proporcionados.

El diseño inicial conserva los cinco enlaces en `100dvh`. Las filas se adaptan al número de tarjetas. Las imágenes remotas se optimizan mediante Cloudinary; las imágenes locales usan Astro. La home no envía JavaScript de aplicación; el panel usa un script para los formularios. Las fuentes Anton y Archivo se cargan desde Google Fonts y tienen alternativas locales.

## Compilador en Windows

En este equipo Windows bloquea el compilador nativo de Astro. Se verificó la compilación con la alternativa WebAssembly oficial. Si reaparece el bloqueo después de reinstalar dependencias:

```sh
npm install --save-dev --force @astrojs/compiler-binding-wasm32-wasi@0.5.1
```

Este comando instala la alternativa aunque npm la marque para la arquitectura `wasm32`. Astro la usa automáticamente cuando no puede cargar el compilador nativo. No es necesario en un entorno que permita el compilador nativo, como el despliegue habitual de Vercel.

[Documentación de Astro](https://docs.astro.build/en/getting-started/) · [Tailwind CSS con Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)
