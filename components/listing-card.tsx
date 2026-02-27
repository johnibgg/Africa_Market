"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Eye, Heart, BadgeCheck, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/rating-stars"
import { PriceDisplay } from "@/components/price-display"
import type { Listing } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/context/language-context"

interface ListingCardProps {
  listing: Listing
  variant?: "grid" | "list"
  className?: string
}

export function ListingCard({ listing, variant = "grid", className }: ListingCardProps) {
  const { t } = useLanguage()

  if (variant === "list") {
    return (
      <Link href={listing.type === "service" ? `/services/${listing.id}` : `/listings/${listing.id}`}>
        <Card className={cn("overflow-hidden transition-shadow hover:shadow-lg group", className)}>
          <div className="flex gap-4 p-4">
            <div className="relative h-32 w-40 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {listing.isPromoted && (
                <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  {t("common.promoted")}
                </Badge>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {listing.type === "product" ? t("search.type_product") : t("search.type_service")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{listing.category}</span>
                </div>
                <h3 className="font-semibold text-foreground line-clamp-1 text-balance">
                  {listing.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {listing.description}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <PriceDisplay
                  amount={listing.price}
                  size="sm"
                  suffix={listing.type === "service" ? "" : undefined}
                />
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <RatingStars rating={listing.rating} size="sm" />
                    ({listing.reviewCount})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={listing.type === "service" ? `/services/${listing.id}` : `/listings/${listing.id}`}>
      <Card className={cn("overflow-hidden transition-all hover:shadow-lg group h-full", className)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
          {listing.isPromoted && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs shadow-sm">
              <Tag className="mr-1 h-3 w-3" />
              {t("common.promoted")}
            </Badge>
          )}
          <button
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-card"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            aria-label={t("listing.favorite")}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                listing.isFavorited
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground"
              )}
            />
          </button>
          <Badge variant="secondary" className="absolute bottom-3 left-3 text-xs backdrop-blur-sm">
            {listing.type === "product" ? t("search.type_product") : t("search.type_service")}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{listing.category}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {listing.views}
            </span>
          </div>
          <h3 className="font-semibold text-foreground line-clamp-2 text-balance leading-snug">
            {listing.title}
          </h3>
          <PriceDisplay
            amount={listing.price}
            size="sm"
            className="mt-2"
            suffix={listing.type === "service" ? "" : undefined}
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-muted-foreground">{listing.seller.name}</span>
              {listing.seller.isVerified && (
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <RatingStars rating={listing.rating} size="sm" />
            <span className="text-xs text-muted-foreground">({listing.reviewCount})</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
