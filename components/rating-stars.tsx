"use client"

import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "sm",
  showValue = false,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalf ? 1 : 0)

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-${i}`}
          className={cn(sizeClasses[size], "fill-accent text-accent")}
        />
      ))}
      {hasHalf && (
        <StarHalf
          className={cn(sizeClasses[size], "fill-accent text-accent")}
        />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          className={cn(sizeClasses[size], "text-muted-foreground/30")}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  )
}
