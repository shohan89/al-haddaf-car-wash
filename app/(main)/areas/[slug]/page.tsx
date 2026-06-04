import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookNowButton } from '@/components/shared/book-now-button';
import Link from 'next/link';
import { MapPin, CheckCircle2, Phone, ChevronRight } from 'lucide-react';
import { generateEntityMetadata } from '@/lib/seo';
import { SanitizeHTML } from '@/components/shared/sanitize-html';
import { SchemaMarkup } from '@/components/shared/schema-markup';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const area = await prisma.area.findUnique({ where: { slug } });
    if (!area) return { title: 'Area Not Found' };
    return await generateEntityMetadata(area, 'area');
  } catch (error) {
    console.error("Metadata DB error:", error);
    return { title: 'Area Not Found' };
  }
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let area = null;
  let services: any[] = [];
  
  try {
    area = await prisma.area.findUnique({ where: { slug } });

    if (area && area.isPublished) {
      // Also fetch available services for the coverage section
      services = await prisma.service.findMany({
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        select: { title: true, slug: true, shortDescription: true, price: true, duration: true },
      });
    }
  } catch (error) {
    console.error("Database error in AreaPage:", error);
  }

  if (!area || !area.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SchemaMarkup json={area.schemaMarkup} />
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[70vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background image */}
        {area.image ? (
          <>
            <div className="absolute inset-0 z-0">
              <Image 
                src={area.image} 
                alt={area.title} 
                fill 
                className="object-cover" 
                priority 
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 z-0 bg-linear-to-r from-black/80 via-black/60 to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 z-0 bg-linear-to-br from-primary/90 to-primary/60" />
        )}

        <div className="container-premium relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
                {area.heroTagline || 'Service Location'}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter">
              Car Wash in<br />
              <span className="text-secondary">{area.title}</span>
            </h1>
            <p className="mt-6 text-xl text-white/80 max-w-xl leading-relaxed">
              {area.shortDescription}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <BookNowButton size="lg" className="text-lg px-8 shadow-premium">
                Book Now in {area.title} <ChevronRight className="ml-2 w-5 h-5" />
              </BookNowButton>
              <Link href="tel:+971555503288">
                <Button size="lg" variant="outline" className="text-lg px-8 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm">
                  <Phone className="mr-2 w-5 h-5" /> Call Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── COVERAGE BADGES ── */}
      {area.coveredAreas && area.coveredAreas.length > 0 && (
        <section className="bg-primary py-6">
          <div className="container-premium">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-white/70 text-sm font-semibold uppercase tracking-widest mr-2">We Cover:</span>
              {area.coveredAreas.map((subArea: string, i: number) => (
                <Badge key={i} className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors px-3 py-1">
                  <CheckCircle2 className="w-3 h-3 mr-1.5" /> {subArea}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCAL CONTENT ── */}
      <section className="py-20 bg-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <Badge variant="secondary" className="mb-4">About This Area</Badge>
              <SanitizeHTML
                className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-a:text-primary"
                html={area.fullDescription}
              />
            </div>

            {/* Sidebar: Quick Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-bold mb-4">Quick Info</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Mobile car wash — we come to you</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Available 7 days a week</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Eco-friendly cleaning products</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Trained & insured detailers</li>
                </ul>
              </div>

              <BookNowButton size="lg" className="w-full text-lg shadow-premium">
                Book a Wash in {area.title}
              </BookNowButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES IN THIS AREA ── */}
      {services.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container-premium">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-4">Available Services</Badge>
              <h2 className="text-3xl md:text-4xl font-black">Services Available in {area.title}</h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
                Choose the perfect car wash package, and we'll come directly to you.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.slug} className="bg-white rounded-2xl border border-border p-6 hover:shadow-premium transition-all group">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{service.shortDescription}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-black text-primary">AED {service.price}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{service.duration}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <BookNowButton size="sm" className="w-full font-bold shadow-soft flex-1">Book Now →</BookNowButton>
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="outline" size="sm" className="px-3">Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MID-PAGE CTA STRIP ── */}
      {services.length > 0 && (
        <div className="bg-secondary py-7">
          <div className="container-premium flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-black text-white text-xl">Ready for a spotless car in {area.title}?</p>
              <p className="text-white/80 text-sm mt-0.5">We arrive within 45 min · Book in under a minute</p>
            </div>
            <BookNowButton size="lg" className="bg-white text-secondary hover:bg-white/90 font-black px-8 shadow-xl shrink-0">
              Book Now in {area.title} →
            </BookNowButton>
          </div>
        </div>
      )}

      {/* ── MAP SECTION ── */}
      {area.mapEmbedUrl && (
        <section className="py-20 bg-white">
          <div className="container-premium">
            <div className="mb-10 text-center">
              <Badge variant="secondary" className="mb-4">Find Us</Badge>
              <h2 className="text-3xl md:text-4xl font-black">We Serve {area.title}</h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Book online and we'll come directly to your location within this area.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-premium border border-border aspect-video">
              <iframe
                src={area.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-primary">
        <div className="container-premium text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Ready for a Spotless Car in {area.title}?
          </h2>
          <p className="mt-4 text-xl text-white/70 max-w-xl mx-auto">
            Book in seconds. We'll handle everything else.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <BookNowButton size="lg" variant="secondary" className="text-lg px-10">
              Book Now <ChevronRight className="ml-2 w-5 h-5" />
            </BookNowButton>
          </div>
        </div>
      </section>
    </div>
  );
}
