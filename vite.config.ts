
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import ViteSitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteSitemap({
      hostname: 'https://www.consudes.com',
      dynamicRoutes: [
        '/',
        '/galeria',
        '/noticias',
        '/federacoes',
        '/esportes',
        '/calendario',
        '/interclubes',
        '/contato',
        '/historia',
        '/missao',
        '/valores',
        '/equipe',
        '/ex-presidentes',
        '/relatorios',
      ].filter((route, idx, arr) => arr.indexOf(route) === idx),
      exclude: ['/admin/login'],
      priority: {
        '/': 1.0,
        '/galeria': 0.9,
        '/noticias': 0.9,
        '/calendario': 0.9,
        '/federacoes': 0.9,
        '/esportes': 0.8,
        '/interclubes': 0.8,
        '/contato': 0.8,
        '/historia': 0.8,
        '/missao': 0.8,
        '/valores': 0.8,
        '/equipe': 0.8,
        '/ex-presidentes': 0.8,
        '/relatorios': 0.8,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase'
          }
        },
      },
    },
  },
})
