'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { deleteCloudinaryAsset, listCloudinaryImages } from '@/lib/cloudinary-signature';

export async function getMediaAssets() {
  return prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
}

// Backfills the Media Library with every image already sitting in Cloudinary
// — including ones uploaded before this feature existed, or ones no longer
// referenced by any service/area/post. Safe to re-run: only inserts assets
// we don't already have a row for.
export async function syncMediaLibraryFromCloudinary() {
  try {
    const existing = await prisma.mediaAsset.findMany({ select: { url: true } });
    const knownUrls = new Set(existing.map((e) => e.url));

    const toCreate: {
      url: string;
      publicId: string;
      filename: string;
      mimeType: string | null;
      width: number | null;
      height: number | null;
      size: number | null;
      createdAt: Date;
    }[] = [];

    let cursor: string | undefined;
    do {
      const { resources, nextCursor } = await listCloudinaryImages(cursor);
      for (const r of resources) {
        if (knownUrls.has(r.secure_url)) continue;
        knownUrls.add(r.secure_url);
        toCreate.push({
          url: r.secure_url,
          publicId: r.public_id,
          filename: `${r.public_id.split('/').pop()}.${r.format}`,
          mimeType: r.format ? `image/${r.format}` : null,
          width: r.width ?? null,
          height: r.height ?? null,
          size: r.bytes ?? null,
          createdAt: r.created_at ? new Date(r.created_at) : new Date(),
        });
      }
      cursor = nextCursor;
    } while (cursor);

    if (toCreate.length > 0) {
      await prisma.mediaAsset.createMany({ data: toCreate, skipDuplicates: true });
    }

    revalidatePath('/admin/media');
    return { success: true, added: toCreate.length, assets: await getMediaAssets() };
  } catch (error) {
    console.error('Error syncing media library from Cloudinary:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Sync failed' };
  }
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
