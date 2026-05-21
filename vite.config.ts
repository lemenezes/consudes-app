
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
        '/admin/login',
      ],
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
