"use client"

import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin, Eye, Heart, Share2, BadgeCheck, Truck, Store,
  MessageSquare, ShoppingCart, Zap, Star, ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RatingStars } from "@/components/rating-stars"
import { PriceDisplay } from "@/components/price-display"
import { ListingCard } from "@/components/listing-card"
import { useLanguage } from "@/lib/context/language-context"
import { useCart } from "@/lib/context/cart-context"

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t } = useLanguage()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFav, setIsFav] = useState(false)
  const [listing, setListing] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`)
        if (res.ok) {
          const data = await res.json()
          setListing(data)
          // Fetch related listings
          const relRes = await fetch(`/api/listings?category=${data.categoryId}&limit=4`)
          if (relRes.ok) {
            const relData = await relRes.json()
            setRelated((Array.isArray(relData) ? relData : []).filter((l: any) => l.id !== id).slice(0, 4))
          }
        }
      } catch (err) {
        console.error("Failed to fetch listing", err)
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 mx-auto max-w-7xl px-4 py-6 w-full">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-20 rounded-lg" />)}
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center flex-col gap-4">
          <p className="text-lg text-muted-foreground">Annonce introuvable</p>
          <Button asChild variant="outline"><Link href="/search">← Retour aux annonces</Link></Button>
        </main>
        <Footer />
      </div>
    )
  }

  const images = listing.images || ["/placeholder.svg?height=400&width=600"]
  const reviews = listing.reviews || []
  const seller = listing.seller || {}

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b bg-card px-4 py-3">
          <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-primary">{listing.category?.nameFr || "Annonces"}</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{listing.title}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Images */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                <Image src={images[selectedImage]} alt={listing.title} fill className="object-cover" />
                <button
                  className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-all"
                  onClick={() => setIsFav(!isFav)}
                >
                  <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </button>
                {listing.isPromoted && <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-none">{t("common.promoted")}</Badge>}
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${selectedImage === i ? "border-teal-600" : "border-transparent"}`}
                    >
                      <Image src={img} alt={`${listing.title} ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-lg font-bold text-foreground">{t("listing.description")}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{listing.description}</p>
              </div>

              {/* Reviews */}
              <div className="mt-8">
                <h2 className="text-lg font-bold text-foreground">{t("listing.reviews")} ({reviews.length})</h2>
                {reviews.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {reviews.map((review: any) => (
                      <Card key={review.id} className="border-0 bg-muted/50 rounded-xl">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.userAvatar || ""} />
                              <AvatarFallback>{(review.userName || "?")[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{review.userName}</span>
                                <RatingStars rating={review.rating} size="sm" />
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                              <p className="mt-2 text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</p>
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
                <Card className="rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{listing.type === "PRODUCT" ? t("search.type_product") : t("search.type_service")}</Badge>
                      {listing.condition && <Badge variant="outline" className="text-xs">{listing.condition === "new" ? t("listing.condition_new") : t("listing.condition_used")}</Badge>}
                    </div>
                    <h1 className="text-xl font-bold text-foreground text-balance">{listing.title}</h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}{listing.quartier ? `, ${listing.quartier}` : ""}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{listing.views || 0} {t("listing.views")}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <RatingStars rating={listing.rating || 0} size="md" showValue />
                      <span className="text-sm text-muted-foreground">({listing.reviewCount || reviews.length} {t("listing.reviews")})</span>
                    </div>
                    <Separator className="my-4" />
                    <PriceDisplay amount={listing.price} size="lg" />
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      {listing.deliveryAvailable ? (
                        <span className="flex items-center gap-1 text-teal-600 font-medium"><Truck className="h-4 w-4" />{t("listing.delivery")}</span>
                      ) : (
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{t("listing.no_delivery")}</span>
                      )}
                    </div>
                    <div className="mt-6 flex flex-col gap-2">
                      {listing.type === "SERVICE" ? (
                        <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl" asChild>
                          <Link href="/messages"><MessageSquare className="mr-2 h-4 w-4" />Demander un devis</Link>
                        </Button>
                      ) : (
                        <>
                          <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl" onClick={() => addItem(listing)}>
                            <ShoppingCart className="mr-2 h-4 w-4" />{t("listing.add_to_cart")}
                          </Button>
                          <Button size="lg" variant="outline" className="w-full rounded-xl">
                            <Zap className="mr-2 h-4 w-4" />{t("listing.buy_now")}
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => navigator.share?.({ title: listing.title, url: window.location.href }).catch(() => { })}>
                        <Share2 className="mr-2 h-4 w-4" />{t("listing.share")}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => setIsFav(!isFav)}>
                        <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />{t("listing.favorite")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Seller card */}
                {seller.id && (
                  <Card className="rounded-2xl shadow-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-sm">{t("listing.seller_info")}</CardTitle></CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={seller.image || ""} />
                          <AvatarFallback>{(seller.name || "?")[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <Link href={seller.shopSlug ? `/boutique/${seller.shopSlug}` : "#"} className="font-semibold text-foreground hover:text-primary text-sm">{seller.name}</Link>
                            {seller.isVerified && <BadgeCheck className="h-4 w-4 text-teal-600" />}
                          </div>
                          {seller.shopName && <p className="text-xs text-muted-foreground">{seller.shopName}</p>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <Button variant="outline" className="w-full rounded-xl" asChild>
                          <Link href="/messages"><MessageSquare className="mr-2 h-4 w-4" />{t("listing.contact_seller")}</Link>
                        </Button>
                        {seller.shopSlug && (
                          <Button variant="default" className="w-full rounded-xl bg-teal-600 hover:bg-teal-700" asChild>
                            <Link href={`/boutique/${seller.shopSlug}`}>
                              <Store className="mr-2 h-4 w-4" /> Visiter la boutique
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">{t("listing.related")}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((l: any) => <ListingCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
