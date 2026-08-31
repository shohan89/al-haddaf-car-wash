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
import { saveService } from '@/actions/service-actions';
import { Plus, X } from 'lucide-react';

interface ServiceFormProps {
  initialData?: any;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [error, setError] = useState('');
  const uploading = imageUploading || contentUploading;

  const [features, setFeatures] = useState<string[]>(initialData?.features || ['']);
  const [benefits, setBenefits] = useState<string[]>(initialData?.benefits || ['']);
  const [fullDescription, setFullDescription] = useState(initialData?.fullDescription || '');
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    initialData?.faqs?.length ? initialData.faqs.map((f: any) => ({ question: f.question, answer: f.answer })) : []
  );

  const handleArrayChange = (setter: any, items: string[], index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setter(newItems);
  };

  const addArrayItem = (setter: any, items: string[]) => {
    setter([...items, '']);
  };

  const removeArrayItem = (setter: any, items: string[], index: number) => {
    setter(items.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqs(faqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq)));
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
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
    formData.set('fullDescription', fullDescription);
    formData.set('features', JSON.stringify(features.filter(f => f.trim() !== '')));
    formData.set('benefits', JSON.stringify(benefits.filter(b => b.trim() !== '')));
    formData.set('faqs', JSON.stringify(faqs.filter(f => f.question.trim() !== '' && f.answer.trim() !== '')));

    if (initialData?.id) {
      formData.set('id', initialData.id);
    }

    const result = await saveService(formData);

    if (result.success) {
      toast.success(initialData ? 'Service updated' : 'Service created');
      router.push('/admin/services');
    } else {
      setError(result.error || 'Failed to save service');
      toast.error(result.error || 'Failed to save service');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white p-6 rounded-lg shadow-sm">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input name="title" defaultValue={initialData?.title} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <Input name="slug" defaultValue={initialData?.slug} placeholder="auto-generated-if-empty" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (AED) *</label>
              <Input type="number" step="0.01" name="price" defaultValue={initialData?.price} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Original Price (AED)</label>
              <Input type="number" step="0.01" name="compareAtPrice" defaultValue={initialData?.compareAtPrice ?? ''} placeholder="Leave blank if no sale" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration *</label>
              <Input name="duration" defaultValue={initialData?.duration} placeholder="e.g. 45 mins" required />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                name="isBundle"
                id="isBundle"
                defaultChecked={initialData?.isBundle ?? false}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <label htmlFor="isBundle" className="text-sm font-medium">Featured Bundle</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Short Description *</label>
            <Textarea name="shortDescription" defaultValue={initialData?.shortDescription} required rows={3} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Service Image</label>
            <ImageUpload
              value={initialData?.image || ''}
              onChange={() => {}}
              onUploadingChange={setImageUploading}
              altTextFieldName="imageAltText"
              altTextValue={initialData?.imageAltText || ''}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium mb-1">Full Description</label>
        <RichTextEditor value={fullDescription} onChange={setFullDescription} onUploadingChange={setContentUploading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Features</label>
          <div className="space-y-2">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-2">
                <Input value={feature} onChange={(e) => handleArrayChange(setFeatures, features, i, e.target.value)} placeholder="Feature..." />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(setFeatures, features, i)}>
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(setFeatures, features)}>
              <Plus className="w-4 h-4 mr-2" /> Add Feature
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Benefits</label>
          <div className="space-y-2">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-2">
                <Input value={benefit} onChange={(e) => handleArrayChange(setBenefits, benefits, i, e.target.value)} placeholder="Benefit..." />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(setBenefits, benefits, i)}>
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(setBenefits, benefits)}>
              <Plus className="w-4 h-4 mr-2" /> Add Benefit
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="font-semibold text-lg">Page Content</h3>
        <p className="text-sm text-gray-500 -mt-2">
          Leave any field blank to use the page&apos;s default text shown in the placeholder.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">&quot;Full Breakdown&quot; Section Title</label>
            <Input name="breakdownTitle" defaultValue={initialData?.breakdownTitle || ''} placeholder="What's Included" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">&quot;Full Breakdown&quot; Section Subtitle</label>
            <Input name="breakdownSubtitle" defaultValue={initialData?.breakdownSubtitle || ''} placeholder="Every step of this service is carried out by our certified team using professional-grade equipment and products." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">&quot;Benefits&quot; Section Title</label>
            <Input name="benefitsTitle" defaultValue={initialData?.benefitsTitle || ''} placeholder="Why You'll Love It" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">&quot;Benefits&quot; Section Subtitle</label>
            <Input name="benefitsSubtitle" defaultValue={initialData?.benefitsSubtitle || ''} placeholder="Here is exactly what you gain when you book this service with Al Haddaf." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">FAQ Section Title</label>
            <Input name="faqTitle" defaultValue={initialData?.faqTitle || ''} placeholder="Frequently Asked Questions" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">FAQ Section Subtitle</label>
            <Input name="faqSubtitle" defaultValue={initialData?.faqSubtitle || ''} placeholder={`Everything you need to know before booking ${initialData?.title || 'this service'}.`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Final CTA Title</label>
            <Input name="ctaTitle" defaultValue={initialData?.ctaTitle || ''} placeholder={`Ready to Book ${initialData?.title || 'this service'}?`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Final CTA Subtitle</label>
            <Input name="ctaSubtitle" defaultValue={initialData?.ctaSubtitle || ''} placeholder="Join hundreds of satisfied customers across Dubai. Professional service, delivered to your door." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Final CTA Button Text</label>
            <Input name="ctaButtonText" defaultValue={initialData?.ctaButtonText || ''} placeholder={`Book Now — AED ${initialData?.price ?? '0'}`} />
          </div>
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="font-semibold text-lg">FAQs</h3>
        <p className="text-sm text-gray-500 -mt-2">Shown in the FAQ section on this service&apos;s page. Add as many as you like.</p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-2 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFaq(i)}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4 text-red-500" />
              </Button>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-500">Question</label>
                <Input value={faq.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} placeholder="e.g. How long does it take?" className="pr-10" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-500">Answer</label>
                <Textarea value={faq.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} placeholder="Answer shown to customers..." rows={2} />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addFaq}>
            <Plus className="w-4 h-4 mr-2" /> Add FAQ
          </Button>
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="font-semibold text-lg">SEO Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <Input name="metaTitle" defaultValue={initialData?.metaTitle} placeholder="SEO Title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <Textarea name="metaDescription" defaultValue={initialData?.metaDescription} placeholder="SEO Description" rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Focus Keyword</label>
            <Input name="focusKeyword" defaultValue={initialData?.focusKeyword} placeholder="Primary keyword" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Schema Markup (JSON-LD)</label>
            <Textarea name="schemaMarkup" defaultValue={initialData?.schemaMarkup} placeholder='{"@context": "https://schema.org", ...}' rows={3} className="font-mono text-xs" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/services')} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? 'Saving...' : uploading ? 'Uploading image...' : initialData ? 'Update Service' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
}
