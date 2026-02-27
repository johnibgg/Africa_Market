"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { RatingStars } from "@/components/rating-stars"
import { useLanguage } from "@/lib/context/language-context"

const testimonials = [
  {
    name: "Jean-Baptiste H.",
    location: "Cotonou",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 5,
    comment: "Grace a AfricaMarket, j'ai trouve un excellent menuisier pour ma maison. La qualite du travail est exceptionnelle et le prix tres competitif.",
  },
  {
    name: "Grace H.",
    location: "Porto-Novo",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 5,
    comment: "En tant qu'acheteuse, je trouve facilement les meilleurs artisans de ma region. La plateforme est tres simple a utiliser.",
  },
  {
    name: "Amina B.",
    location: "Parakou",
    avatar: "/placeholder.svg?height=48&width=48",
    rating: 5,
    comment: "AfricaMarket m'a permis de developper mon activite de couture. J'ai triple mes commandes en 6 mois !",
  },
]

export function TestimonialsSection() {
  const { t } = useLanguage()

  return (
    <section className="bg-muted/50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-2xl font-bold text-foreground">
          {t("home.testimonials")}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <RatingStars rating={item.rating} size="md" className="mb-4" />
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {'"'}{item.comment}{'"'}
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
