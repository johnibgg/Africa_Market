"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MediaUpload } from "./media-upload"
import { Check, ChevronRight, ChevronLeft, Package, Briefcase, Search, Upload, Info } from "lucide-react"
import { toast } from "sonner"

const STEPS = [
    { id: 1, title: "Type & Catégorie", icon: Search },
    { id: 2, title: "Médias", icon: Upload },
    { id: 3, title: "Détails", icon: Info },
]

export function CreateListingForm() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        categoryId: "",
        type: "PRODUCT", // PRODUCT, SERVICE
        adType: "OFFER", // OFFER, WANTED
        location: "Cotonou",
        quartier: "",
        images: [] as File[],
        videos: [] as File[],
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories")
                const data = await res.json()
                setCategories(data)
            } catch (err) {
                console.error("Failed to fetch categories", err)
            }
        }
        fetchCategories()
    }, [])

    const handleMediaChange = (media: { images: File[], videos: File[] }) => {
        setFormData(prev => ({ ...prev, images: media.images, videos: media.videos }))
    }

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.categoryId) {
            toast.error("Veuillez remplir tous les champs obligatoires.")
            return
        }

        setLoading(true)
        try {
            // In a real app, you'd upload files to S3/Cloudinary first
            // Here we assume the API handles it or we send base64 (simplified)
            // For now, let's just send the text data
            const res = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    // In a simulation, we'd add mock URLs if no real upload exists
                    images: formData.images.map(() => "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"),
                    videoUrls: formData.videos.map(() => "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4")
                })
            })

            if (res.ok) {
                toast.success("Annonce publiée avec succès !")
                router.push("/dashboard/seller")
            } else {
                const data = await res.json()
                toast.error(data.message || "Erreur lors de la publication.")
            }
        } catch (err) {
            toast.error("Une erreur est survenue.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Multi-step progress bar */}
            <div className="flex items-center justify-between mb-8">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= s.id ? "bg-teal-600 border-teal-600 text-white" : "border-muted-foreground/30 text-muted-foreground"
                                }`}>
                                {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.id ? "text-teal-700" : "text-muted-foreground"
                                }`}>
                                {s.title}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`h-[2px] flex-1 mx-4 transition-all ${step > s.id ? "bg-teal-600" : "bg-muted"
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-black text-teal-900">
                        {step === 1 && "Que voulez-vous publier ?"}
                        {step === 2 && "Ajoutez des visuels"}
                        {step === 3 && "Dites-en plus"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Choisissez le type d'annonce et la catégorie."}
                        {step === 2 && "Les photos et vidéos augmentent vos chances de succès."}
                        {step === 3 && "Les détails aident les acheteurs à se décider."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    {step === 1 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setFormData({ ...formData, adType: "OFFER" })}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 group ${formData.adType === "OFFER"
                                            ? "border-teal-600 bg-teal-50 shadow-inner"
                                            : "border-muted hover:border-teal-200"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${formData.adType === "OFFER" ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground group-hover:bg-teal-100 group-hover:text-teal-600"
                                        }`}>
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Je propose</p>
                                        <p className="text-xs text-muted-foreground">Un produit ou un service à vendre/offrir.</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, adType: "WANTED" })}
                                    className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 group ${formData.adType === "WANTED"
                                            ? "border-orange-500 bg-orange-50 shadow-inner"
                                            : "border-muted hover:border-orange-200"
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${formData.adType === "WANTED" ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground group-hover:bg-orange-100 group-hover:text-orange-500"
                                        }`}>
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">Je cherche</p>
                                        <p className="text-xs text-muted-foreground">Un produit ou service dont j'ai besoin.</p>
                                    </div>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4 p-1 bg-muted rounded-xl w-fit mx-auto">
                                    <button
                                        onClick={() => setFormData({ ...formData, type: "PRODUCT" })}
                                        className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === "PRODUCT" ? "bg-white shadow-sm text-teal-700" : "text-muted-foreground"
                                            }`}
                                    >
                                        Produit
                                    </button>
                                    <button
                                        onClick={() => setFormData({ ...formData, type: "SERVICE" })}
                                        className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === "SERVICE" ? "bg-white shadow-sm text-teal-700" : "text-muted-foreground"
                                            }`}
                                    >
                                        Service
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <Label>Catégorie</Label>
                                    <Select
                                        value={formData.categoryId}
                                        onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-2 focus-visible:ring-teal-500">
                                            <SelectValue placeholder="Choisir une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.nameFr}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <MediaUpload onChange={handleMediaChange} />
                            <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                                <Info className="w-5 h-5 text-teal-600 mt-0.5" />
                                <p className="text-xs text-teal-800 leading-relaxed font-medium">
                                    Saviez-vous que les annonces avec vidéo génèrent <span className="font-black text-teal-900 border-none">3x plus d'engagement</span> ?
                                    Capturez votre produit en action pour rassurer vos clients.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre de l'annonce</Label>
                                <Input
                                    id="title"
                                    placeholder="Ex: iPhone 13 Pro Max - État Neuf"
                                    className="h-12 rounded-xl border-2"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description détaillée</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Décrivez votre article, ses points forts..."
                                    className="min-h-[120px] rounded-xl border-2"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Prix (FCFA)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0"
                                        className="h-12 rounded-xl border-2"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Ville</Label>
                                    <Input
                                        id="location"
                                        placeholder="Cotonou"
                                        className="h-12 rounded-xl border-2"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between pt-6">
                    {step > 1 ? (
                        <Button variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl border-2 border-muted-foreground/30 hover:bg-muted font-bold text-muted-foreground">
                            <ChevronLeft className="mr-2 w-4 h-4" /> Retour
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button onClick={nextStep} className="h-12 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold border-none shadow-lg shadow-teal-600/20">
                            Suivant <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="h-12 px-12 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold border-none shadow-lg shadow-teal-600/20"
                        >
                            {loading ? "Publication..." : "Publier l'annonce"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
