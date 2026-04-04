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
import { cn } from "@/lib/utils"

const mockTrajectory = [
    { lat: 6.366, lng: 2.450 },
    { lat: 6.367, lng: 2.448 },
    { lat: 6.368, lng: 2.446 },
    { lat: 6.369, lng: 2.444 },
    { lat: 6.370, lng: 2.442 },
    { lat: 6.371, lng: 2.440 },
]

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
    const stats = [
        { label: "Commandes", value: buyerOrders.length.toString(), icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Favoris", value: wishlist.length.toString(), icon: Heart, color: "text-red-600", bg: "bg-red-100" },
        { label: "Dépenses", value: `${(data.stats?.totalSpent || 0).toLocaleString()} FCFA`, icon: Star, color: "text-yellow-600", bg: "bg-yellow-100" },
        { label: "Suivis", value: (data.stats?.followingCount || 0).toString(), icon: ShieldCheck, color: "text-teal-600", bg: "bg-teal-100" },
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
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header with User Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-3xl bg-teal-100 flex items-center justify-center text-teal-700 font-black text-3xl shadow-inner overflow-hidden border-4 border-white">
                            {user?.image ? <Image src={user.image} alt={user.name || ""} fill className="object-cover" /> : user?.name?.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bonjour, {user?.name?.split(' ')[0]} 👋</h1>
                        <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-teal-500" /> Compte Acheteur Particulier
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 h-12 px-6 font-bold" asChild>
                        <Link href="/profile">Mon profil</Link>
                    </Button>
                    <Button className="rounded-2xl bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-900/20 h-12 px-8 font-bold text-white" asChild>
                        <Link href="/search">
                            <Package className="w-5 h-5 mr-2" /> Shopping
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all bg-white">
                        <CardContent className="p-6">
                            <div className={cn("p-3 w-12 h-12 rounded-2xl mb-4 flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="bg-slate-200/50 p-1 rounded-2xl h-14 backdrop-blur-md mb-8">
                    <TabsTrigger value="orders" className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-lg font-bold transition-all">Mes Commandes</TabsTrigger>
                    <TabsTrigger value="wishlist" className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-lg font-bold transition-all">Ma Wishlist</TabsTrigger>
                </TabsList>

                <TabsContent value="orders">
                    <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-8 py-6">
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900">Historique des commandes</CardTitle>
                                <CardDescription className="font-medium">Suivez vos achats en temps réel</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {buyerOrders.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Package className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune commande pour le moment</h3>
                                    <p className="text-slate-500 mb-6 max-w-xs mx-auto">Explorez notre catalogue et trouvez des pépites !</p>
                                    <Button className="rounded-xl bg-teal-600 hover:bg-teal-700 px-8" asChild>
                                        <Link href="/search">Découvrir les produits</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {buyerOrders.map((order: any) => (
                                        <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center gap-5">
                                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm border bg-slate-50">
                                                    {order.items[0]?.listing.images[0] && (
                                                        <Image src={order.items[0].listing.images[0]} alt="Produit" fill className="object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-slate-900 line-clamp-1">{order.items[0]?.listing.title}</p>
                                                    <p className="text-sm text-slate-400 font-medium">Commande #{order.id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-sm font-black text-teal-600 mt-1">{order.total.toLocaleString()} FCFA</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                                                <Badge className={cn(
                                                    "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none",
                                                    getStatusColor(order.status)
                                                )}>
                                                    {order.status === "DELIVERED" ? "Livré" : 
                                                     order.status === "SHIPPED" ? "En route" : 
                                                     order.status === "PROCESSING" ? "En traitement" : "Confirmé"}
                                                </Badge>
                                                
                                                <div className="flex gap-2">
                                                    {order.seller?.phone && (
                                                        <Button size="sm" variant="outline" className="rounded-xl font-bold bg-emerald-50 text-emerald-600 border-emerald-100" asChild>
                                                            <Link href={`https://wa.me/${order.seller.phone.replace(/\D/g, '')}`} target="_blank">
                                                                WhatsApp
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {order.status === "SHIPPED" && (
                                                        <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
                                                            <DialogTrigger asChild>
                                                                <Button size="sm" className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700">
                                                                    <Truck className="mr-2 h-4 w-4" /> Suivre
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                                                                <div className="bg-teal-700 p-6 text-white">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="text-2xl font-black flex items-center gap-2">
                                                                            <Navigation className="w-6 h-6 animate-pulse" />
                                                                            Suivi en Direct
                                                                        </DialogTitle>
                                                                        <DialogDescription className="text-teal-100">
                                                                            Course #{order.id.slice(-6)} • Livreur en route
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
                                                    <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 border-slate-200 shadow-sm" asChild>
                                                        <Link href={`/orders/${order.id}`}>Détails</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
