import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://djexcept4.de',
  base: '',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({
      input: './src/styles/global.css',
      applyBaseStyles: false,
    }),
  ],
  build: {
    format: 'directory',
    sitemap: {
      exclude: ['/admin/**'],
    },
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
