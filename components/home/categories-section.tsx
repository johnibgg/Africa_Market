"use client"

import Link from "next/link"
import {
  Wrench,
  Hammer,
  UtensilsCrossed,
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  Leaf,
  GraduationCap,
  Car,
  Heart,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/context/language-context"
import { categories } from "@/lib/mock-data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Hammer,
  UtensilsCrossed,
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  Leaf,
  GraduationCap,
  Car,
  Heart,
  Building2,
}

export function CategoriesSection() {
  const { t, locale } = useLanguage()

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{t("home.categories")}</h2>
          <Link href="/search">
            <Button variant="ghost" size="sm" className="text-primary">
              {t("common.see_all")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon]
            return (
              <Link
                key={category.id}
                href={`/search?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {locale === "fr" ? category.nameFr : category.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {category.count} {locale === "fr" ? "annonces" : "listings"}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
