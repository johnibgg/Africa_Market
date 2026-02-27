"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Loader2 } from "lucide-react"

import {
    Truck,
    MapPin,
    Package,
    Navigation,
    PhoneCall,
    Clock,
    AlertCircle
} from "lucide-react"

export default function PartnerDashboard() {
    const { user, isAuthenticated } = useAuth()
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch("/api/dashboard/partner")
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

    const partner = user
    const activeDeliveries = data.activeShipments || []
    const availableOrders = data.availableOrders || []
    const stats = data.stats || {}

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">En attente</Badge>
            case "picked_up": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Récupéré</Badge>
            case "in_transit": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">En transit</Badge>
            case "delivered": return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Livré</Badge>
            default: return <Badge>{status}</Badge>
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Espace Livreur</h1>
                    <p className="text-muted-foreground">Gérez vos courses et le suivi des livraisons</p>
                </div>
                <div className="flex gap-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <div className="text-center">
                        <p className="text-xs text-teal-600 font-medium h-4">Statut Actuel</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-bold text-teal-900 font-heading">EN LIGNE</span>
                        </div>
                    </div>
                    <div className="w-px bg-teal-200 self-stretch"></div>
                    <div>
                        <p className="text-xs text-teal-600 font-medium h-4">Gains cumulés</p>
                        <p className="text-sm font-bold text-teal-900 font-heading mt-1">{stats.totalEarnings?.toLocaleString()} FCFA</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Deliveries List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-teal-600" />
                        Livraisons en cours ({activeDeliveries.length})
                    </h2>

                    <div className="space-y-4">
                        {activeDeliveries.map((task: any) => (
                            <Card key={task.id} className="overflow-hidden border-teal-100 shadow-md">
                                <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 text-white flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        <span className="font-bold">Course #{task.id.slice(-5)}</span>
                                    </div>
                                    <span className="text-sm font-medium">Frais: {task.deliveryFee?.toLocaleString()} FCFA</span>
                                </div>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6 relative">
                                            <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-dashed border-l border-dashed border-teal-200"></div>

                                            <div className="flex gap-4 relative">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 z-10 border-4 border-white">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold h-4">Point de départ (Vendeur : {task.seller?.shopName || task.seller?.name})</p>
                                                    <p className="text-sm font-semibold mt-1">{task.seller?.location || "Adresse vendeur"}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 relative">
                                                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 z-10 border-4 border-white">
                                                    <MapPin className="w-4 h-4 text-teal-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold h-4">Point de livraison (Acheteur : {task.customerName || "Acheteur"})</p>
                                                    <p className="text-sm font-semibold mt-1">{task.deliveryAddress}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between items-end gap-6">
                                            <div className="text-right w-full">
                                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold h-4">Statut</p>
                                                {getStatusBadge(task.status)}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full w-full justify-center">
                                                <Clock className="w-4 h-4" />
                                                <span>Dernière mise à jour : {new Date(task.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="p-4 bg-muted/30 border-t flex flex-wrap gap-2 justify-between items-center">
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="border-teal-200 text-teal-700">
                                            <PhoneCall className="mr-2 h-4 w-4" /> Appeler
                                        </Button>
                                        <Button size="sm" variant="ghost">
                                            Détails commande
                                        </Button>
                                    </div>
                                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/20">
                                        Mettre à jour le statut
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {activeDeliveries.length === 0 && (
                            <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
                                <Package className="mx-auto w-12 h-12 text-muted-foreground/30 mb-4" />
                                <h3 className="text-lg font-semibold text-muted-foreground">Aucune livraison en cours</h3>
                                <p className="text-sm text-muted-foreground">Les nouvelles demandes de livraison apparaîtront ici.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="bg-teal-900 text-white border-none shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-teal-800 rounded-full opacity-50 blur-2xl"></div>
                        <CardHeader>
                            <CardTitle className="text-teal-50 font-heading">Résumé de la journée</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-teal-300">Livraisons terminées</span>
                                <span className="text-2xl font-bold font-heading">{stats.completedDeliveries}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-teal-300">Commandes disponibles</span>
                                <span className="text-2xl font-bold font-heading">{stats.availableCount}</span>
                            </div>
                            <div className="pt-4 border-t border-teal-800 mt-4 text-center">
                                <p className="text-teal-300 text-xs mb-1">Gains totaux confirmés</p>
                                <p className="text-3xl font-bold font-heading text-teal-50">{stats.totalEarnings?.toLocaleString()} FCFA</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-teal-600" />
                                Dernières infos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm p-3 border rounded-xl bg-orange-50 border-orange-100">
                                    <div className="flex-1">
                                        <p className="font-bold text-orange-900">Zone de trafic dense</p>
                                        <p className="text-orange-700 mt-0.5">Retards possibles secteur Akpakpa dus à des travaux routiers.</p>
                                    </div>
                                </div>
                                <div className="text-sm p-3 border rounded-xl bg-blue-50 border-blue-100">
                                    <p className="font-bold text-blue-900">Nouvelle Prime</p>
                                    <p className="text-blue-700 mt-0.5">+500 FCFA sur toutes les livraisons ce soir après 19h.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
