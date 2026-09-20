import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, Folder, Clock } from 'lucide-react';
import { BookNowButton } from '@/components/shared/book-now-button';
import { siteConfig } from '@/data/site-config';
import { cn } from '@/lib/utils';

interface SidebarCategory {
  id: string;
  slug: string;
  name: string;
  count: number;
}

interface SidebarPost {
  id: string;
  slug: string;
  title: string;
  createdAt: Date;
  readingTime: number;
}

interface BlogSidebarProps {
  categories: SidebarCategory[];
  recentPosts: SidebarPost[];
  activeCategorySlug?: string | null;
}

function SidebarCard({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-border bg-white p-6 shadow-sm', className)}>
      {title && <h3 className="mb-4 text-base font-black uppercase tracking-widest text-gray-900">{title}</h3>}
      {children}
    </div>
  );
}

export function BlogSidebar({ categories, recentPosts, activeCategorySlug }: BlogSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
      <SidebarCard className="overflow-hidden p-0">
        <div className="relative aspect-video w-full">
          <Image
            src="/Alhaddafcarwash-1.jpg"
            alt="Al Haddaf Car Wash team washing cars at a customer's home in Dubai"
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="mb-2 text-base font-black uppercase tracking-widest text-gray-900">About Us</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Al Haddaf Car Wash is Dubai&apos;s mobile car wash and detailing team. We come to your home, office or
            parking spot with our own water, equipment and eco-friendly products, so your car gets a
            showroom finish without you leaving your day behind.
          </p>
          <BookNowButton size="md" className="mt-4 w-full font-bold">
            Book a Wash
          </BookNowButton>
        </div>
      </SidebarCard>

      {categories.length > 0 && (
        <SidebarCard title="Categories">
          <ul className="space-y-1">
            {categories.map((category) => {
              const active = category.slug === activeCategorySlug;
              return (
                <li key={category.id}>
                  <Link
                    href={`/blogs?category=${category.slug}`}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-muted hover:text-primary'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Folder size={14} /> {category.name}
                    </span>
                    <span className={cn('text-xs', active ? 'text-white/80' : 'text-muted-foreground')}>
                      {category.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SidebarCard>
      )}

      {recentPosts.length > 0 && (
        <SidebarCard title="Recent Posts">
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/blogs/${post.slug}`} className="group block">
                  <p className="text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary line-clamp-2">
                    {post.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    {post.readingTime} min read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </SidebarCard>
      )}

      <SidebarCard className="bg-primary text-white border-primary">
        <h3 className="mb-2 text-lg font-black text-white">Need a wash today?</h3>
        <p className="mb-4 text-sm text-white/80">
          We arrive within 45 minutes anywhere in Dubai. {siteConfig.businessHours.mon_sat}, Mon–Sat.
        </p>
        <div className="space-y-2">
          <Link
            href={`tel:${siteConfig.phone}`}
            className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-white/90"
          >
            <Phone size={16} /> {siteConfig.phone}
          </Link>
          <Link
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <MessageCircle size={16} /> WhatsApp Us
          </Link>
        </div>
      </SidebarCard>
    </aside>
  );
}
