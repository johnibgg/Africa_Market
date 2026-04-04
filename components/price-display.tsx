"use client"

import { cn } from "@/lib/utils"

function formatPrice(amount: number, currency = "FCFA") {
  return `${amount.toLocaleString("fr-FR")} ${currency}`
}


interface PriceDisplayProps {
  amount: number
  originalAmount?: number
  size?: "sm" | "md" | "lg"
  suffix?: string
  className?: string
}

export function PriceDisplay({
  amount,
  originalAmount,
  size = "md",
  suffix,
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm font-semibold",
    md: "text-lg font-bold",
    lg: "text-2xl font-bold",
  }

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn(sizeClasses[size], "text-primary")}>
        {formatPrice(amount)}
        {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
      </span>
      {originalAmount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(originalAmount)}
        </span>
      )}
    </span>
  )
}
