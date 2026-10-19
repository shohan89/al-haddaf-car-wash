import { MetadataRoute } from 'next';
import prisma from '@/lib/db';
import { getSiteSettings } from '@/actions/settings-actions';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const baseUrl = settings.seo.canonicalUrl || 'https://alhaddafcarwash.com';

  // Static routes
  const staticRoutes = [
    '',
    '/services',
    '/areas',
    '/blogs',
    '/book',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Service routes
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });
  const serviceRoutes = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic Area routes
  const areas = await prisma.area.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });
  const areaRoutes = areas.map((a) => ({
    url: `${baseUrl}/areas/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic Blog routes
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });
  const blogRoutes = posts.map((p) => ({
    url: `${baseUrl}/blogs/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes, ...blogRoutes];
}
