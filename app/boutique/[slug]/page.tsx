import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { BadgeCheck, MapPin, Users, Package, Calendar } from "lucide-react"

export default async function BoutiquePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const user = await prisma.user.findUnique({
        where: { shopSlug: slug },
        include: {
            listings: {
                where: { status: "active" },
                include: {
                    category: true,
                    seller: true,
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

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <Header />
            <main className="flex-1">
                {/* Store Header / Banner */}
                <div className="bg-teal-900/90 py-16 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#0d9488]/20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
                    <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-white">
                            <Image 
                                src={user.image || "/logo.png"} 
                                alt={user.shopName || user.name || "Boutique"} 
                                width={128} 
                                height={128} 
                                className="object-cover h-full w-full"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left text-white space-y-3">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h1 className="text-4xl font-black">{user.shopName || user.name}</h1>
                                {user.isVerified && <BadgeCheck className="text-teal-400 w-8 h-8" />}
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-teal-100 text-sm font-medium">
                                {user.location && (
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {user.location} {user.quartier ? `(${user.quartier})` : ""}</span>
                                )}
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Membre depuis {new Date(user.joinedAt).getFullYear()}</span>
                            </div>
                            {user.shopDescription ? (
                                <p className="text-teal-50 max-w-2xl text-sm leading-relaxed opacity-90">{user.shopDescription}</p>
                            ) : user.bio ? (
                                <p className="text-teal-50 max-w-2xl text-sm leading-relaxed opacity-90">{user.bio}</p>
                            ) : null}
                            
                            <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{user._count.listings}</p>
                                    <p className="text-xs text-teal-200 uppercase tracking-widest">Annonces</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{user._count.followers}</p>
                                    <p className="text-xs text-teal-200 uppercase tracking-widest">Abonnés</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                            <Button size="lg" className="bg-white text-teal-900 hover:bg-teal-50 shadow-lg font-bold w-full rounded-xl">
                                <Users className="w-4 h-4 mr-2" /> S'abonner
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-foreground">
                        <Package className="w-6 h-6 text-teal-600" />
                        Toutes les annonces
                    </h2>
                    
                    {user.listings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-muted-foreground/30 shadow-sm">
                            <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">Aucune annonce</h3>
                            <p className="text-muted-foreground">Cette boutique n'a pas encore publié d'annonces actives.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                    <ListingCard key={listing.id} listing={formattedListing} />
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
