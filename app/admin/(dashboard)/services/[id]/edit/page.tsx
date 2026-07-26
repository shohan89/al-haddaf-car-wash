import { ServiceForm } from '@/components/admin/service-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { serviceFaqs } from '@/data/service-faqs';

export const metadata = {
  title: 'Edit Service | Admin',
};

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({
    where: { id },
    include: { faqs: { orderBy: { order: 'asc' } } },
  });

  if (!service) {
    notFound();
  }

  // Pre-fill the FAQ editor with the current live FAQs — DB-saved ones if this
  // service has been edited before, otherwise the site's built-in static list.
  const faqs = service.faqs.length > 0 ? service.faqs : (serviceFaqs[service.slug] ?? []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/services" className="text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Service</h1>
          <p className="text-gray-500">Update the details for "{service.title}".</p>
        </div>
      </div>

      <ServiceForm initialData={{ ...service, faqs }} />
    </div>
  );
}
