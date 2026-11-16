import { ArrowUp, MapPin } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { footerConfig, navigation } from '../../config/navigation';
import { site } from '../../content/site';
import { addressLines, directionsUrl, isFilled } from '../../lib/links';
import { Pending } from '../ui/Primitives';
import { useReveal } from '../../hooks/useReveal';
import { Logo } from './Logo';

export function Footer() {
  const address = addressLines();
  const directions = directionsUrl();
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <footer className="site-footer" ref={ref}>
      <div className="container">
        <div className="site-footer__brand" data-reveal>
          <Logo />
          <p className="site-footer__tagline">{site.tagline}</p>
        </div>

        <div className="site-footer__grid">
          <nav aria-label="Rodapé" data-reveal>
            <h2 className="footer-title">{footerConfig.navigationTitle}</h2>
            <ul className="footer-list">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div data-reveal>
            <h2 className="footer-title">{footerConfig.locationTitle}</h2>
            <address className="footer-address">
              <MapPin size={15} strokeWidth={1.5} aria-hidden="true" />
              <span>{address ? address.map((line) => <span key={line}>{line}</span>) : <Pending />}</span>
            </address>
            {directions && (
              <a href={directions} target="_blank" rel="noopener noreferrer" className="link-arrow">
                Como chegar<span className="sr-only"> (abre em nova aba)</span>
              </a>
            )}
          </div>

          <div data-reveal>
            <h2 className="footer-title">{footerConfig.hoursTitle}</h2>
            <dl className="footer-hours">
              {site.hours.map((h) => (
                <div key={h.days}>
                  <dt>{h.days}</dt>
                  <dd>
                    <Pending value={h.time} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {site.name}. {site.legal.rights}
            {isFilled(site.legal.cnpj) && <> · CNPJ {site.legal.cnpj}</>}
          </p>
          <button type="button" className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {footerConfig.backToTopLabel}
            <ArrowUp size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
        <p className="site-footer__mark" aria-hidden="true">
          {site.wordmark.primary}
        </p>
      </div>
    </footer>
  );
}
