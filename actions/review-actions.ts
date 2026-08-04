'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { uploadImage } from '@/lib/upload-image';

export async function getAdminReviews() {
  return await prisma.review.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function reorderReviews(items: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.review.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to reorder reviews' };
  }
}

export async function toggleReviewStatus(id: string, field: 'isPublished' | 'isFeatured' | 'isVerified', value: boolean) {
  try {
    await prisma.review.update({ where: { id }, data: { [field]: value } });
    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update review status' };
  }
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete review' };
  }
}

export async function saveReview(formData: FormData) {
  try {
    const id = formData.get('id') as string | null;
    const author = formData.get('author') as string;
    const role = formData.get('role') as string;
    const location = formData.get('location') as string;
    const content = formData.get('content') as string;
    const rating = parseInt(formData.get('rating') as string) || 5;

    const imageFile = formData.get('imageFile') as File | null;
    const existingImage = formData.get('existingImage') as string | null;
    
    let avatarUrl = existingImage || null;
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      const newPath = await uploadImage(imageFile);
      if (newPath) avatarUrl = newPath;
    }

    if (id) {
      await prisma.review.update({
        where: { id },
        data: { author, role, location, content, rating, avatar: avatarUrl },
      });
    } else {
      const maxOrder = await prisma.review.aggregate({ _max: { order: true } });
      const nextOrder = (maxOrder._max.order || 0) + 1;

      await prisma.review.create({
        data: { author, role, location, content, rating, avatar: avatarUrl, order: nextOrder, isPublished: true },
      });
    }

    revalidatePath('/admin/reviews');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error saving review:', error);
    return { success: false, error: 'Failed to save review' };
  }
}
