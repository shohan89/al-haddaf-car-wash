'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { savePageSeo } from '@/actions/seo-actions';
import { STATIC_PAGES, type PageSeoData, SCHEMA_TEMPLATES } from '@/lib/seo-constants';
import { CheckCircle2, ChevronLeft, Eye, EyeOff, ExternalLink, Code2, Search, Share2, Twitter, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeoEditorProps {
  pageSeo: PageSeoData | null;
  pageKey: string;
  pageLabel: string;
  onBack: () => void;
}

function Field({ label, hint, children, count, maxCount }: {
  label: string; hint?: string; children: React.ReactNode; count?: number; maxCount?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {count !== undefined && maxCount && (
          <span className={cn("text-xs font-medium tabular-nums", count > maxCount ? "text-red-500" : count > maxCount * 0.9 ? "text-amber-500" : "text-muted-foreground")}>
            {count} / {maxCount}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all border",
        active ? "bg-primary text-white border-primary shadow-sm" : "text-gray-600 border-transparent hover:bg-gray-100"
      )}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

const SCHEMA_OPTIONS = [
  { label: 'LocalBusiness', value: 'LocalBusiness' },
  { label: 'Service', value: 'Service' },
  { label: 'Article', value: 'Article' },
  { label: 'FAQPage', value: 'FAQPage' },
  { label: 'BreadcrumbList', value: 'BreadcrumbList' },
  { label: 'Custom JSON-LD', value: 'custom' },
];

export function SeoEditor({ pageSeo, pageKey, pageLabel, onBack }: SeoEditorProps) {
  const [tab, setTab] = useState<'meta' | 'og' | 'twitter' | 'schema' | 'advanced'>('meta');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<PageSeoData>({
    pageKey, pageLabel,
    metaTitle: pageSeo?.metaTitle || '',
    metaDescription: pageSeo?.metaDescription || '',
    canonicalUrl: pageSeo?.canonicalUrl || '',
    focusKeyword: pageSeo?.focusKeyword || '',
    ogTitle: pageSeo?.ogTitle || '',
    ogDescription: pageSeo?.ogDescription || '',
    ogImage: pageSeo?.ogImage || '',
    ogType: pageSeo?.ogType || 'website',
    twitterCard: pageSeo?.twitterCard || 'summary_large_image',
    twitterTitle: pageSeo?.twitterTitle || '',
    twitterDescription: pageSeo?.twitterDescription || '',
    twitterImage: pageSeo?.twitterImage || '',
    noIndex: pageSeo?.noIndex ?? false,
    noFollow: pageSeo?.noFollow ?? false,
    schemaMarkup: pageSeo?.schemaMarkup || '',
  });

  const set = (field: keyof PageSeoData, value: any) => setData(p => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    const result = await savePageSeo(data);
    setSaving(false);
    if (result.success) {
      setSaved(true);
      toast.success('SEO settings saved');
      setTimeout(() => setSaved(false), 3000);
    } else {
      toast.error(result.error || 'Failed to save SEO settings');
    }
  };

  const applySchemaTemplate = (type: string) => {
    let json = '';
    if (type === 'LocalBusiness') json = SCHEMA_TEMPLATES.LocalBusiness('Al Haddaf Car Wash', '+971 55 550 3288', 'Dubai, UAE', 'https://alhaddafcarwash.ae');
    else if (type === 'Service') json = SCHEMA_TEMPLATES.Service('Mobile Car Wash Dubai', 'Premium mobile car wash at your doorstep', '99', 'https://alhaddafcarwash.ae/services');
    else if (type === 'Article') json = SCHEMA_TEMPLATES.Article('Article Title', 'Article description', 'Admin', new Date().toISOString(), '');
    else if (type === 'FAQPage') json = SCHEMA_TEMPLATES.FAQPage([{ question: 'How long does a wash take?', answer: '30–60 minutes depending on the package.' }]);
    else if (type === 'BreadcrumbList') json = SCHEMA_TEMPLATES.BreadcrumbList([{ name: 'Home', url: 'https://alhaddafcarwash.ae' }, { name: pageLabel, url: '' }]);
    else json = '{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}';
    set('schemaMarkup', json);
  };

  // SERP preview
  const serpTitle = data.metaTitle || 'Page Title';
  const serpDesc = data.metaDescription || 'Meta description will appear here. Aim for 150–160 characters.';
  const serpUrl = data.canonicalUrl || 'https://alhaddafcarwash.ae';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to SEO Overview
        </button>
        <div className="h-4 w-px bg-border" />
        <h2 className="font-bold text-lg">{pageLabel} — SEO Editor</h2>
      </div>

      {/* Focus keyword + SERP preview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Search className="w-4 h-4 text-primary" /> Focus Keyword
          </div>
          <Input
            value={data.focusKeyword || ''}
            onChange={e => set('focusKeyword', e.target.value)}
            placeholder="e.g. mobile car wash dubai"
          />
          <p className="text-xs text-muted-foreground">The primary keyword this page should rank for. Used to audit your content quality.</p>
          {data.focusKeyword && (
            <div className="space-y-1.5">
              {[
                { label: 'In meta title', ok: data.metaTitle?.toLowerCase().includes(data.focusKeyword.toLowerCase()) },
                { label: 'In meta description', ok: data.metaDescription?.toLowerCase().includes(data.focusKeyword.toLowerCase()) },
                { label: 'In OG title', ok: !data.ogTitle || data.ogTitle?.toLowerCase().includes(data.focusKeyword.toLowerCase()) },
              ].map(({ label, ok }) => (
                <div key={label} className={cn("flex items-center gap-2 text-xs font-medium", ok ? "text-emerald-600" : "text-amber-600")}>
                  {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SERP Preview */}
        <div className="bg-white rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <ExternalLink className="w-4 h-4 text-primary" /> Google SERP Preview
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-1">
            <p className="text-xs text-emerald-700 truncate">{serpUrl}</p>
            <p className="text-[#1a0dab] text-lg font-medium leading-tight hover:underline cursor-pointer line-clamp-1">{serpTitle}</p>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{serpDesc}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="flex gap-2 p-4 border-b border-border bg-gray-50 flex-wrap">
          <TabBtn active={tab === 'meta'} onClick={() => setTab('meta')} icon={Search} label="Meta Tags" />
          <TabBtn active={tab === 'og'} onClick={() => setTab('og')} icon={Share2} label="Open Graph" />
          <TabBtn active={tab === 'twitter'} onClick={() => setTab('twitter')} icon={Twitter} label="Twitter Card" />
          <TabBtn active={tab === 'schema'} onClick={() => setTab('schema')} icon={Code2} label="Schema Markup" />
          <TabBtn active={tab === 'advanced'} onClick={() => setTab('advanced')} icon={Info} label="Advanced" />
        </div>

        <div className="p-6 space-y-5">
          {/* Meta Tags */}
          {tab === 'meta' && (
            <>
              <Field label="Meta Title" count={data.metaTitle?.length} maxCount={60} hint="Optimal length: 50–60 characters. Include your focus keyword near the start.">
                <Input value={data.metaTitle || ''} onChange={e => set('metaTitle', e.target.value)} placeholder="Page Title | Al Haddaf Car Wash" />
              </Field>
              <Field label="Meta Description" count={data.metaDescription?.length} maxCount={160} hint="Optimal length: 150–160 characters. Summarize the page and include the focus keyword.">
                <Textarea value={data.metaDescription || ''} onChange={e => set('metaDescription', e.target.value)} rows={3} placeholder="Describe this page in 150–160 characters…" />
              </Field>
              <Field label="Canonical URL" hint="Leave blank to use the page's default URL. Set explicitly to avoid duplicate content issues.">
                <Input value={data.canonicalUrl || ''} onChange={e => set('canonicalUrl', e.target.value)} placeholder="https://alhaddafcarwash.ae/page" />
              </Field>
            </>
          )}

          {/* Open Graph */}
          {tab === 'og' && (
            <>
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                <strong>Open Graph</strong> controls how this page looks when shared on Facebook, LinkedIn, and WhatsApp. Leave blank to inherit from meta tags.
              </div>
              <Field label="OG Title" count={data.ogTitle?.length} maxCount={60}>
                <Input value={data.ogTitle || ''} onChange={e => set('ogTitle', e.target.value)} placeholder="Inherits meta title if blank" />
              </Field>
              <Field label="OG Description" count={data.ogDescription?.length} maxCount={200}>
                <Textarea value={data.ogDescription || ''} onChange={e => set('ogDescription', e.target.value)} rows={3} placeholder="Inherits meta description if blank" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="OG Image URL" hint="Recommended: 1200×630px">
                  <Input value={data.ogImage || ''} onChange={e => set('ogImage', e.target.value)} placeholder="/og-image.jpg" />
                </Field>
                <Field label="OG Type">
                  <select value={data.ogType || 'website'} onChange={e => set('ogType', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {['website', 'article', 'product', 'profile'].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </>
          )}

          {/* Twitter Card */}
          {tab === 'twitter' && (
            <>
              <div className="rounded-lg bg-sky-50 border border-sky-200 px-4 py-3 text-sm text-sky-800">
                <strong>Twitter Cards</strong> control how this page appears when shared on Twitter/X. Leave blank to fall back to Open Graph tags.
              </div>
              <Field label="Twitter Card Type">
                <select value={data.twitterCard || 'summary_large_image'} onChange={e => set('twitterCard', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="summary_large_image">Summary with Large Image</option>
                  <option value="summary">Summary</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </Field>
              <Field label="Twitter Title" count={data.twitterTitle?.length} maxCount={70}>
                <Input value={data.twitterTitle || ''} onChange={e => set('twitterTitle', e.target.value)} placeholder="Falls back to OG title if blank" />
              </Field>
              <Field label="Twitter Description" count={data.twitterDescription?.length} maxCount={200}>
                <Textarea value={data.twitterDescription || ''} onChange={e => set('twitterDescription', e.target.value)} rows={3} placeholder="Falls back to OG description if blank" />
              </Field>
              <Field label="Twitter Image URL" hint="Recommended: 1200×628px">
                <Input value={data.twitterImage || ''} onChange={e => set('twitterImage', e.target.value)} placeholder="Falls back to OG image if blank" />
              </Field>
            </>
          )}

          {/* Schema Markup */}
          {tab === 'schema' && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">JSON-LD Schema Markup</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Structured data that helps search engines understand your page content.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">Template:</span>
                  <select onChange={e => applySchemaTemplate(e.target.value)} defaultValue=""
                    className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white">
                    <option value="" disabled>Apply template…</option>
                    {SCHEMA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <Textarea
                value={data.schemaMarkup || ''}
                onChange={e => set('schemaMarkup', e.target.value)}
                rows={16}
                className="font-mono text-xs"
                placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}'}
              />
              {data.schemaMarkup && (() => {
                try { JSON.parse(data.schemaMarkup); return <p className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON</p>; }
                catch { return <p className="text-xs text-red-500 font-medium">⚠ Invalid JSON — fix before saving</p>; }
              })()}
            </>
          )}

          {/* Advanced */}
          {tab === 'advanced' && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Robots / Indexing</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { field: 'noIndex' as const, label: 'No Index', desc: 'Prevent search engines from indexing this page' },
                  { field: 'noFollow' as const, label: 'No Follow', desc: 'Prevent search engines from following links on this page' },
                ].map(({ field, label, desc }) => (
                  <div key={field} className="flex items-start gap-3 p-4 rounded-xl border border-border">
                    <button
                      type="button"
                      onClick={() => set(field, !data[field])}
                      className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 mt-0.5',
                        data[field] ? 'bg-red-500' : 'bg-gray-200')}
                    >
                      <span className={cn('inline-block h-4 w-4 rounded-full bg-white shadow transition-transform', data[field] ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                    <div>
                      <p className="text-sm font-semibold">{label} {data[field] && <span className="text-red-500 text-xs">(Active)</span>}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                ⚠ Enable "No Index" on pages like thank-you pages, private landing pages, or duplicate content pages. Never enable on your main pages.
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50">
          <p className="text-xs text-muted-foreground">Changes apply instantly to the live site after saving.</p>
          <Button onClick={handleSave} disabled={saving} className="min-w-36 gap-2">
            {saving ? 'Saving…' : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : 'Save SEO Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
