import { siteConfig } from '@/data/site-config'
import { MapPin, Navigation } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ServiceAreas() {
  return (
    <section id="areas" className="py-24 bg-background">
      <div className="container-premium">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary">Coverage</Badge>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Serving All Major <span className="text-primary">Dubai Districts</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our mobile units are strategically positioned across Dubai to ensure
                fast response times in your neighborhood.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {siteConfig.serviceAreas.map((area) => (
                <div key={area} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={18} />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">{area}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square max-w-xl">
            {/* Abstract Map Representation */}
            <div className="absolute inset-0 bg-primary/5 rounded-3xl overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 animate-ping rounded-full bg-primary/20" />
                  <div className="relative h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white shadow-premium">
                    <Navigation size={24} />
                  </div>
                </div>
              </div>
              {/* Decorative Dots */}
              <div className="absolute top-1/4 left-1/4 h-3 w-3 rounded-full bg-secondary opacity-50" />
              <div className="absolute bottom-1/3 right-1/4 h-3 w-3 rounded-full bg-primary opacity-50" />
              <div className="absolute top-1/2 right-1/2 h-3 w-3 rounded-full bg-accent opacity-50" />
            </div>
            <div className="absolute -bottom-6 -left-6 glass-effect p-6 rounded-2xl max-w-xs">
              <p className="font-bold text-lg mb-1">Average Response Time</p>
              <p className="text-3xl font-black text-secondary">45 Mins</p>
              <p className="text-sm text-muted-foreground mt-2">Anywhere in Dubai</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
