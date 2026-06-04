'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Star, Shield, Clock, MousePointer2 } from 'lucide-react'

interface HeroData {
  tagline: string;
  heading: string;
  subheading: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  badge1: string;
  badge2: string;
  badge3: string;
  isVisible: boolean;
}

export function Hero({ data }: { data: HeroData }) {
  if (!data.isVisible) return null;

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Luxury Car Wash Dubai"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="container-premium relative z-10 flex h-full flex-col justify-center pt-20">
        <div className="max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-accent font-bold tracking-widest uppercase text-sm">
              <span className="h-0.5 w-8 bg-accent" />
              {data.tagline}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
              {data.heading}
            </h1>

            <p className="max-w-xl text-lg text-white/80 sm:text-xl md:text-2xl leading-relaxed">
              {data.subheading}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link href={data.primaryButtonLink}>
              <Button size="xl" className="h-16 px-10 text-lg shadow-premium">
                {data.primaryButtonText}
              </Button>
            </Link>
            <Link href={data.secondaryButtonLink} target="_blank">
              <Button variant="whatsapp" size="xl" className="h-16 px-10 text-lg">
                {data.secondaryButtonText}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center gap-8 pt-8"
          >
            <div className="flex items-center gap-2 text-white/70">
              <Star className="text-accent" fill="currentColor" size={20} />
              <span className="font-medium">{data.badge1}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Shield className="text-secondary" size={20} />
              <span className="font-medium">{data.badge2}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="text-whatsapp" size={20} />
              <span className="font-medium">{data.badge3}</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-20 right-8 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-effect space-y-6 rounded-2xl p-8"
          >
            <div className="space-y-1">
              <p className="text-3xl font-black text-primary">{data.stat1Value}</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{data.stat1Label}</p>
            </div>
            <div className="h-[1px] w-full bg-white/10" />
            <div className="space-y-1">
              <p className="text-3xl font-black text-secondary">{data.stat2Value}</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{data.stat2Label}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] font-medium">Scroll</span>
          <MousePointer2 size={20} />
        </div>
      </motion.div>
    </section>
  )
}
