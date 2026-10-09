import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.peruanoqueserespeta.com',
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    build: {
      rolldownOptions: {
        treeshake: {
          // The Vercel runtime imports adapter constants from its build module.
          // Drop unused build tools so functions do not load native compilers.
          moduleSideEffects: (id) => !['rolldown', '@vercel/routing-utils'].includes(id),
        },
      },
    },
  },
});
