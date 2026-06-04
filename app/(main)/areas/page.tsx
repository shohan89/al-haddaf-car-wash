import prisma from '@/lib/db';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookNowButton } from '@/components/shared/book-now-button';
import { generatePageMetadata } from '@/lib/seo';
import { SchemaMarkup } from '@/components/shared/schema-markup';
import { getPageSeo } from '@/actions/seo-actions';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export const generateMetadata = () => generatePageMetadata('page:areas');

export default async function AreasIndexPage() {
  const [areas, pageSeo] = await Promise.all([
    prisma.area.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
      }
    }),
    getPageSeo('page:areas'),
  ]);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/30">
      <SchemaMarkup json={pageSeo?.schemaMarkup} />
      <div className="container-premium">
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1">Our Coverage</Badge>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-primary uppercase">
            Service Areas in Dubai
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We bring professional car wash and detailing services to your doorstep across all major Dubai communities. 
            Select your location to see localized services.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Link 
              key={area.id} 
              href={`/areas/${area.slug}`}
              className="group bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle2 size={12} /> Live Now
                </div>
              </div>

              <h2 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                {area.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                {area.shortDescription}
              </p>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2">
                  View coverage <ArrowRight size={14} />
                </span>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                  45min Arrival
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Dynamic CTA */}
        <div className="mt-20 grid lg:grid-cols-2 gap-8 items-center bg-white rounded-[3rem] p-8 md:p-16 border border-border shadow-premium overflow-hidden relative">
          <div className="space-y-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-primary leading-tight uppercase tracking-tighter">
              Don't see your <br />
              <span className="text-secondary">location listed?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              We are constantly expanding our mobile fleet. Contact us to see if we can reach you today!
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <BookNowButton size="lg" className="font-bold px-8">Request Custom Visit</BookNowButton>
              <Link href="tel:+971555503288">
                <Button size="lg" variant="outline" className="font-bold px-8">Call Dispatch</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000" 
              alt="Dubai Skyline" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
