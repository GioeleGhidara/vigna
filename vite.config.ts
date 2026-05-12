import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Aggiorna l'app automaticamente quando cambi codice
      includeAssets: ['favicon.svg', 'icons.svg', 'hero.png'], // Risorse da mettere in cache subito
      manifest: {
        name: 'Vigna Fojachini',
        short_name: 'Fojachini',
        description: 'Gemello Digitale del Vigneto',
        theme_color: '#fcfaf7',
        background_color: '#fcfaf7',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        // Questa sezione dice all'app di salvare tutto il codice JS e CSS in cache
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // Cache per i font di Google (se usati) o icone esterne
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
