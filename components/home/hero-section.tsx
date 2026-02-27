"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/context/language-context"

export function HeroSection() {
  const { t } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (location) params.set("location", location)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-primary px-4 py-16 md:py-24">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-40 w-40 rounded-full border-2 border-primary-foreground" />
        <div className="absolute top-40 right-20 h-24 w-24 rounded-full border-2 border-primary-foreground" />
        <div className="absolute bottom-10 left-1/3 h-32 w-32 rounded-full border-2 border-primary-foreground" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold leading-tight text-primary-foreground text-balance md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-primary-foreground/80 text-pretty md:text-lg">
          {t("hero.subtitle")}
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("hero.search_placeholder")}
              className="h-12 bg-card pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="relative sm:w-48">
            <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("hero.location_placeholder")}
              className="h-12 bg-card pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 bg-accent px-8 text-accent-foreground hover:bg-accent/90">
            <Search className="mr-2 h-4 w-4" />
            {t("hero.cta")}
          </Button>
        </form>

        {/* Quick categories */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["Menuiserie", "Restauration", "Mode", "Electronique", "Mecanique"].map((cat) => (
            <Button
              key={cat}
              variant="secondary"
              size="sm"
              className="h-8 rounded-full bg-primary-foreground/15 text-xs text-primary-foreground hover:bg-primary-foreground/25"
              onClick={() => router.push(`/search?category=${cat.toLowerCase()}`)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
