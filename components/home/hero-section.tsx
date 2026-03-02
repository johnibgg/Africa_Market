"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/context/language-context"

const CATEGORIES = [
  { label: "Toutes catégories", value: "" },
  { label: "Mécanique", value: "mecanique" },
  { label: "Menuiserie", value: "menuiserie" },
  { label: "Restauration", value: "restauration" },
  { label: "Électronique", value: "electronique" },
  { label: "Mode & Vêtements", value: "mode" },
  { label: "Beauté & Bien-être", value: "beaute" },
  { label: "Maison & Déco", value: "maison" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Éducation", value: "education" },
  { label: "Transport", value: "transport" },
  { label: "Santé", value: "sante" },
  { label: "Construction", value: "construction" },
]

export function HeroSection() {
  const { t } = useLanguage()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category) params.set("category", category)
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

        {/* Search form — with category dropdown */}
        <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-2xl p-2 shadow-2xl">
            {/* Category dropdown */}
            <div className="relative sm:w-48 flex-shrink-0">
              <ChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 appearance-none bg-muted/50 rounded-xl pl-3 pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("hero.search_placeholder")}
                className="h-11 bg-transparent pl-10 border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Location */}
            <div className="relative sm:w-36 flex-shrink-0">
              <MapPin className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("hero.location_placeholder")}
                className="h-11 bg-transparent pl-9 border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button type="submit" size="lg" className="h-11 bg-teal-600 hover:bg-teal-700 text-white border-none px-6 rounded-xl font-bold shrink-0">
              <Search className="mr-2 h-4 w-4" />
              {t("hero.cta")}
            </Button>
          </div>
        </form>

        {/* Quick categories */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["Menuiserie", "Restauration", "Mode", "Electronique", "Mecanique"].map((cat) => (
            <Button
              key={cat}
              variant="secondary"
              size="sm"
              type="button"
              className="h-8 rounded-full bg-primary-foreground/15 text-xs text-primary-foreground hover:bg-primary-foreground/30 border-none font-semibold"
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
