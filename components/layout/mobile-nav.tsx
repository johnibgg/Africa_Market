"use client"

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

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/search", label: t("nav.search"), icon: Search },
    { href: "/videos", label: "Vidéos", icon: Play },
    { href: "/cart", label: t("nav.cart"), icon: ShoppingCart },
  ]

  const authItems = isAuthenticated
    ? [
      { href: `/profile/${user?.id}`, label: t("nav.profile"), icon: User },
      {
        href:
          user?.role === "seller"
            ? "/dashboard/seller"
            : user?.role === "admin"
              ? "/dashboard/admin"
              : user?.role === "delivery"
                ? "/dashboard/delivery"
                : "/dashboard/buyer",
        label: t("nav.dashboard"),
        icon: LayoutDashboard,
      },
      { href: "/messages", label: t("nav.messages"), icon: MessageSquare },
      ...(user?.role === "delivery"
        ? [{ href: "/delivery/discover", label: "Livrer", icon: Truck }]
        : []),
      ...(user?.verificationStatus !== "verified"
        ? [{ href: "/auth/verify", label: "S'authentifier", icon: ShieldCheck }]
        : []),
      ...(user?.role === "admin"
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

          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start gap-3">
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
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={() => { login("buyer"); onClose() }}
              >
                <LogIn className="h-4 w-4" />
                {t("nav.login")}
              </Button>
              <Link href="/auth/register" onClick={onClose}>
                <Button className="w-full justify-start gap-3">
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
