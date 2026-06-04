'use client'

import React, { createContext, useContext, useState } from 'react'

interface BookingContextType {
  isOpen: boolean
  isOptionsOpen: boolean
  openModal: (service?: string) => void
  closeModal: () => void
  openOptionsModal: () => void
  closeOptionsModal: () => void
  selectedService: string
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('')

  const openModal = (service = '') => {
    setSelectedService(service)
    setIsOpen(true)
    setIsOptionsOpen(false)
  }

  const closeModal = () => setIsOpen(false)
  const openOptionsModal = () => setIsOptionsOpen(true)
  const closeOptionsModal = () => setIsOptionsOpen(false)

  return (
    <BookingContext.Provider value={{ isOpen, isOptionsOpen, openModal, closeModal, openOptionsModal, closeOptionsModal, selectedService }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBookingModal() {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBookingModal must be used within a BookingProvider')
  return context
}
