"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AdBannerProps {
    slot: "home-top" | "home-middle" | "sidebar" | "footer"
    className?: string
}

export function AdBanner({ slot, className }: AdBannerProps) {
    // Logic to fetch ad based on slot would go here.
    // For now, we return a placeholder or a static ad.

    if (slot === "home-top") {
        return (
            <div className={cn("w-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg overflow-hidden relative h-24 sm:h-32 flex items-center justify-center", className)}>
                <Link href="/pricing" className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg sm:text-2xl hover:bg-black/10 transition-colors">
                    Boostez vos ventes avec AfricaMarket Pro ! -50% le premier mois
                </Link>
            </div>
        )
    }

    if (slot === "sidebar") {
        return (
            <div className={cn("w-full bg-muted rounded-lg overflow-hidden relative aspect-square flex items-center justify-center", className)}>
                <span className="text-muted-foreground text-sm">Espace Publicitaire</span>
            </div>
        )
    }

    return null
}
