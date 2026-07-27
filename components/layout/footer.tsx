import Link from 'next/link'
import { Instagram, Facebook, Twitter, Linkedin, Youtube, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { getSiteSettings } from '@/actions/settings-actions'
import { SITE_SETTINGS_DEFAULTS } from '@/data/site-settings-defaults'
import { siteConfig } from '@/data/site-config'

export async function Footer() {
  let settings = SITE_SETTINGS_DEFAULTS
  try {
    settings = await getSiteSettings()
  } catch {
    // fall back to defaults
  }
  const { general, social, footer, branding } = settings

  const socialLinks = [
    { url: social.instagram, Icon: Instagram, label: 'Instagram' },
    { url: social.facebook, Icon: Facebook, label: 'Facebook' },
    { url: social.twitter, Icon: Twitter, label: 'Twitter' },
    { url: social.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { url: social.youtube, Icon: Youtube, label: 'YouTube' },
  ].filter(s => s.url)

  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="container-premium">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-12 w-48 brightness-0 invert">
                {branding.logoUrl && (
                  <Image
                    src={branding.logoUrl}
                    alt={general.companyName}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
            </Link>
            <p className="text-white/70 leading-relaxed">
              {footer.tagline}
            </p>
            {footer.showSocialLinks && socialLinks.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {socialLinks.map(({ url, Icon, label }) => (
                  <Link
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {siteConfig.mainNav.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-lg font-bold mb-6">Opening Hours</h4>
            <ul className="space-y-4 text-white/70">
              <li>
                <p className="text-white font-semibold text-sm mb-0.5">Monday – Saturday</p>
                <p>{general.businessHoursMF}</p>
              </li>
              <li>
                <p className="text-white font-semibold text-sm mb-0.5">Sunday</p>
                <p>{general.businessHoursSun}</p>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Get In Touch</h4>
            <div className="space-y-4">
              <Link href={`tel:${general.phone}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Phone size={18} className="text-secondary flex-shrink-0" />
                {general.phone}
              </Link>
              {general.phoneAlt && (
                <Link href={`tel:${general.phoneAlt}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone size={18} className="text-secondary flex-shrink-0" />
                  {general.phoneAlt}
                </Link>
              )}
              <Link href={`mailto:${general.email}`} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <Mail size={18} className="text-secondary flex-shrink-0" />
                {general.email}
              </Link>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                {general.address}
              </div>
            </div>
            <Link href={`https://wa.me/${general.whatsapp}`} target="_blank">
              <Button variant="whatsapp" className="w-full">
                Chat on WhatsApp
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>
            © {new Date().getFullYear()} {footer.copyrightText} · Design &amp; Developed by{' '}
            <Link
              href="https://hellotomarketing.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              Hello To Marketing
            </Link>
          </p>
          <div className="flex gap-8">
            <Link href={footer.privacyPolicyUrl} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href={footer.termsUrl} className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
