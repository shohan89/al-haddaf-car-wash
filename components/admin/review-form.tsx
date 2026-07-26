'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './image-upload';
import { saveReview } from '@/actions/review-actions';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  initialData?: any;
}

export function ReviewForm({ initialData }: ReviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(initialData?.rating || 5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('rating', rating.toString());
    
    if (initialData?.id) {
      formData.set('id', initialData.id);
    }

    const result = await saveReview(formData);

    if (result.success) {
      toast.success(initialData ? 'Review updated' : 'Review created');
      router.push('/admin/reviews');
    } else {
      setError(result.error || 'Failed to save review');
      toast.error(result.error || 'Failed to save review');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white p-6 rounded-lg shadow-sm">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Customer Name *</label>
          <Input name="author" defaultValue={initialData?.author} required placeholder="e.g. Ahmed Al-Maktoum" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Role *</label>
          <Input name="role" defaultValue={initialData?.role} required placeholder="e.g. VIP Client, Business Owner" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Location (Optional)</label>
          <Input name="location" defaultValue={initialData?.location} placeholder="e.g. Dubai Marina" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={cn("p-1 transition-colors", rating >= star ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200")}
            >
              <Star className="w-8 h-8 fill-current" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Review Content *</label>
        <Textarea name="content" defaultValue={initialData?.content} required rows={5} placeholder="The actual review text..." />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Customer Avatar</label>
        <ImageUpload value={initialData?.avatar || ''} onChange={() => {}} />
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/reviews')} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Review' : 'Add Review'}
        </Button>
      </div>
    </form>
  );
}
