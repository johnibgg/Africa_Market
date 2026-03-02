"use client"

import Link from "next/link"
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Store,
  Shield,
  Play,
  Truck,
  ShieldCheck,
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageToggle } from "@/components/language-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useLanguage } from "@/lib/context/language-context"
import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import { useState } from "react"
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown"

export function Header() {
  const { t } = useLanguage()
  const { itemCount } = useCart()
  const { user, isAuthenticated, login, logout } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const getDashboardLink = () => {
    if (!user) return "/dashboard/buyer"
    switch (user.role) {
      case "seller":
        return "/dashboard/seller"
      case "admin":
        return "/admin"
      case "delivery":
        return "/dashboard/delivery"
      default:
        return "/dashboard/buyer"
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <img src="/logo.png" alt="AfricaMarket" className="h-10 w-auto object-contain" />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline-block">
            Africa<span className="text-primary">Market</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/">
            <Button variant="ghost" size="sm">{t("nav.home")}</Button>
          </Link>
          <Link href="/search">
            <Button variant="ghost" size="sm">{t("nav.categories")}</Button>
          </Link>
          <Link href="/videos">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Play className="h-4 w-4 text-teal-500 fill-teal-500" /> Vidéos
            </Button>
          </Link>
          {user?.role === "delivery" && (
            <Link href="/delivery/discover">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-500" /> Livrer
              </Button>
            </Link>
          )}
          {isAuthenticated && (
            <Link href="/messages">
              <Button variant="ghost" size="sm">{t("nav.messages")}</Button>
            </Link>
          )}
          <Link href="/listings/new">
            <Button size="sm" className="ml-2 bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 gap-2">
              <PlusCircle className="h-4 w-4" /> Vendre
            </Button>
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:flex" />

          <Link href="/search" className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-4 w-4" />
              <span className="sr-only">{t("nav.search")}</span>
            </Button>
          </Link>



          {isAuthenticated && <NotificationsDropdown />}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                  <span className="sr-only">{t("nav.profile")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user?.id}`} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {t("nav.dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {t("nav.messages")}
                  </Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t("nav.admin")}
                    </Link>
                  </DropdownMenuItem>
                )}
                {user?.role === "buyer" && (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/verify" className="flex items-center gap-2 text-teal-600 font-medium">
                      <Store className="h-4 w-4" />
                      Devenir Vendeur
                    </Link>
                  </DropdownMenuItem>
                )}
                {user?.verificationStatus !== "verified" && user?.role !== "buyer" && (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/verify" className="flex items-center gap-2 text-teal-600 font-medium">
                      <ShieldCheck className="h-4 w-4" />
                      S'authentifier
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" onClick={() => login("buyer")}>
                {t("nav.login")}
              </Button>
              <Link href="/auth/register">
                <Button size="sm">{t("nav.register")}</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  )
}
