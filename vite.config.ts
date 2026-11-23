import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Site publicado na raiz do domínio próprio (https://bheletronicos.com.br)
  base: '/',
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
          // React separado: senão ele cai dentro do pacote 3D e todas as páginas baixam o 3D
          if (/node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) return 'react-vendor';
          if (id.includes('node_modules/three/') || id.includes('@react-three')) return 'three-vendor';
          if (id.includes('node_modules/gsap')) return 'gsap';
          return undefined;
        },
      },
    },
  },
});

