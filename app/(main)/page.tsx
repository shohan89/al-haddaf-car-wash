import { generatePageMetadata } from '@/lib/seo'
import { SchemaMarkup } from '@/components/shared/schema-markup'
import { HomePageClient } from '@/components/sections/home-main/home-page-client'
import { getPageSeo } from '@/actions/seo-actions'
import prisma from '@/lib/db'

export const generateMetadata = () => generatePageMetadata('page:home')

export default async function Home() {
  const [pageSeo, services] = await Promise.all([
    getPageSeo('page:home'),
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        isPopular: true,
        isBundle: true,
      },
    }),
  ])
  return (
    <>
      <SchemaMarkup json={pageSeo?.schemaMarkup} />
      <HomePageClient services={services} />
    </>
  )
}
