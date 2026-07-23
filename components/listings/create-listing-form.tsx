"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MediaUpload } from "./media-upload"
import { Check, ChevronRight, ChevronLeft, Package, Briefcase, Search, Upload, Info, ShieldAlert, Store, Sparkles, Wand2, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { toast } from "sonner"

const STEPS = [
    { id: 1, title: "Type & Catégorie", icon: Search },
    { id: 2, title: "Médias", icon: Upload },
    { id: 3, title: "Détails", icon: Info },
]

// Principales villes du Bénin (liste déroulante)
const BENIN_CITIES = [
    "Cotonou", "Abomey-Calavi", "Porto-Novo", "Parakou", "Djougou", "Bohicon",
    "Natitingou", "Ouidah", "Abomey", "Lokossa", "Kandi", "Savè", "Malanville",
    "Comè", "Dassa-Zoumè", "Aplahoué", "Nikki", "Pobè", "Sakété", "Allada",
    "Grand-Popo", "Tanguiéta", "Bassila", "Kétou", "Dogbo",
]

// Quartiers connus par ville (liste déroulante quand disponible, sinon saisie libre)
const QUARTIERS_BY_CITY: Record<string, string[]> = {
    "Cotonou": ["Akpakpa", "Cadjèhoun", "Fidjrossè", "Gbégamey", "Ganhi", "Jéricho", "Sègbèya", "Vodjè", "Zongo", "Agla", "Aïbatin", "Sainte-Rita", "Vèdoko", "Ste-Cécile", "Menontin"],
    "Abomey-Calavi": ["Calavi Centre", "Godomey", "Akassato", "Zopah", "Hêvié", "Togba", "Ouèdo", "Kpanroun", "Cocotomey"],
    "Porto-Novo": ["Ouando", "Djègan-Kpèvi", "Houinmè", "Attakè", "Dowa", "Tokpota", "Louho"],
    "Parakou": ["Zongo", "Ladji Farani", "Banikanni", "Titirou", "Guéma", "Wansirou", "Albarika"],
}

export function CreateListingForm() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [upgrading, setUpgrading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const { user, isAuthenticated } = useAuth()

    // --- IA vendeur ---
    const [aiBrief, setAiBrief] = useState("")
    const [aiBusy, setAiBusy] = useState(false)

    // --- Ville / quartier : bascule vers saisie libre ("Autre") ---
    const [otherCity, setOtherCity] = useState(false)
    const [otherQuartier, setOtherQuartier] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        categoryId: "",
        type: "PRODUCT" as "PRODUCT" | "SERVICE",
        adType: "OFFER" as "OFFER" | "WANTED",
        location: "Cotonou",
        quartier: "",
        images: [] as File[],
        videos: [] as File[],
        customCategory: "",
    })

    // Fetch real categories from DB
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories")
                if (res.ok) {
                    const data = await res.json()
                    setCategories(Array.isArray(data) ? data : [])
                }
            } catch (err) {
                console.error("Failed to fetch categories", err)
            }
        }
        fetchCategories()
    }, [])

    const handleMediaChange = (media: { images: File[], videos: File[] }) => {
        setFormData(prev => ({ ...prev, images: media.images, videos: media.videos }))
    }

    // --- IA : génère titre + description + prix conseillé à partir d'un brief court ---
    const handleAiGenerate = async () => {
        const brief = aiBrief.trim() || formData.title.trim() || formData.description.trim()
        if (!brief) {
            toast.info("Décris ton produit/service en quelques mots pour que l'IA t'aide.")
            return
        }
        setAiBusy(true)
        try {
            const catName = categories.find((c) => c.id === formData.categoryId)?.nameFr || formData.customCategory || ""
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: "listing", brief, category: catName }),
            })
            const data = await res.json()
            if (!res.ok) {
                toast.error(data.error || "L'IA n'a pas pu générer l'annonce.")
                return
            }
            setFormData((f) => ({
                ...f,
                title: data.title || f.title,
                description: data.description || f.description,
                price: data.suggestedPrice ? String(data.suggestedPrice) : f.price,
            }))
            toast.success("Annonce générée par l'IA. Vérifie et ajuste si besoin ✨")
            if (data.tips) toast.info("Conseil IA : " + data.tips, { duration: 6000 })
        } catch {
            toast.error("Connexion à l'IA impossible. Réessaie.")
        } finally {
            setAiBusy(false)
        }
    }

    // --- IA : modération / anti-arnaque avant publication (ne bloque qu'en cas de risque élevé) ---
    const moderate = async (): Promise<boolean> => {
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    task: "moderate",
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price) || 0,
                }),
            })
            if (!res.ok) return true // en cas d'erreur IA, ne bloque pas la publication
            const data = await res.json()
            if (data.allowed === false || data.risk === "high") {
                const reason = Array.isArray(data.reasons) && data.reasons.length ? data.reasons.join(" · ") : "Contenu à risque détecté."
                toast.error("Publication bloquée : " + reason, { duration: 8000 })
                if (data.suggestion) toast.info("Suggestion : " + data.suggestion, { duration: 8000 })
                return false
            }
            if (data.risk === "medium" && Array.isArray(data.reasons) && data.reasons.length) {
                toast.warning("À vérifier : " + data.reasons.join(" · "), { duration: 6000 })
            }
            return true
        } catch {
            return true // réseau IA indisponible → on laisse publier
        }
    }

    // --- ROLE & VERIFICATION CHECK ---
    const isBuyer = isAuthenticated && user && (user as any).role === "BUYER"
    const isSeller = isAuthenticated && user && (user as any).role === "SELLER"
    const isAdmin = isAuthenticated && user && (user as any).role === "ADMIN"
    const isVerified = isAuthenticated && user && ((user as any).isVerified || (user as any).verificationStatus === "VERIFIED")
    const isPending = isAuthenticated && user && (user as any).verificationStatus === "PENDING"

    const handleUpgradeToSeller = async () => {
        setUpgrading(true)
        try {
            const res = await fetch("/api/user/upgrade", { method: "POST" })
            const data = await res.json()
            if (res.ok) {
                toast.success("Votre compte a été mis à jour ! Vous êtes maintenant Vendeur. Rechargez la page.")
                setTimeout(() => router.refresh(), 1500)
            } else {
                toast.error(data.message || "Erreur lors de la mise à jour.")
            }
        } catch {
            toast.error("Erreur réseau.")
        } finally {
            setUpgrading(false)
        }
    }

    // --- BUYER BLOCKER ---
    if (isBuyer && formData.adType === "OFFER") {
        return (
            <div className="max-w-xl mx-auto py-8 px-4">
                <Card className="border-orange-200 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-orange-500" />
                        </div>
                        <CardTitle className="text-2xl font-black text-orange-900">Compte Vendeur Requis</CardTitle>
                        <CardDescription className="text-base mt-2 text-orange-700">
                            Pour publier une offre, vous devez être inscrit comme <strong>Vendeur</strong>.
                            Votre compte est actuellement un compte <strong>Acheteur</strong>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
                            <p className="text-sm text-teal-800 font-medium">
                                ✅ Avantages de devenir Vendeur :
                            </p>
                            <ul className="mt-2 text-sm text-teal-700 space-y-1 list-disc list-inside">
                                <li>Publiez vos produits et services</li>
                                <li>Créez votre boutique personnalisée</li>
                                <li>Recevez des commandes et des messages</li>
                            </ul>
                        </div>
                        <Button
                            onClick={handleUpgradeToSeller}
                            disabled={upgrading}
                            className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold text-white shadow-lg"
                        >
                            <Store className="mr-2 h-5 w-5" />
                            {upgrading ? "Mise à jour..." : "Devenir Vendeur Gratuitement"}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl"
                            onClick={() => setFormData(f => ({ ...f, adType: "WANTED" }))}
                        >
                            <Briefcase className="mr-2 h-5 w-5 text-orange-500" />
                            Publier une annonce &ldquo;Je cherche&rdquo; à la place
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // --- UNVERIFIED SELLER BLOCKER ---
    if (isSeller && !isVerified && formData.adType === "OFFER") {
        return (
            <div className="max-w-xl mx-auto py-8 px-4">
                <Card className="border-blue-200 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert className="w-8 h-8 text-blue-500" />
                        </div>
                        <CardTitle className="text-2xl font-black text-blue-900">Vérification Requise</CardTitle>
                        <CardDescription className="text-base mt-2 text-blue-700">
                            {isPending 
                                ? "Votre demande de vérification est en cours de traitement. Vous pourrez publier vos offres dès que votre compte sera validé."
                                : "Pour garantir la sécurité de la communauté, les vendeurs doivent vérifier leur identité avant de publier des offres."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isPending && (
                            <Button
                                onClick={() => router.push("/auth/verify")}
                                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg"
                            >
                                <ShieldAlert className="mr-2 h-5 w-5" />
                                Vérifier mon identité maintenant
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl"
                            onClick={() => setFormData(f => ({ ...f, adType: "WANTED" }))}
                        >
                            <Briefcase className="mr-2 h-5 w-5 text-orange-500" />
                            Publier une annonce &ldquo;Je cherche&rdquo; à la place
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Step nav — no blocking validation on step 1 (user can navigate freely)
    const nextStep = () => {
        if (step === 1) {
            // Only warn, don't block
            if (!formData.categoryId && !formData.customCategory && formData.adType === "OFFER") {
                toast.info("Pensez à choisir une catégorie avant de publier !")
            }
        }
        setStep(s => Math.min(s + 1, 3))
    }
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    const handleSubmit = async () => {
        if (!formData.title || !formData.price) {
            toast.error("Le titre et le prix sont obligatoires.")
            return
        }
        if (!formData.categoryId && !formData.customCategory) {
            toast.error("Veuillez choisir une catégorie.")
            return
        }

        setLoading(true)
        try {
            // --- MODÉRATION IA (anti-arnaque) avant publication ---
            const ok = await moderate()
            if (!ok) {
                setLoading(false)
                return
            }

            // --- IMAGE UPLOAD SIMULATION ---
            // Dans une vraie app, on utiliserait Cloudinary, UploadThing ou S3 ici
            // Ex: const uploadedImages = await Promise.all(formData.images.map(uploadFile))
            
            const simulatedImageUrls = formData.images.map((_, i) => 
                `https://images.unsplash.com/photo-${1523275335684 + i}-37898b6baf30?q=80&w=1000&auto=format&fit=crop`
            )
            
            const res = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    images: simulatedImageUrls.length > 0 ? simulatedImageUrls : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"],
                    videoUrls: formData.videos.map(() => ""), // À implémenter avec un service vidéo
                })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success("Annonce publiée avec succès !")
                router.push("/dashboard/seller")
                router.refresh()
            } else {
                toast.error(data.message || "Erreur lors de la publication.")
            }
        } catch (err) {
            console.error(err)
            toast.error("Une erreur réseau est survenue.")
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
                                    type="button"
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
                                        <div className="font-bold text-lg">Je propose</div>
                                        <div className="text-xs text-muted-foreground">Un produit ou un service à vendre/offrir.</div>
                                    </div>
                                </button>

                                <button
                                    type="button"
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
                                        <div className="font-bold text-lg">Je cherche</div>
                                        <div className="text-xs text-muted-foreground">Un produit ou service dont j&rsquo;ai besoin.</div>
                                    </div>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-4 p-1 bg-muted rounded-xl w-fit mx-auto">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: "PRODUCT" })}
                                        className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === "PRODUCT" ? "bg-white shadow-sm text-teal-700" : "text-muted-foreground"
                                            }`}
                                    >
                                        Produit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: "SERVICE" })}
                                        className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === "SERVICE" ? "bg-white shadow-sm text-teal-700" : "text-muted-foreground"
                                            }`}
                                    >
                                        Service
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <Label>Catégorie</Label>
                                    {categories.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">Chargement des catégories...</p>
                                    ) : (
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
                                                <SelectItem value="other">Autre (préciser...)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                {formData.categoryId === "other" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="customCategory">Nom de la nouvelle catégorie</Label>
                                        <Input
                                            id="customCategory"
                                            placeholder="Ex: Équipement Agricole"
                                            className="h-12 rounded-xl border-2"
                                            value={formData.customCategory}
                                            onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <MediaUpload onChange={handleMediaChange} />
                            <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                                <Info className="w-5 h-5 text-teal-600 mt-0.5" />
                                <p className="text-xs text-teal-800 leading-relaxed font-medium">
                                    Saviez-vous que les annonces avec vidéo génèrent <span className="font-black text-teal-900 border-none">3x plus d&apos;engagement</span> ?
                                    Capturez votre produit en action pour rassurer vos clients.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            {/* --- Assistant vendeur IA --- */}
                            <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-teal-900">Assistant IA</div>
                                        <div className="text-[11px] text-teal-700/80">Décris ton article, l&rsquo;IA rédige le titre, la description et propose un prix.</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Input
                                        placeholder="Ex: robe pagne wax taille M, neuve, faite à Cotonou"
                                        className="h-11 flex-1 rounded-xl border-2"
                                        value={aiBrief}
                                        onChange={(e) => setAiBrief(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAiGenerate() } }}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAiGenerate}
                                        disabled={aiBusy}
                                        className="h-11 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold text-white shadow-lg shadow-teal-600/20 sm:w-auto"
                                    >
                                        {aiBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                        {aiBusy ? "Génération…" : "Générer"}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Titre de l&rsquo;annonce *</Label>
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
                                    <Label htmlFor="price">Prix (FCFA) *</Label>
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
                                    {!otherCity ? (
                                        <Select
                                            value={BENIN_CITIES.includes(formData.location) ? formData.location : ""}
                                            onValueChange={(val) => {
                                                if (val === "__other__") {
                                                    setOtherCity(true)
                                                    setOtherQuartier(false)
                                                    setFormData((f) => ({ ...f, location: "", quartier: "" }))
                                                } else {
                                                    setOtherQuartier(false)
                                                    setFormData((f) => ({ ...f, location: val, quartier: "" }))
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl border-2 focus-visible:ring-teal-500">
                                                <SelectValue placeholder="Choisir une ville" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {BENIN_CITIES.map((c) => (
                                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                                ))}
                                                <SelectItem value="__other__">Autre ville…</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                id="location"
                                                autoFocus
                                                placeholder="Nom de la ville"
                                                className="h-12 rounded-xl border-2"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-12 rounded-xl border-2 shrink-0"
                                                onClick={() => {
                                                    setOtherCity(false)
                                                    setFormData((f) => ({ ...f, location: "Cotonou", quartier: "" }))
                                                }}
                                            >
                                                Liste
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quartier">Quartier</Label>
                                {QUARTIERS_BY_CITY[formData.location] && !otherQuartier ? (
                                    <Select
                                        value={QUARTIERS_BY_CITY[formData.location].includes(formData.quartier) ? formData.quartier : ""}
                                        onValueChange={(val) => {
                                            if (val === "__other__") {
                                                setOtherQuartier(true)
                                                setFormData((f) => ({ ...f, quartier: "" }))
                                            } else {
                                                setFormData((f) => ({ ...f, quartier: val }))
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-2 focus-visible:ring-teal-500">
                                            <SelectValue placeholder="Choisir un quartier (optionnel)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {QUARTIERS_BY_CITY[formData.location].map((q) => (
                                                <SelectItem key={q} value={q}>{q}</SelectItem>
                                            ))}
                                            <SelectItem value="__other__">Autre quartier…</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            id="quartier"
                                            placeholder="Ex: Akpakpa (optionnel)"
                                            className="h-12 rounded-xl border-2"
                                            value={formData.quartier}
                                            onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
                                        />
                                        {QUARTIERS_BY_CITY[formData.location] && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-12 rounded-xl border-2 shrink-0"
                                                onClick={() => {
                                                    setOtherQuartier(false)
                                                    setFormData((f) => ({ ...f, quartier: "" }))
                                                }}
                                            >
                                                Liste
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between pt-6">
                    {step > 1 ? (
                        <Button type="button" variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl border-2 border-muted-foreground/30 hover:bg-muted font-bold text-muted-foreground">
                            <ChevronLeft className="mr-2 w-4 h-4" /> Retour
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <Button type="button" onClick={nextStep} className="h-12 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 font-bold border-none shadow-lg shadow-teal-600/20">
                            Suivant <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            type="button"
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
