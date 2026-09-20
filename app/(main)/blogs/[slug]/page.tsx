import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { generateEntityMetadata } from '@/lib/seo';
import { SanitizeHTML } from '@/components/shared/sanitize-html';
import { SchemaMarkup } from '@/components/shared/schema-markup';
import { BlogCoverImage } from '@/components/shared/blog-cover-image';
import { BlogSidebar } from '@/components/shared/blog-sidebar';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return { title: 'Post Not Found' };
    return await generateEntityMetadata(post, 'post');
  } catch (error) {
    console.error("Metadata DB error:", error);
    return { title: 'Post Not Found' };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let post = null;
  try {
    post = await prisma.post.findUnique({ 
      where: { slug },
      include: { category: true, tags: true }
    });
  } catch (error) {
    console.error("Database error in BlogPostPage:", error);
  }

  if (!post || !post.isPublished) {
    notFound();
  }

  let categories: { id: string; slug: string; name: string; count: number }[] = [];
  let recentPosts: { id: string; slug: string; title: string; createdAt: Date; readingTime: number }[] = [];
  try {
    const [categoryRows, recentRows] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { posts: { where: { isPublished: true } } } } },
      }),
      prisma.post.findMany({
        where: { isPublished: true, id: { not: post.id } },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { id: true, slug: true, title: true, createdAt: true, readingTime: true },
      }),
    ]);
    categories = categoryRows
      .map((c) => ({ id: c.id, slug: c.slug, name: c.name, count: c._count.posts }))
      .filter((c) => c.count > 0);
    recentPosts = recentRows;
  } catch (error) {
    console.error("Database error loading blog sidebar:", error);
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-white">
      <SchemaMarkup json={post.schemaMarkup} />
      <div className="container-premium max-w-6xl">
        <Link href="/blogs" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6">
          <ChevronLeft size={16} className="mr-1" /> Back to all articles
        </Link>
        {post.category && (
          <div className="mb-4">
            <Badge variant="secondary" className="px-3 py-1">{post.category.name}</Badge>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
        <div className="space-y-6 mb-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-gray-900">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{post.authorName.charAt(0)}</div>
              <span className="font-bold text-gray-900">{post.authorName}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2"><Clock size={16} /> {post.readingTime} min read</div>
          </div>
        </div>

        {post.coverImage && <BlogCoverImage src={post.coverImage} alt={post.coverImageAltText || post.title} />}

        <SanitizeHTML
          className="prose blog-prose prose-lg max-w-none prose-headings:font-black prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl"
          html={post.content}
        />

        {post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Tags:</span>
            {post.tags.map(tag => (
              <Badge key={tag.id} variant="outline" className="bg-gray-50 text-gray-600 hover:bg-gray-100">{tag.name}</Badge>
            ))}
          </div>
        )}
        </div>

        <BlogSidebar categories={categories} recentPosts={recentPosts} activeCategorySlug={post.category?.slug} />
        </div>
      </div>
    </div>
  );
}
