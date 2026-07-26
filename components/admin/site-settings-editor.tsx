'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveSiteSection } from '@/actions/settings-actions';
import { compressImage } from '@/lib/compress-image';
import type { SiteSettingsKey } from '@/data/site-settings-defaults';
import {
  CheckCircle2, Building2, Phone, Mail, Link2, Search,
  Code2, AlignLeft, Palette, Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsEditorProps { settings: any }

const TABS: { key: string; label: string; icon: any }[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'social', label: 'Social Links', icon: Link2 },
  { key: 'seo', label: 'SEO Defaults', icon: Search },
  { key: 'scripts', label: 'Analytics & Scripts', icon: Code2 },
  { key: 'footer', label: 'Footer', icon: AlignLeft },
  { key: 'branding', label: 'Branding', icon: Palette },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function SaveBtn({ section, saving, saved, onSave }: {
  section: SiteSettingsKey; saving: string | null; saved: string | null; onSave: () => void;
}) {
  return (
    <div className="flex justify-end pt-6 border-t border-border mt-6">
      <Button onClick={onSave} disabled={saving === section} className="min-w-36 gap-2">
        {saving === section
          ? <><span className="animate-spin">⏳</span> Saving...</>
          : saved === section
          ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          : 'Save Changes'}
      </Button>
    </div>
  );
}

export function SiteSettingsEditor({ settings }: SettingsEditorProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [data, setData] = useState<any>(settings);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const update = (section: SiteSettingsKey, field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const save = async (section: SiteSettingsKey) => {
    setSaving(section);
    const result = await saveSiteSection(section, data[section]);
    setSaving(null);
    if (result.success) {
      setSaved(section);
      toast.success('Settings saved');
      setTimeout(() => setSaved(null), 3000);
    } else {
      toast.error(result.error || 'Failed to save settings');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      setLogoPreview(URL.createObjectURL(compressed));
      const fd = new FormData();
      fd.append('file', compressed);
      const { uploadSiteLogo } = await import('@/actions/settings-actions');
      const result = await uploadSiteLogo(fd);
      if (result.success && result.url) {
        setData((prev: any) => ({ ...prev, branding: { ...prev.branding, logoUrl: result.url } }));
        toast.success('Logo uploaded');
      } else {
        toast.error(result.error || 'Failed to upload logo');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      setFaviconPreview(URL.createObjectURL(compressed));
      const fd = new FormData();
      fd.append('file', compressed);
      const { uploadFavicon } = await import('@/actions/settings-actions');
      const result = await uploadFavicon(fd);
      if (result.success) {
        toast.success('Favicon uploaded');
      } else {
        toast.error(result.error || 'Failed to upload favicon');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar Tabs */}
      <div className="w-52 flex-shrink-0">
        <nav className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left',
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm p-8">

        {/* General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">General Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">Core company information used across the site.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Company Name">
                <Input value={data.general.companyName} onChange={e => update('general', 'companyName', e.target.value)} />
              </Field>
              <Field label="Tagline">
                <Input value={data.general.tagline} onChange={e => update('general', 'tagline', e.target.value)} />
              </Field>
              <Field label="Primary Phone">
                <Input value={data.general.phone} onChange={e => update('general', 'phone', e.target.value)} placeholder="+971 XX XXX XXXX" />
              </Field>
              <Field label="Secondary Phone (optional)">
                <Input value={data.general.phoneAlt} onChange={e => update('general', 'phoneAlt', e.target.value)} placeholder="+971 XX XXX XXXX" />
              </Field>
              <Field label="WhatsApp Number" hint="Numbers only, no spaces or + (e.g. 971555503288)">
                <Input value={data.general.whatsapp} onChange={e => update('general', 'whatsapp', e.target.value)} placeholder="971XXXXXXXXX" />
              </Field>
              <Field label="Email Address">
                <Input type="email" value={data.general.email} onChange={e => update('general', 'email', e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Business Address">
                  <Input value={data.general.address} onChange={e => update('general', 'address', e.target.value)} />
                </Field>
              </div>
              <Field label="Business Hours (Mon–Sat)">
                <Input value={data.general.businessHoursMF} onChange={e => update('general', 'businessHoursMF', e.target.value)} placeholder="8:00 AM – 10:00 PM" />
              </Field>
              <Field label="Business Hours (Sunday)">
                <Input value={data.general.businessHoursSun} onChange={e => update('general', 'businessHoursSun', e.target.value)} placeholder="9:00 AM – 8:00 PM" />
              </Field>
            </div>
            <SaveBtn section="general" saving={saving} saved={saved} onSave={() => save('general')} />
          </div>
        )}

        {/* Social Links */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Social Links</h2>
              <p className="text-sm text-muted-foreground mt-1">Full URLs to your social media profiles.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/yourhandle' },
                { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage' },
                { key: 'twitter', label: 'Twitter / X URL', placeholder: 'https://twitter.com/yourhandle' },
                { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/yourco' },
                { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@yourchannel' },
                { key: 'tiktok', label: 'TikTok URL', placeholder: 'https://tiktok.com/@yourhandle' },
              ].map(({ key, label, placeholder }) => (
                <Field key={key} label={label}>
                  <Input value={(data.social as any)[key]} onChange={e => update('social', key, e.target.value)} placeholder={placeholder} />
                </Field>
              ))}
            </div>
            <SaveBtn section="social" saving={saving} saved={saved} onSave={() => save('social')} />
          </div>
        )}

        {/* SEO Defaults */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">SEO Defaults</h2>
              <p className="text-sm text-muted-foreground mt-1">Used as fallback SEO metadata across all pages.</p>
            </div>
            <div className="space-y-5">
              <Field label="Default Meta Title" hint="Appears in browser tab and Google results">
                <Input value={data.seo.defaultTitle} onChange={e => update('seo', 'defaultTitle', e.target.value)} />
              </Field>
              <Field label="Title Template" hint="Use %s as placeholder for the page name (e.g. '%s | Al Haddaf')">
                <Input value={data.seo.titleTemplate} onChange={e => update('seo', 'titleTemplate', e.target.value)} />
              </Field>
              <Field label="Default Meta Description" hint="Recommended: 150–160 characters">
                <Textarea value={data.seo.defaultDescription} onChange={e => update('seo', 'defaultDescription', e.target.value)} rows={3} />
                <p className="text-xs text-muted-foreground mt-1">{data.seo.defaultDescription?.length || 0} / 160 characters</p>
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Default OG Image URL" hint="Social sharing preview image">
                  <Input value={data.seo.ogImage} onChange={e => update('seo', 'ogImage', e.target.value)} placeholder="/og-image.jpg" />
                </Field>
                <Field label="Canonical Site URL" hint="Your live domain with https">
                  <Input value={data.seo.canonicalUrl} onChange={e => update('seo', 'canonicalUrl', e.target.value)} placeholder="https://yoursite.ae" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Default Keywords" hint="Comma-separated keywords (less important for modern SEO)">
                    <Input value={data.seo.keywords} onChange={e => update('seo', 'keywords', e.target.value)} />
                  </Field>
                </div>
              </div>
            </div>
            <SaveBtn section="seo" saving={saving} saved={saved} onSave={() => save('seo')} />
          </div>
        )}

        {/* Scripts */}
        {activeTab === 'scripts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Analytics & Scripts</h2>
              <p className="text-sm text-muted-foreground mt-1">Tracking codes and custom scripts injected into every page.</p>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              ⚠️ Changes here affect all pages. Incorrect scripts can break the site. Double-check IDs before saving.
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Google Analytics ID" hint="Format: G-XXXXXXXXXX">
                <Input value={data.scripts.googleAnalyticsId} onChange={e => update('scripts', 'googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" />
              </Field>
              <Field label="Google Tag Manager ID" hint="Format: GTM-XXXXXXX">
                <Input value={data.scripts.googleTagManagerId} onChange={e => update('scripts', 'googleTagManagerId', e.target.value)} placeholder="GTM-XXXXXXX" />
              </Field>
              <Field label="Google Site Verification" hint="Content value from Google Search Console meta tag">
                <Input value={data.scripts.googleSiteVerification} onChange={e => update('scripts', 'googleSiteVerification', e.target.value)} placeholder="xxxxxxxxxxxxxxxxx" />
              </Field>
              <Field label="Facebook Pixel ID" hint="Numbers only">
                <Input value={data.scripts.facebookPixelId} onChange={e => update('scripts', 'facebookPixelId', e.target.value)} placeholder="XXXXXXXXXXXXXXXXX" />
              </Field>
            </div>
            <Field label="Custom <head> Scripts" hint="Paste full <script> tags. Injected before </head>.">
              <Textarea
                value={data.scripts.customHeadScripts}
                onChange={e => update('scripts', 'customHeadScripts', e.target.value)}
                rows={5}
                className="font-mono text-xs"
                placeholder={'<script>\n  // your custom script here\n</script>'}
              />
            </Field>
            <Field label="Custom <body> Scripts" hint="Injected immediately after <body>. Used for GTM noscript tags.">
              <Textarea
                value={data.scripts.customBodyScripts}
                onChange={e => update('scripts', 'customBodyScripts', e.target.value)}
                rows={5}
                className="font-mono text-xs"
                placeholder={'<noscript>\n  <!-- GTM fallback -->\n</noscript>'}
              />
            </Field>
            <SaveBtn section="scripts" saving={saving} saved={saved} onSave={() => save('scripts')} />
          </div>
        )}

        {/* Footer */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Footer Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">Customize the footer content shown on all pages.</p>
            </div>
            <div className="space-y-5">
              <Field label="Footer Tagline" hint="Appears under the logo in the footer">
                <Textarea value={data.footer.tagline} onChange={e => update('footer', 'tagline', e.target.value)} rows={3} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Copyright Text" hint="Year is added automatically">
                  <Input value={data.footer.copyrightText} onChange={e => update('footer', 'copyrightText', e.target.value)} />
                </Field>
                <Field label="Privacy Policy URL">
                  <Input value={data.footer.privacyPolicyUrl} onChange={e => update('footer', 'privacyPolicyUrl', e.target.value)} placeholder="/privacy" />
                </Field>
                <Field label="Terms & Conditions URL">
                  <Input value={data.footer.termsUrl} onChange={e => update('footer', 'termsUrl', e.target.value)} placeholder="/terms" />
                </Field>
                <Field label="Show Social Icons">
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => update('footer', 'showSocialLinks', !data.footer.showSocialLinks)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        data.footer.showSocialLinks ? 'bg-primary' : 'bg-gray-200'
                      )}
                    >
                      <span className={cn(
                        'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                        data.footer.showSocialLinks ? 'translate-x-6' : 'translate-x-1'
                      )} />
                    </button>
                    <span className="text-sm font-medium">{data.footer.showSocialLinks ? 'Visible' : 'Hidden'}</span>
                  </div>
                </Field>
              </div>
            </div>
            <SaveBtn section="footer" saving={saving} saved={saved} onSave={() => save('footer')} />
          </div>
        )}

        {/* Branding */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Branding</h2>
              <p className="text-sm text-muted-foreground mt-1">Logo, favicon, and brand colors.</p>
            </div>

            {/* Logo */}
            <div className="rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-bold">Site Logo</h3>
              <div className="flex items-center gap-6">
                <div className="h-20 w-48 bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoPreview || data.branding.logoUrl}
                    alt="Logo preview"
                    className="h-12 object-contain"
                  />
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white hover:bg-gray-50 transition-colors text-sm font-semibold">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading…' : 'Upload New Logo'}
                    <input type="file" className="hidden" accept="image/*,.svg" onChange={handleLogoUpload} />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">Recommended: SVG or PNG, transparent background</p>
                </div>
              </div>
              <div>
                <Field label="Logo URL (manual override)">
                  <Input value={data.branding.logoUrl} onChange={e => update('branding', 'logoUrl', e.target.value)} placeholder="/logo.svg" />
                </Field>
              </div>
            </div>

            {/* Favicon */}
            <div className="rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-bold">Favicon</h3>
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-border flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={faviconPreview || data.branding.faviconUrl}
                    alt="Favicon preview"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white hover:bg-gray-50 transition-colors text-sm font-semibold">
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading…' : 'Upload Favicon'}
                    <input type="file" className="hidden" accept=".ico,image/x-icon,image/png" onChange={handleFaviconUpload} />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">Recommended: 32×32 or 64×64 .ico or .png</p>
                </div>
              </div>
            </div>

            <SaveBtn section="branding" saving={saving} saved={saved} onSave={() => save('branding')} />
          </div>
        )}
      </div>
    </div>
  );
}
