'use client'

import { XCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { useBookingModal } from '@/contexts/BookingContext'

export function PainPoints() {
  const { openOptionsModal } = useBookingModal()

  return (
    <section className="section-padding bg-[hsl(var(--brand-light))]">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Pain points */}
          <div className="space-y-8 animate-slide-in-left">
            <h2 className="text-3xl md:text-5xl font-bold text-[hsl(var(--brand-dark))] mb-6">
              Why Queues <span className="text-red-500">Suck</span>,{' '}
              <br />We <span className="text-[hsl(var(--brand-primary))]">Fix It</span>.
            </h2>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-400 mt-1 shrink-0" />
                <span className="text-lg text-gray-600">No more waiting in long lines at the petrol station.</span>
              </li>
              <li className="flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-400 mt-1 shrink-0" />
                <span className="text-lg text-gray-600">Stop wasting your precious weekends on car maintenance.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[hsl(var(--brand-primary))] mt-1 shrink-0" />
                <span className="text-lg text-gray-800 font-medium">We come to you, Home, Office, or Anywhere in Dubai.</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[hsl(var(--brand-primary))] mt-1 shrink-0" />
                <span className="text-lg text-gray-800 font-medium">Fully equipped mobile units (No water/electricity needed).</span>
              </li>
            </ul>

            <div className="pt-4">
              <button onClick={() => openOptionsModal()} className="btn-primary">
                Book My Service Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          {/* Right: Stats card */}
          <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-[var(--shadow-xl)] bg-white p-8 border border-gray-100 flex flex-col justify-center items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand-primary))]/5 to-transparent z-0" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[hsl(var(--brand-dark))] mb-4">
                Alhaddaf brings pro care right to you.
              </h3>
              <p className="text-gray-500 mb-6">
                Experience the convenience of a showroom shine without leaving your doorstep.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <span className="block text-2xl font-bold text-[hsl(var(--brand-primary))]">0</span>
                  <span className="text-sm text-gray-500">Minutes Waited</span>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <span className="block text-2xl font-bold text-[hsl(var(--brand-primary))]">100%</span>
                  <span className="text-sm text-gray-500">Convenience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
