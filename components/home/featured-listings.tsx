"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listing-card"
import { useLanguage } from "@/lib/context/language-context"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function ListingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function FeaturedListings() {
  const { t } = useLanguage()
  const [featured, setFeatured] = useState<any[]>([])
  const [recent, setRecent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          fetch("/api/listings?promoted=true&limit=4"),
          fetch("/api/listings?limit=4&offset=4"),
        ])
        const featuredData = await featuredRes.json()
        const recentData = await recentRes.json()
        setFeatured(Array.isArray(featuredData) ? featuredData.slice(0, 4) : [])
        setRecent(Array.isArray(recentData) ? recentData.slice(0, 4) : [])
      } catch (err) {
        console.error("Failed to fetch listings", err)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  return (
    <section className="bg-muted/50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Featured */}
        <div className="mb-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">{t("home.featured")}</h2>
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-primary font-semibold">
                {t("common.see_all")} →
              </Button>
            </Link>
          </div>
          {loading ? <ListingSkeleton /> : (
            featured.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Aucune annonce disponible pour l'instant.</p>
            )
          )}
        </div>

        {/* Recent */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">{t("home.recent")}</h2>
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-primary font-semibold">
                {t("common.see_all")} →
              </Button>
            </Link>
          </div>
          {loading ? <ListingSkeleton /> : (
            recent.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recent.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Aucune annonce récente.</p>
            )
          )}
        </div>
      </div>
    </section>
  )
}
