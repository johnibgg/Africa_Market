"use client"

import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface FollowButtonProps {
    sellerId: string
    initialIsFollowing?: boolean
    variant?: "default" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

export function FollowButton({
    sellerId,
    initialIsFollowing = false,
    variant = "outline",
    size = "sm"
}: FollowButtonProps) {
    const { user, isAuthenticated } = useAuth()
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleFollow = async () => {
        if (!isAuthenticated) {
            toast.error("Veuillez vous connecter pour suivre ce vendeur")
            router.push("/auth/login")
            return
        }

        if (user?.id === sellerId) {
            toast.error("Vous ne pouvez pas vous suivre vous-même")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/user/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sellerId }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            setIsFollowing(data.isFollowing)
            toast.success(data.message)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant={isFollowing ? "secondary" : variant}
            size={size}
            disabled={isLoading}
            onClick={handleFollow}
            className="gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <UserMinus className="h-4 w-4" />
            ) : (
                <UserPlus className="h-4 w-4" />
            )}
            {isFollowing ? "Suivi" : "Suivre"}
        </Button>
    )
}
