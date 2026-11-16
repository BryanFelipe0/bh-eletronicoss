import type { ReactNode } from 'react';
import { site } from '../../content/site';
import { isFilled } from '../../lib/links';

/** Etiqueta técnica em fonte mono: "01 — Produtos" */
export function Eyebrow({ index, children, className = '' }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`.trim()}>
      {index && <span className="eyebrow__index">{index}</span>}
      <span>{children}</span>
    </p>
  );
}

interface SectionHeaderProps {
  label: string;
  index?: string;
  title: string;
  text?: string;
  as?: 'h1' | 'h2';
  align?: 'left' | 'split';
  id?: string;
}

export function SectionHeader({ label, index, title, text, as: Heading = 'h2', align = 'left', id }: SectionHeaderProps) {
  return (
    <header className={`section-header section-header--${align}`} data-reveal>
      <div>
        <Eyebrow index={index}>{label}</Eyebrow>
        <Heading className={Heading === 'h1' ? 'display-xl' : 'display-lg'} id={id} data-split>
          {title}
        </Heading>
      </div>
      {text && <p className="lead">{text}</p>}
    </header>
  );
}

/** Mostra o valor, ou "A definir" com estilo de pendência se estiver vazio. */
export function Pending({ value, fallback = site.pendingLabel }: { value?: string | null; fallback?: string }) {
  if (isFilled(value)) return <>{value}</>;
  return <span className="pending">{fallback}</span>;
}

/** Selo discreto para conteúdo provisório */
export function DraftBadge() {
  return <span className="draft-badge">Conteúdo provisório</span>;
}
