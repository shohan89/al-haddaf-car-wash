'use server';

import prisma from '@/lib/db';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { SITE_SETTINGS_DEFAULTS, type SiteSettingsKey } from '@/data/site-settings-defaults';

const KEY_PREFIX = 'site.';

export const getSiteSettings = unstable_cache(
  async () => {
    let rows: { key: string; value: string }[] = [];
    try {
      const keys = Object.keys(SITE_SETTINGS_DEFAULTS).map((k) => `${KEY_PREFIX}${k}`);
      rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } });
    } catch {
      return SITE_SETTINGS_DEFAULTS;
    }

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
