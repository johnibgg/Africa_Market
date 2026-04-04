"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    BarChart3,
    Package,
    Plus,
    Settings,
    Star,
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    Eye,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    Percent,
    ShoppingCart,
    Clock,
    CheckCircle2,
    AlertCircle,
    LayoutDashboard,
    Store,
    Image as ImageIcon,
    Save,
    Search,
    ShieldAlert,
    ShoppingBag,
    Wallet,
    ArrowDownToLine,
    XCircle,
    MessageSquare
} from "lucide-react"
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts"
import { ClientOnly } from "@/components/client-only"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

// Premium KPI Card Component
function KPICard({ title, value, trend, trendValue, icon: Icon, color }: any) {
    const isPositive = trend === "up"
    return (
        <Card className="relative overflow-hidden border-none shadow-xl bg-white/40 backdrop-blur-md group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${color.bg} ${color.text} shadow-inner`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trendValue}%
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon className="w-24 h-24" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function SellerDashboard() {
    const { user, isAuthenticated } = useAuth()
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")
    const [isSavingSettings, setIsSavingSettings] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [withdrawalAmount, setWithdrawalAmount] = useState("")
    const [withdrawalMethod, setWithdrawalMethod] = useState("momo")
    const [withdrawalPhone, setWithdrawalPhone] = useState("")

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
            toast.error("Veuillez entrer un montant valide")
            return
        }
        setIsWithdrawing(true)
        try {
            const res = await fetch("/api/withdrawals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(withdrawalAmount),
                    method: withdrawalMethod,
                    phone: withdrawalPhone
                })
            })
            if (res.ok) {
                toast.success("Demande de retrait envoyée !")
                setWithdrawalAmount("")
                // Refresh dashboard data
                const refreshRes = await fetch("/api/dashboard/seller")
                if (refreshRes.ok) setData(await refreshRes.json())
            } else {
                const err = await res.json()
                toast.error(err.message || "Erreur lors du retrait")
            }
        } catch {
            toast.error("Erreur réseau")
        } finally {
            setIsWithdrawing(false)
        }
    }

    // Form states for shop settings
    const [shopSettings, setShopSettings] = useState({
        shopName: "",
        shopDescription: "",
        shopBanner: "",
        whatsapp: "",
        location: "",
        shopSlug: ""
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch("/api/dashboard/seller")
                if (res.ok) {
                    const dashboardData = await res.json()
                    setData(dashboardData)
                    if (user) {
                        setShopSettings({
                            shopName: (user as any).shopName || "",
                            shopDescription: (user as any).shopDescription || "",
                            shopBanner: (user as any).shopBanner || "",
                            whatsapp: (user as any).whatsapp || "",
                            location: user.location || "",
                            shopSlug: (user as any).shopSlug || ""
                        })
                    }
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
    }, [isAuthenticated, user])

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSavingSettings(true)
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(shopSettings)
            })
            if (res.ok) {
                toast.success("Boutique mise à jour avec succès !")
            } else {
                toast.error("Échec de la mise à jour")
            }
        } catch {
            toast.error("Erreur serveur")
        } finally {
            setIsSavingSettings(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
                    <p className="text-slate-500 font-medium animate-pulse">Chargement de votre espace pro...</p>
                </div>
            </div>
        )
    }

    if (!data) return null

  // Dashboard stats with calculated data
  const sellerListings = data.listings || []
  const statsItems = [
    { label: "Ventes totales", value: `${sellerListings.reduce((acc: number, curr: any) => acc + (curr.price * (curr.orders?.length || 0)), 0).toLocaleString()} FCFA`, icon: DollarSign, trend: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Commandes", value: sellerListings.reduce((acc: number, curr: any) => acc + (curr.orders?.length || 0), 0).toString(), icon: ShoppingCart, trend: "+3", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Annonces actives", value: sellerListings.filter((l: any) => l.status === "ACTIVE").length.toString(), icon: Package, trend: "Stable", color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Vues totales", value: sellerListings.reduce((acc: number, curr: any) => acc + curr.views, 0).toLocaleString(), icon: TrendingUp, trend: "+85", color: "text-purple-600", bg: "bg-purple-100" },
  ]

  const chartData = data.stats?.monthlyData || [
    { month: "Lun", revenue: 4000 },
    { month: "Mar", revenue: 3000 },
    { month: "Mer", revenue: 2000 },
    { month: "Jeu", revenue: 2780 },
    { month: "Ven", revenue: 1890 },
    { month: "Sam", revenue: 2390 },
    { month: "Dim", revenue: 3490 },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header with Shop Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 font-black text-2xl shadow-inner">
              {user?.shopName?.charAt(0) || user?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{user?.shopName || "Ma Boutique"}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={user?.isVerified ? "default" : "secondary"}
                       className={user?.isVerified ? "rounded-full bg-teal-500" : "rounded-full"}>
                  {user?.isVerified ? "Boutique Vérifiée" : "Non vérifiée"}
                </Badge>
                <span className="text-xs text-slate-400 font-medium">Membre depuis {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-slate-200" asChild>
                <Link href={`/boutique/${(user as any).shopSlug}`} target="_blank">
                    Voir ma boutique
                </Link>
            </Button>
            <Button className="rounded-xl bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-900/20" asChild>
                <Link href="/listings/new">
                    <Plus className="w-4 h-4 mr-2" /> Publier
                </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsItems.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100 rounded-full">
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wallet & Balance */}
          <Card className="lg:col-span-1 border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] overflow-hidden relative group">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all" />
            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Wallet className="w-6 h-6 text-teal-400" />
                </div>
                <Badge className="bg-teal-500/20 text-teal-400 border-none">Disponible</Badge>
              </div>
              <CardTitle className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-4">Solde de ma boutique</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <div>
                <h2 className="text-4xl font-black tracking-tight">{(data.stats.balance || 0).toLocaleString()} <span className="text-teal-400 text-xl font-medium">FCFA</span></h2>
                <p className="text-slate-500 text-xs mt-1">Après déduction des commissions (5%)</p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full h-14 bg-teal-500 hover:bg-teal-400 text-slate-900 font-black text-lg rounded-2xl shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98]">
                    <ArrowDownToLine className="w-5 h-5 mr-2" /> Demander un retrait
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] p-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Effectuer un retrait</DialogTitle>
                    <DialogDescription>Transférez vos gains vers votre compte Mobile Money ou Bancaire.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleWithdraw} className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Montant à retirer (FCFA)</Label>
                      <Input 
                        type="number" 
                        placeholder="Ex: 50000" 
                        className="h-14 rounded-2xl bg-slate-50 border-none text-lg font-bold"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        max={data.stats.balance}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Méthode de retrait</Label>
                      <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold">
                          <SelectValue placeholder="Choisir une méthode" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="momo">MTN Mobile Money</SelectItem>
                          <SelectItem value="moov">Moov Money</SelectItem>
                          <SelectItem value="bank">Virement Bancaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                        {withdrawalMethod === "bank" ? "Informations Bancaires (IBAN/RIB)" : "Numéro de téléphone"}
                      </Label>
                      <Input 
                        placeholder={withdrawalMethod === "bank" ? "BJ..." : "00229..."}
                        className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                        value={withdrawalPhone}
                        onChange={(e) => setWithdrawalPhone(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isWithdrawing || !withdrawalAmount}
                      className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl"
                    >
                      {isWithdrawing ? "Traitement..." : "Confirmer le retrait"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Sales Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
              <div>
                <CardTitle className="text-lg font-black text-slate-900">Analyse des revenus</CardTitle>
                <CardDescription>Performance de votre boutique</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[300px] w-full">
                <ClientOnly>
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                    </ResponsiveContainer>
                </ClientOnly>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Orders Summary */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 px-6 py-4 border-b">
                <CardTitle className="text-lg font-black text-slate-900">Commandes récentes</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {(data.orders || []).slice(0, 3).map((order: any, i: number) => (
                     <div key={order.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                           <ShoppingCart className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="text-sm font-bold text-slate-900">Commande #{order.id.slice(-5)}</p>
                           <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50">Payé</Badge>
                         {order.buyer?.phone && (
                           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                             <Link href={`https://wa.me/${order.buyer.phone.replace(/\D/g, '')}`} target="_blank">
                               <MessageSquare className="w-4 h-4" />
                             </Link>
                           </Button>
                         )}
                       </div>
                     </div>
                   ))}
                  <Button variant="ghost" className="w-full text-teal-600 font-bold text-sm" onClick={() => setActiveTab("orders")}>Voir tout le catalogue →</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-teal-900/5 bg-teal-900 rounded-3xl overflow-hidden text-white">
              <CardContent className="p-6">
                <h3 className="font-black text-xl mb-2">Besoin d&apos;aide ?</h3>
                <p className="text-teal-100/70 text-sm mb-4">Notre support vendeur est disponible 24/7 pour vous accompagner.</p>
                <Button className="w-full bg-white text-teal-900 hover:bg-teal-50 font-black rounded-xl">Contacter le support</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Listings Table Section */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
            <div>
              <CardTitle className="text-lg font-black text-slate-900">Gestion du stock</CardTitle>
              <CardDescription>Gérez vos annonces et suivez vos performances individuelles</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 text-slate-500 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Produit</th>
                    <th className="px-6 py-4">Prix</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Performance</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerListings.map((listing: any) => (
                    <tr key={listing.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                            <Image src={listing.images?.[0] || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{listing.title}</p>
                            <p className="text-xs text-slate-400">{listing.category?.nameFr}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{listing.price.toLocaleString()} FCFA</td>
                      <td className="px-6 py-4">
                        <Badge className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border-emerald-100">
                          En ligne
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {listing.views} vues</span>
                          <span className="flex items-center gap-1"><ShoppingCart className="w-3 h-3" /> {listing.orders?.length || 0} ventes</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200">
                            <Edit className="w-4 h-4 text-slate-400" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:border-red-100 border border-transparent">
                            <Trash2 className="w-4 h-4 text-red-400" />
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
      </div>
    </div>
  )
}
