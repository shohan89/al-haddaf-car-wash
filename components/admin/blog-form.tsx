'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
const ImageUpload = dynamic(() => import('./image-upload').then(m => m.ImageUpload), { ssr: false });
const RichTextEditor = dynamic(() => import('./rich-text-editor').then(m => m.RichTextEditor), { ssr: false });
import { saveBlog } from '@/actions/blog-actions';

interface BlogFormProps {
  initialData?: any;
}

const TEXT_FIELD_NAMES = ['title', 'excerpt', 'slug', 'category', 'tags', 'metaTitle', 'metaDescription', 'focusKeyword', 'schemaMarkup'];
const AUTOSAVE_INTERVAL_MS = 20_000;

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState(initialData?.content || '');
  const [isPublished, setIsPublished] = useState(initialData ? !!initialData.isPublished : false);
  const uploading = imageUploading || contentUploading;

  // Format tags for display if editing
  const initialTags = initialData?.tags?.map((t: any) => t.name).join(', ') || '';

  const draftKey = `al-haddaf-blog-draft-${initialData?.id || 'new'}`;

  // Autosave: periodically snapshot the form into localStorage so a failed
  // save (or a closed tab) doesn't lose what was written. Offer to restore
  // it once on mount if a newer draft than the loaded data exists.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(draftKey);
    } catch {
      return;
    }
    if (!raw) return;

    let draft: { savedAt: number; fields: Record<string, string>; content: string; isPublished: boolean };
    try {
      draft = JSON.parse(raw);
    } catch {
      return;
    }

    toast('Unsaved draft found', {
      description: `Autosaved ${new Date(draft.savedAt).toLocaleString()}. Restore it?`,
      duration: 15_000,
      action: {
        label: 'Restore',
        onClick: () => {
          const form = formRef.current;
          if (form) {
            for (const [name, value] of Object.entries(draft.fields)) {
              const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
              if (field) field.value = value;
            }
          }
          setContent(draft.content);
          setIsPublished(draft.isPublished);
          toast.success('Draft restored');
        },
      },
    });
    // Only check once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const saveSnapshot = () => {
      const form = formRef.current;
      if (!form) return;
      const fields: Record<string, string> = {};
      for (const name of TEXT_FIELD_NAMES) {
        const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
        if (field) fields[name] = field.value;
      }
      // Don't bother persisting an effectively-empty form.
      if (!fields.title && !content) return;
      try {
        localStorage.setItem(draftKey, JSON.stringify({ savedAt: Date.now(), fields, content, isPublished }));
      } catch {
        // Storage full or unavailable — autosave is best-effort only.
      }
    };

    const interval = setInterval(saveSnapshot, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [content, isPublished, draftKey]);

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploading) {
      toast.error('Please wait for the image to finish uploading');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('content', content);
    formData.set('isPublished', String(isPublished));

    if (initialData?.id) {
      formData.set('id', initialData.id);
    }

    const result = await saveBlog(formData);

    if (result.success) {
      clearDraft();
      toast.success(initialData ? 'Blog post updated' : 'Blog post created');
      router.push('/admin/blogs');
    } else {
      // Keep the autosaved draft — this is exactly the situation it's for.
      setError(result.error || 'Failed to save blog');
      toast.error(result.error || 'Failed to save blog');
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 max-w-5xl bg-white p-6 rounded-lg shadow-sm">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input name="title" defaultValue={initialData?.title} required className="text-lg py-6" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt *</label>
            <Textarea name="excerpt" defaultValue={initialData?.excerpt} required rows={3} placeholder="A short summary of the blog post..." />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-1">Content *</label>
            <RichTextEditor value={content} onChange={setContent} onUploadingChange={setContentUploading} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="font-semibold border-b pb-2">Publish Settings</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={isPublished ? 'true' : 'false'}
                onChange={(e) => setIsPublished(e.target.value === 'true')}
                className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:text-base"
              >
                <option value="false">Draft</option>
                <option value="true">Published</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Drafts are saved but stay hidden from the public blog until you switch this to Published.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <Input name="slug" defaultValue={initialData?.slug} placeholder="Auto-generated if empty" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input name="category" defaultValue={initialData?.category?.name} placeholder="e.g. Detailing Tips" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <Input name="tags" defaultValue={initialTags} placeholder="e.g. polish, wax, maintenance" />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="font-semibold border-b pb-2">Featured Image</h3>
            <ImageUpload
              value={initialData?.coverImage || ''}
              onChange={() => {}}
              onUploadingChange={setImageUploading}
              altTextFieldName="coverImageAltText"
              altTextValue={initialData?.coverImageAltText || ''}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
            <h3 className="font-semibold border-b pb-2">SEO Metadata</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <Input name="metaTitle" defaultValue={initialData?.metaTitle || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <Textarea name="metaDescription" defaultValue={initialData?.metaDescription || ''} rows={3} />
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
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/blogs')} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading
            ? 'Saving...'
            : uploading
            ? 'Uploading image...'
            : isPublished
            ? initialData ? 'Update & Publish' : 'Publish Post'
            : 'Save Draft'}
        </Button>
      </div>
    </form>
  );
}
