import prisma from '@/lib/db'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookNowButton } from '@/components/shared/book-now-button'
import { generatePageMetadata } from '@/lib/seo'
import { SchemaMarkup } from '@/components/shared/schema-markup'
import { getPageSeo } from '@/actions/seo-actions'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export const generateMetadata = () => generatePageMetadata('page:services')

export default async function ServicesIndexPage() {
  const [services, pageSeo] = await Promise.all([
    prisma.service.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        duration: true,
        features: true,
        isBundle: true,
      },
    }),
    getPageSeo('page:services'),
  ])

  const regularServices = services.filter((s) => !s.isBundle)
  const bundleServices = services.filter((s) => s.isBundle)

  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/30">
      <SchemaMarkup json={pageSeo?.schemaMarkup} />
      <div className="container-premium">
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1">
            Our Packages
          </Badge>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-primary uppercase">
            Premium Car Wash Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Experience the finest mobile car detailing in Dubai. From express washes to full
            interior restoration, we bring the showroom finish to you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularServices.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-premium border border-border transition-all duration-500"
            >
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 size={28} />
                  </div>
                  <Badge variant="secondary" className="font-bold">
                    {service.duration}
                  </Badge>
                </div>

                <h2 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                  {service.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3 mb-8 flex-1">
                  {service.shortDescription}
                </p>

                <div className="space-y-4 mb-8">
                  {service.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Starting from
                    </p>
                    {service.price === 0 ? (
                      <p className="text-2xl font-black text-primary">Contact Us</p>
                    ) : (
                      <p className="text-2xl font-black text-primary">AED {service.price}</p>
                    )}
                  </div>
                  <Link href={`/services/${service.slug}`}>
                    <Button
                      variant="ghost"
                      className="gap-2 font-bold group-hover:bg-primary group-hover:text-white transition-all"
                    >
                      Details <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle Highlight */}
        {bundleServices.map((bundle) => (
          <div
            key={bundle.id}
            className="mt-12 rounded-3xl bg-primary p-8 md:p-12 text-white relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold mb-4">
                  ✨ Best Value Bundle
                </span>
                <h3 className="text-3xl md:text-4xl font-black mb-2">{bundle.title}</h3>
                <p className="text-white/80 mb-4">{bundle.shortDescription}</p>
                <div className="flex items-center gap-3">
                  {bundle.compareAtPrice && (
                    <span className="text-white/50 line-through text-xl">
                      AED {bundle.compareAtPrice}
                    </span>
                  )}
                  <span className="text-4xl font-black">AED {bundle.price}</span>
                  {bundle.compareAtPrice && (
                    <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-bold">
                      Save AED {bundle.compareAtPrice - bundle.price}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href={`/services/${bundle.slug}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white hover:text-primary font-bold px-8"
                  >
                    Learn More
                  </Button>
                </Link>
                <BookNowButton size="lg" variant="secondary" className="w-full font-bold px-8">
                  Grab Bundle Deal →
                </BookNowButton>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>
        ))}

        <div className="mt-12 p-12 rounded-[3rem] bg-primary text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Not sure which package is right for you?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Our experts are happy to recommend the best service based on your car&apos;s condition
              and your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <BookNowButton size="lg" variant="secondary" className="font-bold px-8 shadow-xl">
                Book a Consultation
              </BookNowButton>
              <Link href="https://wa.me/971555503288" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold px-8 border-white text-white hover:bg-white hover:text-primary"
                >
                  Chat on WhatsApp
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}
