import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { generateEntityMetadata } from '@/lib/seo';
import { SanitizeHTML } from '@/components/shared/sanitize-html';
import { SchemaMarkup } from '@/components/shared/schema-markup';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) return { title: 'Service Not Found' };
    return await generateEntityMetadata(service, 'service');
  } catch (error) {
    console.error("Metadata DB error:", error);
    return { title: 'Service Not Found' };
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let service = null;
  try {
    service = await prisma.service.findUnique({ where: { slug } });
  } catch (error) {
    console.error("Database error in ServicePage:", error);
  }

  if (!service || !service.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <SchemaMarkup json={service.schemaMarkup} />
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <Badge className="mb-4">{service.duration}</Badge>
              <h1 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter">
                {service.title}
              </h1>
              <p className="mt-4 text-xl text-muted-foreground">{service.shortDescription}</p>
            </div>

            <SanitizeHTML className="prose prose-lg max-w-none" html={service.fullDescription} />

            <div className="flex items-center gap-6 pt-6 border-t border-border">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Investment</p>
                <p className="text-4xl font-black text-primary">AED {service.price}</p>
              </div>
              <Link href="/book" className="flex-1">
                <Button size="lg" className="w-full text-lg shadow-premium">Book Now</Button>
              </Link>
            </div>
          </div>

          <div className="space-y-8 lg:sticky lg:top-32">
            {service.image && (
              <div className="relative aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden shadow-premium">
                <Image 
                  src={service.image} 
                  alt={service.title} 
                  fill 
                  priority 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  className="object-cover" 
                />
              </div>
            )}

            {(service.features.length > 0 || service.benefits.length > 0) && (
              <div className="bg-muted/30 p-8 rounded-2xl space-y-6 border border-border">
                {service.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">What's Included</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.benefits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Benefits</h3>
                    <ul className="space-y-3">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
