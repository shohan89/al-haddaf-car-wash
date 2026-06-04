'use client'

import { useState } from 'react'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookingModal } from '@/contexts/BookingContext'

const faqs = [
  { question: 'Do I need to provide water and electricity?', answer: 'No. Our mobile units are fully equipped with water, power, and professional tools. We bring everything needed to deliver a perfect service.' },
  { question: 'How long does detailing take?', answer: 'Depending on the package, 45 minutes to 2.5 hours. We\'ll give you an accurate estimate when you book.' },
  { question: 'Can I book for multiple cars at once?', answer: 'Yes. We offer group or fleet bookings at special discounted rates. Contact us for a custom quote.' },
  { question: 'Is your team trained for luxury or supercars?', answer: 'Absolutely. We specialize in premium care for all types, from sedans to S-Class and exotic models. Your vehicle is in expert hands.' },
  { question: 'What\'s your cancellation policy?', answer: 'You can cancel or reschedule up to 2 hours before your appointment at no charge.' },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { openOptionsModal } = useBookingModal()

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[hsl(var(--brand-dark))] mb-4">
              Frequently Asked <span className="text-[hsl(var(--brand-primary))]">Questions</span>
            </h2>
            <p className="text-[hsl(var(--brand-gray))] text-lg">
              Everything you need to know about our premium services
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100">
                <button
                  className="flex w-full items-center justify-between py-5 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-bold text-[hsl(var(--brand-dark))] hover:text-[hsl(var(--brand-primary))] transition-colors pr-4">
                    {faq.question}
                  </span>
                  <div className="shrink-0 ml-4">
                    {openIndex === index
                      ? <Minus className="w-5 h-5 text-[hsl(var(--brand-primary))]" />
                      : <Plus className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[hsl(var(--brand-gray))] text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 bg-[hsl(var(--brand-light))] p-8 rounded-xl">
            <p className="text-[hsl(var(--brand-dark))] font-medium mb-4">Ready to shine?</p>
            <button
              onClick={() => openOptionsModal()}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-[hsl(var(--brand-primary))] rounded-lg transition-all duration-300 hover:bg-[hsl(var(--brand-hover))] hover:shadow-lg"
            >
              Book Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
