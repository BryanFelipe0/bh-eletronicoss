import { ArrowUpRight, Clock, Mail, MapPin, Phone, Wrench } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { PageHero } from '../components/sections/PageHero';
import { InstagramIcon, WhatsAppIcon } from '../components/ui/BrandIcons';
import { Eyebrow, Pending } from '../components/ui/Primitives';
import { Seo } from '../components/ui/Seo';
import { contatoContent as content } from '../content/contato';
import { site } from '../content/site';
import { addressLines, directionsUrl, emailUrl, instagramUrl, mapEmbedUrl, phoneUrl, whatsappUrl } from '../lib/links';
import { useReveal } from '../hooks/useReveal';

function ContactCard({
  code,
  icon,
  label,
  children,
  href,
  actionLabel,
}: {
  code: string;
  icon: ReactNode;
  label: string;
  children: ReactNode;
  href?: string | null;
  actionLabel?: string;
}) {
  return (
    <li className="contact-card" data-reveal>
      <div className="contact-card__head">
        <span className="contact-card__icon" aria-hidden="true">
          {icon}
        </span>
        <span className="mono-caption">{code}</span>
      </div>
      <h2 className="contact-card__label">{label}</h2>
      <div className="contact-card__value">{children}</div>
      {actionLabel &&
        (href ? (
          <a className="link-arrow" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
            {actionLabel}
            <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
            {href.startsWith('http') && <span className="sr-only"> (abre em nova aba)</span>}
          </a>
        ) : (
          <span className="link-arrow is-disabled" aria-disabled="true">
            {actionLabel}
          </span>
        ))}
    </li>
  );
}

export default function Contato() {
  const scope = useRef<HTMLDivElement>(null);
  useReveal(scope);

  const wa = whatsappUrl();
  const ig = instagramUrl();
  const tel = phoneUrl();
  const mail = emailUrl();
  const lines = addressLines();
  const directions = directionsUrl();
  const map = mapEmbedUrl();
  const handle = site.contact.instagram.handle.replace(/^@/, '');

  return (
    <div ref={scope}>
      <Seo seo={content.seo} />
      <PageHero label={content.hero.label} index="C" title={content.hero.title} text={content.hero.text} />

      <section className="section contact" aria-label="Canais de contato">
        <div className="container">
          <ul className="contact__grid">
            <ContactCard code="C.01" icon={<WhatsAppIcon size={22} />} label={content.cards.whatsapp.label} href={wa} actionLabel={content.cards.whatsapp.action}>
              <Pending value={site.contact.whatsapp.display} />
            </ContactCard>

            <ContactCard
              code="C.02"
              icon={<Wrench size={22} strokeWidth={1.25} />}
              label={content.cards.evaluation.label}
              href={whatsappUrl(content.cards.evaluation.message)}
              actionLabel={content.cards.evaluation.action}
            >
              {content.cards.evaluation.value}
            </ContactCard>

            <ContactCard code="C.03" icon={<InstagramIcon size={22} />} label={content.cards.instagram.label} href={ig} actionLabel={content.cards.instagram.action}>
              <Pending value={handle ? `@${handle}` : ''} />
            </ContactCard>

            <ContactCard code="C.04" icon={<MapPin size={22} strokeWidth={1.25} />} label={content.cards.address.label} href={directions} actionLabel={content.cards.address.action}>
              <address>{lines ? lines.map((l) => <span key={l}>{l}</span>) : <Pending />}</address>
            </ContactCard>

            <ContactCard code="C.05" icon={<Clock size={22} strokeWidth={1.25} />} label={content.cards.hours.label}>
              <dl className="hours-list">
                {site.hours.map((h) => (
                  <div key={h.days}>
                    <dt>{h.days}</dt>
                    <dd>
                      <Pending value={h.time} />
                    </dd>
                  </div>
                ))}
              </dl>
            </ContactCard>

            {tel && (
              <ContactCard code="C.06" icon={<Phone size={22} strokeWidth={1.25} />} label={content.cards.phone.label} href={tel} actionLabel={site.contact.phoneDisplay || site.contact.phone}>
                {site.contact.phoneDisplay || site.contact.phone}
              </ContactCard>
            )}
            {mail && (
              <ContactCard code="C.07" icon={<Mail size={22} strokeWidth={1.25} />} label={content.cards.email.label} href={mail} actionLabel={site.contact.email}>
                {site.contact.email}
              </ContactCard>
            )}
          </ul>
        </div>
      </section>

      <section className="section map-section" aria-labelledby="map-title">
        <div className="container">
          <header className="map-section__header" data-reveal>
            <Eyebrow index="L">{content.map.label}</Eyebrow>
            <h2 className="display-lg" id="map-title" data-split>
              {content.map.title}
            </h2>
          </header>
          <div className="map-frame" data-reveal>
            {map ? (
              <iframe
                src={map}
                title={content.map.iframeTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="map-frame__placeholder">
                <span className="map-frame__grid" aria-hidden="true" />
                <span className="map-frame__pin" aria-hidden="true">
                  <MapPin size={28} strokeWidth={1.25} />
                </span>
                <p>{content.map.pendingText}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
