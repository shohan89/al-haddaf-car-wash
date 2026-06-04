'use client'

import { Truck, Users, Droplets, ThumbsUp, MapPin, ArrowRight } from 'lucide-react'
import { useBookingModal } from '@/contexts/BookingContext'

const benefits = [
  { icon: Truck,     title: 'Fully Equipped Mobile Units', description: 'We bring our own water and electricity. Seamless service anywhere.' },
  { icon: Users,     title: 'Expert Team',                 description: 'Professionally trained detailers who treat your car with care.' },
  { icon: Droplets,  title: 'Premium Eco-Products',        description: 'High-quality, eco-friendly cleaning solutions for a lasting shine.' },
  { icon: ThumbsUp,  title: '98% Satisfaction',            description: 'Trusted by 5,000+ vehicle owners across Dubai.' },
  { icon: MapPin,    title: 'Dubai-Wide Coverage',         description: 'From Marina to Downtown, we come to your location.' },
]

export function Benefits() {
  const { openOptionsModal } = useBookingModal()

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[hsl(var(--brand-dark))] mb-4">
            Why Choose <span className="text-[hsl(var(--brand-primary))]">Alhaddaf</span>?
          </h2>
          <p className="text-[hsl(var(--brand-gray))] text-lg">
            Experience the difference of a truly premium mobile car wash service.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group p-6 rounded-xl bg-[hsl(var(--brand-light))] hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-[var(--shadow-xl)] transition-all duration-300 text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 mx-auto group-hover:bg-[hsl(var(--brand-primary))] transition-colors">
                <benefit.icon className="w-6 h-6 text-[hsl(var(--brand-primary))] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[hsl(var(--brand-dark))] mb-2">{benefit.title}</h3>
              <p className="text-[hsl(var(--brand-gray))] text-sm leading-relaxed">{benefit.description}</p>
              <div className="w-8 h-1 bg-[hsl(var(--brand-primary))] mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={() => openOptionsModal()} className="btn-primary">
            Choose Excellence – Book Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  )
}
