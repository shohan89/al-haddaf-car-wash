// Client-side image compression: downscales to a max dimension and re-encodes as WebP
// so admin uploads transfer faster and stay comfortably under the server action body limit.
export async function compressImage(
  file: File,
  { maxDimension = 1920, quality = 0.82 }: { maxDimension?: number; quality?: number } = {}
): Promise<File> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) return file;
  // Skip formats where re-encoding would lose animation or intentionally-vector content
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^./\\]+$/, '') + '.webp';
    return new File([blob], newName, { type: 'image/webp', lastModified: Date.now() });
  } catch {
    // Compression is a best-effort optimization — fall back to the original file on any failure
    return file;
  }
}
