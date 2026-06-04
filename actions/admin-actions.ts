'use server'

import prisma from '@/lib/db'

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
