'use client'

import { useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const VISIBLE_COUNT = 5

export function CoverageBadges({ areas, areaTitle }: { areas: string[]; areaTitle: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const visible = areas.slice(0, VISIBLE_COUNT)
  const remaining = areas.length - visible.length

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-white/70 text-sm font-semibold uppercase tracking-widest mr-2">We Cover:</span>
        {visible.map((subArea, i) => (
          <Badge key={i} className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors px-3 py-1">
            <CheckCircle2 className="w-3 h-3 mr-1.5" /> {subArea}
          </Badge>
        ))}
        {remaining > 0 && (
          <button type="button" onClick={() => setIsOpen(true)}>
            <Badge className="bg-white text-primary border-white hover:bg-white/90 transition-colors px-3 py-1 cursor-pointer font-bold">
              +{remaining} More
            </Badge>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-lg max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col">
            <div className="bg-primary p-6 text-white relative shrink-0">
              <h2 className="text-xl font-bold">All Areas We Cover</h2>
              <p className="text-white/70 text-sm mt-1">Every neighborhood we serve in {areaTitle}.</p>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-wrap gap-3">
              {areas.map((subArea, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1">
                  <CheckCircle2 className="w-3 h-3 mr-1.5" /> {subArea}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
