import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/bh-eletronicoss/',
  // Permite abrir a prÃ©via por um link temporÃ¡rio do Cloudflare (teste no celular)
  preview: {
    port: 4173,
    allowedHosts: ['.trycloudflare.com'],
  },
  build: {
    // O pacote 3D (Three.js + React Three Fiber) Ã© grande, mas sÃ³ Ã© baixado na Home
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three/') || id.includes('@react-three')) return 'three-vendor';
          if (id.includes('node_modules/gsap')) return 'gsap';
          return undefined;
        },
      },
    },
  },
});

