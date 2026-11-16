import { Plus } from 'lucide-react';
import { useRef } from 'react';
import { PageHero } from '../components/sections/PageHero';
import { BeforeAfter } from '../components/ui/BeforeAfter';
import { Icon } from '../components/ui/Icon';
import { Eyebrow, SectionHeader } from '../components/ui/Primitives';
import { Seo } from '../components/ui/Seo';
import { SmartImage } from '../components/ui/SmartImage';
import { assistenciaContent as content, faqs, processSteps, services } from '../content/assistencia';
import { useReveal } from '../hooks/useReveal';

export default function Assistencia() {
  const scope = useRef<HTMLDivElement>(null);
  useReveal(scope);

  return (
    <div ref={scope}>
      <Seo seo={content.seo} />
      <PageHero
        variant="technical"
        label={content.hero.label}
        index="A"
        title={content.hero.title}
        text={content.hero.text}
        ctas={content.hero.ctas}
        aside={<SmartImage image={content.hero.image} ratio="4 / 5" icon="wrench" code="A.00" priority />}
      />

      <section className="section" aria-labelledby="assist-intro">
        <div className="container assist-intro">
          <div data-reveal>
            <Eyebrow index="01">{content.intro.label}</Eyebrow>
            <h2 className="display-lg" id="assist-intro" data-split>
              {content.intro.title}
            </h2>
            <p className="lead">{content.intro.text}</p>
          </div>
          <div data-reveal>
            <SmartImage image={content.intro.image} ratio="4 / 3" icon="wrench" parallax />
          </div>
        </div>
      </section>

      <section className="section before-after-section" aria-labelledby="before-after-title">
        <div className="container before-after-section__grid">
          <div className="before-after-section__copy">
            <SectionHeader
              label={content.beforeAfter.label}
              index="02"
              title={content.beforeAfter.title}
              text={content.beforeAfter.text}
              id="before-after-title"
            />
          </div>
          <div data-reveal>
            <BeforeAfter
              before={content.beforeAfter.before}
              after={content.beforeAfter.after}
              beforeLabel={content.beforeAfter.beforeLabel}
              afterLabel={content.beforeAfter.afterLabel}
              hint={content.beforeAfter.hint}
              ratio={content.beforeAfter.ratio}
            />
          </div>
        </div>
      </section>

      <section className="section services" aria-labelledby="services-title">
        <div className="container">
          <SectionHeader label={content.servicesSection.label} index="03" title={content.servicesSection.title} id="services-title" />
          <ul className="services__grid">
            {services.map((s, i) => (
              <li key={s.id} className="service-card" data-reveal>
                <span className="service-card__code">S.{String(i + 1).padStart(2, '0')}</span>
                <span className="service-card__icon" aria-hidden="true">
                  <Icon name={s.icon} size={26} strokeWidth={1.25} />
                </span>
                <h3 className="display-sm">{s.title}</h3>
                <p className="body-muted">{s.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section process" id={content.processSection.id} aria-labelledby="process-title">
        <div className="container">
          <SectionHeader label={content.processSection.label} index="04" title={content.processSection.title} id="process-title" />
          <ol className="process__list">
            {processSteps.map((step, i) => (
              <li key={step.title} className="process__step" data-reveal>
                <span className="process__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="process__line" aria-hidden="true" data-draw />
                <h3 className="display-sm">{step.title}</h3>
                <p className="body-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section faq" aria-labelledby="faq-title">
        <div className="container faq__grid">
          <SectionHeader label={content.faqSection.label} index="05" title={content.faqSection.title} id="faq-title" />
          <div className="faq__list" data-reveal>
            {faqs.map((f) => (
              <details key={f.question} className="faq__item">
                <summary>
                  <span>{f.question}</span>
                  <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
                </summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
