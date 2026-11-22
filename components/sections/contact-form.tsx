'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, ContactInput } from '@/lib/validations'
import { createContactSubmission } from '@/actions/contact'
import { notifyByEmail } from '@/lib/web3forms-client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, MessageSquare } from 'lucide-react'

const SUBJECTS = [
  'Book a Service',
  'General Inquiry',
  'Custom Package',
  'Fleet Services',
  'Complaint / Feedback',
  'Other',
]

export function ContactForm() {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    setServerError('')
    const result = await createContactSubmission(data)
    if (result.success) {
      notifyByEmail(`New Contact Form Submission: ${data.subject}`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      })
      setSuccess(true)
      reset()
    } else {
      setServerError(result.error ?? 'Something went wrong. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-primary mb-2">Message Sent!</h3>
          <p className="text-muted-foreground max-w-sm">
            Thank you for reaching out. Our team will get back to you within 2 hours.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/971555503288"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors"
          >
            Continue on WhatsApp
          </a>
          <button
            onClick={() => setSuccess(false)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Honeypot */}
      <input {...register('honeypot')} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Full Name *</label>
          <Input {...register('name')} placeholder="e.g. Ahmed Al Mansoori" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
          <Input {...register('phone')} placeholder="e.g. 050 123 4567" type="tel" />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Email Address *</label>
        <Input {...register('email')} placeholder="you@example.com" type="email" />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Subject *</label>
        <select
          {...register('subject')}
          className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <option value="">— Select a subject —</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Message *</label>
        <Textarea
          {...register('message')}
          placeholder="Tell us how we can help you..."
          rows={5}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full h-13 text-base font-bold" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 size={18} className="animate-spin mr-2" /> Sending…</>
        ) : (
          <><MessageSquare size={18} className="mr-2" /> Send Message</>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        We respond within 2 hours · Mon–Sat 8 AM–10 PM · Sun 9 AM–8 PM
      </p>
    </form>
  )
}
