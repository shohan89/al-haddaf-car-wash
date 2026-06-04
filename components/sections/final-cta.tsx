import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface FinalCtaData {
  isVisible: boolean;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  disclaimer: string;
}

export function FinalCTA({ data }: { data: FinalCtaData }) {
  if (!data.isVisible) return null;

  return (
    <section className="py-24">
      <div className="container-premium">
        <div className="relative overflow-hidden rounded-[3rem] bg-primary px-8 py-20 text-center text-white shadow-premium">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          
          <div className="relative z-10 mx-auto max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold tracking-wider uppercase">
              <Sparkles size={16} className="text-accent" />
              {data.badge}
            </div>
            
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl text-white">
              {data.title} <br />
              <span className="text-secondary">{data.titleHighlight}</span>
            </h2>
            
            <p className="text-xl text-white/70">
              {data.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href={data.primaryButtonLink}>
                <Button variant="accent" size="xl" className="h-16 px-12 shadow-premium">
                  {data.primaryButtonText}
                </Button>
              </Link>
              <Link href={data.secondaryButtonLink} target="_blank">
                <Button variant="whatsapp" size="xl" className="h-16 px-12">
                  {data.secondaryButtonText}
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-white/50 pt-4">{data.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
