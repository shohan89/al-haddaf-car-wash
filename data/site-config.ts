export const siteConfig = {
  name: 'Al Haddaf Car Wash',
  description: 'Premium Mobile Car Wash Services in Dubai. Professional detailing, steam cleaning, and ceramic coating at your doorstep.',
  url: 'https://alhaddafcarwash.ae',
  ogImage: 'https://alhaddafcarwash.ae/og-image.jpg',
  links: {
    instagram: 'https://instagram.com/alhaddafcarwash',
    whatsapp: 'https://wa.me/971555503288',
  },
  address: 'Dubai, United Arab Emirates',
  phone: '+971 55 550 3288',
  email: 'info@alhaddafcarwash.ae',
  businessHours: {
    mon_sat: '8:00 AM - 10:00 PM',
    sun: '9:00 AM - 8:00 PM',
  },
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Services', href: '/services/mobile-car-wash-dubai' },
    { title: 'Areas', href: '/areas/dubai-marina' },
    { title: 'Pricing', href: '/#services' },
    { title: 'About', href: '#about' },
    { title: 'Contact', href: '/contact' },
  ],
  serviceAreas: [
    'Dubai Marina',
    'Palm Jumeirah',
    'Downtown Dubai',
    'Business Bay',
    'Jumeirah Lakes Towers (JLT)',
    'Jumeirah Beach Residence (JBR)',
    'Arabian Ranches',
    'Mirdif',
  ],
}

export type SiteConfig = typeof siteConfig
