'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { BookingStatus } from '@prisma/client'

export async function updateBookingStatus(id: string, status: BookingStatus) {
  try {
    await prisma.booking.update({ where: { id }, data: { status } })
    revalidatePath('/admin/bookings')
    return { success: true }
  } catch (error) {
    console.error('Error updating booking status:', error)
    return { success: false, error: 'Failed to update booking status.' }
  }
}

export async function getDashboardStats() {
  const [
    totalServices,
    publishedServices,
    totalReviews,
    totalBlogs,
    publishedBlogs,
    totalFaqs,
    totalAreas,
    totalContacts,
    latestReviews,
    recentContacts,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { isPublished: true } }),
    prisma.review.count(),
    prisma.post.count(),
    prisma.post.count({ where: { isPublished: true } }),
    prisma.faq.count(),
    prisma.area.count(),
    prisma.contactSubmission.count(),
    prisma.review.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: { id: true, author: true, rating: true, content: true, avatar: true, location: true, createdAt: true }
    }),
    prisma.contactSubmission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, subject: true, status: true, createdAt: true }
    }),
  ])

  return {
    totalServices,
    publishedServices,
    totalReviews,
    totalBlogs,
    publishedBlogs,
    totalFaqs,
    totalAreas,
    totalContacts,
    latestReviews,
    recentContacts,
  }
}
