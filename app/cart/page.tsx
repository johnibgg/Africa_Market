"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PriceDisplay } from "@/components/price-display"
import { useCart } from "@/lib/context/cart-context"
import { useLanguage } from "@/lib/context/language-context"
import { formatPrice } from "@/lib/mock-data"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart()
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              {t("cart.title")} ({itemCount})
            </h1>
            {items.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
                {t("cart.clear")}
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{t("cart.empty")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("cart.empty_desc")}</p>
              <Button className="mt-6" asChild>
                <Link href="/search">{t("cart.continue_shopping")}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.listing.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Link
                            href={`/listings/${item.listing.id}`}
                            className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
                          >
                            <Image
                              src={item.listing.images[0]}
                              alt={item.listing.title}
                              fill
                              className="object-cover"
                            />
                          </Link>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <Link
                                href={`/listings/${item.listing.id}`}
                                className="font-medium text-foreground hover:text-primary"
                              >
                                {item.listing.title}
                              </Link>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {item.listing.seller.name} - {item.listing.location}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.listing.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="min-w-[2rem] text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.listing.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-3">
                                <PriceDisplay amount={item.listing.price * item.quantity} size="md" />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => removeItem(item.listing.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/search">{t("cart.continue_shopping")}</Link>
                </Button>
              </div>

              {/* Order summary */}
              <div>
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-lg">{t("cart.summary")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {t("cart.subtotal")} ({itemCount} {itemCount > 1 ? "articles" : "article"})
                        </span>
                        <span className="font-medium">{formatPrice(total)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("cart.delivery_fee")}</span>
                        <span className="font-medium text-primary">{t("cart.calculated_at_checkout")}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{t("cart.total")}</span>
                        <PriceDisplay amount={total} size="lg" />
                      </div>
                    </div>

                    <Button className="mt-6 w-full" size="lg" asChild>
                      <Link href="/checkout">
                        {t("cart.checkout")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <div className="mt-4 space-y-2 text-center">
                      <p className="text-xs text-muted-foreground">{t("cart.secure_payment")}</p>
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span>MTN MoMo</span>
                        <span>Moov Money</span>
                        <span>Visa</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
