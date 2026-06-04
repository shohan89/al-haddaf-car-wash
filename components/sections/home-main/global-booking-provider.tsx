'use client'

import { BookingProvider } from '@/contexts/BookingContext'
import { BookingOptionsModal } from './booking-options-modal'
import { BookingModal } from './booking-modal'

export function GlobalBookingProvider({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      {children}
      <BookingOptionsModal />
      <BookingModal />
    </BookingProvider>
  )
}
