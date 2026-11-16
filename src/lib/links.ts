/**
 * Geração e validação de links a partir de src/content/site.ts.
 * Nenhum link externo é criado se o dado correspondente estiver vazio.
 */
import { site } from '../content/site';

const ALLOWED_PROTOCOLS = ['https:', 'mailto:', 'tel:'];

/** Retorna a URL somente se for segura (https, mailto ou tel). */
export function safeUrl(value: string | undefined | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function isFilled(value: string | undefined | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

const digits = (value: string) => value.replace(/\D/g, '');

export function whatsappUrl(message?: string): string | null {
  const number = digits(site.contact.whatsapp.number);
  if (number.length < 10) return null;
  const text = message ?? site.contact.whatsapp.defaultMessage;
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function instagramUrl(): string | null {
  const handle = site.contact.instagram.handle.replace(/^@/, '').trim();
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null;
  return `https://www.instagram.com/${handle}/`;
}

export function phoneUrl(): string | null {
  const number = digits(site.contact.phone);
  return number.length >= 10 ? `tel:+55${number.replace(/^55/, '')}` : null;
}

export function emailUrl(): string | null {
  const email = site.contact.email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : null;
}

/** Endereço completo em uma linha, ou null se não houver rua e cidade. */
export function fullAddress(): string | null {
  const a = site.address;
  if (!isFilled(a.street) || !isFilled(a.city)) return null;
  const line1 = [a.street, a.number].filter(isFilled).join(', ');
  const parts = [line1, a.complement, a.district, [a.city, a.state].filter(isFilled).join(' - '), a.zip];
  return parts.filter(isFilled).join(' · ');
}

export function addressLines(): string[] | null {
  const a = site.address;
  if (!isFilled(a.street) || !isFilled(a.city)) return null;
  return [
    [[a.street, a.number].filter(isFilled).join(', '), a.complement].filter(isFilled).join(' — '),
    [a.district, [a.city, a.state].filter(isFilled).join(' - ')].filter(isFilled).join(', '),
    a.zip ? `CEP ${a.zip}` : '',
  ].filter(isFilled);
}

function validCoordinates(): { lat: number; lng: number } | null {
  const c = site.address.coordinates;
  if (!c || !Number.isFinite(c.lat) || !Number.isFinite(c.lng)) return null;
  if (Math.abs(c.lat) > 90 || Math.abs(c.lng) > 180) return null;
  return c;
}

/** Rota no Google Maps: usa o ponto exato da loja; sem ele, usa o endereço escrito. */
export function directionsUrl(): string | null {
  const c = validCoordinates();
  if (c) return `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;
  const address = fullAddress();
  if (!address) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${site.name}, ${address.replace(/ · /g, ', ')}`)}`;
}

/** Mapa incorporado: link próprio de site.ts ou, se vazio, gerado a partir do ponto da loja. */
export function mapEmbedUrl(): string | null {
  const url = safeUrl(site.address.mapEmbedUrl);
  if (url && url.startsWith('https://www.google.com/maps/embed')) return url;
  const c = validCoordinates();
  if (c) return `https://maps.google.com/maps?q=${c.lat},${c.lng}&z=17&hl=pt-BR&output=embed`;
  return null;
}

/** Em desenvolvimento, avisa no console quais dados ainda faltam. */
export function reportMissingData(): void {
  if (!import.meta.env.DEV) return;
  const missing: string[] = [];
  if (!whatsappUrl()) missing.push('contact.whatsapp.number');
  if (!instagramUrl()) missing.push('contact.instagram.handle');
  if (!fullAddress()) missing.push('address');
  if (site.hours.some((h) => !isFilled(h.time))) missing.push('hours');
  if (missing.length) {
    console.info(`[BH Eletrônicos] Dados provisórios em src/content/site.ts: ${missing.join(', ')}`);
  }
}
