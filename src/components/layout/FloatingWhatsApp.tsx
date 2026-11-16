import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { floatingWhatsapp } from '../../config/navigation';
import { whatsappUrl } from '../../lib/links';
import { WhatsAppIcon } from '../ui/BrandIcons';

/**
 * Botão flutuante do WhatsApp. Configuração em src/config/navigation.ts.
 * Na Home ele só aparece depois que o visitante começa a rolar, para não
 * cobrir os botões da primeira tela.
 */
export function FloatingWhatsApp() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [visible, setVisible] = useState(!isHome);
  const href = whatsappUrl(floatingWhatsapp.message);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * floatingWhatsapp.homeRevealAfter);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const allowedHere = floatingWhatsapp.pages === 'all' || floatingWhatsapp.pages.includes(pathname);
  if (!floatingWhatsapp.enabled || !href || !allowedHere) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-float ${visible ? 'is-visible' : ''}`}
      aria-label={`${floatingWhatsapp.label} pelo WhatsApp (abre em nova aba)`}
      tabIndex={visible ? 0 : -1}
    >
      <span className="wa-float__label" aria-hidden="true">
        {floatingWhatsapp.label}
      </span>
      <span className="wa-float__icon" aria-hidden="true">
        <WhatsAppIcon size={28} />
      </span>
    </a>
  );
}
