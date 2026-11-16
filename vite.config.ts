import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Permite abrir a prévia por um link temporário do Cloudflare (teste no celular)
  preview: {
    port: 4173,
    allowedHosts: ['.trycloudflare.com'],
  },
  build: {
    // O pacote 3D (Three.js + React Three Fiber) é grande, mas só é baixado na Home
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
