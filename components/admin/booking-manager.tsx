'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import { 
  CalendarCheck, Clock, MapPin, Phone, Car, 
  Mail, MessageSquare, CheckCircle2, XCircle, 
  AlertCircle, MoreVertical, Trash2, ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateBookingStatus } from '@/actions/admin-actions';
import { useRouter } from 'next/navigation';

interface BookingManagerProps {
  bookings: any[];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon: any }> = {
    PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
    CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
    COMPLETED: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  };
  const s = map[status] || map.PENDING;
  const Icon = s.icon;
  return (
    <Badge variant="outline" className={cn("gap-1 px-2 py-0.5 font-bold", s.className)}>
      <Icon size={12} /> {s.label}
    </Badge>
  );
}

export function BookingManager({ bookings }: BookingManagerProps) {
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateBookingStatus(id, status);
    router.refresh();
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Hello ${name}! This is Al Haddaf Car Wash regarding your booking.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
            <Button
              key={s}
              variant={filter === s ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(s)}
              className="text-xs font-bold"
            >
              {s}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Showing {filteredBookings.length} bookings
        </p>
      </div>

      <div className="grid gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="border-none shadow-soft hover:shadow-premium transition-all group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                  {/* Service Icon & Initial */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl shadow-soft">
                      {booking.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">{booking.customerName}</h3>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-6 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Service</p>
                      <div className="flex items-center gap-2 font-bold">
                        <Car size={14} className="text-primary" />
                        {booking.service.title}
                      </div>
                      <p className="text-primary font-black">{formatPrice(booking.service.price)}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Schedule</p>
                      <div className="flex items-center gap-2 font-bold">
                        <CalendarCheck size={14} className="text-secondary" />
                        {new Date(booking.scheduledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Clock size={14} />
                        {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Location</p>
                      <div className="flex items-center gap-2 font-bold truncate">
                        <MapPin size={14} className="text-rose-500" />
                        {booking.location}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Contact</p>
                      <div className="flex items-center gap-2 font-bold">
                        <Phone size={14} className="text-whatsapp" />
                        {booking.customerPhone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-medium truncate">
                        <Mail size={14} />
                        {booking.customerEmail}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="whatsapp" 
                      size="sm" 
                      className="gap-2 font-bold"
                      onClick={() => openWhatsApp(booking.customerPhone, booking.customerName)}
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'PENDING')}>
                          <Clock size={14} className="mr-2 text-amber-500" /> Set as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}>
                          <CheckCircle2 size={14} className="mr-2 text-blue-500" /> Confirm Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}>
                          <CheckCircle2 size={14} className="mr-2 text-emerald-500" /> Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}>
                          <XCircle size={14} className="mr-2 text-red-500" /> Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {booking.notes && (
                  <div className="bg-muted/30 px-6 py-3 border-t border-border/50">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
                      <AlertCircle size={12} /> Notes
                    </p>
                    <p className="text-sm text-gray-600 italic">"{booking.notes}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 py-20 text-center space-y-4">
            <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <div>
              <p className="text-lg font-bold">No bookings found</p>
              <p className="text-sm text-muted-foreground">Adjust your filters or wait for new requests.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
