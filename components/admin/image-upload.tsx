'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { compressImage } from '@/lib/compress-image';

interface ImageUploadProps {
  value: string;
  onChange: (file: File | null, url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      if (compressed !== file && fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(compressed);
        fileInputRef.current.files = dataTransfer.files;
      }
      const url = URL.createObjectURL(compressed);
      setPreview(url);
      onChange(compressed, url);
    } finally {
      setCompressing(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange(null, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        name="imageFile"
      />

      {/* If we have an existing or selected image */}
      <input type="hidden" name="existingImage" value={value} />

      {preview ? (
        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-200 group">
          <Image src={preview} alt="Preview" fill className="object-cover" unoptimized={preview.startsWith('blob:')} />
          {compressing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 text-white text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin" /> Compressing...
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
          {compressing ? (
            <Loader2 className="w-10 h-10 mb-2 text-gray-400 animate-spin" />
          ) : (
            <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
          )}
          <span className="text-sm font-medium">{compressing ? 'Compressing...' : 'Click to upload an image'}</span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB — auto-compressed before upload</span>
        </div>
      )}
    </div>
  );
}
