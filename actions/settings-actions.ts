'use server';

import prisma from '@/lib/db';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { SITE_SETTINGS_DEFAULTS, type SiteSettingsKey } from '@/data/site-settings-defaults';

const KEY_PREFIX = 'site.';

export const getSiteSettings = unstable_cache(
  async () => {
    const keys = Object.keys(SITE_SETTINGS_DEFAULTS).map((k) => `${KEY_PREFIX}${k}`);
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } });

    const result: Record<string, any> = {};
    for (const sectionKey of Object.keys(SITE_SETTINGS_DEFAULTS) as SiteSettingsKey[]) {
      const dbKey = `${KEY_PREFIX}${sectionKey}`;
      const row = rows.find((r) => r.key === dbKey);
      if (row) {
        try {
          result[sectionKey] = {
            ...(SITE_SETTINGS_DEFAULTS[sectionKey] as any),
            ...JSON.parse(row.value),
          };
        } catch {
          result[sectionKey] = SITE_SETTINGS_DEFAULTS[sectionKey];
        }
      } else {
        result[sectionKey] = SITE_SETTINGS_DEFAULTS[sectionKey];
      }
    }

    return result as typeof SITE_SETTINGS_DEFAULTS;
  },
  ['site-settings'],
  { tags: ['settings'] }
);

export async function saveSiteSection(section: SiteSettingsKey, value: any) {
  try {
    const key = `${KEY_PREFIX}${section}`;
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) },
    });
    revalidatePath('/');
    revalidatePath('/admin/settings');
    revalidateTag('settings', 'max');
    return { success: true };
  } catch (error) {
    console.error('Error saving site setting:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}

export async function uploadSiteLogo(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return { success: false, error: 'No file' };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop();
  const filename = `logo.${ext}`;
  const path = `public/uploads/${filename}`;

  const fs = await import('fs/promises');
  await fs.writeFile(path, buffer);

  const url = `/uploads/${filename}`;
  await saveSiteSection('branding', { logoUrl: url });
  return { success: true, url };
}

export async function uploadFavicon(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return { success: false, error: 'No file' };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = 'favicon.ico';
  const path = `public/${filename}`;

  const fs = await import('fs/promises');
  await fs.writeFile(path, buffer);

  return { success: true };
}
