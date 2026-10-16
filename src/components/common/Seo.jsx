import { useEffect } from 'react';
import { company, organizationSchema } from '../../config/company.js';
import { PAGE_SEO, site } from '../../config/site.js';

/**
 * Per-route document metadata.
 *
 * Implemented as a small imperative effect rather than react-helmet to avoid
 * pulling another dependency into the bundle for ~30 lines of DOM work.
 *
 * Only verified facts reach the metadata. phone/email/address stay out of
 * JSON-LD until confirmed in config/company.js — see organizationSchema().
 */
export function Seo({
  path = '/',
  noIndex = false,
  structuredData = null,
  title: titleOverride,
  description: descriptionOverride,
}) {
  useEffect(() => {
    const meta = PAGE_SEO[path];
    const title = titleOverride ?? meta?.title ?? `${company.name} — ${company.tagline}`;
    const description = descriptionOverride ?? meta?.description ?? '';
    const canonical = `${site.url}${meta?.path ?? path}`;
    const ogImage = `${site.url}${company.seo.defaultOgImage}`;

    document.title = title;

    setMeta('name', 'description', description);
    setLink('canonical', canonical);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:site_name', company.name);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Structured data — organisation by default, overridable per route.
    const id = 'vnr-structured-data';
    document.getElementById(id)?.remove();

    if (structuredData || !noIndex) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(
        structuredData
          ? { '@context': 'https://schema.org', ...structuredData }
          : organizationSchema(),
      );
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(id)?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptionOverride, noIndex, path, titleOverride]);

  return null;
}

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default Seo;