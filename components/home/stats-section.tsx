"use client"

import { Users, ShoppingBag, ArrowRightLeft, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/context/language-context"

export function StatsSection() {
  const { t } = useLanguage()

  const stats = [
    { value: "15K+", label: t("home.stats_users"), icon: Users },
    { value: "8,900+", label: t("home.stats_listings"), icon: ShoppingBag },
    { value: "23K+", label: t("home.stats_transactions"), icon: ArrowRightLeft },
    { value: "45+", label: t("home.stats_cities"), icon: MapPin },
  ]

  return (
    <section className="bg-primary px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <stat.icon className="mb-3 h-8 w-8 text-primary-foreground/70" />
              <span className="text-3xl font-bold text-primary-foreground md:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-primary-foreground/70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
