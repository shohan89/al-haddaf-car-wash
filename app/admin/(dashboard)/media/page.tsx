import { getMediaAssets } from '@/actions/media-actions';
import { MediaLibrary } from '@/components/admin/media-library';

export const metadata = {
  title: 'Media Library | Admin',
};

export default async function MediaLibraryPage() {
  const assets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
        <p className="text-gray-500">
          Every image uploaded across services, areas, blogs, reviews, and branding — set a title, alt text, and
          description for better image SEO.
        </p>
      </div>

      <MediaLibrary initialAssets={assets as any} />
    </div>
  );
}
