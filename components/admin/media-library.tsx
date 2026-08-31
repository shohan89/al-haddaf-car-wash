'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { X, Copy, Trash2, ImageOff, Check, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateMediaAsset, deleteMediaAsset } from '@/actions/media-actions';
import { compressImage } from '@/lib/compress-image';
import { uploadToCloudinaryAndRecord } from '@/lib/upload-to-cloudinary';

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  title: string | null;
  altText: string | null;
  description: string | null;
  createdAt: string | Date;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEditor = (asset: MediaAsset) => {
    setSelected(asset);
    setTitle(asset.title || '');
    setAltText(asset.altText || '');
    setDescription(asset.description || '');
  };

  const closeEditor = () => setSelected(null);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const result = await updateMediaAsset(selected.id, { title, altText, description });
    setSaving(false);
    if (result.success) {
      setAssets((prev) =>
        prev.map((a) => (a.id === selected.id ? { ...a, title: title || null, altText: altText || null, description: description || null } : a))
      );
      toast.success('Media details updated');
      closeEditor();
    } else {
      toast.error(result.error || 'Failed to update media');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm('Delete this file permanently? It will be removed from Cloudinary and can no longer be used anywhere it was linked.')) return;
    setDeleting(true);
    const result = await deleteMediaAsset(selected.id);
    setDeleting(false);
    if (result.success) {
      setAssets((prev) => prev.filter((a) => a.id !== selected.id));
      toast.success('Media deleted');
      closeEditor();
    } else {
      toast.error(result.error || 'Failed to delete media');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const asset = await uploadToCloudinaryAndRecord(compressed, 'media-library');
      setAssets((prev) => [asset, ...prev]);
      toast.success('Image uploaded');
      openEditor(asset);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} accept="image/*" className="hidden" />

      <div className="mb-4 flex justify-end">
        <Button type="button" onClick={handleUploadClick} disabled={uploading}>
          {uploading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
          ) : (
            <><Upload className="w-4 h-4 mr-2" /> Upload Image</>
          )}
        </Button>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white rounded-lg border shadow-sm p-16 text-center text-gray-500">
          <ImageOff className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No media yet</p>
          <p className="text-sm mt-1">
            Upload an image above, or it'll appear here automatically once you upload one from Services, Areas,
            Blogs, Reviews, or Settings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => openEditor(asset)}
              className="group text-left bg-white rounded-lg border shadow-sm overflow-hidden hover:shadow-md hover:border-primary/40 transition-all"
            >
              <div className="relative aspect-square w-full bg-gray-100">
                <Image src={asset.url} alt={asset.altText || asset.filename} fill className="object-cover" />
                {!asset.altText && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                    No Alt Text
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-900 truncate">{asset.title || asset.filename}</p>
                <p className="text-[11px] text-gray-400">{new Date(asset.createdAt).toLocaleDateString()}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeEditor}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Edit Media</h3>
              <button onClick={closeEditor} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="space-y-3">
                <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden border">
                  <Image src={selected.url} alt={selected.altText || selected.filename} fill className="object-contain" />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="truncate"><span className="font-medium text-gray-700">File:</span> {selected.filename}</p>
                  {selected.width && selected.height && (
                    <p><span className="font-medium text-gray-700">Dimensions:</span> {selected.width} × {selected.height}px</p>
                  )}
                  {formatBytes(selected.size) && (
                    <p><span className="font-medium text-gray-700">Size:</span> {formatBytes(selected.size)}</p>
                  )}
                  <p><span className="font-medium text-gray-700">Uploaded:</span> {new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => copyUrl(selected.url)}>
                  <Copy className="w-4 h-4 mr-2" /> Copy URL
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Text</label>
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="e.g. Mobile car wash technician cleaning a white SUV in Dubai Marina"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Describes the image for screen readers and Google Images — the single most important field for
                    image SEO. Keep it specific and natural, not keyword-stuffed.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Shown as a tooltip on hover" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Optional longer context for this image — not shown publicly, but useful for your own reference and for structured data."
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button type="button" variant="ghost" onClick={handleDelete} disabled={deleting} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" /> {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                  <Button type="button" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : <><Check className="w-4 h-4 mr-2" /> Save</>}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
