"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ListingCard } from "@/components/listing-card"
import { RatingStars } from "@/components/rating-stars"
import { useLanguage } from "@/lib/context/language-context"
import { listings, categories } from "@/lib/mock-data"

type ViewMode = "grid" | "list"

function FilterSidebar({
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  listingType,
  setListingType,
  minRating,
  setMinRating,
  resetFilters,
  t,
  locale,
}: {
  selectedCategories: string[]
  toggleCategory: (slug: string) => void
  priceRange: number[]
  setPriceRange: (v: number[]) => void
  listingType: string
  setListingType: (v: string) => void
  minRating: number
  setMinRating: (v: number) => void
  resetFilters: () => void
  t: (key: string) => string
  locale: string
}) {
  return (
    <div className="space-y-6">
      {/* Type */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("search.type")}</h4>
        <div className="flex flex-col gap-2">
          {[
            { value: "all", label: t("common.all") },
            { value: "product", label: t("search.type_product") },
            { value: "service", label: t("search.type_service") },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={listingType === opt.value}
                onCheckedChange={() => setListingType(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("search.category")}</h4>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <span className="flex-1">{locale === "fr" ? cat.nameFr : cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("search.price_range")}</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={500000}
          min={0}
          step={5000}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{new Intl.NumberFormat("fr-FR").format(priceRange[0])} FCFA</span>
          <span>{new Intl.NumberFormat("fr-FR").format(priceRange[1])} FCFA</span>
        </div>
      </div>

      <Separator />

      {/* Min rating */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-foreground">{t("search.min_rating")}</h4>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors ${minRating === r ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
            >
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  )
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [listingType, setListingType] = useState("all")
  const [minRating, setMinRating] = useState(0)

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 500000])
    setListingType("all")
    setMinRating(0)
    setQuery("")
  }

  const filtered = useMemo(() => {
    let result = [...listings]

    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }

    if (selectedCategories.length > 0) {
      result = result.filter((l) => {
        const cat = categories.find((c) => c.id === l.categoryId)
        return cat && selectedCategories.includes(cat.slug)
      })
    }

    if (listingType !== "all") {
      result = result.filter((l) => l.type === listingType)
    }

    result = result.filter(
      (l) => l.price >= priceRange[0] && l.price <= priceRange[1]
    )

    if (minRating > 0) {
      result = result.filter((l) => l.rating >= minRating)
    }

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "recent":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [query, selectedCategories, listingType, priceRange, minRating, sortBy])

  const activeFilterCount =
    selectedCategories.length +
    (listingType !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 500000 ? 1 : 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Search header */}
        <div className="border-b bg-card px-4 py-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("hero.search_placeholder")}
                className="max-w-sm"
              />
              <span className="text-sm text-muted-foreground">
                {filtered.length} {t("search.results")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
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
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {t("search.filters")}
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-[10px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{t("search.filters")}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <FilterSidebar
                      selectedCategories={selectedCategories}
                      toggleCategory={toggleCategory}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      listingType={listingType}
                      setListingType={setListingType}
                      minRating={minRating}
                      setMinRating={setMinRating}
                      resetFilters={resetFilters}
                      t={t as (key: string) => string}
                      locale={locale}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center gap-2">
              {selectedCategories.map((slug) => {
                const cat = categories.find((c) => c.slug === slug)
                return (
                  <Badge key={slug} variant="secondary" className="gap-1">
                    {locale === "fr" ? cat?.nameFr : cat?.name}
                    <button onClick={() => toggleCategory(slug)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
              {listingType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {listingType === "product" ? t("search.type_product") : t("search.type_service")}
                  <button onClick={() => setListingType("all")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 text-xs text-destructive">
                {t("search.reset_filters")}
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-20 rounded-lg border bg-card p-4">
              <h3 className="mb-4 text-sm font-semibold text-foreground">{t("search.filters")}</h3>
              <FilterSidebar
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                listingType={listingType}
                setListingType={setListingType}
                minRating={minRating}
                setMinRating={setMinRating}
                resetFilters={resetFilters}
                t={t as (key: string) => string}
                locale={locale}
              />
            </div>
          </aside>

          {/* Listings */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-medium text-foreground">{t("search.no_results")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("search.no_results_desc")}</p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  {t("search.reset_filters")}
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} variant="grid" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} variant="list" />
                ))}
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
    <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
