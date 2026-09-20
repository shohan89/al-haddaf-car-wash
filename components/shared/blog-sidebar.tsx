import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle } from 'lucide-react';
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

// Flat widget: no box or shadow. A heading with a short accent underline,
// then plain content. Widgets are separated by whitespace only.
function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-black uppercase tracking-widest text-gray-900 relative after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-10 after:bg-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function BlogSidebar({ categories, recentPosts, activeCategorySlug }: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      <Widget title="About Us">
        <div className="relative mb-3 aspect-2/1 w-full overflow-hidden rounded-md">
          <Image
            src="/Alhaddafcarwash-1.jpg"
            alt="Al Haddaf Car Wash team washing cars at a customer's home in Dubai"
            fill
            sizes="260px"
            className="object-cover"
          />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Dubai&apos;s mobile car wash and detailing team. We come to your home, office or parking spot with our
          own equipment and eco-friendly products.
        </p>
        <BookNowButton variant="ghost" className="mt-2 h-auto px-0 py-0 text-sm font-bold text-primary hover:bg-transparent hover:underline">
          Book a wash →
        </BookNowButton>
      </Widget>

      {categories.length > 0 && (
        <Widget title="Categories">
          <ul className="divide-y divide-gray-100">
            {categories.map((category) => {
              const active = category.slug === activeCategorySlug;
              return (
                <li key={category.id}>
                  <Link
                    href={`/blogs?category=${category.slug}`}
                    className={cn(
                      'flex items-center justify-between py-2 text-sm transition-colors hover:text-primary',
                      active ? 'font-bold text-primary' : 'text-gray-700'
                    )}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-muted-foreground">({category.count})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Widget>
      )}

      {recentPosts.length > 0 && (
        <Widget title="Recent Posts">
          <ul className="divide-y divide-gray-100">
            {recentPosts.map((post) => (
              <li key={post.id} className="py-3 first:pt-0 last:pb-0">
                <Link href={`/blogs/${post.slug}`} className="group block">
                  <p className="text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary line-clamp-2">
                    {post.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    {post.readingTime} min read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Widget>
      )}

      <Widget title="Need a wash today?">
        <p className="mb-3 text-sm text-muted-foreground">We arrive within 45 minutes anywhere in Dubai.</p>
        <div className="space-y-2 text-sm font-bold">
          <Link href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-primary hover:underline">
            <Phone size={14} /> {siteConfig.phone}
          </Link>
          <Link
            href={siteConfig.links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <MessageCircle size={14} /> WhatsApp us
          </Link>
        </div>
      </Widget>
    </aside>
  );
}
