import prisma from '@/lib/db';
import Link from 'next/link';
import { FallbackImage } from '@/components/shared/fallback-image';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { SchemaMarkup } from '@/components/shared/schema-markup';
import { getPageSeo } from '@/actions/seo-actions';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => generatePageMetadata('page:blog');

export default async function BlogsPage() {
  const [posts, pageSeo] = await Promise.all([
    prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    getPageSeo('page:blog')
  ]);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-muted/30">
      <SchemaMarkup json={pageSeo?.schemaMarkup} />
      <div className="container-premium">
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1">Our Blog</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Car Care & Detailing Insights</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover expert tips, latest trends, and comprehensive guides to keep your vehicle in pristine condition.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-premium border border-border/50 transition-all duration-300">
              <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                <FallbackImage
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="default" className="bg-primary/90 backdrop-blur-sm shadow-sm">{post.category.name}</Badge>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="flex items-center gap-1.5"><Clock size={14} /> {post.readingTime} min read</div>
                </div>
                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">{post.title}</h2>
                <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{post.authorName.charAt(0)}</div>
                  <span className="text-sm font-semibold text-gray-900">{post.authorName}</span>
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <p className="text-xl">No posts published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
