import { generatePageMetadata } from '@/lib/seo'
import { SchemaMarkup } from '@/components/shared/schema-markup'
import { HomePageClient } from '@/components/sections/home-main/home-page-client'
import { getPageSeo } from '@/actions/seo-actions'

export const generateMetadata = () => generatePageMetadata('page:home')

export default async function Home() {
  const pageSeo = await getPageSeo('page:home')
  return (
    <>
      <SchemaMarkup json={pageSeo?.schemaMarkup} />
      <HomePageClient />
    </>
  )
}
