'use client'

import { AdminSidebar } from '@/components/admin/sidebar'
import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Toaster } from 'sonner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster richColors position="top-right" />
      <AdminSidebar />
      
      <div className="pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search bookings, services, customers..." 
              className="pl-10 h-11 bg-muted/50 border-none rounded-xl"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-all">
              <Bell size={20} />
            </button>
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
