'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { MoveHorizontal } from 'lucide-react'
import { useBookingModal } from '@/contexts/BookingContext'

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD YOUR OWN PHOTOS
// 1. Drop images into /public/gallery/ in your project
// 2. Name them: before-1.jpg, after-1.jpg, before-2.jpg, after-2.jpg, etc.
// 3. Update the title / service label in the transformations array below
// ─────────────────────────────────────────────────────────────────────────────

const transformations = [
  {
    id: 1,
    title: 'Exterior Deep Clean',
    service: 'Prestige Car Wash',
    before: '/gallery/before-1.jpg',
    after: '/gallery/after-1.jpg',
  },
  {
    id: 2,
    title: 'Interior Detailing',
    service: 'Interior Detailing',
    before: '/gallery/before-2.jpg',
    after: '/gallery/after-2.jpg',
  },
  {
    id: 3,
    title: 'Full Detailing & Polish',
    service: 'Full Detailing + Polishing',
    before: '/gallery/before-3.jpg',
    after: '/gallery/after-3.jpg',
  },
]

// ─── Fallback shown when the image file hasn't been added yet ────────────────
function Placeholder({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${
        accent ? 'bg-primary/8' : 'bg-gray-100'
      }`}
    >
      <div
        className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl ${
          accent ? 'bg-primary/15' : 'bg-gray-200'
        }`}
      >
        {accent ? '✨' : '📷'}
      </div>
      <span className="text-xs font-semibold text-gray-400">{label}</span>
    </div>
  )
}

// ─── Individual drag-to-reveal slider card ───────────────────────────────────
function SliderCard({ item }: { item: (typeof transformations)[0] }) {
  const { openOptionsModal } = useBookingModal()
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [beforeError, setBeforeError] = useState(false)
  const [afterError, setAfterError] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50
    const rect = containerRef.current.getBoundingClientRect()
    return Math.min(97, Math.max(3, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      setPosition(getPercent(e.clientX))
    },
    [isDragging, getPercent]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      setPosition(getPercent(e.touches[0].clientX))
    },
    [getPercent]
  )

  return (
    <div className="group rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-premium transition-all">
      {/* ── Slider area ── */}
      <div
        ref={containerRef}
        className="relative h-72 select-none cursor-ew-resize overflow-hidden touch-none"
        onMouseMove={onMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={onTouchMove}
        onTouchStart={() => {}}
      >
        {/* After image — full-width base layer */}
        {afterError ? (
          <Placeholder label="After Photo" accent />
        ) : (
          <Image
            src={item.after}
            alt={`After — ${item.title}`}
            fill
            className="object-cover"
            onError={() => setAfterError(true)}
          />
        )}

        {/* Before image — clipped from the right via clipPath */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {beforeError ? (
            <Placeholder label="Before Photo" />
          ) : (
            <Image
              src={item.before}
              alt={`Before — ${item.title}`}
              fill
              className="object-cover"
              onError={() => setBeforeError(true)}
            />
          )}
        </div>

        {/* Divider line + drag handle */}
        <div
          className="absolute inset-y-0 z-30 flex items-center pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg -translate-x-px" />
          <div className="relative -translate-x-1/2 h-11 w-11 rounded-full bg-white shadow-xl border-2 border-primary flex items-center justify-center pointer-events-auto cursor-ew-resize">
            <MoveHorizontal size={18} className="text-primary" />
          </div>
        </div>

        {/* Before / After labels */}
        <span className="absolute top-3 left-3 z-20 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm pointer-events-none">
          Before
        </span>
        <span className="absolute top-3 right-3 z-20 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm pointer-events-none">
          After
        </span>

        {/* Drag hint — fades out after first drag */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          ← Drag to compare →
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-t border-border">
        <div>
          <p className="font-black text-gray-900 text-sm">{item.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{item.service}</p>
        </div>
        <button
          onClick={() => openOptionsModal()}
          className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
        >
          Book This →
        </button>
      </div>
    </div>
  )
}

// ─── Bottom CTA uses context (must be inside GlobalBookingProvider) ──────────
function BookYourTransformationButton() {
  const { openOptionsModal } = useBookingModal()
  return (
    <button
      onClick={() => openOptionsModal()}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-black text-white hover:bg-primary/90 shadow-premium transition-all"
    >
      Book Your Transformation →
    </button>
  )
}

// ─── Section export ──────────────────────────────────────────────────────────
export function BeforeAfterGallery() {
  return (
    <section className="py-24 bg-white">
      <div className="container-premium">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-primary text-sm font-bold">
            Real Results
          </div>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            See the Transformation
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Drag the slider on each card to compare before &amp; after. Every vehicle, every time.
          </p>
        </div>

        {/* Slider grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {transformations.map((item) => (
            <SliderCard key={item.id} item={item} />
          ))}
        </div>

        {/* Photo instructions */}
        <p className="mt-8 text-center text-xs text-muted-foreground/50">
          To add your own photos: drop images into{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">/public/gallery/</code> named{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">before-1.jpg</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">after-1.jpg</code>, … up to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">before-3.jpg</code> /{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">after-3.jpg</code>
        </p>

        {/* CTA */}
        <div className="mt-10 text-center">
          <BookYourTransformationButton />
        </div>
      </div>
    </section>
  )
}
