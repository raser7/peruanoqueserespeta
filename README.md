# Peruano que se respeta

Microsite one-page en Astro 7, TypeScript y Tailwind CSS 4, ubicada en la raíz del repositorio. Cuatro enlaces de Telegram en una composición de afiche chicha/editorial.

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

La salida estática se genera en `dist/`. `vercel.json` configura Astro, el comando de compilación y la carpeta de salida. Importa este repositorio en Vercel usando la raíz del repositorio como directorio del proyecto. No requiere variables de entorno ni adaptador de servidor.

## Editar contenido

- `src/data/campaigns.ts`: los cuatro enlaces, CTA y fotografías. Las fotos se asignaron por hora ascendente a los enlaces en el orden proporcionado.
- `src/components/CampaignLink.astro`: pieza visual reutilizable; todo el bloque es un enlace accesible.
- `src/pages/index.astro`: logo, cabecera y composición general.
- `src/styles/global.css`: Tailwind, paleta, tipografía y composición responsive.
- `src/layouts/Layout.astro`: HTML y metadatos.
- `src/assets/images/`: imágenes originales y logo proporcionados.

Desktop (desde 1024px) ocupa `100dvh` con dos filas asimétricas. Tablet y móvil muestran los cuatro enlaces dentro del viewport, con imágenes pequeñas al lado del texto. En móvil horizontal se usan dos filas de dos enlaces. Las imágenes se optimizan a WebP con tamaños responsive durante la compilación. No se envía JavaScript de aplicación al navegador. Las fuentes Anton y Archivo se cargan desde Google Fonts y tienen alternativas locales.

## Compilador en Windows

En este equipo Windows bloquea el compilador nativo de Astro. Se verificó la compilación con la alternativa WebAssembly oficial. Si reaparece el bloqueo después de reinstalar dependencias:

```sh
npm install --save-dev --force @astrojs/compiler-binding-wasm32-wasi@0.5.1
```

Este comando instala la alternativa aunque npm la marque para la arquitectura `wasm32`. Astro la usa automáticamente cuando no puede cargar el compilador nativo. No es necesario en un entorno que permita el compilador nativo, como el despliegue habitual de Vercel.

[Documentación de Astro](https://docs.astro.build/en/getting-started/) · [Tailwind CSS con Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)
