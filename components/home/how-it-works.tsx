"use client"

import { Search, MessageSquare, CreditCard } from "lucide-react"
import { useLanguage } from "@/lib/context/language-context"

export function HowItWorks() {
  const { t } = useLanguage()

  const steps = [
    {
      icon: Search,
      title: t("home.step1_title"),
      description: t("home.step1_desc"),
      step: "01",
    },
    {
      icon: MessageSquare,
      title: t("home.step2_title"),
      description: t("home.step2_desc"),
      step: "02",
    },
    {
      icon: CreditCard,
      title: t("home.step3_title"),
      description: t("home.step3_desc"),
      step: "03",
    },
  ]

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-2xl font-bold text-foreground">
          {t("home.how_it_works")}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <span className="mb-2 text-xs font-bold tracking-widest text-primary uppercase">
                {step.step}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="absolute top-8 right-0 hidden w-1/4 border-t-2 border-dashed border-primary/20 md:block" style={{ left: "75%" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
