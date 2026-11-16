import { homeContent } from '../../content/home';
import { site } from '../../content/site';
import { addressLines } from '../../lib/links';
import { CtaButton, CtaGroup } from '../ui/CtaButton';
import { Icon } from '../ui/Icon';
import { Eyebrow, Pending } from '../ui/Primitives';
import { SmartImage } from '../ui/SmartImage';

export function IntroSection() {
  const { intro } = homeContent;
  return (
    <section className="section intro-section" aria-labelledby="intro-title">
      <div className="container intro-section__grid">
        <div data-reveal>
          <Eyebrow index="06">{intro.label}</Eyebrow>
        </div>
        <div>
          <h2 className="display-lg" id="intro-title" data-split>
            {intro.title}
          </h2>
          <div className="intro-section__text" data-reveal>
            {intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <CtaButton cta={intro.cta} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AssistanceBand() {
  const { assistance } = homeContent;
  return (
    <section className="section assistance-band" aria-labelledby="assist-title">
      <div className="assistance-band__lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="container assistance-band__inner">
        <div className="assistance-band__icon" data-reveal aria-hidden="true">
          <Icon name="wrench" size={28} strokeWidth={1.25} />
        </div>
        <div data-reveal>
          <Eyebrow index="07">{assistance.label}</Eyebrow>
          <h2 className="display-lg" id="assist-title" data-split>
            {assistance.title}
          </h2>
        </div>
        <div className="assistance-band__body" data-reveal>
          <p className="lead">{assistance.text}</p>
          <CtaGroup ctas={assistance.ctas} />
        </div>
      </div>
    </section>
  );
}

export function StoreBlock() {
  const { store } = homeContent;
  const lines = addressLines();
  return (
    <section className="section store-block" aria-labelledby="store-title">
      <div className="container store-block__grid">
        <div className="store-block__media" data-reveal>
          <SmartImage image={store.image} ratio="5 / 4" icon="store" code="L.01" parallax />
        </div>
        <div className="store-block__content">
          <div data-reveal>
            <Eyebrow index="08">{store.label}</Eyebrow>
            <h2 className="display-lg" id="store-title" data-split>
              {store.title}
            </h2>
            <p className="lead">{store.text}</p>
          </div>
          <dl className="info-list" data-reveal>
            <div>
              <dt>{store.addressLabel}</dt>
              <dd>{lines ? lines.map((l) => <span key={l}>{l}</span>) : <Pending />}</dd>
            </div>
            <div>
              <dt>{store.hoursLabel}</dt>
              <dd>
                {site.hours.map((h) => (
                  <span key={h.days} className="info-list__row">
                    <span>{h.days}</span>
                    <Pending value={h.time} />
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <div data-reveal>
            <CtaGroup ctas={store.ctas} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta({
  label,
  title,
  text,
  ctas,
}: {
  label?: string;
  title: string;
  text?: string;
  ctas: Parameters<typeof CtaGroup>[0]['ctas'];
}) {
  return (
    <section className="section final-cta" aria-labelledby="final-cta-title">
      <div className="container final-cta__inner" data-reveal>
        {label && <Eyebrow>{label}</Eyebrow>}
        <h2 className="display-xl" id="final-cta-title" data-split>
          {title}
        </h2>
        {text && <p className="lead">{text}</p>}
        <CtaGroup ctas={ctas} />
      </div>
    </section>
  );
}
