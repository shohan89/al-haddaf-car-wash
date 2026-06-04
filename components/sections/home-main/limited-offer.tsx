'use client'

import { Phone, ArrowRight } from 'lucide-react'
import { useBookingModal } from '@/contexts/BookingContext'

export function LimitedOffer() {
  const { openOptionsModal } = useBookingModal()

  return (
    <section className="bg-[hsl(var(--brand-primary))] text-white py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="container-custom relative z-10 text-center">
        <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-4 animate-pulse">
          ⚠️ Premium Service
        </div>

        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
          Premium Mobile Car Wash – Book Today!
        </h2>

        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Experience the best mobile car wash in Dubai. We come to you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openOptionsModal()}
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg transition-all duration-300 hover:shadow-lg w-full sm:w-auto bg-white text-[hsl(var(--brand-primary))] hover:bg-gray-100"
          >
            Book Online Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>

          <a
            href="tel:+971555503288"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-colors w-full sm:w-auto"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call +971 55 550 3288
          </a>
        </div>
      </div>
    </section>
  )
}
