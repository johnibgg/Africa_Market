"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, MapPin, CreditCard, Smartphone, Banknote, ShieldCheck, CheckCircle2, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PriceDisplay } from "@/components/price-display"
import { useCart } from "@/lib/context/cart-context"
import { useLanguage } from "@/lib/context/language-context"
import { formatPrice } from "@/lib/mock-data"

type CheckoutStep = "delivery" | "payment" | "confirmation"

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart()
  const { t } = useLanguage()
  const router = useRouter()
  const [step, setStep] = useState<CheckoutStep>("delivery")
  const [paymentMethod, setPaymentMethod] = useState("mtn_momo")
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    quartier: "",
    city: "Cotonou",
    notes: "",
  })

  const deliveryFee = 2500
  const grandTotal = total + deliveryFee
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (step === "confirmation") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">{t("checkout.order_confirmed")}</h1>
            <p className="mt-2 text-muted-foreground">{t("checkout.order_confirmed_desc")}</p>
            <div className="mt-6 rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">{t("checkout.order_number")}</p>
              <p className="text-lg font-bold text-primary">AM-2025-{String(Math.floor(Math.random() * 1000)).padStart(3, "0")}</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild>
                <Link href="/dashboard/buyer">{t("checkout.view_orders")}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/search">{t("cart.continue_shopping")}</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const [loading, setLoading] = useState(false)

  const handleConfirmOrder = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            listingId: item.listing.id,
            quantity: item.quantity,
            price: item.listing.price,
          })),
          total: total,
          deliveryFee: deliveryFee,
          address: deliveryInfo.address + ", " + deliveryInfo.city,
          paymentMethod: paymentMethod,
        })
      })

      if (res.ok) {
        toast.success(t("checkout.success_message") || "Commande confirmée !")
        clearCart()
        setStep("confirmation")
      } else {
        const data = await res.json()
        toast.error(data.message || "Erreur lors de la confirmation")
      }
    } catch (err) {
      console.error(err)
      toast.error("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <h1 className="text-2xl font-bold">{t("cart.empty")}</h1>
            <Button asChild className="rounded-xl">
              <Link href="/search">{t("cart.back_to_shop")}</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Progress steps */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {[
              { key: "delivery" as const, label: t("checkout.delivery_info"), num: 1 },
              { key: "payment" as const, label: t("checkout.payment"), num: 2 },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <div className="h-px w-12 bg-border" />}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${step === s.key
                    ? "bg-primary text-primary-foreground"
                    : s.num < (step === "payment" ? 2 : 1)
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {s.num}
                </div>
                <span className={`hidden text-sm sm:inline ${step === s.key ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: Form */}
            <div className="lg:col-span-2">
              {step === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {t("checkout.delivery_info")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t("checkout.full_name")}</Label>
                        <Input
                          id="fullName"
                          value={deliveryInfo.fullName}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                          placeholder="Ex: Jean Mensah"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("checkout.phone")}</Label>
                        <Input
                          id="phone"
                          value={deliveryInfo.phone}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                          placeholder="+229 97 XX XX XX"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t("checkout.address")}</Label>
                      <Input
                        id="address"
                        value={deliveryInfo.address}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                        placeholder="Numero et nom de rue"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="quartier">{t("checkout.quartier")}</Label>
                        <Input
                          id="quartier"
                          value={deliveryInfo.quartier}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, quartier: e.target.value })}
                          placeholder="Ex: Akpakpa, Gbeto..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("checkout.city")}</Label>
                        <Input
                          id="city"
                          value={deliveryInfo.city}
                          onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">{t("checkout.notes")}</Label>
                      <Textarea
                        id="notes"
                        value={deliveryInfo.notes}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                        placeholder="Instructions pour le livreur..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button onClick={() => setStep("payment")}>
                        {t("checkout.continue_to_payment")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      {t("checkout.payment_method")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        {[
                          { value: "mtn_momo", label: "MTN Mobile Money", icon: Smartphone, desc: "Paiement via MTN MoMo" },
                          { value: "moov_money", label: "Moov Money", icon: Smartphone, desc: "Paiement via Moov Money" },
                          { value: "card", label: "Carte bancaire", icon: CreditCard, desc: "Visa, Mastercard" },
                          { value: "cash", label: "Paiement a la livraison", icon: Banknote, desc: "Especes a la reception" },
                        ].map((method) => (
                          <label
                            key={method.value}
                            className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${paymentMethod === method.value
                              ? "border-primary bg-primary/5"
                              : "hover:bg-muted/50"
                              }`}
                          >
                            <RadioGroupItem value={method.value} />
                            <method.icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{method.label}</p>
                              <p className="text-xs text-muted-foreground">{method.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>

                    {(paymentMethod === "mtn_momo" || paymentMethod === "moov_money") && (
                      <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                        <Label htmlFor="momo_number">{t("checkout.mobile_number")}</Label>
                        <Input id="momo_number" placeholder="+229 XX XX XX XX" />
                        <p className="text-xs text-muted-foreground">
                          {t("checkout.mobile_payment_desc")}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <p className="text-xs text-muted-foreground">{t("checkout.secure_desc")}</p>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setStep("delivery")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {t("common.back")}
                      </Button>
                      <Button
                        onClick={handleConfirmOrder}
                        disabled={loading}
                      >
                        {loading ? t("common.loading") : t("checkout.confirm_order")} - {formatPrice(grandTotal)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">{t("cart.summary")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.listing.id} className="flex gap-3">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={item.listing.images[0]}
                            alt={item.listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="line-clamp-1 text-sm font-medium">{item.listing.title}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">{formatPrice(item.listing.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("cart.delivery_fee")}</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{t("cart.total")}</span>
                      <PriceDisplay amount={grandTotal} size="lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
