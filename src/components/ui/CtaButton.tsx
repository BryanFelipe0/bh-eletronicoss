import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Cta } from '../../content/types';
import { directionsUrl, safeUrl, whatsappUrl } from '../../lib/links';
import { WhatsAppIcon } from './BrandIcons';

interface Props {
  cta: Cta;
  className?: string;
  /** Usado quando o botão está dentro de uma cena oculta (não focável) */
  tabIndex?: number;
}

/**
 * Botão universal do site. Recebe um objeto `Cta` dos arquivos de conteúdo
 * e decide sozinho se é link interno, WhatsApp, link externo ou rota no mapa.
 *
 * Se o dado necessário (ex.: número de WhatsApp) ainda não existir em
 * site.ts, o botão leva para a página de Contato em vez de criar um link falso.
 */
export function CtaButton({ cta, className = '', tabIndex }: Props) {
  const variant = cta.variant ?? 'primary';
  const cls = `btn btn--${variant} ${className}`.trim();
  const { action } = cta;

  if (action.type === 'route') {
    return (
      <Link to={action.to} className={cls} tabIndex={tabIndex}>
        <span>{cta.label}</span>
        {variant === 'ghost' && <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />}
      </Link>
    );
  }

  let href: string | null = null;
  let icon = <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />;
  if (action.type === 'whatsapp') {
    href = whatsappUrl(action.message);
    icon = <WhatsAppIcon size={16} />;
  } else if (action.type === 'directions') {
    href = directionsUrl();
    icon = <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />;
  } else if (action.type === 'external') {
    href = safeUrl(action.href);
  }

  if (!href) {
    // Dado ainda não configurado: direciona para a página de contato.
    return (
      <Link to="/contato" className={cls} tabIndex={tabIndex} data-pending="true">
        {action.type === 'whatsapp' && icon}
        <span>{cta.label}</span>
      </Link>
    );
  }

  return (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer" tabIndex={tabIndex}>
      {action.type !== 'external' && icon}
      <span>{cta.label}</span>
      {action.type === 'external' && icon}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

export function CtaGroup({ ctas, className = '', tabIndex }: { ctas: Cta[]; className?: string; tabIndex?: number }) {
  return (
    <div className={`cta-group ${className}`.trim()}>
      {ctas.map((cta) => (
        <CtaButton key={cta.label} cta={cta} tabIndex={tabIndex} />
      ))}
    </div>
  );
}
