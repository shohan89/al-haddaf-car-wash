import { ShieldCheck, Award, Star, Users } from 'lucide-react'

const iconMap: Record<string, any> = { Star, Users, ShieldCheck, Award };

interface TrustBarData {
  isVisible: boolean;
  items: readonly { value: string; label: string }[];
}

export function TrustBar({ data }: { data: TrustBarData }) {
  if (!data.isVisible) return null;
  const icons = [Star, Users, ShieldCheck, Award];

  return (
    <section className="border-y border-border bg-white py-12">
      <div className="container-premium">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {data.items.map((stat, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={i} className="flex flex-col items-center justify-center text-center space-y-2">
                <Icon className="h-6 w-6 text-primary" />
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
