import { useRef } from 'react';
import { PageHero } from '../components/sections/PageHero';
import { Icon } from '../components/ui/Icon';
import { Eyebrow, SectionHeader } from '../components/ui/Primitives';
import { Seo } from '../components/ui/Seo';
import { SmartImage } from '../components/ui/SmartImage';
import { categories, highlights, produtosContent as content } from '../content/produtos';
import { useReveal } from '../hooks/useReveal';

export default function Produtos() {
  const scope = useRef<HTMLDivElement>(null);
  useReveal(scope);

  return (
    <div ref={scope}>
      <Seo seo={content.seo} />
      <PageHero label={content.hero.label} index="P" title={content.hero.title} text={content.hero.text} />

      <nav className="category-index" aria-label={content.indexLabel}>
        <div className="container category-index__inner">
          <span className="mono-caption">{content.indexLabel}</span>
          <ul>
            {categories.map((cat, i) => (
              <li key={cat.id}>
                <a href={`#${cat.id}`}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="showcase">
        {categories.map((cat, i) => (
          <section key={cat.id} id={cat.id} className={`showcase__row ${i % 2 ? 'showcase__row--reverse' : ''}`} aria-labelledby={`${cat.id}-title`}>
            <div className="container showcase__grid">
              <div className="showcase__media" data-reveal>
                <SmartImage image={cat.image} ratio="4 / 5" icon={cat.icon} code={`C.${String(i + 1).padStart(2, '0')}`} priority={i === 0} parallax />
              </div>
              <div className="showcase__content" data-reveal>
                <span className="showcase__number" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Eyebrow>
                  <span className="showcase__icon">
                    <Icon name={cat.icon} size={14} />
                  </span>
                  {cat.summary}
                </Eyebrow>
                <h2 className="display-lg" id={`${cat.id}-title`} data-split>
                  {cat.name}
                </h2>
                <p className="lead">{cat.description}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      {highlights.length > 0 && (
        <section className="section highlights" aria-labelledby="highlights-title">
          <div className="container">
            <SectionHeader label={content.highlightsSection.label} title={content.highlightsSection.title} id="highlights-title" />
            <ul className="highlights__grid">
              {highlights.map((h) => (
                <li key={h.id} className="highlights__item" data-reveal>
                  <SmartImage image={h.image} ratio="1 / 1" />
                  <h3 className="display-sm">{h.title}</h3>
                  <p className="body-muted">{h.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
