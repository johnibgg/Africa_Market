"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package, Heart, Star, Clock, MapPin, ChevronRight, Truck, Navigation, Gavel, ShieldCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import TrackingMap from "@/components/delivery/tracking-map"


export default function BuyerDashboard() {
    const { user, isAuthenticated } = useAuth()
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isTrackingOpen, setIsTrackingOpen] = useState(false)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch("/api/dashboard/buyer")
                if (res.ok) {
                    const dashboardData = await res.json()
                    setData(dashboardData)
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (isAuthenticated) {
            fetchDashboardData()
        }
    }, [isAuthenticated])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        )
    }

    if (!data) return null

    const buyer = user
    const buyerOrders = data.orders || []
    const wishlist: any[] = [] // Wishlist needs a dedicated table in DB to be real
    const followedSellers = data.followedSellers || []
    const stats = data.stats || {}

    // Mock trajectory data
    const mockTrajectory = [
        { lat: 6.366, lng: 2.450 },
        { lat: 6.367, lng: 2.448 },
        { lat: 6.368, lng: 2.446 },
        { lat: 6.369, lng: 2.444 },
        { lat: 6.370, lng: 2.442 },
        { lat: 6.371, lng: 2.440 },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-green-100 text-green-700"
            case "SHIPPED": return "bg-blue-100 text-blue-700"
            case "PROCESSING": return "bg-yellow-100 text-yellow-700"
            case "CONFIRMED": return "bg-teal-100 text-teal-700"
            default: return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Mon Tableau de Bord</h1>
                    <p className="text-muted-foreground">Bienvenue, {buyer?.name || "Utilisateur"}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/profile">Mon Profil</Link>
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">Acheter à nouveau</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-teal-100 rounded-full">
                                <Package className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Commandes totales</p>
                                <h3 className="text-2xl font-bold">{stats.orderCount}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-pink-100 rounded-full">
                                <Heart className="w-6 h-6 text-pink-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Vendeurs suivis</p>
                                <h3 className="text-2xl font-bold">{stats.followingCount}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total dépensé</p>
                                <h3 className="text-2xl font-bold">{stats.totalSpent?.toLocaleString()} FCFA</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
                    <TabsTrigger value="orders">Mes Commandes</TabsTrigger>
                    <TabsTrigger value="wishlist">Ma Wishlist</TabsTrigger>
                </TabsList>

                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des commandes</CardTitle>
                            <CardDescription>Suivez vos achats récents et passés.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {buyerOrders.map((order: any) => (
                                    <div key={order.id} className="border rounded-lg overflow-hidden">
                                        <div className="bg-muted/50 p-4 flex flex-wrap justify-between items-center gap-4 border-b">
                                            <div className="flex gap-6 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">COMMANDE PASSÉE</p>
                                                    <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">TOTAL</p>
                                                    <p className="font-medium">{order.total.toLocaleString()} FCFA</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">EXPÉDIÉ À</p>
                                                    <p className="font-medium truncate max-w-[150px]">{order.deliveryAddress}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground mb-1">N° DE COMMANDE {order.id}</p>
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status === "DELIVERED" ? "Livré" :
                                                        order.status === "SHIPPED" ? "En cours d'expédition" :
                                                            order.status === "PROCESSING" ? "En traitement" : order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 items-center">
                                                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                                                        <Image
                                                            src={item.listing.images[0]}
                                                            alt={item.listing.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold truncate">{item.listing.title}</h4>
                                                        <p className="text-sm text-muted-foreground">Vendu par {order.sellerName}</p>
                                                        <p className="text-sm font-medium mt-1">{item.price.toLocaleString()} FCFA x {item.quantity}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {order.status === "SHIPPED" && (
                                                            <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
                                                                <DialogTrigger asChild>
                                                                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                                                        <Truck className="mr-2 h-4 w-4" /> Suivre
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                                                                    <div className="bg-teal-700 p-6 text-white">
                                                                        <DialogHeader>
                                                                            <DialogTitle className="text-2xl font-heading flex items-center gap-2">
                                                                                <Navigation className="w-6 h-6 animate-pulse" />
                                                                                Suivi en Direct
                                                                            </DialogTitle>
                                                                            <DialogDescription className="text-teal-100">
                                                                                Course #{order.id} • Livreur : Serge Adandedjan
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                    </div>
                                                                    <div className="p-1">
                                                                        <TrackingMap
                                                                            delivererPosition={mockTrajectory[0]}
                                                                            trajectory={mockTrajectory}
                                                                            pickupPoint={{ lat: 6.365, lng: 2.455 }}
                                                                            deliveryPoint={{ lat: 6.375, lng: 2.435 }}
                                                                        />
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}
                                                        {order.status === "CONFIRMED" && (
                                                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                                                <Gavel className="mr-2 h-4 w-4" /> Voir les offres (3)
                                                            </Button>
                                                        )}
                                                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Acheter à nouveau</Button>
                                                        <Button size="sm" variant="outline">Laisser un avis</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="wishlist">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((listing: any) => (
                            <Card key={listing.id} className="overflow-hidden group">
                                <div className="relative aspect-video">
                                    <Image
                                        src={listing.images[0]}
                                        alt={listing.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Button variant="secondary" size="icon" className="rounded-full bg-white/90 hover:bg-white text-pink-600">
                                            <Heart className="w-5 h-5 fill-pink-600" />
                                        </Button>
                                    </div>
                                </div>
                                <CardHeader className="p-4 pb-0">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50">
                                            {listing.category}
                                        </Badge>
                                        <div className="flex items-center text-sm font-bold text-teal-600">
                                            <Star className="w-4 h-4 mr-1 fill-teal-600" />
                                            {listing.rating}
                                        </div>
                                    </div>
                                    <CardTitle className="text-lg mt-2 truncate">{listing.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <p className="text-xl font-bold text-teal-700">{listing.price.toLocaleString()} FCFA</p>
                                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {listing.location}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 gap-2">
                                    <Button className="flex-1 bg-teal-600 hover:bg-teal-700">Ajouter au panier</Button>
                                    <Button variant="outline" size="icon" asChild>
                                        <Link href={`/listings/${listing.id}`}>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                        {wishlist.length === 0 && (
                            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
                                <Heart className="mx-auto w-12 h-12 text-muted-foreground opacity-20 mb-4" />
                                <h3 className="text-lg font-semibold">Votre wishlist est vide</h3>
                                <p className="text-muted-foreground mb-6">Ajoutez des articles qui vous plaisent pour les retrouver facilement.</p>
                                <Button className="bg-teal-600 hover:bg-teal-700" asChild>
                                    <Link href="/search">Explorer les annonces</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
