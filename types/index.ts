export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type Service = {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  price: number
  duration: string
  image: string
  features: string[]
  benefits: string[]
  faqs?: { question: string; answer: string }[]
  isPopular?: boolean
  metaTitle: string
  metaDescription: string
}

export type Area = {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  image?: string | null
  highlights?: string[]
  faqs?: { question: string; answer: string }[]
  metaTitle?: string | null
  metaDescription?: string | null
}

export type Review = {
  id: string
  author: string
  role: string
  content: string
  rating: number
  avatar: string
}

export type ContactFormValues = {
  name: string
  email: string
  phone: string
  carModel: string
  service: string
  message: string
}
