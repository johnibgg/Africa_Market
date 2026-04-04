import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    BadgeCheck, 
    MapPin, 
    Users, 
    Package, 
    Calendar, 
    MessageCircle, 
    Share2, 
    Search,
    Filter,
    ShoppingBag,
    Star,
    ArrowRight
} from "lucide-react"

export default async function BoutiquePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Fetch user and all their info
    const user = await prisma.user.findUnique({
        where: { shopSlug: slug },
        include: {
            listings: {
                where: { status: "ACTIVE" },
                include: {
                    category: true,
                },
                orderBy: { createdAt: "desc" }
            },
            _count: {
                select: { followers: true, listings: true }
            }
        }
    })

    if (!user || user.role !== "SELLER") {
        notFound()
    }

    // Prepare shop info
    const shopName = user.shopName || user.name || "Ma Boutique"
    const shopDescription = user.shopDescription || user.bio || "Bienvenue dans ma boutique sur AfricaMarket."
    const bannerUrl = user.shopBanner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
    const whatsapp = user.whatsapp
    const theme = (user.shopTheme || "modern") as "modern" | "minimal" | "vibrant" | "elegant"

    // Theme-based styling
    const themeStyles = {
        modern: {
            bg: "bg-[#F8FAFC]",
            card: "bg-white rounded-3xl shadow-xl border-slate-100",
            primary: "teal-600",
            headerText: "text-white",
            button: "rounded-2xl",
            avatar: "rounded-[2rem]",
            accent: "teal-500"
        },
        minimal: {
            bg: "bg-white",
            card: "bg-white rounded-none border border-slate-200 shadow-none",
            primary: "slate-900",
            headerText: "text-slate-900",
            button: "rounded-none",
            avatar: "rounded-full border-slate-100",
            accent: "slate-800"
        },
        vibrant: {
            bg: "bg-indigo-50/30",
            card: "bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 border-none",
            primary: "indigo-600",
            headerText: "text-white",
            button: "rounded-full",
            avatar: "rounded-[3rem]",
            accent: "purple-500"
        },
        elegant: {
            bg: "bg-[#1A1A1A]",
            card: "bg-[#262626] rounded-xl border border-gold-500/20 text-white",
            primary: "amber-600",
            headerText: "text-white",
            button: "rounded-lg",
            avatar: "rounded-xl border-amber-500/30",
            accent: "amber-500"
        }
    }[theme]

    return (
        <div className={`flex min-h-screen flex-col ${themeStyles.bg}`}>
            <Header />
            
            <main className="flex-1">
                {/* 1. Hero / Header Section Premium */}
                <div className="relative w-full overflow-hidden">
                    {/* Banner */}
                    <div className="relative h-[300px] md:h-[450px] w-full">
                        <Image 
                            src={bannerUrl}
                            alt={shopName}
                            fill
                            className="object-cover"
                            priority
                        />
                        {theme !== "minimal" && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />}
                    </div>

                    {/* Store Profile Info - Overlapping Banner */}
                    <div className="max-w-7xl mx-auto px-4">
                        <div className={`relative ${theme === "minimal" ? "mt-8" : "-mt-24 md:-mt-32"} pb-8 flex flex-col md:flex-row items-end gap-6 z-10`}>
                            {/* Avatar */}
                            <div className={`relative h-32 w-32 md:h-48 md:w-48 ${themeStyles.avatar} overflow-hidden border-4 border-white shadow-2xl bg-white shrink-0 group`}>
                                <Image 
                                    src={user.image || "/logo.png"} 
                                    alt={shopName} 
                                    fill
                                    className="object-cover"
                                />
                                <div className={`absolute inset-0 bg-${themeStyles.accent}/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                            </div>

                            {/* Text Info */}
                            <div className={`flex-1 ${theme === "minimal" ? "text-slate-900" : "text-white"} md:pb-4 space-y-2`}>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className={`text-3xl md:text-5xl font-black font-heading tracking-tight`}>{shopName}</h1>
                                    {user.isVerified && (
                                        <div className={`bg-${themeStyles.accent} rounded-full p-1 shadow-lg shadow-${themeStyles.accent}/20`}>
                                            <BadgeCheck className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className={`flex flex-wrap items-center gap-4 ${theme === "minimal" ? "text-slate-500" : "text-teal-50/80"} text-sm font-medium`}>
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user.location || "Localisation non précisée"}</span>
                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Depuis {new Date(user.joinedAt).getFullYear()}</span>
                                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.9 (24 avis)</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 w-full md:w-auto md:pb-4 shrink-0">
                                {whatsapp && (
                                    <Button asChild size="lg" className={`bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-14 ${themeStyles.button} px-6 shadow-lg shadow-green-500/20`}>
                                        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                                            <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                                        </a>
                                    </Button>
                                )}
                                <Button size="lg" className={`${theme === "elegant" ? "bg-amber-600 text-white" : "bg-white text-teal-900"} hover:bg-slate-100 font-black h-14 ${themeStyles.button} px-8 shadow-xl flex-1 md:flex-none`}>
                                    S&rsquo;abonner
                                </Button>
                                <Button variant="outline" size="icon" className={`h-14 w-14 ${themeStyles.button} ${theme === "minimal" ? "bg-white border-slate-200 text-slate-900" : "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"}`}>
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Content Section */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        
                        {/* Sidebar - About */}
                        <div className="space-y-8 order-2 lg:order-1">
                            <div className={`${themeStyles.card} p-8`}>
                                <h3 className={`text-lg font-black mb-4 flex items-center gap-2 ${theme === "elegant" ? "text-amber-500" : ""}`}>
                                    <span className={`w-1.5 h-6 bg-${themeStyles.accent} rounded-full`} /> À propos
                                </h3>
                                <p className={`${theme === "elegant" ? "text-slate-300" : "text-slate-500"} text-sm leading-relaxed mb-6 font-medium`}>
                                    {shopDescription}
                                </p>
                                
                                <div className={`space-y-4 pt-4 border-t ${theme === "elegant" ? "border-slate-700" : "border-slate-50"}`}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Produits</span>
                                        <span className={`font-black text-${themeStyles.accent}`}>{user._count.listings}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Abonnés</span>
                                        <span className={`font-black text-${themeStyles.accent}`}>{user._count.followers}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Temps réponse</span>
                                        <span className={`font-black text-${themeStyles.accent}`}>&lt; 1h</span>
                                    </div>
                                </div>
                            </div>

                            {/* Promotional Card */}
                            <div className={`bg-gradient-to-br from-${themeStyles.accent} to-${themeStyles.primary} ${themeStyles.button} p-8 text-white shadow-xl shadow-${themeStyles.accent}/10 relative overflow-hidden group`}>
                                <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
                                <h4 className="text-xl font-black mb-2 italic">Offres Spéciales</h4>
                                <p className="text-teal-50/80 text-sm mb-6 leading-relaxed">Abonnez-vous pour recevoir les dernières pépites de {shopName} en priorité !</p>
                                <Button className="w-full bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl h-12">
                                    Je m&rsquo;abonne <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Feed - Listings */}
                        <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
                            {/* Search & Filter - Store Specific */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-${themeStyles.accent} transition-colors`} />
                                    <Input 
                                        placeholder={`Chercher chez ${shopName}...`} 
                                        className={`h-14 pl-12 ${themeStyles.button} ${theme === "elegant" ? "bg-[#262626] border-slate-700 text-white" : "bg-white border-slate-100 shadow-sm"} focus:ring-4 focus:ring-${themeStyles.accent}/5 transition-all text-base`}
                                    />
                                </div>
                                <Button variant="outline" className={`h-14 px-6 ${themeStyles.button} ${theme === "elegant" ? "bg-[#262626] border-slate-700 text-white hover:bg-slate-800" : "bg-white border-slate-100"} font-bold flex gap-2`}>
                                    <Filter className="w-5 h-5" /> Filtrer
                                </Button>
                            </div>

                            {user.listings.length === 0 ? (
                                <div className={`text-center py-24 ${theme === "elegant" ? "bg-[#262626] border-slate-700" : "bg-white/60 backdrop-blur-sm"} ${themeStyles.button} border-2 border-dashed`}>
                                    <Package className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                                    <h3 className={`text-2xl font-black ${theme === "elegant" ? "text-white" : "text-slate-900"}`}>Pas d&rsquo;articles dispo</h3>
                                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">Revenez bientôt ou suivez la boutique pour les alertes stocks !</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {user.listings.map(listing => {
                                        const formattedListing = {
                                            ...listing,
                                            category: listing.category.nameFr,
                                            seller: {
                                                id: user.id,
                                                name: user.name || "Vendeur",
                                                avatar: user.image || "/logo.png",
                                                isVerified: user.isVerified,
                                                shopSlug: user.shopSlug,
                                            }
                                        } as any;
                                        return (
                                            <div key={listing.id} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                                                <ListingCard listing={formattedListing} />
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}
