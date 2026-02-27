"use client"

import Link from "next/link"
import { ArrowRight, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/context/language-context"

export function SellCTA() {
  const { t } = useLanguage()

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left">
            <div className="flex-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
                <Store className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-primary-foreground text-balance md:text-3xl">
                {t("home.sell_cta_title")}
              </h2>
              <p className="mt-3 max-w-xl text-base text-primary-foreground/80 text-pretty">
                {t("home.sell_cta_desc")}
              </p>
            </div>
            <div className="mt-6 md:mt-0 md:ml-8">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {t("home.sell_cta_button")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
