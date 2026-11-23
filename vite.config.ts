import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Páginas internas do site. No GitHub Pages, /produtos é entregue a partir de
 * produtos.html com "200 OK" (o Google indexa). Ao criar uma página nova,
 * adicione o caminho aqui.
 */
const ROTAS = ['produtos', 'assistencia', 'sobre', 'contato'];

function paginasEstaticas(): Plugin {
  return {
    name: 'bh-paginas-estaticas',
    apply: 'build',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist');
      const index = resolve(dist, 'index.html');
      if (!existsSync(index)) return;
      for (const rota of ROTAS) copyFileSync(index, resolve(dist, `${rota}.html`));
      copyFileSync(index, resolve(dist, '404.html'));
    },
  };
}

export default defineConfig({
  plugins: [react(), paginasEstaticas()],
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

