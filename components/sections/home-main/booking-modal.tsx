'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useBookingModal } from '@/contexts/BookingContext'
import { CheckCircle2, MapPin, Car, Phone, User, Sparkles, ArrowLeft, X } from 'lucide-react'

const formSchema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters'),
  phone:       z.string().min(9, 'Please enter a valid phone number'),
  address:     z.string().min(5, 'Please enter your location in Dubai'),
  serviceType: z.string().min(1, 'Please select a service'),
  carModel:    z.string().min(2, 'Please enter your car model'),
})

type FormValues = z.infer<typeof formSchema>

const services = [
  'Quick Car Wash (AED 79)',
  'Premium Car Wash (AED 129)',
  'Prestige Car Wash (AED 199)',
  'Interior Detailing (AED 299)',
  'Full Detailing + Polishing (AED 700)',
  'Exterior Car Polishing (AED 499)',
  'Custom Package',
]

export function BookingModal() {
  const { isOpen, closeModal, selectedService, openOptionsModal } = useBookingModal()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', phone: '', address: '', serviceType: 'Interior Detailing (AED 299)', carModel: '' },
  })

  useEffect(() => {
    if (selectedService) form.setValue('serviceType', selectedService)
  }, [selectedService, form])

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      await fetch('https://formsubmit.co/ajax/Manikhossainhridoy@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, _subject: `New Car Wash Booking: ${values.name}`, _template: 'table', _captcha: 'false' }),
      })
      const msg = `*New Booking Request from Website*%0A%0A*Name:* ${values.name}%0A*Phone:* ${values.phone}%0A*Address:* ${values.address}%0A*Service:* ${values.serviceType}%0A*Car Model:* ${values.carModel}%0A%0A_Sent from Website Booking Form_`
      setIsSubmitted(true)
      setTimeout(() => window.open(`https://wa.me/971555503288?text=${msg}`, '_blank'), 2000)
    } catch {
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    closeModal()
    setTimeout(() => setIsSubmitted(false), 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[450px] rounded-xl overflow-hidden shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <div className="bg-[#333232] p-6 text-white text-center relative">
              <h2 className="text-2xl font-bold text-white mb-2">Book My Service Now</h2>
              <p className="text-gray-300 text-sm">Fill in the details below and we&apos;ll come to you!</p>
              <button
                onClick={() => { closeModal(); setTimeout(() => openOptionsModal(), 200) }}
                className="absolute left-4 top-4 text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button onClick={handleClose} className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4 bg-white">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#333232] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#2388C7]" /> Name
                </label>
                <Input placeholder="Your Full Name" {...form.register('name')} className="focus-visible:ring-[#2388C7]" />
                {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#333232] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#2388C7]" /> Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-3 border rounded-md bg-gray-50 text-sm font-medium text-gray-500">+971</div>
                  <Input placeholder="5X XXX XXXX" {...form.register('phone')} className="focus-visible:ring-[#2388C7]" />
                </div>
                {form.formState.errors.phone && <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#333232] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2388C7]" /> Address in Dubai
                </label>
                <Input placeholder="Area, Building, Flat No." {...form.register('address')} className="focus-visible:ring-[#2388C7]" />
                {form.formState.errors.address && <p className="text-xs text-red-500">{form.formState.errors.address.message}</p>}
              </div>

              {/* Service + Car Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#333232] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2388C7]" /> Service
                  </label>
                  <select
                    {...form.register('serviceType')}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2388C7]"
                  >
                    {services.map((s) => (
                      <option key={s} value={s}>{s}{s.includes('Interior Detailing') ? ' ⭐ (Most Popular)' : ''}</option>
                    ))}
                  </select>
                  {form.formState.errors.serviceType && <p className="text-xs text-red-500">{form.formState.errors.serviceType.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#333232] flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#2388C7]" /> Car Model
                  </label>
                  <Input placeholder="e.g. Tesla Model 3" {...form.register('carModel')} className="focus-visible:ring-[#2388C7]" />
                  {form.formState.errors.carModel && <p className="text-xs text-red-500">{form.formState.errors.carModel.message}</p>}
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-[#2388C7] hover:bg-[#1a6ba3] transition-colors shadow-lg disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <span className="flex items-center gap-2"><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</span>
                    : 'Confirm Booking'}
                </Button>
                <p className="text-xs text-center text-gray-500 italic px-4">
                  &ldquo;We are a 100% mobile service—no need to visit a garage. We come to your location anywhere in Dubai.&rdquo;
                </p>
              </div>
            </form>
          </>
        ) : (
          <div className="p-12 flex flex-col items-center text-center bg-white animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#333232] mb-2">Booking Received!</h2>
            <p className="text-gray-600 mb-6">
              Thank you, {form.getValues('name')}! We&apos;re redirecting you to WhatsApp to confirm your time slot.
            </p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#2388C7] h-full" style={{ width: '100%', animation: 'progress 2s ease-in-out' }} />
            </div>
            <Button
              className="mt-8 bg-[#25D366] hover:bg-[#128C7E] text-white w-full"
              onClick={() => {
                const v = form.getValues()
                const msg = `*New Booking Request from Website*%0A%0A*Name:* ${v.name}%0A*Phone:* ${v.phone}%0A*Address:* ${v.address}%0A*Service:* ${v.serviceType}%0A*Car Model:* ${v.carModel}%0A%0A_Sent from Website Booking Form_`
                window.open(`https://wa.me/971555503288?text=${msg}`, '_blank')
              }}
            >
              Open WhatsApp Now
            </Button>
          </div>
        )}
      </div>
      <style>{`@keyframes progress { 0% { width: 0% } 100% { width: 100% } }`}</style>
    </div>
  )
}
