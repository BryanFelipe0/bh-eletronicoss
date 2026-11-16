import { Suspense, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { pageTransitionConfig } from '../../config/animation-ui';
import { ScrollTrigger } from '../../lib/gsap';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { Footer } from './Footer';
import { Header } from './Header';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;
    // Aguarda a página (carregada sob demanda) montar antes de rolar até a âncora
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      tries += 1;
      if (el || tries > 20) {
        window.clearInterval(timer);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}

function PageFallback() {
  return (
    <div className="page-fallback" role="status" aria-live="polite">
      <span className="page-fallback__bar" />
      <span className="sr-only">Carregando página</span>
    </div>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollManager />
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Suspense fallback={<PageFallback />}>
          {/* A troca de chave reinicia a transição suave a cada página */}
          <div key={pathname} className="page-enter" style={{ ['--page-duration' as string]: `${pageTransitionConfig.duration}s` }}>
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
