"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/listing-card"
import { useLanguage } from "@/lib/context/language-context"
import { listings } from "@/lib/mock-data"

export function FeaturedListings() {
  const { t } = useLanguage()

  const featured = listings.filter((l) => l.isPromoted).slice(0, 4)
  const recent = listings.filter((l) => !l.isPromoted).slice(0, 4)

  return (
    <section className="bg-muted/50 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Featured */}
        <div className="mb-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">{t("home.featured")}</h2>
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-primary">
                {t("common.see_all")}
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">{t("home.recent")}</h2>
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-primary">
                {t("common.see_all")}
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
