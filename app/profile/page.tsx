"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { User, MapPin, Calendar, Star, CheckCircle, Pencil, Save, LogOut, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login")
            return
        }
        if (status === "authenticated") {
            const fetchProfile = async () => {
                try {
                    const res = await fetch("/api/user/profile")
                    if (res.ok) {
                        const data = await res.json()
                        setProfile(data.user)
                    }
                } catch (err) {
                    console.error("Failed to fetch profile", err)
                } finally {
                    setLoading(false)
                }
            }
            fetchProfile()
        }
    }, [status, router])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    bio: profile.bio,
                    location: profile.location,
                    phone: profile.phone,
                    shopName: profile.shopName,
                    shopDescription: profile.shopDescription,
                })
            })
            if (res.ok) {
                toast.success("Profil mis à jour !")
                setIsEditing(false)
            } else {
                toast.error("Erreur lors de la mise à jour.")
            }
        } catch {
            toast.error("Erreur réseau.")
        } finally {
            setSaving(false)
        }
    }

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Skeleton className="h-96 rounded-2xl" />
                        <div className="md:col-span-2 space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-64 w-full rounded-2xl" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!profile) return null

    const roleLabel = profile.role === "BUYER" ? "Acheteur" : profile.role === "SELLER" ? "Vendeur" : profile.role === "DELIVERY" ? "Livreur" : "Admin"

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Summary Card */}
                        <div className="md:col-span-1">
                            <Card className="rounded-2xl shadow-lg">
                                <CardHeader className="text-center pb-2">
                                    <div className="relative mx-auto w-28 h-28 mb-4">
                                        <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
                                            <AvatarImage src={profile.image || ""} alt={profile.name || ""} />
                                            <AvatarFallback className="text-4xl bg-teal-100 text-teal-700">{(profile.name || "?").charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {profile.isVerified && (
                                            <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md">
                                                <CheckCircle className="w-5 h-5 text-teal-600 fill-teal-600/10" />
                                            </div>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                                    <CardDescription>{profile.email}</CardDescription>
                                    <div className="flex flex-col items-center gap-2 mt-2">
                                        <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-none">{roleLabel}</Badge>
                                        {profile.verificationStatus === "PENDING" && (
                                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Vérification en cours</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {profile.location && (
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4 text-teal-500" />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 text-teal-500" />
                                        <span>Membre depuis {new Date(profile.joinedAt || profile.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</span>
                                    </div>

                                    {profile.verificationStatus === "NONE" && (
                                        <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl space-y-2 mt-2">
                                            <p className="text-xs font-bold text-teal-900">BOOSTEZ VOTRE PROFIL</p>
                                            <p className="text-xs text-teal-700 leading-relaxed">Vérifiez votre compte pour vendre ou livrer.</p>
                                            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-xs h-8" asChild>
                                                <Link href="/auth/verify">Se vérifier maintenant</Link>
                                            </Button>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t space-y-2">
                                        <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={saving}>
                                            {isEditing ? (saving ? "Sauvegarde..." : <><Save className="mr-2 h-4 w-4" /> Enregistrer</>) : <><Pencil className="mr-2 h-4 w-4" /> Modifier le profil</>}
                                        </Button>
                                        <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => signOut({ callbackUrl: "/" })}>
                                            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="md:col-span-2">
                            <Tabs defaultValue="info" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl">
                                    <TabsTrigger value="info">Informations</TabsTrigger>
                                    <TabsTrigger value="security">Sécurité</TabsTrigger>
                                </TabsList>

                                <TabsContent value="info">
                                    <Card className="rounded-2xl shadow-sm">
                                        <CardHeader>
                                            <CardTitle>Profil Personnel</CardTitle>
                                            <CardDescription>Gérez vos informations publiques.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {[
                                                    { id: "name", label: "Nom complet", key: "name" },
                                                    { id: "phone", label: "Téléphone", key: "phone" },
                                                    { id: "location", label: "Localisation", key: "location" },
                                                ].map(({ id, label, key }) => (
                                                    <div key={id} className="space-y-2">
                                                        <Label htmlFor={id}>{label}</Label>
                                                        <Input
                                                            id={id}
                                                            value={profile[key] || ""}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                                            className={!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}
                                                        />
                                                    </div>
                                                ))}
                                                {profile.role === "SELLER" && [
                                                    { id: "shopName", label: "Nom de boutique", key: "shopName" },
                                                    { id: "shopSlug", label: "Lien public (slug)", key: "shopSlug" },
                                                ].map(({ id, label, key }) => (
                                                    <div key={id} className="space-y-2">
                                                        <Label htmlFor={id}>{label}</Label>
                                                        <Input
                                                            id={id}
                                                            value={profile[key] || ""}
                                                            readOnly={!isEditing}
                                                            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                                            className={!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}
                                                            placeholder={id === "shopSlug" ? "nom-de-boutique" : ""}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    value={profile.bio || ""}
                                                    readOnly={!isEditing}
                                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                    className={`min-h-[100px] ${!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}`}
                                                />
                                            </div>
                                            {profile.role === "SELLER" && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="shopDescription">Description détaillée de la boutique</Label>
                                                    <Textarea
                                                        id="shopDescription"
                                                        value={profile.shopDescription || ""}
                                                        readOnly={!isEditing}
                                                        onChange={(e) => setProfile({ ...profile, shopDescription: e.target.value })}
                                                        className={`min-h-[100px] ${!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}`}
                                                        placeholder="Parlez de votre boutique, vos valeurs, vos produits..."
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                        {isEditing && (
                                            <CardFooter className="flex justify-end gap-3 bg-muted/30 p-4 border-t">
                                                <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                                                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave} disabled={saving}>
                                                    {saving ? "Sauvegarde..." : "Enregistrer"}
                                                </Button>
                                            </CardFooter>
                                        )}
                                    </Card>
                                </TabsContent>

                                <TabsContent value="security">
                                    <Card className="rounded-2xl shadow-sm">
                                        <CardHeader>
                                            <CardTitle>Sécurité du compte</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {[
                                                { id: "current-password", label: "Mot de passe actuel" },
                                                { id: "new-password", label: "Nouveau mot de passe" },
                                                { id: "confirm-password", label: "Confirmer le mot de passe" },
                                            ].map(({ id, label }) => (
                                                <div key={id} className="space-y-2">
                                                    <Label htmlFor={id}>{label}</Label>
                                                    <Input id={id} type="password" />
                                                </div>
                                            ))}
                                            <Button className="bg-teal-600 hover:bg-teal-700">Changer le mot de passe</Button>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
