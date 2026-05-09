import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

interface WhyChooseUsData {
  isVisible: boolean;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  items: readonly { title: string; description: string }[];
}

export function WhyChooseUs({ data }: { data: WhyChooseUsData }) {
  if (!data.isVisible) return null;

  return (
    <section id="about" className="py-24">
      <div className="container-premium">
        <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="accent" className="mb-4">{data.badge}</Badge>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {data.title} <span className="text-secondary">{data.titleHighlight}</span>
            </h2>
          </div>
          <p className="max-w-md text-lg text-muted-foreground">
            {data.description}
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item, index) => (
            <Card key={index} className="group border-none bg-muted/30 shadow-none transition-colors hover:bg-white hover:shadow-premium">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-soft group-hover:bg-primary group-hover:text-white transition-colors">
                  <CheckCircle2 size={28} />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
