'use client'

import { ArrowRight, Phone, MessageSquare } from 'lucide-react'
import { useBookingModal } from '@/contexts/BookingContext'

export function CTA() {
  const { openOptionsModal } = useBookingModal()

  return (
    <section id="book-now" className="section-padding bg-[hsl(var(--brand-light))]">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[hsl(var(--brand-dark))] mb-6 leading-tight">
            Ready for the Easiest Car Wash in Dubai? Book in 1 Minute.
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12 relative">
            <div className="hidden md:block absolute top-[28px] left-1/6 right-1/6 h-0.5 bg-gray-200 z-0" />
            {[
              { step: 1, title: 'Book Online',    desc: 'Select service & details' },
              { step: 2, title: 'Pick Time/Place', desc: 'Anywhere in Dubai' },
              { step: 3, title: 'Relax',           desc: 'We handle the rest' },
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[hsl(var(--brand-primary))] text-white text-xl font-bold flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--brand-dark))] mb-1">{item.title}</h3>
                <p className="text-[hsl(var(--brand-gray))]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <button
              onClick={() => openOptionsModal()}
              className="btn-primary w-full md:w-auto text-xl px-12 py-5 shadow-[var(--shadow-xl)] hover:shadow-xl transform hover:scale-[1.02] inline-flex items-center justify-center"
            >
              Book Now
              <ArrowRight className="w-6 h-6 ml-2" />
            </button>
            <p className="text-[hsl(var(--brand-gray))] mt-6 italic text-lg">
              Your car reflects you.{' '}
              <span className="font-semibold text-[hsl(var(--brand-dark))]">Keep it spotless.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 pt-8 border-t border-gray-200">
            <a
              href="https://wa.me/971555503288?text=I%20want%20to%20book%20car%20wash%2C%20booking%20from%20website"
              className="flex items-center gap-3 text-lg font-bold text-[hsl(var(--brand-dark))] hover:text-[hsl(var(--brand-primary))] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              +971 55 550 3288
            </a>
            <a
              href="https://wa.me/971555503288?text=I%20want%20to%20book%20car%20wash%2C%20booking%20from%20website"
              className="flex items-center gap-3 text-lg font-bold text-[hsl(var(--brand-dark))] hover:text-green-500 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
