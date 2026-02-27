"use client"

import { useLanguage } from "@/lib/context/language-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

  return (
    <div className={cn("flex items-center gap-0.5 rounded-full border bg-muted p-0.5", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocale("fr")}
        className={cn(
          "h-7 rounded-full px-3 text-xs font-medium",
          locale === "fr"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        FR
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLocale("en")}
        className={cn(
          "h-7 rounded-full px-3 text-xs font-medium",
          locale === "en"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </Button>
    </div>
  )
}
