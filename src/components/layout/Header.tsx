import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { headerConfig, navigation } from '../../config/navigation';
import { CtaButton } from '../ui/CtaButton';
import { Logo } from './Logo';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu ao trocar de página
  useEffect(() => setOpen(false), [pathname]);

  // Bloqueia a rolagem do fundo, fecha com Esc e mantém o foco dentro do menu
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('menu-open');
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>('a, button');
    focusables?.[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab' && focusables && focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          toggleRef.current?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          toggleRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
    <header className={`site-header ${scrolled || open ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <a href="#conteudo" className="skip-link">
        {headerConfig.skipToContentLabel}
      </a>
      <div className="site-header__inner container">
        <Logo />

        <nav className="site-nav" aria-label="Principal">
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className="site-nav__link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          {headerConfig.showWhatsappButton && (
            <CtaButton
              className="site-header__cta"
              cta={{ label: headerConfig.whatsappLabel, action: { type: 'whatsapp', message: headerConfig.whatsappMessage }, variant: 'primary' }}
            />
          )}
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? headerConfig.closeMenuLabel : headerConfig.openMenuLabel}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </header>

      {/* O menu fica FORA do <header>: o desfoque (backdrop-filter) do cabeçalho
          prenderia um elemento "fixed" dentro dele e o menu ficaria sem altura. */}
      <div id="menu-mobile" ref={panelRef} className="mobile-menu" hidden={!open}>
        <nav aria-label="Menu mobile">
          <ol>
            {navigation.map((item, i) => (
              <li key={item.to} style={{ ['--i' as string]: i }}>
                <NavLink to={item.to} end={item.to === '/'} className="mobile-menu__link">
                  <span className="mobile-menu__index">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>
        {headerConfig.showWhatsappButton && (
          <CtaButton
            className="mobile-menu__cta"
            cta={{ label: headerConfig.whatsappLabel, action: { type: 'whatsapp', message: headerConfig.whatsappMessage }, variant: 'primary' }}
          />
        )}
      </div>
    </>
  );
}
