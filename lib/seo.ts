import type { Metadata } from 'next';
import prisma from '@/lib/db';
import { getSiteSettings } from '@/actions/settings-actions';
import { SITE_SETTINGS_DEFAULTS } from '@/data/site-settings-defaults';

/**
 * Generates Next.js Metadata for any page by looking up PageSeo in the DB.
 * Falls back to site-level SEO defaults if no custom entry exists.
 * Usage in any page: export const generateMetadata = () => generatePageMetadata('page:home')
 */
export async function generatePageMetadata(pageKey: string, overrides?: {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
}): Promise<Metadata> {
  let pageSeo = null;
  let siteSettings = SITE_SETTINGS_DEFAULTS;
  try {
    [pageSeo, siteSettings] = await Promise.all([
      prisma.pageSeo.findUnique({ where: { pageKey } }),
      getSiteSettings(),
    ]);
  } catch {
    // fall through to defaults
  }

  const defaults = siteSettings.seo;
  const baseUrl = defaults.canonicalUrl || 'https://alhaddafcarwash.ae';

  const title = overrides?.title || pageSeo?.metaTitle || defaults.defaultTitle;
  const description = overrides?.description || pageSeo?.metaDescription || defaults.defaultDescription;
  const image = overrides?.image || pageSeo?.ogImage || defaults.ogImage;
  const canonical = overrides?.canonicalUrl || pageSeo?.canonicalUrl;

  const robots: Metadata['robots'] = {
    index: !(pageSeo?.noIndex ?? false),
    follow: !(pageSeo?.noFollow ?? false),
  };

  return {
    title,
    description,
    keywords: pageSeo?.focusKeyword ? [pageSeo.focusKeyword, ...(defaults.keywords?.split(',').map(k => k.trim()) || [])] : defaults.keywords,
    robots,
    ...(canonical && { alternates: { canonical } }),
    openGraph: {
      type: (pageSeo?.ogType as any) || 'website',
      title: pageSeo?.ogTitle || title,
      description: pageSeo?.ogDescription || description,
      images: image ? [{ url: image.startsWith('http') ? image : `${baseUrl}${image}` }] : [],
      siteName: siteSettings.general.companyName,
    },
    twitter: {
      card: (pageSeo?.twitterCard as any) || 'summary_large_image',
      title: pageSeo?.twitterTitle || pageSeo?.ogTitle || title,
      description: pageSeo?.twitterDescription || pageSeo?.ogDescription || description,
      images: pageSeo?.twitterImage || image ? [pageSeo?.twitterImage || image!] : [],
    },
  };
}

/**
 * Builds Next.js Metadata from entity fields (Service, Area, Post).
 * These already have metaTitle/metaDescription on their models.
 */
export async function generateEntityMetadata(entity: {
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  schemaMarkup?: string | null;
  image?: string | null;
  title?: string;
  shortDescription?: string;
  excerpt?: string;
  slug?: string;
}, type: 'service' | 'area' | 'post' = 'service'): Promise<Metadata> {
  let siteSettings = SITE_SETTINGS_DEFAULTS;
  try {
    siteSettings = await getSiteSettings();
  } catch {
    // fall through to defaults
  }
  const defaults = siteSettings.seo;
  const baseUrl = defaults.canonicalUrl || 'https://alhaddafcarwash.ae';

  const title = entity.metaTitle || entity.title || defaults.defaultTitle;
  const description = entity.metaDescription || entity.shortDescription || entity.excerpt || defaults.defaultDescription;
  const image = entity.image;

  const ogTypeMap = { service: 'website', area: 'website', post: 'article' } as const;

  return {
    title,
    description,
    keywords: entity.focusKeyword ? [entity.focusKeyword] : undefined,
    openGraph: {
      type: ogTypeMap[type],
      title,
      description,
      images: image ? [{ url: image.startsWith('http') ? image : `${baseUrl}${image}` }] : [],
      siteName: siteSettings.general.companyName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

import { SCHEMA_TEMPLATES } from './seo-constants';

export { SCHEMA_TEMPLATES };

