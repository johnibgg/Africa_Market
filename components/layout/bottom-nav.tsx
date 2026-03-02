"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/search", label: "Explorer", icon: Search },
    { href: "/listings/new", label: "Publier", icon: PlusCircle, isMain: true },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/profile", label: "Profil", icon: User },
]

export function BottomNav() {
    const pathname = usePathname()
    const { isAuthenticated } = useAuth()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    if (item.isMain) {
                        return (
                            <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-6">
                                <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-600/30 active:scale-95 transition-transform hover:bg-teal-700">
                                    <item.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-[9px] font-bold text-teal-600 mt-1">{item.label}</span>
                            </Link>
                        )
                    }
                    // For messages and profile, require auth
                    const requiresAuth = item.href === "/messages" || item.href === "/profile"
                    const href = requiresAuth && !isAuthenticated ? "/auth/login" : item.href

                    return (
                        <Link key={item.href} href={href} className="flex flex-col items-center gap-1 px-3 py-1">
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-teal-600" : "text-slate-400"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={cn(
                                "text-[9px] font-semibold transition-colors",
                                isActive ? "text-teal-600" : "text-slate-400"
                            )}>
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="absolute -top-0.5 w-4 h-0.5 bg-teal-600 rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
