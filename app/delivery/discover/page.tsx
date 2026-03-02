"use client"

import { useState } from "react"
import { orders, formatPrice } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Clock, Truck, DollarSign, ChevronRight, Gavel } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function DeliveryDiscoverPage() {
    // Mocking available orders that need delivery
    const availableOrders = orders.filter(o => o.status === "CONFIRMED")
    const [bids, setBids] = useState<Record<string, string>>({})

    const handleBidSubmit = (orderId: string) => {
        const price = bids[orderId]
        if (!price) {
            toast.error("Veuillez entrer votre prix proposé")
            return
        }
        toast.success(`Votre offre de ${price} FCFA a été envoyée au client !`)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-heading">Découvrir des Courses</h1>
                <p className="text-muted-foreground">Trouvez des livraisons disponibles dans votre zone et proposez vos tarifs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availableOrders.map((order) => (
                    <Card key={order.id} className="border-teal-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Navigation className="w-5 h-5" />
                                <span className="font-bold">Zone : Cotonou (Akpakpa)</span>
                            </div>
                            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">À pourvoir</Badge>
                        </div>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-6">
                                <div className="space-y-4 relative">
                                    <div className="absolute left-3 top-3 bottom-0 w-0.5 border-l border-dashed border-teal-200"></div>

                                    <div className="flex gap-4 relative">
                                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 z-10 border-4 border-white">
                                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Récupération (Vendeur : {order.sellerName})</p>
                                            <p className="text-sm font-semibold mt-1">Atelier Mensah, Akpakpa, Cotonou</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 relative">
                                        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 z-10 border-4 border-white">
                                            <MapPin className="w-4 h-4 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Livraison (Client : {order.buyerName})</p>
                                            <p className="text-sm font-semibold mt-1">{order.deliveryAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck className="w-4 h-4 text-teal-600" />
                                        <span>Colis de taille moyenne</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-right justify-end">
                                        <Clock className="w-4 h-4 text-teal-600" />
                                        <span>Passée il y a 10m</span>
                                    </div>
                                </div>

                                <div className="bg-teal-50 p-4 rounded-xl space-y-3">
                                    <Label htmlFor={`bid-${order.id}`} className="text-teal-900 font-bold">Votre proposition de prix (FCFA)</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600" />
                                            <Input
                                                id={`bid-${order.id}`}
                                                type="number"
                                                placeholder="Ex: 2500"
                                                className="pl-9 border-teal-200"
                                                value={bids[order.id] || ""}
                                                onChange={(e) => setBids({ ...bids, [order.id]: e.target.value })}
                                            />
                                        </div>
                                        <Button
                                            className="bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
                                            onClick={() => handleBidSubmit(order.id)}
                                        >
                                            <Gavel className="w-4 h-4 mr-2" />
                                            Offrir
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-teal-600">Le client verra votre prix et votre trajet avant de choisir.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {availableOrders.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-muted/30 rounded-2xl border-2 border-dashed">
                        <Navigation className="mx-auto w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground">Aucune course disponible pour le moment</h3>
                        <p className="text-sm text-muted-foreground">Revenez bientôt ou activez les notifications pour votre zone.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
