'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

// Get all areas for admin
export async function getAdminAreas() {
  return await prisma.area.findMany({
    orderBy: { order: 'asc' },
  });
}

// Reorder areas
export async function reorderAreas(items: { id: string; order: number }[]) {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.area.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath('/admin/areas');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error reordering areas:', error);
    return { success: false, error: 'Failed to reorder areas' };
  }
}

// Toggle publish status
export async function toggleAreaPublish(id: string, isPublished: boolean) {
  try {
    await prisma.area.update({
      where: { id },
      data: { isPublished },
    });
    revalidatePath('/admin/areas');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error toggling publish status:', error);
    return { success: false, error: 'Failed to update publish status' };
  }
}

// Delete area
export async function deleteArea(id: string) {
  try {
    await prisma.area.delete({
      where: { id },
    });
    revalidatePath('/admin/areas');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting area:', error);
    return { success: false, error: 'Failed to delete area' };
  }
}

// Create or update area
export async function saveArea(formData: FormData) {
  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const heroTagline = formData.get('heroTagline') as string;
    const mapEmbedUrl = formData.get('mapEmbedUrl') as string;
    const latitude = formData.get('latitude') as string;
    const longitude = formData.get('longitude') as string;
    const focusKeyword = formData.get('focusKeyword') as string;
    const schemaMarkup = formData.get('schemaMarkup') as string;

    const midCtaTitle = (formData.get('midCtaTitle') as string | null)?.trim() || null;
    const midCtaSubtitle = (formData.get('midCtaSubtitle') as string | null)?.trim() || null;
    const midCtaButtonText = (formData.get('midCtaButtonText') as string | null)?.trim() || null;
    const ctaTitle = (formData.get('ctaTitle') as string | null)?.trim() || null;
    const ctaSubtitle = (formData.get('ctaSubtitle') as string | null)?.trim() || null;
    const ctaButtonText = (formData.get('ctaButtonText') as string | null)?.trim() || null;
    const locationTitle = (formData.get('locationTitle') as string | null)?.trim() || null;
    const locationDescription = (formData.get('locationDescription') as string | null)?.trim() || null;

    const coveredAreasRaw = formData.get('coveredAreas') as string;
    const coveredAreas = coveredAreasRaw ? JSON.parse(coveredAreasRaw) : [];

    const requestedSlug = formData.get('slug') as string;
    const slug = requestedSlug
      ? slugify(requestedSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    const imageUrl = (formData.get('image') as string | null) || null;

    const areaData = {
      title,
      slug,
      shortDescription,
      fullDescription,
      image: imageUrl,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      heroTagline: heroTagline || null,
      mapEmbedUrl: mapEmbedUrl || null,
      latitude: latitude || null,
      longitude: longitude || null,
      focusKeyword: focusKeyword || null,
      schemaMarkup: schemaMarkup || null,
      coveredAreas,
      midCtaTitle,
      midCtaSubtitle,
      midCtaButtonText,
      ctaTitle,
      ctaSubtitle,
      ctaButtonText,
      locationTitle,
      locationDescription,
    };

    if (id) {
      await prisma.area.update({ where: { id }, data: areaData });
    } else {
      const maxOrderResult = await prisma.area.aggregate({ _max: { order: true } });
      const nextOrder = (maxOrderResult._max.order || 0) + 1;
      await prisma.area.create({
        data: { ...areaData, order: nextOrder, isPublished: true },
      });
    }

    revalidatePath('/admin/areas');
    revalidatePath('/');
    revalidatePath(`/areas/${slug}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error saving area:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'An area with this slug already exists.' };
    }
    return { success: false, error: 'Failed to save area' };
  }
}
