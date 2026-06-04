import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { BookNowButton } from '@/components/shared/book-now-button'
import { Button } from '@/components/ui/button'
import { SanitizeHTML } from '@/components/shared/sanitize-html'
import { SchemaMarkup } from '@/components/shared/schema-markup'
import { ServiceFaqAccordion } from '@/components/sections/service-faq-accordion'
import { serviceFaqs } from '@/data/service-faqs'
import { generateEntityMetadata } from '@/lib/seo'
import {
  CheckCircle2,
  Star,
  Clock,
  Users,
  ShieldCheck,
  Phone,
  CalendarCheck,
  Truck,
  Sparkles,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const service = await prisma.service.findUnique({ where: { slug } })
    if (!service) return { title: 'Service Not Found' }
    return await generateEntityMetadata(service, 'service')
  } catch {
    return { title: 'Service Not Found' }
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let service = null
  try {
    service = await prisma.service.findUnique({ where: { slug } })
  } catch (error) {
    console.error('Database error in ServicePage:', error)
  }

  if (!service || !service.isPublished) notFound()

  const isContactOnly = service.price === 0
  const savings =
    service.compareAtPrice && service.compareAtPrice > service.price
      ? service.compareAtPrice - service.price
      : null

  const faqs = serviceFaqs[slug] ?? []

  const processSteps = [
    {
      number: '01',
      icon: CalendarCheck,
      title: 'Choose & Book',
      description:
        'Select this service and pick a time slot that suits you — via our booking form or WhatsApp. Confirmation within minutes.',
    },
    {
      number: '02',
      icon: Truck,
      title: 'We Come to You',
      description:
        'Our certified team arrives at your home, office, or parking spot anywhere in Dubai. No drop-off needed.',
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'Service Delivered',
      description:
        'We complete the service to the highest professional standard using premium equipment and products.',
    },
    {
      number: '04',
      icon: Star,
      title: 'Drive Away Happy',
      description:
        'Inspect the result, rate us, and enjoy your freshly serviced vehicle. We are not done until you are delighted.',
    },
  ]

  return (
    <div className="min-h-screen">
      <SchemaMarkup json={service.schemaMarkup} />

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] w-full overflow-hidden flex items-end pb-16 pt-32">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-primary" />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/30" />

        <div className="container-premium relative z-10 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {service.duration}
              </Badge>
              {service.isBundle && (
                <Badge className="bg-green-500 text-white hover:bg-green-600">
                  ✨ Best Value Bundle
                </Badge>
              )}
              {service.isPopular && (
                <Badge variant="accent">Most Popular</Badge>
              )}
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl uppercase">
              {service.title}
            </h1>

            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              {service.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {isContactOnly ? (
                <span className="text-4xl font-black text-white">Contact Us</span>
              ) : (
                <div className="flex items-baseline gap-3">
                  {service.compareAtPrice && (
                    <span className="text-xl text-white/50 line-through">
                      AED {service.compareAtPrice}
                    </span>
                  )}
                  <span className="text-4xl font-black text-white">AED {service.price}</span>
                  {savings && (
                    <span className="rounded-full bg-green-500 text-white px-3 py-1 text-sm font-bold">
                      Save AED {savings}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {isContactOnly ? (
                <Link href="https://wa.me/971555503288" target="_blank">
                  <Button size="lg" className="h-14 px-8 text-base shadow-premium">
                    Chat on WhatsApp
                  </Button>
                </Link>
              ) : (
                <BookNowButton size="lg" className="h-14 px-8 text-base shadow-premium">
                  Book Now
                </BookNowButton>
              )}
              <Link href="https://wa.me/971555503288" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base border-white/40 text-white hover:bg-white/10"
                >
                  <Phone size={18} className="mr-2" /> Ask a Question
                </Button>
              </Link>
            </div>
          </div>

          {/* Glass stats card — desktop only */}
          <div className="absolute top-1/2 right-8 hidden lg:block -translate-y-1/2">
            <div className="glass-effect rounded-2xl p-6 space-y-4 min-w-45">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Duration
                </p>
                <p className="text-2xl font-black text-primary">{service.duration}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {isContactOnly ? 'Pricing' : 'Starting at'}
                </p>
                <p className="text-2xl font-black text-secondary">
                  {isContactOnly ? 'Custom' : `AED ${service.price}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK STATS STRIP ────────────────────────────────────────── */}
      <section className="bg-white border-y border-border py-10 mt-8 lg:mt-16">
        <div className="container-premium">
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Clock, value: service.duration, label: 'Service Duration' },
              { icon: Users, value: '50+', label: 'Certified Detailers' },
              { icon: ShieldCheck, value: '100%', label: 'Fully Insured' },
              { icon: Star, value: '4.9 / 5', label: 'Customer Rating' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon size={22} className="text-primary" />
                </div>
                <dt className="text-2xl font-black text-primary">{value}</dt>
                <dd className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 3. WHAT'S INCLUDED ──────────────────────────────────────────── */}
      {service.features.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container-premium">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-3 px-4 py-1">Full Breakdown</Badge>
              <h2 className="text-3xl font-black text-primary uppercase tracking-tight sm:text-4xl">
                What&apos;s Included
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Every step of this service is carried out by our certified team using professional-grade equipment and products.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {service.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white rounded-2xl p-6 border border-border hover:shadow-md transition-shadow"
                >
                  <div className="shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-primary" />
                  </div>
                  <p className="font-semibold text-gray-800 leading-snug pt-1">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA: after What's Included ──────────────────────────────────── */}
      {service.features.length > 0 && (
        <div className="bg-white border-y border-border py-6">
          <div className="container-premium flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-black text-gray-900 text-lg">
              Sounds good? Book {service.title} today — we come to you.
            </p>
            <div className="flex gap-3 shrink-0">
              {isContactOnly ? (
                <Link href="https://wa.me/971555503288" target="_blank">
                  <Button className="font-bold px-6">Chat on WhatsApp →</Button>
                </Link>
              ) : (
                <BookNowButton className="font-bold px-6 shadow-premium">Book Now — AED {service.price} →</BookNowButton>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. WHY CHOOSE THIS SERVICE ──────────────────────────────────── */}
      {service.benefits.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container-premium">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-3 px-4 py-1">The Benefits</Badge>
              <h2 className="text-3xl font-black text-primary uppercase tracking-tight sm:text-4xl">
                Why You&apos;ll Love It
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Here is exactly what you gain when you book this service with Al Haddaf.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto">
              {service.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="shrink-0 h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Star size={20} className="text-secondary" fill="currentColor" />
                  </div>
                  <p className="font-semibold text-gray-800 leading-snug pt-1">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. ABOUT THIS SERVICE ───────────────────────────────────────── */}
      {service.fullDescription && (
        <section className="py-20 bg-muted/30">
          <div className="container-premium">
            <div className="mb-10 text-center">
              <Badge variant="secondary" className="mb-3 px-4 py-1">In Detail</Badge>
              <h2 className="text-3xl font-black text-primary uppercase tracking-tight sm:text-4xl">
                About This Service
              </h2>
            </div>
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-border shadow-sm">
              <SanitizeHTML className="prose prose-lg max-w-none" html={service.fullDescription} />
            </div>
          </div>
        </section>
      )}

      {/* ── 6. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-[20rem] font-black tracking-tighter">WASH</span>
        </div>
        <div className="container-premium relative z-10">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-bold mb-3">
              Simple Process
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl text-white">
              How It Works
            </h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              From booking to a spotless vehicle — here&apos;s how easy it is.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(({ number, icon: Icon, title, description }) => (
              <div
                key={number}
                className="relative rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6 space-y-4"
              >
                <span className="text-5xl font-black text-white/20 leading-none">{number}</span>
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA: after How It Works ─────────────────────────────────────── */}
      <div className="bg-white py-10 border-b border-border">
        <div className="container-premium text-center space-y-4">
          <p className="text-2xl font-black text-gray-900">
            Ready? Book in 60 seconds — we handle everything else.
          </p>
          <p className="text-muted-foreground">No drop-off needed · Same-day slots · Certified team</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {isContactOnly ? (
              <Link href="https://wa.me/971555503288" target="_blank">
                <Button size="lg" className="font-bold px-8 shadow-premium">Get a Custom Quote →</Button>
              </Link>
            ) : (
              <>
                <BookNowButton size="lg" className="font-bold px-8 shadow-premium">
                  Start My Booking →
                </BookNowButton>
                <Link href="https://wa.me/971555503288" target="_blank">
                  <Button size="lg" variant="outline" className="font-bold px-8">
                    Ask a Question
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── 7. SERVICE FAQs ─────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container-premium">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-3 px-4 py-1">FAQs</Badge>
              <h2 className="text-3xl font-black text-primary uppercase tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Everything you need to know before booking {service.title}.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <ServiceFaqAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* ── 8. FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-white md:px-16">
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <Badge className="bg-white/20 text-white border-white/30">
                Book Today
              </Badge>
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl text-white">
                Ready to Book {service.title}?
              </h2>
              <p className="text-white/80 text-lg">
                Join hundreds of satisfied customers across Dubai. Professional service, delivered to your door.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                {isContactOnly ? (
                  <Link href="https://wa.me/971555503288" target="_blank">
                    <Button size="xl" variant="secondary" className="h-14 px-10 text-base font-bold shadow-xl">
                      Chat on WhatsApp
                    </Button>
                  </Link>
                ) : (
                  <BookNowButton size="xl" variant="secondary" className="h-14 px-10 text-base font-bold shadow-xl">
                    Book Now — AED {service.price}
                  </BookNowButton>
                )}
                <Link href="https://wa.me/971555503288" target="_blank">
                  <Button
                    size="xl"
                    variant="outline"
                    className="h-14 px-10 text-base font-bold border-white/40 text-white hover:bg-white/10"
                  >
                    Ask a Question
                  </Button>
                </Link>
              </div>
              <p className="text-white/50 text-sm">
                Same-day service available · No hidden fees · 100% satisfaction guaranteed
              </p>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  )
}
