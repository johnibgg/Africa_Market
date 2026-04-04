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
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import React from "react"

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

// Vibrant color palette per category
const colorMap: Record<string, { bg: string; text: string; hover: string; ring: string }> = {
  Wrench: { bg: "bg-orange-100", text: "text-orange-600", hover: "group-hover:bg-orange-500", ring: "group-hover:ring-orange-200" },
  Hammer: { bg: "bg-amber-100", text: "text-amber-600", hover: "group-hover:bg-amber-500", ring: "group-hover:ring-amber-200" },
  UtensilsCrossed: { bg: "bg-red-100", text: "text-red-600", hover: "group-hover:bg-red-500", ring: "group-hover:ring-red-200" },
  Smartphone: { bg: "bg-blue-100", text: "text-blue-600", hover: "group-hover:bg-blue-500", ring: "group-hover:ring-blue-200" },
  Shirt: { bg: "bg-purple-100", text: "text-purple-600", hover: "group-hover:bg-purple-500", ring: "group-hover:ring-purple-200" },
  Sparkles: { bg: "bg-pink-100", text: "text-pink-600", hover: "group-hover:bg-pink-500", ring: "group-hover:ring-pink-200" },
  Home: { bg: "bg-teal-100", text: "text-teal-600", hover: "group-hover:bg-teal-500", ring: "group-hover:ring-teal-200" },
  Leaf: { bg: "bg-green-100", text: "text-green-600", hover: "group-hover:bg-green-500", ring: "group-hover:ring-green-200" },
  GraduationCap: { bg: "bg-indigo-100", text: "text-indigo-600", hover: "group-hover:bg-indigo-500", ring: "group-hover:ring-indigo-200" },
  Car: { bg: "bg-sky-100", text: "text-sky-600", hover: "group-hover:bg-sky-500", ring: "group-hover:ring-sky-200" },
  Heart: { bg: "bg-rose-100", text: "text-rose-600", hover: "group-hover:bg-rose-500", ring: "group-hover:ring-rose-200" },
  Building2: { bg: "bg-stone-100", text: "text-stone-600", hover: "group-hover:bg-stone-500", ring: "group-hover:ring-stone-200" },
}

export function CategoriesSection() {
  const { t, locale } = useLanguage()
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("home.categories")}</h2>
            <p className="text-sm text-muted-foreground mt-1">Trouvez ce dont vous avez besoin</p>
          </div>
          <Link href="/search">
            <Button variant="ghost" size="sm" className="text-primary font-semibold">
              {t("common.see_all")} →
            </Button>
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 snap-x snap-mandatory sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2 w-8" />
              </div>
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              Aucune catégorie trouvée
            </div>
          ) : (
            categories.map((category) => {
              const Icon = iconMap[category.icon]
              const colors = colorMap[category.icon] ?? { bg: "bg-primary/10", text: "text-primary", hover: "group-hover:bg-primary", ring: "group-hover:ring-primary/20" }
              return (
                <Link
                  key={category.id}
                  href={`/search?category=${category.slug}`}
                  className="group flex-shrink-0 snap-start w-24 sm:w-auto flex flex-col items-center gap-3 rounded-2xl border border-transparent bg-white p-4 text-center transition-all hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 active:scale-95"
                >
                  <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ring-4 ring-transparent transition-all ${colors.bg} ${colors.text} ${colors.hover} ${colors.ring} group-hover:text-white`}>
                    {Icon && <Icon className="h-7 w-7 transition-transform group-hover:scale-110" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground leading-tight">
                      {locale === "fr" ? category.nameFr : category.name}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground font-medium">
                      {category.count}
                    </p>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
