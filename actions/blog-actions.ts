'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

// Calculate reading time based on word count (approx 200 words per minute)
function calculateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export async function getAdminBlogs() {
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true, tags: true }
  });
}

export async function getCategoriesAndTags() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
  return { categories, tags };
}

export async function toggleBlogPublish(id: string, isPublished: boolean) {
  try {
    await prisma.post.update({ where: { id }, data: { isPublished } });
    revalidatePath('/admin/blogs');
    revalidatePath('/blogs');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update publish status' };
  }
}

export async function deleteBlog(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/admin/blogs');
    revalidatePath('/blogs');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete blog' };
  }
}

export async function saveBlog(formData: FormData) {
  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const focusKeyword = formData.get('focusKeyword') as string;
    const schemaMarkup = formData.get('schemaMarkup') as string;
    
    const requestedSlug = formData.get('slug') as string;
    const slug = requestedSlug ? slugify(requestedSlug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });
    
    const categoryName = formData.get('category') as string;
    const tagsString = formData.get('tags') as string;
    const tagNames = tagsString ? tagsString.split(',').map(t => t.trim()).filter(t => t) : [];

    const readingTime = calculateReadingTime(content || '');

    const imageUrl = (formData.get('image') as string | null) || '';

    // Handle Category
    let categoryId = null;
    if (categoryName) {
      const categorySlug = slugify(categoryName, { lower: true, strict: true });
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: { name: categoryName, slug: categorySlug }
      });
      categoryId = category.id;
    }

    // Handle Tags
    const tagConnections = await Promise.all(tagNames.map(async (tagName) => {
      const tagSlug = slugify(tagName, { lower: true, strict: true });
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug }
      });
      return { id: tag.id };
    }));

    if (id) {
      await prisma.post.update({
        where: { id },
        data: {
          title, slug, excerpt, content, coverImage: imageUrl, metaTitle, metaDescription, 
          focusKeyword, schemaMarkup, readingTime,
          categoryId,
          tags: { set: tagConnections }
        },
      });
    } else {
      await prisma.post.create({
        data: {
          title, slug, excerpt, content, coverImage: imageUrl, metaTitle, metaDescription, 
          focusKeyword, schemaMarkup, readingTime,
          isPublished: true,
          categoryId,
          tags: { connect: tagConnections }
        },
      });
    }

    revalidatePath('/admin/blogs');
    revalidatePath('/blogs');
    return { success: true };
  } catch (error: any) {
    console.error('Error saving blog:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return { success: false, error: 'A post with this slug or title already exists.' };
    }
    return { success: false, error: 'Failed to save blog' };
  }
}
