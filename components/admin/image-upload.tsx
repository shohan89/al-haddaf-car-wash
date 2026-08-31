'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { compressImage } from '@/lib/compress-image';
import { uploadToCloudinary } from '@/lib/upload-to-cloudinary';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
  prefix?: string;
  /** Shows an Alt Text field under the preview, submitted as a hidden input under this name. */
  altTextFieldName?: string;
  altTextValue?: string;
}

export function ImageUpload({
  value,
  onChange,
  onUploadingChange,
  prefix = 'uploads',
  altTextFieldName,
  altTextValue,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const [imageUrl, setImageUrl] = useState<string>(value);
  const [altText, setAltText] = useState(altTextValue || '');
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading'>('idle');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setBusy = (busy: boolean) => onUploadingChange?.(busy);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setBusy(true);

    try {
      setStatus('compressing');
      const compressed = await compressImage(file);
      setPreview(URL.createObjectURL(compressed));

      setStatus('uploading');
      const url = await uploadToCloudinary(compressed, prefix);

      setImageUrl(url);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
      setPreview(imageUrl);
    } finally {
      setStatus('idle');
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview('');
    setImageUrl('');
    setError('');
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const busy = status !== 'idle';

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input type="hidden" name="image" value={imageUrl} />
      {altTextFieldName && <input type="hidden" name={altTextFieldName} value={altText} />}

      {error && (
        <div className="mb-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {preview ? (
        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-200 group">
          <Image src={preview} alt="Preview" fill className="object-cover" unoptimized={preview.startsWith('blob:')} />
          {busy && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 text-white text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin" /> {status === 'compressing' ? 'Compressing...' : 'Uploading...'}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-md aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center cursor-pointer text-gray-500"
        >
          {busy ? (
            <Loader2 className="w-10 h-10 mb-2 text-gray-400 animate-spin" />
          ) : (
            <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
          )}
          <span className="text-sm font-medium">
            {status === 'compressing' ? 'Compressing...' : status === 'uploading' ? 'Uploading...' : 'Click to upload an image'}
          </span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB — auto-compressed before upload</span>
        </div>
      )}

      {altTextFieldName && preview && (
        <div className="mt-3 max-w-md">
          <label className="block text-sm font-medium mb-1">Alt Text</label>
          <Input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe this image for search engines and screen readers"
          />
          <p className="text-xs text-gray-500 mt-1">
            The most important field for image SEO — describe what's actually in the photo.
          </p>
        </div>
      )}
    </div>
  );
}
