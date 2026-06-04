'use client'

import { useBookingModal } from '@/contexts/BookingContext'
import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<typeof Button>

export function BookNowButton({ children, className, variant, size, ...props }: ButtonProps) {
  const { openOptionsModal } = useBookingModal()
  return (
    <Button
      onClick={() => openOptionsModal()}
      className={className}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  )
}
