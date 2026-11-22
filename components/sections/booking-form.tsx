'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bookingSchema, type BookingInput } from '@/lib/validations'
import { createBooking } from '@/actions/db-actions'
import { notifyByEmail } from '@/lib/web3forms-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, Loader2, MessageSquare, Phone, MapPin, Calendar, Clock, Car } from 'lucide-react'
import { Service } from '@/types'

interface BookingFormProps {
  services: Service[]
}

export function BookingForm({ services }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      honeypot: '',
    }
  })

  const onSubmit = async (data: BookingInput) => {
    setIsSubmitting(true)
    setError(null)
    
    const result = await createBooking(data)
    
    if (result.success) {
      notifyByEmail(`New Booking: ${result.data?.serviceName ?? 'Service'}`, {
        service: result.data?.serviceName ?? data.serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        carModel: data.carModel,
        location: data.location,
        date: data.date,
        time: data.time,
        notes: data.notes || '',
      })
      setIsSuccess(true)
      reset()
    } else {
      setError(result.error || 'Something went wrong')
    }
    
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <Card className="border-2 border-primary/20 shadow-premium overflow-hidden text-center py-12 px-6">
        <CardContent className="space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="text-primary w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black">Booking Received!</h3>
            <p className="text-muted-foreground text-lg">
              We've received your request. Our team will contact you shortly to confirm.
            </p>
          </div>
          <Button onClick={() => setIsSuccess(false)} variant="outline">Book Another Service</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
      <CardHeader className="bg-primary text-white p-8 sm:p-10">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <Badge variant="accent" className="bg-white/20 text-white border-white/30">Instant Confirmation</Badge>
            <CardTitle className="text-3xl sm:text-4xl font-black">Book Your Wash</CardTitle>
            <CardDescription className="text-white/70 text-lg">
              Professional detailing at your doorstep in Dubai.
            </CardDescription>
          </div>
          <div className="hidden sm:block">
            <Phone className="text-accent" size={40} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Honeypot for spam protection */}
          <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary" /> Full Name
              </label>
              <Input 
                placeholder="Enter your name" 
                {...register('customerName')} 
                className={errors.customerName ? 'border-destructive' : ''}
              />
              {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <Phone size={16} className="text-primary" /> Phone Number
              </label>
              <Input 
                placeholder="050 123 4567" 
                {...register('customerPhone')}
                className={errors.customerPhone ? 'border-destructive' : ''}
              />
              {errors.customerPhone && <p className="text-xs text-destructive">{errors.customerPhone.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <MessageSquare size={16} className="text-primary" /> Email Address
              </label>
              <Input 
                type="email" 
                placeholder="your@email.com" 
                {...register('customerEmail')}
                className={errors.customerEmail ? 'border-destructive' : ''}
              />
              {errors.customerEmail && <p className="text-xs text-destructive">{errors.customerEmail.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <Car size={16} className="text-primary" /> Car Model
              </label>
              <Input 
                placeholder="e.g. Tesla Model Y / Nissan Patrol" 
                {...register('carModel')}
                className={errors.carModel ? 'border-destructive' : ''}
              />
              {errors.carModel && <p className="text-xs text-destructive">{errors.carModel.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary" /> Service Required
              </label>
              <select 
                {...register('serviceId')}
                className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
              {errors.serviceId && <p className="text-xs text-destructive">{errors.serviceId.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Location / Area
              </label>
              <Input 
                placeholder="e.g. Dubai Marina, Downtown" 
                {...register('location')}
                className={errors.location ? 'border-destructive' : ''}
              />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Preferred Date
              </label>
              <Input 
                type="date" 
                {...register('date')}
                className={errors.date ? 'border-destructive' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <Clock size={16} className="text-primary" /> Preferred Time
              </label>
              <Input 
                type="time" 
                {...register('time')}
                className={errors.time ? 'border-destructive' : ''}
              />
              {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" /> Special Requests (Optional)
            </label>
            <Textarea 
              placeholder="Tell us about your car's condition or specific needs..." 
              {...register('notes')}
              className="min-h-[100px]"
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-bold border border-destructive/20">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            size="xl" 
            className="w-full h-16 text-lg font-bold shadow-premium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            By clicking confirm, you'll be redirected to WhatsApp to verify your details.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
