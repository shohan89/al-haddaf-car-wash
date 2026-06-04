'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Star, MapPin, ShieldCheck, Users } from 'lucide-react'
import { useBookingModal } from '@/contexts/BookingContext'

const heroImages = [
  '/Alhaddafcarwash-1.jpg',
  '/Alhaddafcarwash-2.jpg',
  '/Alhaddafcarwash-3.jpg',
]

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { openOptionsModal } = useBookingModal()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[100dvh] min-h-[600px] flex items-center overflow-hidden pt-24">
      {/* Background Image Slider */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent/20" />
        </div>
      ))}

      <div className="container-custom relative z-10 text-white">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--brand-primary))]/20 backdrop-blur-sm border border-[hsl(var(--brand-primary))]/30 rounded-full text-sm font-medium text-white mb-6 animate-fade-in shadow-sm">
            <Star className="w-4 h-4 fill-[hsl(var(--brand-primary))] text-[hsl(var(--brand-primary))]" />
            <span>#1 Mobile Car Wash in Dubai – Trusted by Over 1,200 Car Owners</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold italic leading-tight mb-6 animate-fade-in-up drop-shadow-lg text-white">
            Every Wash is a <span className="text-[hsl(var(--brand-primary))]">Masterpiece</span>.<br />
            Delivered to Your Doorstep.
          </h1>

          {/* Subheadline */}
          <p
            className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-up drop-shadow-md bg-black/10 backdrop-blur-[1px] rounded-lg p-2 inline-block"
            style={{ animationDelay: '0.2s' }}
          >
            Skip the heat and the queues. We bring Dubai&apos;s #1 mobile detailing service to your home or office.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => openOptionsModal()} className="btn-primary text-lg">
              Book Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-white/50 bg-white/5 backdrop-blur-sm rounded-lg transition-all duration-300 hover:bg-white hover:text-[hsl(var(--brand-dark))] hover:border-white focus:outline-none"
            >
              See Services
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {[
              { Icon: Star, label: '4.9/5 Rating' },
              { Icon: MapPin, label: 'Dubai-Wide' },
              { Icon: ShieldCheck, label: 'Fully Insured' },
              { Icon: Users, label: 'Expert Team' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-[hsl(var(--brand-primary))]" />
                </div>
                <span className="text-sm font-medium text-gray-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  )
}
