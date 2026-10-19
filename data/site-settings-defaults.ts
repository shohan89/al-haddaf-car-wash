// Global site settings defaults — plain data file, NOT a server action
export const SITE_SETTINGS_DEFAULTS = {
  general: {
    companyName: 'Al Haddaf Car Wash',
    tagline: "Dubai's #1 Premium Mobile Car Wash",
    phone: '+971 55 550 3288',
    phoneAlt: '',
    whatsapp: '+971555503288',
    email: 'info@alhaddafcarwash.ae',
    address: 'Dubai, United Arab Emirates',
    businessHoursMF: '8:00 AM - 10:00 PM',
    businessHoursSun: '9:00 AM - 8:00 PM',
  },
  social: {
    instagram: 'https://instagram.com/alhaddafcarwash',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  },
  seo: {
    defaultTitle: 'Al Haddaf Car Wash | Premium Mobile Car Wash Dubai',
    titleTemplate: '%s | Al Haddaf Car Wash',
    defaultDescription: 'Premium Mobile Car Wash Services in Dubai. Professional detailing, steam cleaning, and ceramic coating at your doorstep.',
    ogImage: '/og-image.jpg',
    canonicalUrl: 'https://alhaddafcarwash.com',
    keywords: 'car wash dubai, mobile car wash, car detailing dubai, steam car wash',
  },
  scripts: {
    googleAnalyticsId: '',
    googleTagManagerId: '',
    googleSiteVerification: '',
    facebookPixelId: '',
    customHeadScripts: '',
    customBodyScripts: '',
  },
  footer: {
    tagline: 'Premium mobile car wash and detailing services delivered to your doorstep in Dubai. Quality care for your luxury vehicle.',
    copyrightText: 'Al Haddaf Car Wash. All rights reserved.',
    privacyPolicyUrl: '/privacy',
    termsUrl: '/terms',
    showSocialLinks: true,
  },
  branding: {
    logoUrl: '/logo.svg',
    faviconUrl: '/favicon.ico',
    primaryColor: '#1A5490',
    accentColor: '#E8B84B',
  },
} as const;

export type SiteSettings = typeof SITE_SETTINGS_DEFAULTS;
export type SiteSettingsKey = keyof SiteSettings;
