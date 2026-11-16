import { useLocation } from 'react-router-dom';
import type { Seo as SeoData } from '../../content/types';
import { site } from '../../content/site';
import { safeUrl } from '../../lib/links';

/**
 * Título e meta tags de cada página. O React 19 move estas tags para o <head>.
 * Os textos vêm do campo `seo` de cada arquivo em src/content/.
 */
export function Seo({ seo }: { seo: SeoData }) {
  const { pathname } = useLocation();
  const base = safeUrl(site.url);
  const canonical = base ? new URL(pathname, base).toString() : null;
  const image = base && site.shareImage ? new URL(site.shareImage, base).toString() : null;

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </>
  );
}
