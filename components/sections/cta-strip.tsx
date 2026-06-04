import { siteConfig } from '@/data/site-config'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import { BookNowButton } from '@/components/shared/book-now-button'

export function CTAStrip() {
  return (
    <section className="bg-secondary py-12 text-white">
      <div className="container-premium flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to give your car a premium shine?
          </h2>
          <p className="text-white/80 text-lg">
            Professional detailing at your location, anywhere in Dubai.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <BookNowButton className="inline-flex items-center justify-center h-16 px-10 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
            Book Appointment Now
          </BookNowButton>
          <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-xl font-bold hover:text-white/80 transition-colors">
            <div className="h-12 w-12 rounded-full border-2 border-white/20 flex items-center justify-center">
              <Phone size={24} />
            </div>
            {siteConfig.phone}
          </a>
        </div>
      </div>
    </section>
  )
}
