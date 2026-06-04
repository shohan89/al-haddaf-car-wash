'use client'

import * as React from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface Faq {
  id: string
  question: string
  answer: string
  category?: { name: string } | null
}

export function FAQAccordion({ dbFaqs = [] }: { dbFaqs?: Faq[] }) {
  const [openIndex, setOpenIndex] = React.useState<string | null>(null)

  const groupedFaqs = dbFaqs.reduce((acc, faq) => {
    const catName = faq.category?.name || 'General';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(faq);
    return acc;
  }, {} as Record<string, Faq[]>);

  const categories = Object.keys(groupedFaqs);

  if (dbFaqs.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container-premium max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about our services.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category}>
              {categories.length > 1 && (
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">{category}</h3>
              )}
              <div className="space-y-4">
                {groupedFaqs[category].map((faq) => (
                  <div
                    key={faq.id}
                    className={cn(
                      'rounded-2xl border border-border transition-all duration-200',
                      openIndex === faq.id ? 'bg-muted/30 border-primary/20' : 'bg-white hover:border-primary/20'
                    )}
                  >
                    <button
                      className="flex w-full items-center justify-between p-6 text-left"
                      onClick={() => setOpenIndex(openIndex === faq.id ? null : faq.id)}
                    >
                      <span className="text-lg font-bold text-foreground">{faq.question}</span>
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300',
                        openIndex === faq.id ? 'bg-primary text-white rotate-180' : 'bg-muted text-primary'
                      )}>
                        {openIndex === faq.id ? <Minus size={18} /> : <Plus size={18} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openIndex === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
