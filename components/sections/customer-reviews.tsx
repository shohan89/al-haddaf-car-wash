import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Star, BadgeCheck } from 'lucide-react'
import Image from 'next/image'

interface Review {
  id: string
  author: string
  role: string
  location?: string | null
  content: string
  rating: number
  avatar?: string | null
  isFeatured?: boolean
}

export function CustomerReviews({ dbReviews = [] }: { dbReviews?: Review[] }) {
  if (dbReviews.length === 0) return null;

  return (
    <section className="py-24 bg-muted/30">
      <div className="container-premium">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">What Our Clients Say</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Trusted by luxury car owners across Dubai. Join our community of happy customers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {dbReviews.map((review) => (
            <Card key={review.id} className={`relative bg-white shadow-soft transition-all ${review.isFeatured ? 'border-2 border-primary/40 shadow-premium' : 'border-none hover:shadow-premium'}`}>
              {review.isFeatured && (
                <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full p-1 shadow-lg">
                  <BadgeCheck size={20} />
                </div>
              )}
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-primary/10 bg-gray-100 shrink-0">
                  {review.avatar ? (
                    <Image src={review.avatar} alt={review.author} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-gray-500 text-xl">{review.author.charAt(0)}</div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-foreground leading-tight">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.role}{review.location && <span className="opacity-75"> • {review.location}</span>}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i + review.rating} size={16} className="text-gray-200" />
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  &ldquo;{review.content}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
