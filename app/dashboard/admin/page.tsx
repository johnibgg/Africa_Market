"use client"

import { adminStats, users, listings, orders } from "@/lib/mock-data"
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
    Filter
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

export default function AdminDashboard() {
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
                                <h3 className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</h3>
                                <div className="flex items-center text-xs text-green-600 mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    <span>+{adminStats.newUsersToday} aujourd'hui</span>
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
                                <h3 className="text-2xl font-bold">{adminStats.totalListings.toLocaleString()}</h3>
                                <div className="flex items-center text-xs text-green-600 mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    <span>+{adminStats.newListingsToday} aujourd'hui</span>
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
                                <h3 className="text-2xl font-bold">{adminStats.totalOrders.toLocaleString()}</h3>
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
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Volume d'affaires</p>
                                <h3 className="text-2xl font-bold">{(adminStats.totalRevenue / 1000000).toFixed(1)}M FCFA</h3>
                                <div className="flex items-center text-xs text-green-600 mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    <span>+8.4% ce mois</span>
                                </div>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <DollarSign className="w-6 h-6 text-purple-500" />
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
                                <AreaChart data={adminStats.monthlyData}>
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
                                        <p className="text-sm font-semibold text-orange-900">{adminStats.pendingModeration} annonces en attente</p>
                                        <p className="text-xs text-orange-700 mt-1">Vérifiez les nouvelles annonces signalées pour non-conformité.</p>
                                        <Button variant="link" className="p-0 h-auto text-xs font-bold text-orange-800 mt-2">Gérer les annonces</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-blue-900">8 demandes de vérification</p>
                                        <p className="text-xs text-blue-700 mt-1">Vendeurs en attente de badge de certification.</p>
                                        <Button variant="link" className="p-0 h-auto text-xs font-bold text-blue-800 mt-2">Vérifier les profils</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                <div className="flex gap-3">
                                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-red-900">3 Litiges ouverts</p>
                                        <p className="text-xs text-red-700 mt-1">Conflits entre acheteurs et vendeurs à résoudre.</p>
                                        <Button variant="link" className="p-0 h-auto text-xs font-bold text-red-800 mt-2">Ouvrir les litiges</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Gestion des utilisateurs</CardTitle>
                        <CardDescription>Liste complète des utilisateurs enregistrés sur la plateforme.</CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher un utilisateur..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold">Utilisateur</th>
                                    <th className="p-4 font-semibold">Rôle</th>
                                    <th className="p-4 font-semibold">Localisation</th>
                                    <th className="p-4 font-semibold">Date d'inscription</th>
                                    <th className="p-4 font-semibold">Statut</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.slice(0, 8).map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/20">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
                                                    <Image src={user.avatar} alt={user.name} width={32} height={32} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="secondary" className="capitalize">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{user.location}</td>
                                        <td className="p-4 text-muted-foreground">
                                            {new Date(user.joinedAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span>Actif</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                        <p>Affichage de 8 sur {adminStats.totalUsers} utilisateurs</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>Précédent</Button>
                            <Button variant="outline" size="sm">Suivant</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
