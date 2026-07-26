'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveFaq } from '@/actions/faq-actions';

interface FaqFormProps {
  initialData?: any;
}

export function FaqForm({ initialData }: FaqFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    if (initialData?.id) {
      formData.set('id', initialData.id);
    }

    const result = await saveFaq(formData);

    if (result.success) {
      toast.success(initialData ? 'FAQ updated' : 'FAQ created');
      router.push('/admin/faqs');
    } else {
      setError(result.error || 'Failed to save FAQ');
      toast.error(result.error || 'Failed to save FAQ');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl bg-white p-6 rounded-lg shadow-sm">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Question *</label>
        <Input name="question" defaultValue={initialData?.question} required className="text-lg font-medium" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Answer *</label>
        <Textarea name="answer" defaultValue={initialData?.answer} required rows={6} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <Input name="category" defaultValue={initialData?.category?.name} placeholder="e.g. Pricing, General, Services" />
        <p className="text-xs text-gray-500 mt-1">If the category doesn't exist, it will be created automatically.</p>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/faqs')} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update FAQ' : 'Add FAQ'}
        </Button>
      </div>
    </form>
  );
}
