"use client"

import { useState } from "react"
import { users } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Calendar, Star, CheckCircle, Pencil, Save, LogOut, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const user = users[4] // Current user
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState(user)

    const handleSave = () => {
        setIsEditing(false)
        // In a real app, this would call an API
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Summary Card */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="text-center pb-2">
                            <div className="relative mx-auto w-32 h-32 mb-4">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {user.isVerified && (
                                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md">
                                        <CheckCircle className="w-6 h-6 text-teal-600 fill-teal-600/10" />
                                    </div>
                                )}
                            </div>
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                            <div className="flex flex-col items-center justify-center gap-2 mt-2">
                                <Badge variant="secondary" className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                                    {user.role === 'buyer' ? 'Acheteur' : user.role === 'seller' ? 'Vendeur' : user.role === 'delivery' ? 'Livreur' : user.role}
                                </Badge>
                                {user.verificationStatus === "pending" && (
                                    <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                        Vérification en cours
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{user.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Membre depuis {new Date(user.joinedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{user.rating} ({user.reviewCount} avis)</span>
                            </div>

                            {!user.isVerified && user.verificationStatus === "none" && (
                                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl space-y-3 mt-4">
                                    <p className="text-xs font-bold text-teal-900 border-none">BOOSTEZ VOTRE PROFIL</p>
                                    <p className="text-xs text-teal-700 border-none leading-relaxed">Passez l'authentification stricte pour pouvoir vendre vos articles ou devenir livreur.</p>
                                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-xs h-8" asChild>
                                        <Link href="/auth/verify">Se vérifier maintenant</Link>
                                    </Button>
                                </div>
                            )}

                            <div className="pt-4 border-t space-y-2">
                                <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? <><Save className="mr-2 h-4 w-4" /> Enregistrer</> : <><Pencil className="mr-2 h-4 w-4" /> Modifier le profil</>}
                                </Button>

                                {user.role === 'buyer' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50" asChild>
                                            <Link href="/auth/verify">Devenir Vendeur</Link>
                                        </Button>
                                        <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50" asChild>
                                            <Link href="/auth/verify">Devenir Livreur</Link>
                                        </Button>
                                    </div>
                                )}

                                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                    <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Content Tabs */}
                <div className="md:col-span-2">
                    <Tabs defaultValue="info" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="info">Informations Générales</TabsTrigger>
                            <TabsTrigger value="security">Sécurité & Paramètres</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profil Personnel</CardTitle>
                                    <CardDescription>
                                        Gérez vos informations personnelles et votre présentation publique.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nom complet</Label>
                                            <Input
                                                id="name"
                                                value={profile.name}
                                                readOnly={!isEditing}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className={!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={profile.email}
                                                readOnly={!isEditing}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className={!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input
                                                id="phone"
                                                value={profile.phone}
                                                readOnly={!isEditing}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className={!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Localisation</Label>
                                            <Input
                                                id="location"
                                                value={profile.location}
                                                readOnly={!isEditing}
                                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                className={!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio / À propos de vous</Label>
                                        <Textarea
                                            id="bio"
                                            value={profile.bio}
                                            readOnly={!isEditing}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className={`min-h-[120px] ${!isEditing ? "bg-muted cursor-default focus-visible:ring-0" : ""}`}
                                        />
                                    </div>
                                </CardContent>
                                {isEditing && (
                                    <CardFooter className="flex justify-end gap-3 bg-muted/50 p-4 border-t">
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>Enregistrer les modifications</Button>
                                    </CardFooter>
                                )}
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sécurité du compte</CardTitle>
                                    <CardDescription>
                                        Mettez à jour votre mot de passe et gérez la sécurité de votre compte.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Mot de passe actuel</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">Nouveau mot de passe</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                    </div>
                                    <Button className="bg-teal-600 hover:bg-teal-700">Changer le mot de passe</Button>

                                    <div className="pt-6 border-t mt-6">
                                        <h4 className="font-semibold text-red-600 mb-2">Zone de danger</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. S'il vous plaît soyez certain.
                                        </p>
                                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Supprimer mon compte</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
