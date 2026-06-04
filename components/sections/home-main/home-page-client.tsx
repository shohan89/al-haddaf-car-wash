'use client'

import { Hero } from './hero'
import { PainPoints } from './pain-points'
import { Benefits } from './benefits'
import { Services } from './services'
import { LimitedOffer } from './limited-offer'
import { Testimonials } from './testimonials'
import { FAQ } from './faq'
import { CTA } from './cta'
import { useBookingModal } from '@/contexts/BookingContext'

function MobileStickyButton() {
  const { openOptionsModal } = useBookingModal()
  return (
    <div className="md:hidden fixed bottom-6 right-6 z-50 animate-fade-in">
      <button
        onClick={() => openOptionsModal()}
        className="flex items-center gap-2 px-6 py-3 bg-[hsl(var(--brand-primary))] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        Book Now
      </button>
    </div>
  )
}

export function HomePageClient() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <PainPoints />
      <Benefits />
      <Services />
      <LimitedOffer />
      <Testimonials />
      <FAQ />
      <CTA />
      <MobileStickyButton />
    </div>
  )
}
