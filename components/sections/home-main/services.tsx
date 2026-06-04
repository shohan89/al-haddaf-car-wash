'use client'

import { Check, Sparkles, ArrowRight, Zap, Star, Crown, Gem, Shield } from 'lucide-react'
import Link from 'next/link'
import { useBookingModal } from '@/contexts/BookingContext'

const services = [
  { name: 'Quick Car Wash',        price: 'AED 79',      features: ['Quick clean for everyday shine'],                              icon: Zap,      popular: false },
  { name: 'Premium Car Wash',      price: 'AED 129',     features: ['Deep wash with a crystal-clear finish'],                       icon: Star,     popular: false },
  { name: 'Prestige Car Wash',     price: 'AED 199',     features: ['Premium care with spotless perfection'],                       icon: Crown,    popular: false },
  { name: 'Interior Detailing',    price: 'AED 299',     features: ['Complete interior & exterior detailing for a luxury feel'],    icon: Gem,      popular: true  },
  { name: 'Exterior Car Polishing',price: 'AED 499',     features: ['Ultimate paint restoration and scratch removal'],              icon: Shield,   popular: false },
  { name: 'Custom Package',        price: 'Contact Us',  features: ['Tailored specifically to your vehicle\'s needs'],             icon: Sparkles, popular: false },
]

export function Services() {
  const { openOptionsModal } = useBookingModal()

  return (
    <section id="services" className="py-24 md:py-32 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold tracking-wider text-[hsl(var(--brand-primary))] uppercase bg-[hsl(var(--brand-primary))]/10 rounded-full">
            Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[hsl(var(--brand-dark))] mb-4">
            Services &amp; <span className="text-[hsl(var(--brand-primary))]">Pricing</span>
          </h2>
          <p className="text-[hsl(var(--brand-gray))] text-lg">All at your location. No hidden fees.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-[var(--shadow-xl)] ${
                service.popular
                  ? 'border-[hsl(var(--brand-primary))] bg-[hsl(var(--brand-primary))]/5 shadow-lg scale-[1.02] md:scale-105 z-10'
                  : 'border-gray-100 bg-white shadow-sm hover:border-[hsl(var(--brand-primary))]/30'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[hsl(var(--brand-primary))] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div className="mb-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${service.popular ? 'bg-[hsl(var(--brand-primary))] text-white' : 'bg-[hsl(var(--brand-primary))]/10 text-[hsl(var(--brand-primary))]'}`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[hsl(var(--brand-dark))] text-lg leading-tight">{service.name}</h3>
                  <p className="text-[hsl(var(--brand-primary))] font-extrabold text-2xl">{service.price}</p>
                </div>
              </div>

              <div className="flex-grow mb-6">
                {service.features.map((feature, i) => (
                  <p key={i} className="text-[hsl(var(--brand-gray))] text-sm leading-relaxed flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {feature}
                  </p>
                ))}
              </div>

              <button
                onClick={() => openOptionsModal()}
                className={`w-full py-3 rounded-lg font-bold text-center transition-all ${
                  service.popular
                    ? 'bg-[hsl(var(--brand-primary))] text-white hover:bg-[hsl(var(--brand-hover))] shadow-md'
                    : 'bg-gray-50 text-[hsl(var(--brand-dark))] hover:bg-gray-100 hover:text-[hsl(var(--brand-primary))]'
                }`}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Bundle Deal */}
        <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--brand-primary))] text-white shadow-[var(--shadow-lg)] transform transition-transform hover:scale-[1.01] duration-300">
          <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white">Best Value Bundle</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">Full Detailing + Polishing</h3>
              <p className="text-blue-100 text-lg mb-4">Get the complete showroom experience.</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-2xl text-blue-200 line-through">AED 799</span>
                <span className="text-4xl font-bold text-white">AED 700</span>
                <span className="text-sm font-bold bg-green-500 text-white px-2 py-1 rounded">Save AED 99</span>
              </div>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-4">
              <Link
                href="/services/full-car-detailing-polishing"
                className="btn-bundle bg-white/10 text-white hover:bg-white/20 border-white/20 border-2"
              >
                Learn More
              </Link>
              <button
                onClick={() => openOptionsModal()}
                className="btn-bundle bg-white text-[hsl(var(--brand-primary))] hover:bg-gray-100 border-none shadow-lg inline-flex items-center justify-center"
              >
                Grab Bundle Deal
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* 3-step CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-[hsl(var(--brand-dark))] mb-10">Ready to Book?</h3>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {['Book Online', 'We Arrive', 'You Relax'].map((step, i) => (
              <div key={i} className="flex flex-col items-center max-w-[150px]">
                <div className="w-10 h-10 rounded-full bg-[hsl(var(--brand-primary))] text-white font-bold text-lg flex items-center justify-center mb-3 shadow-md">
                  {i + 1}
                </div>
                <p className="font-bold text-[hsl(var(--brand-dark))] text-sm">{step}</p>
              </div>
            ))}
          </div>
          <div className="max-w-md mx-auto">
            <button
              onClick={() => openOptionsModal()}
              className="w-full flex items-center justify-between bg-[hsl(var(--brand-primary))] text-white p-4 rounded-lg font-bold shadow-sm hover:bg-[hsl(var(--brand-hover))] transition-colors"
            >
              <span>Book Your Wash</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
