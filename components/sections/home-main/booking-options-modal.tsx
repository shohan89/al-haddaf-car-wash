'use client'

import { Phone, MessageSquare, ClipboardList, X } from 'lucide-react'
import { useBookingModal } from '@/contexts/BookingContext'

export function BookingOptionsModal() {
  const { isOptionsOpen, closeOptionsModal, openModal } = useBookingModal()

  if (!isOptionsOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOptionsModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[400px] rounded-xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-[#333232] p-6 text-white text-center relative">
          <h2 className="text-2xl font-bold text-white mb-2">Book Your Service</h2>
          <p className="text-gray-300 text-sm">Choose how you&apos;d like to book with us</p>
          <button
            onClick={closeOptionsModal}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4 bg-white">
          <a
            href="https://wa.me/971555503288?text=I%20want%20to%20book%20a%20car%20wash"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-all group"
            onClick={closeOptionsModal}
          >
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-green-700 text-lg leading-tight">Book via WhatsApp</h4>
              <p className="text-green-600 text-sm">Instant confirmation</p>
            </div>
          </a>

          <a
            href="tel:+971555503288"
            className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-all group"
            onClick={closeOptionsModal}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-blue-700 text-lg leading-tight">Direct Call</h4>
              <p className="text-blue-600 text-sm">Talk to our team</p>
            </div>
          </a>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-4 w-full p-4 rounded-xl border-2 border-orange-500 bg-orange-50 hover:bg-orange-100 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-orange-700 text-lg leading-tight">Booking Form</h4>
              <p className="text-orange-600 text-sm">Quick &amp; Easy</p>
            </div>
          </button>
        </div>

        <div className="bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-500 italic">
            &ldquo;Your satisfaction is our priority. We are open 24/7.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
