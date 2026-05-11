'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import slugify from 'slugify';

// Get all services for admin (includes unpublished)
export async function getAdminServices() {
  return await prisma.service.findMany({
    orderBy: { order: 'asc' },
  });
}

// Reorder services
export async function reorderServices(items: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.service.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error reordering services:', error);
    return { success: false, error: 'Failed to reorder services' };
  }
}

// Toggle publish status
export async function toggleServicePublish(id: string, isPublished: boolean) {
  try {
    await prisma.service.update({
      where: { id },
      data: { isPublished },
    });
    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error toggling publish status:', error);
    return { success: false, error: 'Failed to update publish status' };
  }
}

// Delete service
export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    });
    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'Failed to delete service' };
  }
}

// Upload image and return path
async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0 || file.name === 'undefined') return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  
  try {
    await mkdir(uploadsDir, { recursive: true });
  } catch (err) {
    // ignore if exists
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filePath = join(uploadsDir, filename);

  await writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

// Create or update service
export async function saveService(formData: FormData) {
  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const price = parseFloat(formData.get('price') as string);
    const duration = formData.get('duration') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const focusKeyword = formData.get('focusKeyword') as string;
    const schemaMarkup = formData.get('schemaMarkup') as string;
    
    // Parse JSON arrays
    const featuresStr = formData.get('features') as string;
    const benefitsStr = formData.get('benefits') as string;
    const features = featuresStr ? JSON.parse(featuresStr) : [];
    const benefits = benefitsStr ? JSON.parse(benefitsStr) : [];

    // Base slug logic
    const requestedSlug = formData.get('slug') as string;
    const slug = requestedSlug ? slugify(requestedSlug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });

    // Handle image upload
    const imageFile = formData.get('imageFile') as File | null;
    const existingImage = formData.get('existingImage') as string | null;
    
    let imageUrl = existingImage || '';
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      const newPath = await uploadImage(imageFile);
      if (newPath) imageUrl = newPath;
    }

    if (id) {
      // Update
      await prisma.service.update({
        where: { id },
        data: {
          title,
          slug,
          shortDescription,
          fullDescription,
          price,
          duration,
          image: imageUrl,
          features,
          benefits,
          metaTitle,
          metaDescription,
          focusKeyword,
          schemaMarkup,
        },
      });
    } else {
      // Create
      // Get max order
      const maxOrderResult = await prisma.service.aggregate({
        _max: { order: true }
      });
      const nextOrder = (maxOrderResult._max.order || 0) + 1;

      await prisma.service.create({
        data: {
          title,
          slug,
          shortDescription,
          fullDescription,
          price,
          duration,
          image: imageUrl,
          features,
          benefits,
          metaTitle,
          metaDescription,
          focusKeyword,
          schemaMarkup,
          order: nextOrder,
          isPublished: true,
        },
      });
    }

    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error saving service:', error);
    return { success: false, error: 'Failed to save service' };
  }
}
