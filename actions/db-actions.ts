'use server'

import prisma from '@/lib/db'
import { bookingSchema, reviewSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function createBooking(data: any) {
  try {
    // 1. Validation
    const validatedData = bookingSchema.parse(data)
    
    // 2. Prepare scheduled date
    const scheduledAt = new Date(`${validatedData.date}T${validatedData.time}`)
    
    // 3. Database Storage
    const booking = await prisma.booking.create({
      data: {
        serviceId: validatedData.serviceId,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerPhone: validatedData.customerPhone,
        carModel: validatedData.carModel,
        location: validatedData.location,
        scheduledAt,
        notes: validatedData.notes,
      },
      include: {
        service: true
      }
    })
    
    revalidatePath('/admin/bookings') // Revalidate for admin dashboard

    return {
      success: true, 
      data: {
        id: booking.id,
        serviceName: booking.service.title,
        customerName: booking.customerName
      } 
    }
  } catch (error: any) {
    console.error('Booking creation error:', error)
    if (error.name === 'ZodError') {
      return { success: false, error: 'Invalid form data' }
    }
    return { success: false, error: 'Failed to create booking. Please try again.' }
  }
}

export async function createReview(data: any) {
  try {
    const validatedData = reviewSchema.parse(data)
    
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        avatar: `https://i.pravatar.cc/150?u=${validatedData.author}`,
      },
    })
    
    revalidatePath('/')
    return { success: true, data: review }
  } catch (error) {
    console.error('Review creation error:', error)
    return { success: false, error: 'Failed to submit review' }
  }
}

export async function getServices() {
  return await prisma.service.findMany({
    orderBy: { price: 'asc' },
  })
}
