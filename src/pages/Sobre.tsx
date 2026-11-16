import { useRef } from 'react';
import { FinalCta } from '../components/sections/HomeSections';
import { PageHero } from '../components/sections/PageHero';
import { Eyebrow, SectionHeader } from '../components/ui/Primitives';
import { Seo } from '../components/ui/Seo';
import { sobreContent as content } from '../content/sobre';
import { useReveal } from '../hooks/useReveal';

export default function Sobre() {
  const scope = useRef<HTMLDivElement>(null);
  useReveal(scope);

  return (
    <div ref={scope}>
      <Seo seo={content.seo} />
      <PageHero label={content.hero.label} index="S" title={content.hero.title} text={content.hero.text} />

      <section className="section" aria-labelledby="service-title">
        <div className="container intro-section__grid">
          <div data-reveal>
            <Eyebrow index="01">{content.service.label}</Eyebrow>
          </div>
          <div data-reveal>
            <h2 className="display-lg" id="service-title" data-split>
              {content.service.title}
            </h2>
            <p className="lead">{content.service.text}</p>
          </div>
        </div>
      </section>

      <section className="section differentials" aria-labelledby="diff-title">
        <div className="container">
          <SectionHeader label={content.differentials.label} index="02" title={content.differentials.title} id="diff-title" />
          <ol className="differentials__list">
            {content.differentials.items.map((d, i) => (
              <li key={d.title} data-reveal>
                <span className="differentials__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="display-sm">{d.title}</h3>
                <p className="body-muted">{d.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCta title={content.cta.title} ctas={content.cta.ctas} />
    </div>
  );
}
