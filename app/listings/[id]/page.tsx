"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  MapPin,
  Eye,
  Heart,
  Share2,
  BadgeCheck,
  Truck,
  ChevronLeft,
  MessageSquare,
  ShoppingCart,
  Zap,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RatingStars } from "@/components/rating-stars"
import { PriceDisplay } from "@/components/price-display"
import { ListingCard } from "@/components/listing-card"
import { useLanguage } from "@/lib/context/language-context"
import { useCart } from "@/lib/context/cart-context"
import { listings, getReviewsForListing } from "@/lib/mock-data"
import { QuoteRequestDialog } from "@/components/services/quote-request-dialog"

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t } = useLanguage()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFav, setIsFav] = useState(false)
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)

  const listing = listings.find((l) => l.id === id)
  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-lg text-muted-foreground">Annonce introuvable</p>
        </main>
        <Footer />
      </div>
    )
  }

  const reviews = getReviewsForListing(id)
  const related = listings.filter(
    (l) => l.categoryId === listing.categoryId && l.id !== listing.id
  ).slice(0, 4)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-card px-4 py-3">
          <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-primary">{listing.category}</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{listing.title}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Images */}
            <div className="lg:col-span-3">
              {/* Main image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                <button
                  className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm transition-colors hover:bg-card"
                  onClick={() => setIsFav(!isFav)}
                  aria-label={t("listing.favorite")}
                >
                  <Heart className={`h-5 w-5 ${isFav ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                </button>
                {listing.isPromoted && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    {t("common.promoted")}
                  </Badge>
                )}
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {listing.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === i ? "border-primary" : "border-transparent"
                        }`}
                    >
                      <Image src={img} alt={`${listing.title} ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">{t("listing.description")}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{listing.description}</p>

                {listing.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {listing.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground">
                  {t("listing.reviews")} ({reviews.length})
                </h2>
                {reviews.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id} className="border-0 bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.userAvatar} />
                              <AvatarFallback>{review.userName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{review.userName}</span>
                                <RatingStars rating={review.rating} size="sm" />
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                              {review.sellerResponse && (
                                <div className="mt-3 rounded-lg border-l-2 border-primary bg-primary/5 p-3">
                                  <p className="text-xs font-medium text-primary">Reponse du vendeur</p>
                                  <p className="mt-1 text-sm text-muted-foreground">{review.sellerResponse}</p>
                                </div>
                              )}
                              <p className="mt-2 text-xs text-muted-foreground">{review.createdAt}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">Aucun avis pour le moment.</p>
                )}
              </div>
            </div>

            {/* Right: Info panel */}
            <div className="lg:col-span-2">
              <div className="sticky top-20 space-y-4">
                {/* Main info card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary">{listing.type === "product" ? t("search.type_product") : t("search.type_service")}</Badge>
                      {listing.condition && (
                        <Badge variant="outline" className="text-xs">{listing.condition === "new" ? t("listing.condition_new") : t("listing.condition_used")}</Badge>
                      )}
                    </div>

                    <h1 className="text-xl font-bold text-foreground text-balance">{listing.title}</h1>

                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.location}{listing.quartier ? `, ${listing.quartier}` : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {listing.views} {t("listing.views")}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <RatingStars rating={listing.rating} size="md" showValue />
                      <span className="text-sm text-muted-foreground">({listing.reviewCount} {t("listing.reviews")})</span>
                    </div>

                    <Separator className="my-4" />

                    <PriceDisplay amount={listing.price} size="lg" />

                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      {listing.deliveryAvailable ? (
                        <span className="flex items-center gap-1 text-primary">
                          <Truck className="h-4 w-4" />
                          {t("listing.delivery")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {t("listing.no_delivery")}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      {listing.type === "service" ? (
                        <Button
                          size="lg"
                          className="w-full bg-teal-600 hover:bg-teal-700"
                          onClick={() => setQuoteDialogOpen(true)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Demander un devis
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="lg"
                            className="w-full bg-teal-600 hover:bg-teal-700 font-heading tracking-wide"
                            onClick={() => addItem(listing)}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {t("listing.add_to_cart")}
                          </Button>
                          <Button size="lg" variant="outline" className="w-full font-heading tracking-wide">
                            <Zap className="mr-2 h-4 w-4" />
                            {t("listing.buy_now")}
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
                        <Share2 className="mr-2 h-4 w-4" />
                        {t("listing.share")}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => setIsFav(!isFav)}>
                        <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-destructive text-destructive" : ""}`} />
                        {t("listing.favorite")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Seller card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{t("listing.seller_info")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={listing.seller.avatar} />
                        <AvatarFallback>{listing.seller.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <Link href={`/profile/${listing.seller.id}`} className="font-medium text-foreground hover:text-primary">
                            {listing.seller.name}
                          </Link>
                          {listing.seller.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                        </div>
                        {listing.seller.shopName && (
                          <p className="text-xs text-muted-foreground">{listing.seller.shopName}</p>
                        )}
                        <div className="mt-0.5 flex items-center gap-1">
                          <RatingStars rating={listing.seller.rating} size="sm" />
                          <span className="text-xs text-muted-foreground">({listing.seller.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-4 w-full" asChild>
                      <Link href="/messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {t("listing.contact_seller")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Related listings */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">{t("listing.related")}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <QuoteRequestDialog
        listing={listing}
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
      />
    </div>
  )
}
