"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, Grid3X3, List, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ListingCard } from "@/components/listing-card"
import { RatingStars } from "@/components/rating-stars"
import { useLanguage } from "@/lib/context/language-context"

type ViewMode = "grid" | "list"

function FilterSidebar({ categories, selectedCategories, toggleCategory, priceRange, setPriceRange, listingType, setListingType, minRating, setMinRating, resetFilters, t, locale }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("search.type")}</h4>
        <div className="flex flex-col gap-2">
          {[
            { value: "all", label: t("common.all") },
            { value: "PRODUCT", label: t("search.type_product") },
            { value: "SERVICE", label: t("search.type_service") },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <Checkbox checked={listingType === opt.value} onCheckedChange={() => setListingType(opt.value)} />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("search.category")}</h4>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
          {categories.map((cat: any) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
              <Checkbox checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} />
              <span className="flex-1">{locale === "fr" ? cat.nameFr : cat.name}</span>
            </label>
          ))}
          {categories.length === 0 && <p className="text-xs text-muted-foreground italic">Aucune catégorie disponible</p>}
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("search.price_range")}</h4>
        <Slider value={priceRange} onValueChange={setPriceRange} max={500000} min={0} step={5000} className="mb-3" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{new Intl.NumberFormat("fr-FR").format(priceRange[0])} FCFA</span>
          <span>{new Intl.NumberFormat("fr-FR").format(priceRange[1])} FCFA</span>
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("search.min_rating")}</h4>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={`flex items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors ${minRating === r ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
              <RatingStars rating={r} size="sm" />
              <span className="text-xs text-muted-foreground">{"& +"}</span>
            </button>
          ))}
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={resetFilters}>
        {t("search.reset_filters")}
      </Button>
    </div>
  )
}

function SearchContent() {
  const { t, locale } = useLanguage()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialCategory = searchParams.get("category") || ""

  const [query, setQuery] = useState(initialQuery)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : [])
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [listingType, setListingType] = useState("all")
  const [minRating, setMinRating] = useState(0)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        if (res.ok) {
          const data = await res.json()
          setCategories(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error("Failed to fetch categories", err)
      }
    }
    fetchCategories()
  }, [])

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        if (listingType !== "all") params.set("type", listingType)
        if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","))
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
        if (priceRange[1] < 500000) params.set("maxPrice", priceRange[1].toString())
        if (minRating > 0) params.set("minRating", minRating.toString())

        const res = await fetch(`/api/listings?${params.toString()}`)
        const data = await res.json()
        setListings(Array.isArray(data) ? data : [])
      } catch {
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchListings, 400) // Slightly longer debounce for more complex query
    return () => clearTimeout(debounce)
  }, [query, listingType, selectedCategories, priceRange, minRating])

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 500000])
    setListingType("all")
    setMinRating(0)
    setQuery("")
  }

  // Only client-side sorting remains (on the filtered results from API)
  const filtered = useMemo(() => {
    let result = [...listings]
    switch (sortBy) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break
      case "price_desc": result.sort((a, b) => b.price - a.price); break
      case "rating": result.sort((a, b) => b.rating - a.rating); break
      case "recent": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
    }
    return result
  }, [listings, sortBy])

  const activeFilterCount = selectedCategories.length + (listingType !== "all" ? 1 : 0) + (minRating > 0 ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 500000 ? 1 : 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Search header */}
        <div className="border-b bg-card px-4 py-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("hero.search_placeholder")}
                  className="pl-9"
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {loading ? "..." : `${filtered.length} ${t("search.results")}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Quick type chips - visible on mobile */}
              <div className="flex gap-1 sm:hidden overflow-x-auto">
                {["all", "PRODUCT", "SERVICE"].map((type) => (
                  <button key={type} onClick={() => setListingType(type)} className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all ${listingType === type ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground"}`}>
                    {type === "all" ? "Tous" : type === "PRODUCT" ? "Produits" : "Services"}
                  </button>
                ))}
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 hidden sm:flex">
                  <SelectValue placeholder={t("search.sort")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">{t("search.sort_relevance")}</SelectItem>
                  <SelectItem value="price_asc">{t("search.sort_price_asc")}</SelectItem>
                  <SelectItem value="price_desc">{t("search.sort_price_desc")}</SelectItem>
                  <SelectItem value="rating">{t("search.sort_rating")}</SelectItem>
                  <SelectItem value="recent">{t("search.sort_recent")}</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden items-center gap-1 rounded-md border p-1 sm:flex">
                <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("grid")}><Grid3X3 className="h-3.5 w-3.5" /></Button>
                <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("list")}><List className="h-3.5 w-3.5" /></Button>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {t("search.filters")}
                    {activeFilterCount > 0 && <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-[10px]">{activeFilterCount}</Badge>}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader><SheetTitle>{t("search.filters")}</SheetTitle></SheetHeader>
                  <div className="mt-4">
                    <FilterSidebar categories={categories} selectedCategories={selectedCategories} toggleCategory={toggleCategory} priceRange={priceRange} setPriceRange={setPriceRange} listingType={listingType} setListingType={setListingType} minRating={minRating} setMinRating={setMinRating} resetFilters={resetFilters} t={t as (key: string) => string} locale={locale} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center gap-2">
              {selectedCategories.map((id) => {
                const cat = categories.find((c) => c.id === id)
                return (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {locale === "fr" ? cat?.nameFr : cat?.name}
                    <button onClick={() => toggleCategory(id)}><X className="h-3 w-3" /></button>
                  </Badge>
                )
              })}
              {listingType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {listingType === "PRODUCT" ? t("search.type_product") : t("search.type_service")}
                  <button onClick={() => setListingType("all")}><X className="h-3 w-3" /></button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 text-xs text-destructive">
                {t("search.reset_filters")}
              </Button>
            </div>
          )}
        </div>

        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-20 rounded-lg border bg-card p-4">
              <h3 className="mb-4 text-sm font-semibold text-foreground">{t("search.filters")}</h3>
              <FilterSidebar categories={categories} selectedCategories={selectedCategories} toggleCategory={toggleCategory} priceRange={priceRange} setPriceRange={setPriceRange} listingType={listingType} setListingType={setListingType} minRating={minRating} setMinRating={setMinRating} resetFilters={resetFilters} t={t as (key: string) => string} locale={locale} />
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-medium text-foreground">{t("search.no_results")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("search.no_results_desc")}</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>{t("search.reset_filters")}</Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((listing: any) => <ListingCard key={listing.id} listing={listing} variant="grid" />)}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((listing: any) => <ListingCard key={listing.id} listing={listing} variant="list" />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Chargement...</div>}>
      <SearchContent />
    </Suspense>
  )
}
