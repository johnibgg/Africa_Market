"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Eye, Heart, BadgeCheck, Tag, MessageCircle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  const href = listing.type === "SERVICE" ? `/services/${listing.id}` : `/listings/${listing.id}`

  if (variant === "list") {
    return (
      <Link href={href}>
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
                    {listing.type === "PRODUCT" ? t("search.type_product") : t("search.type_service")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {typeof listing.category === "string" 
                      ? listing.category 
                      : (useLanguage().locale === "fr" ? (listing.category as any).nameFr : (listing.category as any).name)}
                  </span>
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
                  suffix={listing.type === "SERVICE" ? "" : undefined}
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
    <Card className={cn("overflow-hidden transition-all hover:shadow-xl group h-full flex flex-col border-0 shadow-md rounded-2xl", className)}>
      {/* Image */}
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {listing.isPromoted && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-white text-xs shadow-sm border-none font-bold">
              <Tag className="mr-1 h-3 w-3" />
              {t("common.promoted")}
            </Badge>
          )}
          <button
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            aria-label={t("listing.favorite")}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                listing.isFavorited
                  ? "fill-red-500 text-red-500"
                  : "text-slate-500"
              )}
            />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-white/90 text-slate-700 font-semibold border-none">
              {listing.type === "PRODUCT" ? t("search.type_product") : t("search.type_service")}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-white/80 font-medium">
              <Eye className="h-3 w-3" />
              {listing.views}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-xs font-medium text-primary/80 uppercase tracking-wide">
            {typeof listing.category === "string" 
              ? listing.category 
              : (useLanguage().locale === "fr" ? (listing.category as any).nameFr : (listing.category as any).name)}
          </span>
        </div>
        <h3 className="font-bold text-foreground line-clamp-2 text-balance leading-snug text-sm flex-1">
          {listing.title}
        </h3>
        <PriceDisplay
          amount={listing.price}
          size="sm"
          className="mt-2 font-black"
          suffix={listing.type === "SERVICE" ? "" : undefined}
        />

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <Link 
            href={listing.seller?.shopSlug ? `/boutique/${listing.seller.shopSlug}` : "#"} 
            onClick={(e) => { e.stopPropagation(); if (!listing.seller?.shopSlug) e.preventDefault(); }} 
            className="flex items-center gap-1.5 hover:underline decoration-teal-500 underline-offset-2"
          >
            <div className="relative h-5 w-5 overflow-hidden rounded-full ring-1 ring-border">
              <Image
                src={listing.seller?.avatar || "/logo.png"}
                alt={listing.seller?.name || "Vendeur"}
                fill
                className="object-cover"
              />
            </div>
            <span className="truncate max-w-[80px] font-medium text-slate-700">{listing.seller?.name || "Vendeur"}</span>
            {listing.seller?.isVerified && (
              <BadgeCheck className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
            )}
          </Link>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {listing.location}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1">
          <RatingStars rating={listing.rating} size="sm" />
          <span className="text-xs text-muted-foreground">({listing.reviewCount})</span>
        </div>

        {/* Action button — visible on hover on desktop, always on mobile */}
        <Link href={href} className="block mt-3">
          <Button
            size="sm"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-9 font-bold text-xs gap-1.5 transition-all opacity-0 group-hover:opacity-100 md:flex"
          >
            Voir l'annonce <ArrowRight className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl h-9 font-bold text-xs gap-1.5 md:hidden"
          >
            Voir l'annonce <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
