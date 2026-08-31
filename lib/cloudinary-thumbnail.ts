// Builds a Cloudinary-resized thumbnail URL by inserting a transformation
// segment right after "/upload/". Used for the Media Library grid so
// hundreds of thumbnails load small, pre-sized images straight from
// Cloudinary's CDN instead of being routed through Next's own image-resize
// proxy (which doesn't hold up well at that volume, all at once).
export function cloudinaryThumb(url: string, size = 300): string {
  return url.replace('/upload/', `/upload/c_fill,w_${size},h_${size},q_auto,f_auto/`);
}
