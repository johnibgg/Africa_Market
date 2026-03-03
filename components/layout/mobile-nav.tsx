"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Home,
  Search,
  MessageSquare,
  User,
  LayoutDashboard,
  X,
  ShoppingCart,
  LogIn,
  UserPlus,
  LogOut,
  Store,
  Shield,
  Truck,
  Play,
  ShieldCheck,
  PlusCircle,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/context/language-context"
import { useAuth } from "@/lib/context/auth-context"

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { t } = useLanguage()
  const { user, isAuthenticated, login, logout } = useAuth()

  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/search", label: t("nav.search"), icon: Search },
    { href: "/listings/new", label: "Publier", icon: PlusCircle, primary: true },
    { href: "/videos", label: "Vidéos", icon: Play },
    { href: "/cart", label: t("nav.cart"), icon: ShoppingCart },
  ]

  const authItems = (hasMounted && isAuthenticated)
    ? [
      { href: "/profile", label: t("nav.profile"), icon: User },
      {
        href:
          user?.role === "SELLER"
            ? "/dashboard/seller"
            : user?.role === "ADMIN"
              ? "/dashboard/admin"
              : user?.role === "DELIVERY"
                ? "/dashboard/partner"
                : "/dashboard/buyer",
        label: t("nav.dashboard"),
        icon: LayoutDashboard,
      },
      { href: "/messages", label: t("nav.messages"), icon: MessageSquare },
      ...(user?.role === "DELIVERY"
        ? [{ href: "/delivery/discover", label: "Livrer", icon: Truck }]
        : []),
      ...(user?.verificationStatus !== "VERIFIED"
        ? [{ href: "/auth/verify", label: "S'authentifier", icon: ShieldCheck }]
        : []),
      ...(user?.role === "ADMIN"
        ? [{ href: "/dashboard/admin", label: t("nav.admin"), icon: Shield }]
        : []),
    ]
    : []

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Store className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Africa<span className="text-primary">Market</span>
              </span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-1 p-4">
          {isAuthenticated && user && (
            <div className="mb-3 rounded-lg bg-muted p-3">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}

          {navItems.map((item: any) => (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <Button
                variant={item.primary ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${item.primary ? "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}

          {authItems.length > 0 && (
            <>
              <Separator className="my-2" />
              {authItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </>
          )}

          <Separator className="my-2" />

          {isAuthenticated ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={() => { logout(); onClose() }}
            >
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </Button>
          ) : (
            <>
              <Link href="/auth/login" onClick={onClose} className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                >
                  <LogIn className="h-4 w-4" />
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/auth/register" onClick={onClose} className="w-full">
                <Button className="w-full justify-start gap-3 mt-1">
                  <UserPlus className="h-4 w-4" />
                  {t("nav.register")}
                </Button>
              </Link>
            </>
          )}

          <Separator className="my-2" />

          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-muted-foreground">Langue</span>
            <LanguageToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
