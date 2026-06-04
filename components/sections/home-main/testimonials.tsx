'use client'

import { Star, Quote, ArrowRight } from 'lucide-react'

const testimonials = [
  { quote: 'Best car wash in Dubai! Their experienced team delivered an incredible Platinum Wash—my car shines like new inside and out. Affordable prices, perfect details, and top-quality service. Highly recommend and will return!', author: 'Sudip Khatri', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Outstanding mobile service with exceptional attention to detail. My car has never looked this clean. Professional, efficient team takes pride in their work. Without doubt, the best car wash in Dubai. Highly recommended!', author: 'prince mehedi', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Great mobile car wash at home—super convenient anywhere in Dubai. No need to search "car wash near me" anymore. Expert deep cleaning for busy people. Honestly the best car wash service in Dubai!', author: 'M Emam Hossein', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Fantastic mobile Platinum Full Wash & Detailing at home. Next-level results—easy to see why they\'re Dubai\'s best. Perfect deep car cleaning for busy schedules. Highly recommend this reliable service!', author: 'fahad fahad', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Excellent Platinum full wash & detailing—found them searching "car wash near me." Super easy mobile service at home, on time, and my car looked brand new. Best in Dubai for busy people!', author: 'S.A.', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Extremely happy with car seat cleaning—they removed all stains perfectly, leaving seats like new. Professional, fast team at the best price. Highly recommend Alhaddaf for top-quality cleaning!', author: 'Md. Lokman Hossain', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Beyond impressed with interior detailing—toughest stains gone, seats spotless like new. Exceptional service, great attention to detail, efficiency, and competitive price. Highly recommend!', author: 'Ajmal Roshil', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Excellent team—Arid, Nasir, and Mallick were superb professionals. Removed tough stains and odors from my car patiently and thoroughly, despite late call. Shiny results—highly recommend!', author: 'Ashwin Jokhoo', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Best car wash in Dubai! Unbelievable before-and-after from deep detailing & polishing—car looks brand new. Love the mobile service. Highly recommend Alhaddaf!', author: 'Al Jabir', location: '⭐️⭐️⭐️⭐️⭐️' },
  { quote: 'Instant response, agreed on rival price for deep cleaning. In 30 minutes, they arrived and cleaned interior/exterior perfectly—nothing missed. 10/10, highly recommend!', author: 'Adham Elkholy', location: '⭐️⭐️⭐️⭐️⭐️' },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-[hsl(var(--brand-light))] overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[hsl(var(--brand-dark))] mb-4">
            What Our <span className="text-[hsl(var(--brand-primary))]">Customers</span> Say
          </h2>
          <p className="text-[hsl(var(--brand-gray))] text-lg">
            Join over 1,200 satisfied customers across Dubai (98% Satisfaction Rate)
          </p>
        </div>

        {/* Scrolling Carousel */}
        <div className="relative w-full">
          <div className="flex animate-scroll w-max gap-6 hover:pause">
            {[...testimonials, ...testimonials].map((t, index) => (
              <div
                key={index}
                className="card-testimonial w-[300px] md:w-[400px] shrink-0 relative bg-white border border-transparent hover:border-[hsl(var(--brand-primary))]/20 transition-all duration-300 p-6 rounded-xl"
              >
                <Quote className="w-8 h-8 text-[hsl(var(--brand-primary))]/10 absolute top-6 right-6" />

                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-[hsl(var(--brand-quote))] italic mb-6 leading-relaxed text-sm md:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div>
                  <p className="font-bold text-[hsl(var(--brand-dark))]">{t.author}</p>
                  <p className="text-xs text-[hsl(var(--brand-gray))] mt-1">{t.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient edge overlays */}
          <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[hsl(var(--brand-light))] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[hsl(var(--brand-light))] to-transparent z-10 pointer-events-none" />
        </div>

        <div className="text-center mt-12">
          <a href="#book-now" className="btn-secondary inline-flex items-center">
            Book with Confidence
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  )
}
