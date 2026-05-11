import { useEffect } from 'react';

const SITE_NAME = 'CONSUDES';
const BASE_URL  = 'https://consudes.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export interface SEOProps {
  title?: string;        // página — será exibido como "Título | CONSUDES"
  description?: string;
  image?: string;        // URL absoluta
  url?: string;          // pathname ou URL completa
  type?: 'website' | 'article';
  noIndex?: boolean;
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
}: SEOProps = {}) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonical = url
      ? url.startsWith('http') ? url : `${BASE_URL}${url}`
      : BASE_URL;

    // Title
    document.title = pageTitle;

    // Basic
    if (description) setMeta('description', description);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Canonical
    setLink('canonical', canonical);

    // Open Graph
    setMeta('og:type',        type,        'property');
    setMeta('og:site_name',   SITE_NAME,   'property');
    setMeta('og:title',       pageTitle,   'property');
    if (description) setMeta('og:description', description, 'property');
    setMeta('og:image',       image,       'property');
    setMeta('og:image:width', '1200',      'property');
    setMeta('og:image:height','630',       'property');
    setMeta('og:url',         canonical,   'property');

    // Twitter
    setMeta('twitter:card',        'summary_large_image');
    setMeta('twitter:title',       pageTitle);
    if (description) setMeta('twitter:description', description);
    setMeta('twitter:image',       image);
  }, [title, description, image, url, type, noIndex]);
}
