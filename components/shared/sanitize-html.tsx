'use client'
import DOMPurify from 'dompurify'

interface SanitizeHTMLProps {
  html: string
  className?: string
}

export function SanitizeHTML({ html, className }: SanitizeHTMLProps) {
  const cleanHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(html) : html
  return <div className={className} dangerouslySetInnerHTML={{ __html: cleanHtml }} />
}
