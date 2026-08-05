'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
const ImageUpload = dynamic(() => import('./image-upload').then(m => m.ImageUpload), { ssr: false });
const RichTextEditor = dynamic(() => import('./rich-text-editor').then(m => m.RichTextEditor), { ssr: false });
import { saveArea } from '@/actions/area-actions';
import { X, Plus } from 'lucide-react';

interface AreaFormProps {
  initialData?: any;
}

export function AreaForm({ initialData }: AreaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullDescription, setFullDescription] = useState(initialData?.fullDescription || '');
  const [coveredAreas, setCoveredAreas] = useState<string[]>(initialData?.coveredAreas || []);
  const [newCoveredArea, setNewCoveredArea] = useState('');

  const addCoveredArea = () => {
    if (newCoveredArea.trim()) {
      setCoveredAreas([...coveredAreas, newCoveredArea.trim()]);
      setNewCoveredArea('');
    }
  };

  const removeCoveredArea = (index: number) => {
    setCoveredAreas(coveredAreas.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('fullDescription', fullDescription);
    formData.set('coveredAreas', JSON.stringify(coveredAreas));

    if (initialData?.id) {
      formData.set('id', initialData.id);
    }

    const result = await saveArea(formData);

    if (result.success) {
      toast.success(initialData ? 'Area updated' : 'Area created');
      router.push('/admin/areas');
    } else {
      setError(result.error || 'Failed to save area');
      toast.error(result.error || 'Failed to save area');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md">{error}</div>}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <h3 className="font-semibold text-lg border-b pb-3">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Area Name *</label>
            <Input name="title" defaultValue={initialData?.title} required placeholder="e.g. Dubai Marina" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <Input name="slug" defaultValue={initialData?.slug} placeholder="auto-generated-if-empty" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Hero Tagline</label>
            <Input name="heroTagline" defaultValue={initialData?.heroTagline || ''} placeholder="e.g. Premium Car Wash in the Heart of Dubai Marina" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Short Description *</label>
            <Textarea name="shortDescription" defaultValue={initialData?.shortDescription} required rows={3} placeholder="Brief intro shown in hero and meta..." />
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-3">Hero Image</h3>
        <ImageUpload value={initialData?.image || ''} onChange={() => {}} />
        <p className="text-xs text-gray-500">This image appears in the area hero section and on the map card.</p>
      </div>

      {/* Local Content Editor */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-3">Local Content</h3>
        <p className="text-sm text-gray-500">Write area-specific content — mention local landmarks, neighborhoods, and why you're the best service in this area.</p>
        <RichTextEditor value={fullDescription} onChange={setFullDescription} />
      </div>

      {/* Service Coverage */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-3">Service Coverage</h3>
        <p className="text-sm text-gray-500">Add the neighborhoods and sub-areas you cover within this location. These will appear as coverage badges on the page.</p>
        <div className="flex gap-2">
          <Input
            value={newCoveredArea}
            onChange={(e) => setNewCoveredArea(e.target.value)}
            placeholder="e.g. JBR, Marina Walk, Dubai Marina Mall"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCoveredArea(); } }}
          />
          <Button type="button" variant="outline" onClick={addCoveredArea}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {coveredAreas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {coveredAreas.map((area, index) => (
              <span key={index} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                {area}
                <button type="button" onClick={() => removeCoveredArea(index)} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Map Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-3">Map Settings</h3>
        <p className="text-sm text-gray-500">Embed a Google Maps iframe to show your service location. Get the embed URL from Google Maps → Share → Embed a map.</p>
        <div>
          <label className="block text-sm font-medium mb-1">Google Maps Embed URL</label>
          <Input name="mapEmbedUrl" defaultValue={initialData?.mapEmbedUrl || ''} placeholder="https://www.google.com/maps/embed?pb=..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude (optional)</label>
            <Input name="latitude" defaultValue={initialData?.latitude || ''} placeholder="e.g. 25.0757" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude (optional)</label>
            <Input name="longitude" defaultValue={initialData?.longitude || ''} placeholder="e.g. 55.1403" />
          </div>
        </div>
        {initialData?.mapEmbedUrl && (
          <div className="aspect-video w-full rounded-xl overflow-hidden border mt-2">
            <iframe src={initialData.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </div>
        )}
      </div>

      {/* Our Location Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <h3 className="font-semibold text-lg border-b pb-3">&quot;Our Location&quot; Section</h3>
          <p className="text-sm text-gray-500 mt-2">
            Shown next to the map on the area page. Leave blank to use the default text. Use{' '}
            <code className="bg-muted px-1 rounded">{'{area}'}</code> anywhere you want the area name inserted.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input name="locationTitle" defaultValue={initialData?.locationTitle || ''} placeholder="Serving {area} & Nearby Communities" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            name="locationDescription"
            defaultValue={initialData?.locationDescription || ''}
            rows={3}
            placeholder="We proudly bring our mobile car wash and detailing service to {area} and the surrounding neighborhoods. Wherever you are — home, office, or a parking spot — our certified technicians arrive fully equipped and ready to work, so you never have to leave your vehicle or your schedule behind."
          />
        </div>
      </div>

      {/* CTA Sections */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <div>
          <h3 className="font-semibold text-lg border-b pb-3">Call-to-Action Sections</h3>
          <p className="text-sm text-gray-500 mt-2">
            Leave any field blank to use the page&apos;s default text shown in the placeholder. Use{' '}
            <code className="bg-muted px-1 rounded">{'{area}'}</code> anywhere you want the area name inserted.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Mid-Page CTA Strip</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="midCtaTitle" defaultValue={initialData?.midCtaTitle || ''} placeholder="Ready for a spotless car in {area}?" />
            <Input name="midCtaSubtitle" defaultValue={initialData?.midCtaSubtitle || ''} placeholder="We arrive within 45 min · Book in under a minute" />
            <Input name="midCtaButtonText" defaultValue={initialData?.midCtaButtonText || ''} placeholder="Book Now in {area} →" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Final CTA Section</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="ctaTitle" defaultValue={initialData?.ctaTitle || ''} placeholder="Ready for a Spotless Car in {area}?" />
            <Input name="ctaSubtitle" defaultValue={initialData?.ctaSubtitle || ''} placeholder="Book in seconds. We'll handle everything else." />
            <Input name="ctaButtonText" defaultValue={initialData?.ctaButtonText || ''} placeholder="Book Now" />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg border-b pb-3">SEO Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <Input name="metaTitle" defaultValue={initialData?.metaTitle || ''} placeholder="SEO Title for search engines" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <Textarea name="metaDescription" defaultValue={initialData?.metaDescription || ''} placeholder="SEO Description (max 160 chars)" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Focus Keyword</label>
            <Input name="focusKeyword" defaultValue={initialData?.focusKeyword || ''} placeholder="Primary keyword" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Schema Markup (JSON-LD)</label>
            <Textarea name="schemaMarkup" defaultValue={initialData?.schemaMarkup || ''} placeholder='{"@context": "https://schema.org", ...}' rows={3} className="font-mono text-xs" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/areas')} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? 'Saving...' : initialData ? 'Update Area' : 'Create Area'}
        </Button>
      </div>
    </form>
  );
}
