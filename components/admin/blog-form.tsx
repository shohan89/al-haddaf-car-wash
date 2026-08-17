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
import { saveBlog } from '@/actions/blog-actions';

interface BlogFormProps {
  initialData?: any;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState(initialData?.content || '');
  const [isPublished, setIsPublished] = useState(initialData ? !!initialData.isPublished : false);
  const uploading = imageUploading || contentUploading;
  
  // Format tags for display if editing
  const initialTags = initialData?.tags?.map((t: any) => t.name).join(', ') || '';

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
      toast.success(initialData ? 'Blog post updated' : 'Blog post created');
      router.push('/admin/blogs');
    } else {
      setError(result.error || 'Failed to save blog');
      toast.error(result.error || 'Failed to save blog');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl bg-white p-6 rounded-lg shadow-sm">
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
