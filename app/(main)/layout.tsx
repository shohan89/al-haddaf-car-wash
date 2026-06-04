export const dynamic = 'force-dynamic'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'
import { GlobalBookingProvider } from '@/components/sections/home-main/global-booking-provider'
import prisma from '@/lib/db'
import { getSiteSettings } from '@/actions/settings-actions'
import { SITE_SETTINGS_DEFAULTS } from '@/data/site-settings-defaults'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let services: { title: string; slug: string }[] = []
  let areas: { title: string; slug: string }[] = []
  let settings = SITE_SETTINGS_DEFAULTS

  try {
    ;[services, areas, settings] = await Promise.all([
      prisma.service.findMany({
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        select: { title: true, slug: true },
      }),
      prisma.area.findMany({
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        select: { title: true, slug: true },
      }),
      getSiteSettings(),
    ])
  } catch {
    // fall back to empty nav and defaults — page still renders
  }

  const whatsappHref = `https://wa.me/${settings.general.whatsapp}`

  return (
    <GlobalBookingProvider>
      <div className="relative flex min-h-screen flex-col">
        <Navbar dbServices={services} dbAreas={areas} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton href={whatsappHref} />
      </div>
    </GlobalBookingProvider>
  )
}
