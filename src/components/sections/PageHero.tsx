import type { ReactNode } from 'react';
import type { Cta } from '../../content/types';
import { CtaGroup } from '../ui/CtaButton';
import { Eyebrow } from '../ui/Primitives';

interface Props {
  label: string;
  index?: string;
  title: string;
  text?: string;
  ctas?: Cta[];
  aside?: ReactNode;
  variant?: 'default' | 'technical';
}

/** Abertura padrão das páginas internas. */
export function PageHero({ label, index = '00', title, text, ctas, aside, variant = 'default' }: Props) {
  return (
    <section className={`page-hero page-hero--${variant}`}>
      <div className="page-hero__grid-lines" aria-hidden="true" />
      <div className={`container page-hero__inner ${aside ? 'page-hero__inner--aside' : ''}`}>
        <div className="page-hero__copy">
          <div data-reveal>
            <Eyebrow index={index}>{label}</Eyebrow>
          </div>
          <h1 className="display-xl" data-split>
            {title}
          </h1>
          {text && (
            <p className="lead" data-reveal>
              {text}
            </p>
          )}
          {ctas && (
            <div data-reveal>
              <CtaGroup ctas={ctas} />
            </div>
          )}
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </section>
  );
}
