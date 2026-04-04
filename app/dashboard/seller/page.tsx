"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart3,
    Package,
    Plus,
    Settings,
    Star,
    TrendingUp,
    Users,
    DollarSign,
    Eye,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts"
import { ClientOnly } from "@/components/client-only"
import Image from "next/image"
import Link from "next/link"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Loader2 } from "lucide-react"

export default function SellerDashboard() {
    const { user, isAuthenticated } = useAuth()
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch("/api/dashboard/seller")
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

    const seller = user
    const sellerListings = data.listings || []
    const sellerOrders = data.orders || []
    const stats = data.stats || {}

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-heading flex items-center gap-2">
                        Ma Boutique
                        <Badge variant="outline" className="text-base font-normal bg-primary/10 text-primary border-primary/20">
                            {seller?.subscription === 'pro' ? 'Pro' : seller?.subscription === 'vip' ? 'VIP' : 'Basic'}
                        </Badge>
                    </h1>
                    <p className="text-muted-foreground">Bonjour {seller?.name}, voici les performances de <span className="text-teal-600 font-semibold">{seller?.shopName || "votre boutique"}</span></p>
                </div>
                <div className="flex gap-2">
                    {seller?.subscription === 'basic' && (
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5" asChild>
                            <Link href="/pricing">Passer Pro</Link>
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href={`/seller/${seller?.id}`}><ExternalLink className="mr-2 h-4 w-4" /> Voir ma boutique</Link>
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="mr-2 h-4 w-4" /> Nouvelle Annonce
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">Revenu Total</p>
                                <h3 className="text-2xl font-bold">{stats.revenue?.toLocaleString()} FCFA</h3>
                            </div>
                            <div className="p-2 bg-teal-100 rounded-lg">
                                <DollarSign className="w-5 h-5 text-teal-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>Revenu validé (livrées)</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">Commandes</p>
                                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-blue-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>Total historique</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">Vues des annonces</p>
                                <h3 className="text-2xl font-bold">{stats.views?.toLocaleString()}</h3>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Eye className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-purple-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>Visibilité cumulée</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">Note moyenne</p>
                                <h3 className="text-2xl font-bold">{stats.averageRating} / 5</h3>
                            </div>
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground text-center">
                            Basé sur les avis clients
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Aperçu des revenus</CardTitle>
                        <CardDescription>Évolution de vos ventes sur les 6 derniers mois.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ClientOnly>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.monthlyData || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                                        <Tooltip
                                            formatter={(value: number) => [`${value.toLocaleString()} FCFA`, "Revenu"]}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ClientOnly>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ventes récentes</CardTitle>
                        <CardDescription>Vos dernières commandes client.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sellerOrders.slice(0, 5).map((order: any) => (
                                <div key={order.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">Commande #{order.id.slice(-5)}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{order.total.toLocaleString()} FCFA</p>
                                        <Badge variant="outline" className="text-[10px] h-4">
                                            {order.status === "DELIVERED" ? "Livré" :
                                                order.status === "SHIPPED" ? "Expédié" :
                                                    order.status === "PROCESSING" ? "En cours" : order.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-teal-600 hover:text-teal-700 hover:bg-teal-50" asChild>
                                <Link href="/dashboard/seller/orders">Voir toutes les commandes</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="listings" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="listings">Mes Annonces ({sellerListings.length})</TabsTrigger>
                    <TabsTrigger value="reviews">Avis Clients</TabsTrigger>
                    <TabsTrigger value="settings">Paramètres Boutique</TabsTrigger>
                </TabsList>

                <TabsContent value="listings">
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-muted/50 border-b">
                                        <tr>
                                            <th className="p-4 font-semibold text-sm">Produit / Service</th>
                                            <th className="p-4 font-semibold text-sm">Prix</th>
                                            <th className="p-4 font-semibold text-sm">Performance</th>
                                            <th className="p-4 font-semibold text-sm">Statut</th>
                                            <th className="p-4 font-semibold text-sm text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sellerListings.map((listing: any) => (
                                            <tr key={listing.id} className="border-b transition-colors hover:bg-muted/30">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border">
                                                            {listing.images && listing.images[0] ? (
                                                                <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                                    <Package className="w-6 h-6 text-muted-foreground" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-sm truncate max-w-[200px]">{listing.title}</p>
                                                            <p className="text-xs text-muted-foreground">{listing.category?.nameFr || "Sans catégorie"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-bold">{listing.price.toLocaleString()} FCFA</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4 text-xs">
                                                        <div className="flex items-center"><Eye className="w-3 h-3 mr-1" /> {listing.views}</div>
                                                        <div className="flex items-center"><Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" /> {listing.rating}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            listing.status === "ACTIVE"
                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                : "bg-gray-50 text-gray-700 border-gray-200"
                                                        }
                                                    >
                                                        {listing.status === "ACTIVE" ? "Actif" : listing.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews">
                    {/* Add reviews content here */}
                    <div className="flex items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-xl">
                        Gestion des avis en cours de développement
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    {/* Add shop settings content here */}
                    <div className="flex items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-xl">
                        Paramètres de boutique en cours de développement
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
