/**
 * Predefined static pages managed by the SEO engine
 */
export const STATIC_PAGES = [
  { key: 'page:home', label: 'Homepage', path: '/' },
  { key: 'page:services', label: 'Services Directory', path: '/services' },
  { key: 'page:areas', label: 'Service Areas', path: '/areas' },
  { key: 'page:blog', label: 'Blog / News', path: '/blogs' },
  { key: 'page:book', label: 'Book a Service', path: '/book' },
  { key: 'page:privacy', label: 'Privacy Policy', path: '/privacy' },
  { key: 'page:terms', label: 'Terms of Service', path: '/terms' },
];

export type PageSeoData = {
  id?: string;
  pageKey: string;
  pageLabel: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  focusKeyword?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogType?: string | null;
  twitterCard?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  noIndex?: boolean | null;
  noFollow?: boolean | null;
  schemaMarkup?: string | null;
};

/**
 * Schema markup templates for common types.
 * These are safe to use in both Client and Server components.
 */
export const SCHEMA_TEMPLATES = {
  LocalBusiness: (name: string, phone: string, address: string, url: string) => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    telephone: phone,
    address: { '@type': 'PostalAddress', addressLocality: address },
    url,
    priceRange: '$$',
    openingHours: 'Mo-Sa 08:00-22:00',
  }, null, 2),

  Service: (name: string, description: string, price: string, url: string) => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    offers: { '@type': 'Offer', price, priceCurrency: 'AED' },
    url,
  }, null, 2),

  FAQPage: (faqs: { question: string; answer: string }[]) => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }, null, 2),

  Article: (headline: string, description: string, author: string, datePublished: string, image: string) => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: { '@type': 'Person', name: author },
    datePublished,
    image,
  }, null, 2),

  BreadcrumbList: (items: { name: string; url: string }[]) => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }, null, 2),
};
