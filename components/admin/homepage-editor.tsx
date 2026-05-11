'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveHomepageSection } from '@/actions/homepage-actions';
import { CheckCircle2, Plus, X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SectionKey } from '@/data/homepage-defaults';

interface HomepageEditorProps {
  settings: any;
}

function SectionCard({ title, isVisible, onToggle, children }: {
  title: string;
  isVisible: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("bg-white rounded-xl border-2 shadow-sm overflow-hidden transition-all", isVisible ? "border-border" : "border-dashed border-gray-200 opacity-60")}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gray-50">
        <h3 className="font-bold text-lg">{title}</h3>
        <button
          type="button"
          onClick={onToggle}
          className={cn("flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors",
            isVisible ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          )}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {isVisible ? "Visible" : "Hidden"}
        </button>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SaveButton({ section, save, saving, saved }: { section: SectionKey, save: (s: SectionKey) => void, saving: string | null, saved: string | null }) {
  return (
    <div className="flex justify-end pt-4 border-t border-border mt-4">
      <Button onClick={() => save(section)} disabled={saving === section} className="min-w-32">
        {saving === section ? 'Saving...' : saved === section ? <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Saved!</> : 'Save Changes'}
      </Button>
    </div>
  );
}

export function HomepageEditor({ settings }: HomepageEditorProps) {
  const [data, setData] = useState<any>(settings);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const update = (section: SectionKey, field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateItem = (section: SectionKey, arrayField: string, index: number, field: string, value: string) => {
    setData((prev: any) => {
      const items = [...prev[section][arrayField]];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], [arrayField]: items } };
    });
  };

  const addItem = (section: SectionKey, arrayField: string, template: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [arrayField]: [...prev[section][arrayField], template] }
    }));
  };

  const removeItem = (section: SectionKey, arrayField: string, index: number) => {
    setData((prev: any) => {
      const items = prev[section][arrayField].filter((_: any, i: number) => i !== index);
      return { ...prev, [section]: { ...prev[section], [arrayField]: items } };
    });
  };

  const save = async (section: SectionKey) => {
    setSaving(section);
    const result = await saveHomepageSection(section, data[section]);
    setSaving(null);
    if (result.success) {
      setSaved(section);
      setTimeout(() => setSaved(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* SEO */}
      <div className="bg-white rounded-xl border-2 border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-gray-50">
          <h3 className="font-bold text-lg">Homepage SEO</h3>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Meta Title">
            <Input value={data.seo.metaTitle} onChange={e => update('seo', 'metaTitle', e.target.value)} />
          </Field>
          <Field label="Meta Description">
            <Textarea value={data.seo.metaDescription} onChange={e => update('seo', 'metaDescription', e.target.value)} rows={3} />
          </Field>
          <SaveButton section="seo" save={save} saving={saving} saved={saved} />
        </div>
      </div>

      {/* Hero */}
      <SectionCard title="Hero Section" isVisible={data.hero.isVisible} onToggle={() => update('hero', 'isVisible', !data.hero.isVisible)}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tagline (small text)">
            <Input value={data.hero.tagline} onChange={e => update('hero', 'tagline', e.target.value)} />
          </Field>
          <Field label="Main Heading">
            <Input value={data.hero.heading} onChange={e => update('hero', 'heading', e.target.value)} />
          </Field>
          <div className="col-span-2">
            <Field label="Subheading">
              <Textarea value={data.hero.subheading} onChange={e => update('hero', 'subheading', e.target.value)} rows={2} />
            </Field>
          </div>
          <Field label="Primary Button Text">
            <Input value={data.hero.primaryButtonText} onChange={e => update('hero', 'primaryButtonText', e.target.value)} />
          </Field>
          <Field label="Primary Button Link">
            <Input value={data.hero.primaryButtonLink} onChange={e => update('hero', 'primaryButtonLink', e.target.value)} />
          </Field>
          <Field label="Secondary Button Text">
            <Input value={data.hero.secondaryButtonText} onChange={e => update('hero', 'secondaryButtonText', e.target.value)} />
          </Field>
          <Field label="Secondary Button Link">
            <Input value={data.hero.secondaryButtonLink} onChange={e => update('hero', 'secondaryButtonLink', e.target.value)} />
          </Field>
          <Field label="Stat 1 Value"><Input value={data.hero.stat1Value} onChange={e => update('hero', 'stat1Value', e.target.value)} /></Field>
          <Field label="Stat 1 Label"><Input value={data.hero.stat1Label} onChange={e => update('hero', 'stat1Label', e.target.value)} /></Field>
          <Field label="Stat 2 Value"><Input value={data.hero.stat2Value} onChange={e => update('hero', 'stat2Value', e.target.value)} /></Field>
          <Field label="Stat 2 Label"><Input value={data.hero.stat2Label} onChange={e => update('hero', 'stat2Label', e.target.value)} /></Field>
          <Field label="Trust Badge 1"><Input value={data.hero.badge1} onChange={e => update('hero', 'badge1', e.target.value)} /></Field>
          <Field label="Trust Badge 2"><Input value={data.hero.badge2} onChange={e => update('hero', 'badge2', e.target.value)} /></Field>
          <Field label="Trust Badge 3"><Input value={data.hero.badge3} onChange={e => update('hero', 'badge3', e.target.value)} /></Field>
        </div>
        <SaveButton section="hero" save={save} saving={saving} saved={saved} />
      </SectionCard>

      {/* Trust Bar */}
      <SectionCard title="Trust Bar" isVisible={data.trustBar.isVisible} onToggle={() => update('trustBar', 'isVisible', !data.trustBar.isVisible)}>
        <div className="space-y-3">
          {data.trustBar.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Input placeholder="Value" value={item.value} className="w-28" onChange={e => updateItem('trustBar', 'items', i, 'value', e.target.value)} />
              <Input placeholder="Label" value={item.label} onChange={e => updateItem('trustBar', 'items', i, 'label', e.target.value)} />
              <button onClick={() => removeItem('trustBar', 'items', i)} className="text-red-400 hover:text-red-600 flex-shrink-0"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addItem('trustBar', 'items', { value: '', label: '' })}>
            <Plus className="w-4 h-4 mr-1" /> Add Badge
          </Button>
        </div>
        <SaveButton section="trustBar" save={save} saving={saving} saved={saved} />
      </SectionCard>

      {/* Why Choose Us */}
      <SectionCard title="Why Choose Us" isVisible={data.whyChooseUs.isVisible} onToggle={() => update('whyChooseUs', 'isVisible', !data.whyChooseUs.isVisible)}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Section Badge"><Input value={data.whyChooseUs.badge} onChange={e => update('whyChooseUs', 'badge', e.target.value)} /></Field>
          <Field label="Title"><Input value={data.whyChooseUs.title} onChange={e => update('whyChooseUs', 'title', e.target.value)} /></Field>
          <Field label="Title Highlight"><Input value={data.whyChooseUs.titleHighlight} onChange={e => update('whyChooseUs', 'titleHighlight', e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Description"><Textarea value={data.whyChooseUs.description} onChange={e => update('whyChooseUs', 'description', e.target.value)} rows={2} /></Field>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Cards</p>
          {data.whyChooseUs.items.map((item: any, i: number) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2 relative">
              <button onClick={() => removeItem('whyChooseUs', 'items', i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
              <Input placeholder="Card Title" value={item.title} onChange={e => updateItem('whyChooseUs', 'items', i, 'title', e.target.value)} />
              <Textarea placeholder="Card Description" value={item.description} rows={2} onChange={e => updateItem('whyChooseUs', 'items', i, 'description', e.target.value)} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addItem('whyChooseUs', 'items', { title: '', description: '' })}>
            <Plus className="w-4 h-4 mr-1" /> Add Card
          </Button>
        </div>
        <SaveButton section="whyChooseUs" save={save} saving={saving} saved={saved} />
      </SectionCard>

      {/* How It Works */}
      <SectionCard title="How It Works" isVisible={data.howItWorks.isVisible} onToggle={() => update('howItWorks', 'isVisible', !data.howItWorks.isVisible)}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title"><Input value={data.howItWorks.title} onChange={e => update('howItWorks', 'title', e.target.value)} /></Field>
          <Field label="Title Highlight"><Input value={data.howItWorks.titleHighlight} onChange={e => update('howItWorks', 'titleHighlight', e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Description"><Textarea value={data.howItWorks.description} onChange={e => update('howItWorks', 'description', e.target.value)} rows={2} /></Field>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Steps</p>
          {data.howItWorks.steps.map((step: any, i: number) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg space-y-2 relative">
              <button onClick={() => removeItem('howItWorks', 'steps', i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
              <div className="grid grid-cols-4 gap-2">
                <Input placeholder="Number (01)" value={step.number} onChange={e => updateItem('howItWorks', 'steps', i, 'number', e.target.value)} />
                <div className="col-span-3"><Input placeholder="Step Title" value={step.title} onChange={e => updateItem('howItWorks', 'steps', i, 'title', e.target.value)} /></div>
              </div>
              <Textarea placeholder="Step Description" value={step.description} rows={2} onChange={e => updateItem('howItWorks', 'steps', i, 'description', e.target.value)} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addItem('howItWorks', 'steps', { number: `0${data.howItWorks.steps.length + 1}`, title: '', description: '' })}>
            <Plus className="w-4 h-4 mr-1" /> Add Step
          </Button>
        </div>
        <SaveButton section="howItWorks" save={save} saving={saving} saved={saved} />
      </SectionCard>

      {/* Final CTA */}
      <SectionCard title="Final CTA Section" isVisible={data.finalCta.isVisible} onToggle={() => update('finalCta', 'isVisible', !data.finalCta.isVisible)}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Badge Text"><Input value={data.finalCta.badge} onChange={e => update('finalCta', 'badge', e.target.value)} /></Field>
          <Field label="Title"><Input value={data.finalCta.title} onChange={e => update('finalCta', 'title', e.target.value)} /></Field>
          <Field label="Title Highlight"><Input value={data.finalCta.titleHighlight} onChange={e => update('finalCta', 'titleHighlight', e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Description"><Textarea value={data.finalCta.description} onChange={e => update('finalCta', 'description', e.target.value)} rows={2} /></Field>
          </div>
          <Field label="Primary Button Text"><Input value={data.finalCta.primaryButtonText} onChange={e => update('finalCta', 'primaryButtonText', e.target.value)} /></Field>
          <Field label="Primary Button Link"><Input value={data.finalCta.primaryButtonLink} onChange={e => update('finalCta', 'primaryButtonLink', e.target.value)} /></Field>
          <Field label="Secondary Button Text"><Input value={data.finalCta.secondaryButtonText} onChange={e => update('finalCta', 'secondaryButtonText', e.target.value)} /></Field>
          <Field label="Secondary Button Link"><Input value={data.finalCta.secondaryButtonLink} onChange={e => update('finalCta', 'secondaryButtonLink', e.target.value)} /></Field>
          <div className="col-span-2">
            <Field label="Disclaimer Text"><Input value={data.finalCta.disclaimer} onChange={e => update('finalCta', 'disclaimer', e.target.value)} /></Field>
          </div>
        </div>
        <SaveButton section="finalCta" save={save} saving={saving} saved={saved} />
      </SectionCard>
    </div>
  );
}
