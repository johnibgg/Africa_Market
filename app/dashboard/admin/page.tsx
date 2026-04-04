"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    ShieldAlert,
    CheckCircle,
    XCircle,
    MoreVertical,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    ArrowDownToLine
} from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { ClientOnly } from "@/components/client-only"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
    const { isAuthenticated } = useAuth()
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch("/api/dashboard/admin")
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

    const stats = data.stats
    const usersList = data.users
    const withdrawals = data.withdrawals || []
    const monthlyData = data.monthlyData

    const handleUpdateWithdrawal = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/withdrawals/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                toast.success(`Retrait ${status === 'COMPLETED' ? 'validé' : 'rejeté'}`)
                // Refresh
                const refreshRes = await fetch("/api/dashboard/admin")
                if (refreshRes.ok) setData(await refreshRes.json())
            }
        } catch {
            toast.error("Erreur réseau")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Administration</h1>
                    <p className="text-muted-foreground">Vue d'ensemble de la plateforme Africa Market</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filtres</Button>
                    <Button className="bg-teal-600 hover:bg-teal-700">Exporter les données</Button>
                </div>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Utilisateurs Totaux</p>
                                <h3 className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</h3>
                                <div className="flex items-center text-xs text-green-600 mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    <span>+{stats.newUsersToday} aujourd'hui</span>
                                </div>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-teal-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Annonces Actives</p>
                                <h3 className="text-2xl font-bold">{stats.totalListings.toLocaleString()}</h3>
                                <div className="flex items-center text-xs text-green-600 mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    <span>+{stats.newListingsToday} aujourd'hui</span>
                                </div>
                            </div>
                            <div className="p-2 bg-teal-50 rounded-lg">
                                <Package className="w-6 h-6 text-teal-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Commandes Totales</p>
                                <h3 className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</h3>
                                <div className="flex items-center text-xs text-red-600 mt-1">
                                    <ArrowDownRight className="w-3 h-3 mr-1" />
                                    <span>-2% vs hier</span>
                                </div>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Revenus (Commissions)</p>
                                <h3 className="text-2xl font-bold">{(stats.totalCommission || 0).toLocaleString()} FCFA</h3>
                                <div className="flex items-center text-xs text-green-600 mt-1">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    <span>+18.2%</span>
                                </div>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-2xl">
                                <DollarSign className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Croissance de la plateforme</CardTitle>
                        <CardDescription>Évolution des utilisateurs et des annonces sur les 6 derniers mois.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ClientOnly>
                                <AreaChart data={monthlyData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="users" name="Utilisateurs" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="listings" name="Annonces" stroke="#0d9488" fillOpacity={1} fill="url(#colorListings)" strokeWidth={2} />
                                </AreaChart>
                            </ClientOnly>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Actions Requises</CardTitle>
                        <CardDescription>Éléments nécessitant une modération immédiate.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                <div className="flex gap-3">
                                    <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-orange-900">{stats.pendingModeration} annonces en attente</p>
                                        <p className="text-xs text-orange-700 mt-1">Vérifiez les nouvelles annonces signalées pour non-conformité.</p>
                                        <Button variant="link" className="p-0 h-auto text-xs font-bold text-orange-800 mt-2">Gérer les annonces</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-blue-900">{stats.pendingVerification} demandes de vérification</p>
                                        <p className="text-xs text-blue-700 mt-1">Vendeurs en attente de badge de certification.</p>
                                        <Button variant="link" className="p-0 h-auto text-xs font-bold text-blue-800 mt-2">Vérifier les profils</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                <div className="flex gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-red-900">{stats.openDisputes} Litiges ouverts</p>
                                        <p className="text-xs text-red-700 mt-1">Conflits entre acheteurs et vendeurs à résoudre.</p>
                                        <Button variant="link" className="p-0 h-auto text-xs font-bold text-red-800 mt-2">Ouvrir les litiges</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger value="users" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Utilisateurs</TabsTrigger>
                    <TabsTrigger value="withdrawals" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Retraits (Vendeurs)</TabsTrigger>
                    <TabsTrigger value="moderation" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Modération</TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
                            <div>
                                <CardTitle className="text-lg font-black text-slate-900">Gestion des Utilisateurs</CardTitle>
                                <CardDescription>Consultez et gérez tous les comptes de la plateforme</CardDescription>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input placeholder="Rechercher..." className="pl-9 w-64 rounded-xl border-slate-200" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50/30 text-slate-500 text-xs font-black uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Utilisateur</th>
                                            <th className="px-6 py-4">Rôle</th>
                                            <th className="px-6 py-4">Localisation</th>
                                            <th className="px-6 py-4">Inscription</th>
                                            <th className="px-6 py-4">Statut</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {usersList.map((user: any) => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden relative shadow-sm">
                                                            <Image src={user.image || "/logo.png"} alt={user.name} fill className="object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{user.name}</p>
                                                            <p className="text-xs text-slate-400">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border-none">
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-medium">{user.location || "N/A"}</td>
                                                <td className="px-6 py-4 text-slate-500 font-medium">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                                                        <span className="font-bold text-xs text-slate-600">{user.emailVerified ? 'Vérifié' : 'Non vérifié'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 p-4 flex justify-between items-center text-xs text-muted-foreground">
                                <p>Affichage de {usersList.length} sur {stats.totalUsers} utilisateurs</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled>Précédent</Button>
                                    <Button variant="outline" size="sm">Suivant</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="withdrawals">
                     <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                         <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
                             <div>
                                 <CardTitle className="text-lg font-black text-slate-900">Demandes de Retraits</CardTitle>
                                 <CardDescription>Gérez les demandes de paiement des vendeurs</CardDescription>
                             </div>
                         </CardHeader>
                         <CardContent className="p-0">
                            {withdrawals.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ArrowDownToLine className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune demande en attente</h3>
                                    <p className="text-slate-500">Les demandes de retrait des vendeurs apparaîtront ici.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50/30 text-slate-500 text-xs font-black uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Vendeur</th>
                                                <th className="px-6 py-4">Montant</th>
                                                <th className="px-6 py-4">Méthode</th>
                                                <th className="px-6 py-4">Coordonnées</th>
                                                <th className="px-6 py-4">Statut</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {withdrawals.map((w: any) => (
                                                <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-slate-900">{w.user.name}</p>
                                                        <p className="text-xs text-slate-400">{w.user.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-teal-600">{w.amount.toLocaleString()} FCFA</td>
                                                    <td className="px-6 py-4 uppercase text-xs font-bold text-slate-500">{w.method}</td>
                                                    <td className="px-6 py-4 text-slate-500 font-medium">{w.phone || w.bankInfo}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={cn(
                                                            "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider border-none",
                                                            w.status === "PENDING" ? "bg-orange-50 text-orange-600" :
                                                            w.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" :
                                                            "bg-red-50 text-red-600"
                                                        )}>
                                                            {w.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {w.status === "PENDING" && (
                                                            <div className="flex justify-end gap-2">
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline" 
                                                                    className="h-8 rounded-lg border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                                                    onClick={() => handleUpdateWithdrawal(w.id, "COMPLETED")}
                                                                >
                                                                    Valider
                                                                </Button>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline" 
                                                                    className="h-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                                                                    onClick={() => handleUpdateWithdrawal(w.id, "REJECTED")}
                                                                >
                                                                    Rejeter
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                         </CardContent>
                     </Card>
                 </TabsContent>
            </Tabs>
        </div>
    )
}
