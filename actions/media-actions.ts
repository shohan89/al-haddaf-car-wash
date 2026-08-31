'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { deleteCloudinaryAsset } from '@/lib/cloudinary-signature';

export async function getMediaAssets() {
  return prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
}

// Called right after a successful direct-to-Cloudinary upload (see
// lib/upload-to-cloudinary.ts) so every image uploaded anywhere in the admin
// dashboard shows up in the Media Library automatically. Text-only, no file
// bytes — safe to run as a normal Server Action.
export async function recordMediaAsset(data: {
  url: string;
  publicId: string;
  filename: string;
  mimeType?: string;
  width?: number;
  height?: number;
  size?: number;
}) {
  try {
    const asset = await prisma.mediaAsset.upsert({
      where: { url: data.url },
      update: {},
      create: data,
    });
    revalidatePath('/admin/media');
    return asset;
  } catch (error) {
    console.error('Error recording media asset:', error);
    return null;
  }
}

export async function updateMediaAsset(
  id: string,
  data: { title?: string; altText?: string; description?: string }
) {
  try {
    await prisma.mediaAsset.update({
      where: { id },
      data: {
        title: data.title?.trim() || null,
        altText: data.altText?.trim() || null,
        description: data.description?.trim() || null,
      },
    });
    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    console.error('Error updating media asset:', error);
    return { success: false, error: 'Failed to update media asset' };
  }
}

export async function deleteMediaAsset(id: string) {
  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return { success: false, error: 'Media asset not found' };

    await deleteCloudinaryAsset(asset.publicId);
    await prisma.mediaAsset.delete({ where: { id } });

    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    console.error('Error deleting media asset:', error);
    return { success: false, error: 'Failed to delete media asset' };
  }
}
