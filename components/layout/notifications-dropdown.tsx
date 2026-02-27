"use client"

import { useState } from "react"
import { Bell, Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"

export function NotificationsDropdown() {
    const { isAuthenticated } = useAuth()
    const [notifications, setNotifications] = useState<any[]>([])
    const unreadCount = notifications.filter((n) => !n.isRead).length

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/user/notifications")
            if (res.ok) {
                const data = await res.json()
                setNotifications(data)
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications()
            // Optional: Set up interval/polling or use Supabase Realtime here
            const interval = setInterval(fetchNotifications, 60000)
            return () => clearInterval(interval)
        }
    }, [isAuthenticated])

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/user/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            )
        } catch (error) {
            console.error(error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await fetch("/api/user/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            })
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] bg-red-500 hover:bg-red-600">
                            {unreadCount}
                        </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2">
                    <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto px-2 text-xs text-muted-foreground hover:text-primary"
                            onClick={(e) => {
                                e.preventDefault()
                                markAllAsRead()
                            }}
                        >
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground">
                            <Bell className="mb-2 h-8 w-8 opacity-20" />
                            <p className="text-sm">Aucune notification</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 p-1">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex cursor-pointer flex-col items-start gap-1 rounded-md p-3 focus:bg-accent",
                                        !notification.isRead && "bg-muted/50"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                    asChild
                                >
                                    <Link href={notification.link || "#"}>
                                        <div className="flex w-full items-start justify-between gap-2">
                                            <span className="font-semibold text-sm">
                                                {notification.type === "NEW_LISTING" ? "Nouvel article" :
                                                    notification.type === "ORDER_UPDATE" ? "Commande" :
                                                        notification.type === "NEW_FOLLOWER" ? "Nouvel abonné" : "Système"}
                                            </span>
                                            {!notification.isRead && (
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.content}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground mt-1">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
