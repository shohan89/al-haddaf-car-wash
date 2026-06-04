'use client'

import * as React from 'react'
import Link from 'next/link'
import { useScroll } from '@/hooks/use-scroll'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/data/site-config'
import { Button } from '@/components/ui/button'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useBookingModal } from '@/contexts/BookingContext'

interface NavItem {
  title: string
  slug: string
}

export function Navbar({
  dbServices = [],
  dbAreas = []
}: {
  dbServices?: NavItem[],
  dbAreas?: NavItem[]
}) {
  const scrolled = useScroll(20)
  const [isOpen, setIsOpen] = React.useState(false)
  const [servicesOpen, setServicesOpen] = React.useState(false)
  const [areasOpen, setAreasOpen] = React.useState(false)
  const { openOptionsModal } = useBookingModal()

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/85 shadow-sm py-3 border-b border-gray-200'
          : 'bg-transparent py-5'
      )}
      style={scrolled ? { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } : {}}
    >
      <div className="container-premium flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-12 w-48 transition-transform group-hover:scale-105">
            <Image
              src="/logo.svg"
              alt={siteConfig.name}
              fill
              className={cn('object-contain transition-all duration-300', !scrolled && 'brightness-0 invert')}
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className={cn('text-sm font-medium transition-colors', scrolled ? 'text-muted-foreground hover:text-primary' : 'text-white/90 hover:text-white')}>Home</Link>

          {/* Services Dropdown */}
          <div className="relative group">
            <button className={cn('flex items-center gap-1 text-sm font-medium transition-colors py-2', scrolled ? 'text-muted-foreground group-hover:text-primary' : 'text-white/90 group-hover:text-white')}>
              Services <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden flex flex-col p-2">
                {dbServices.map(service => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  >
                    {service.title}
                  </Link>
                ))}
                {dbServices.length === 0 && <span className="px-4 py-2 text-sm text-gray-500">No services yet</span>}
              </div>
            </div>
          </div>

          {/* Areas Dropdown */}
          <div className="relative group">
            <button className={cn('flex items-center gap-1 text-sm font-medium transition-colors py-2', scrolled ? 'text-muted-foreground group-hover:text-primary' : 'text-white/90 group-hover:text-white')}>
              Areas <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 w-64 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden flex flex-col p-2">
                {dbAreas.map(area => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  >
                    {area.title}
                  </Link>
                ))}
                {dbAreas.length === 0 && <span className="px-4 py-2 text-sm text-gray-500">No areas yet</span>}
              </div>
            </div>
          </div>

          <Link href="/blogs" className={cn('text-sm font-medium transition-colors', scrolled ? 'text-muted-foreground hover:text-primary' : 'text-white/90 hover:text-white')}>Blog</Link>
          <Link href="/#about" className={cn('text-sm font-medium transition-colors', scrolled ? 'text-muted-foreground hover:text-primary' : 'text-white/90 hover:text-white')}>Why Us</Link>
          <Link href="/contact" className={cn('text-sm font-medium transition-colors', scrolled ? 'text-muted-foreground hover:text-primary' : 'text-white/90 hover:text-white')}>Contact</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href={`tel:${siteConfig.phone}`} className={cn('flex items-center gap-2 text-sm font-bold transition-colors', scrolled ? 'text-primary' : 'text-white')}>
            <Phone size={16} />
            {siteConfig.phone}
          </Link>
          <Button size="md" onClick={() => openOptionsModal()}>Book Now</Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-white border-t border-border shadow-xl absolute top-full left-0 w-full"
          >
            <div className="container-premium py-8 flex flex-col gap-4">
              <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-bold text-foreground hover:text-primary">Home</Link>

              <div>
                <button onClick={() => setServicesOpen(!servicesOpen)} className="flex items-center justify-between w-full text-xl font-bold text-foreground hover:text-primary">
                  Services <ChevronDown size={20} className={cn("transition-transform", servicesOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden flex flex-col gap-3 pl-4 mt-3">
                      {dbServices.map(service => (
                        <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary">
                          {service.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button onClick={() => setAreasOpen(!areasOpen)} className="flex items-center justify-between w-full text-xl font-bold text-foreground hover:text-primary">
                  Areas <ChevronDown size={20} className={cn("transition-transform", areasOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {areasOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden flex flex-col gap-3 pl-4 mt-3">
                      {dbAreas.map(area => (
                        <Link key={area.slug} href={`/areas/${area.slug}`} onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary">
                          {area.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/blogs" onClick={() => setIsOpen(false)} className="text-xl font-bold text-foreground hover:text-primary">Blog</Link>
              <Link href="/#about" onClick={() => setIsOpen(false)} className="text-xl font-bold text-foreground hover:text-primary">Why Us</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="text-xl font-bold text-foreground hover:text-primary">Contact</Link>

              <hr className="border-border my-2" />
              <div className="flex flex-col gap-4">
                <Link href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-lg font-bold text-primary">
                  <Phone size={20} />
                  {siteConfig.phone}
                </Link>
                <Button size="lg" className="w-full" onClick={() => { openOptionsModal(); setIsOpen(false) }}>
                  Book Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
