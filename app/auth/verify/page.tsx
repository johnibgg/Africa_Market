"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Upload,
    Camera,
    CheckCircle2,
    ShieldCheck,
    ChevronRight,
    FileText,
    User,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/auth-context"
import { toast } from "sonner"

export default function VerifyPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [idType, setIdType] = useState<"cni" | "passport" | "resident">("cni")
    const [idNumber, setIdNumber] = useState("")
    const [files, setFiles] = useState<{ idFront: File | null; selfie: File | null }>({
        idFront: null,
        selfie: null
    })

    const handleNext = () => {
        if (step === 1 && !idNumber) {
            toast.error("Veuillez entrer votre numéro de pièce d'identité")
            return
        }
        if (step === 2 && !files.idFront) {
            toast.error("Veuillez télécharger une photo de votre pièce d'identité")
            return
        }
        setStep(step + 1)
    }

    const [isLoading, setIsLoading] = useState(false)

    const handleFileChange = (type: "idFront" | "selfie", e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setFiles(prev => ({ ...prev, [type]: file }))
    }

    const submitVerification = async () => {
        if (!files.idFront || !files.selfie) {
            toast.error("Veuillez fournir toutes les photos demandées.")
            return
        }

        setIsLoading(true)
        try {
            // Dans une version réelle, nous utiliserions FormData pour envoyer les fichiers
            const formData = new FormData()
            formData.append("type", idType)
            formData.append("idNumber", idNumber)
            if (files.idFront) formData.append("idFront", files.idFront)
            if (files.selfie) formData.append("selfie", files.selfie)

            const response = await fetch("/api/user/verification/submit", {
                method: "POST",
                body: formData // On envoie le FormData directement
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Erreur lors de la soumission")
            }

            toast.success("Votre demande de vérification a été soumise avec succès !")
            router.push("/profile")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if ((user?.verificationStatus as string) === "VERIFIED" || user?.isVerified) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
                <div className="bg-green-50 p-12 rounded-3xl border border-green-100 border-dashed">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-800">Votre compte est vérifié !</h2>
                    <p className="text-green-600 mt-2">Vous avez désormais accès à toutes les fonctionnalités professionnelles.</p>
                    <Button className="mt-8" onClick={() => router.push("/profile")}>Retour au profil</Button>
                </div>
            </div>
        )
    }

    if ((user?.verificationStatus as string) === "PENDING") {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
                <div className="bg-orange-50 p-12 rounded-3xl border border-orange-100 border-dashed">
                    <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-orange-800">Vérification en cours</h2>
                    <p className="text-orange-600 mt-2">Votre demande est actuellement examinée par notre équipe. Nous vous notifierons dès qu'elle sera validée.</p>
                    <Button className="mt-8" onClick={() => router.push("/profile")}>Retour au profil</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                    <ShieldCheck className="w-8 h-8 text-teal-600" />
                </div>
                <h1 className="text-3xl font-bold font-heading">Vérification d'Identité</h1>
                <p className="text-muted-foreground mt-2">Pour vendre sur AfricaMarket, nous devons vérifier votre identité. Choisissez <b>une seule</b> pièce parmi les trois proposées.</p>
            </div>

            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 -z-10"></div>
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${s === step ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" :
                            s < step ? "bg-teal-100 text-teal-600" : "bg-muted text-muted-foreground"
                            } border-4 border-background`}
                    >
                        {s < step ? <CheckCircle2 className="w-6 h-6" /> : s}
                    </div>
                ))}
            </div>

            <Card className="border-teal-100 shadow-xl overflow-hidden">
                {step === 1 && (
                    <>
                        <CardHeader>
                            <CardTitle className="font-heading">Étape 1 : Choix de la pièce</CardTitle>
                            <CardDescription>Choisissez <b>une</b> pièce d'identité et entrez son numéro.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {(['cni', 'passport', 'resident'] as const).map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setIdType(type)}
                                        className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${idType === type ? "border-teal-600 bg-teal-50" : "border-muted hover:border-teal-200"
                                            }`}
                                    >
                                        <FileText className={`w-8 h-8 mx-auto mb-2 ${idType === type ? "text-teal-600" : "text-muted-foreground"}`} />
                                        <p className="text-xs font-bold uppercase tracking-wider">
                                            {type === "cni" ? "Carte d'identité" : type === "passport" ? "Passeport" : "Carte Résident"}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="id-number">Numéro de la pièce d'identité choisie</Label>
                                <Input
                                    id="id-number"
                                    placeholder="Ex: 1234567890"
                                    value={idNumber}
                                    onChange={(e) => setIdNumber(e.target.value)}
                                    className="text-lg py-6 border-teal-100 focus:ring-teal-500"
                                />
                            </div>

                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0" />
                                <p className="text-sm text-orange-800">Assurez-vous que le numéro correspond exactement à celui sur votre pièce physique.</p>
                            </div>
                        </CardContent>
                    </>
                )}

                {step === 2 && (
                    <>
                        <CardHeader>
                            <CardTitle className="font-heading">Étape 2 : Photo de la pièce</CardTitle>
                            <CardDescription>Téléchargez une photo claire du recto (devant) de votre pièce.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div
                                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer group ${files.idFront ? "border-green-500 bg-green-50" : "border-teal-200 bg-teal-50/30 hover:bg-teal-50"
                                    }`}
                                onClick={() => document.getElementById("idFrontInput")?.click()}
                            >
                                <input
                                    id="idFrontInput"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("idFront", e)}
                                />
                                {files.idFront ? (
                                    <>
                                        <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                                        <h3 className="text-lg font-bold text-green-900">Photo sélectionnée</h3>
                                        <p className="text-sm text-green-600 mt-1">{files.idFront.name}</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 mx-auto text-teal-400 group-hover:text-teal-600 transition-colors mb-4" />
                                        <h3 className="text-lg font-bold text-teal-900">Cliquez pour télécharger</h3>
                                        <p className="text-sm text-teal-600 mt-1">Recto de la pièce (PNG, JPG, Max 5MB)</p>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase">À faire</p>
                                    <ul className="text-xs space-y-1 text-green-700">
                                        <li>✓ Photo claire et lisible</li>
                                        <li>✓ Tous les bords visibles</li>
                                        <li>✓ Bon éclairage</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-muted-foreground uppercase">À éviter</p>
                                    <ul className="text-xs space-y-1 text-red-700">
                                        <li>✕ Reflets de lumière</li>
                                        <li>✕ Portrait flou</li>
                                        <li>✕ Éléments cachés</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </>
                )}

                {step === 3 && (
                    <>
                        <CardHeader>
                            <CardTitle className="font-heading">Étape 3 : Selfie avec votre pièce</CardTitle>
                            <CardDescription>Téléchargez une photo de vous tenant votre pièce d'identité à côté de votre visage.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div
                                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer group ${files.selfie ? "border-green-500 bg-green-50" : "border-teal-200 bg-teal-50/30 hover:bg-teal-50"
                                    }`}
                                onClick={() => document.getElementById("selfieInput")?.click()}
                            >
                                <input
                                    id="selfieInput"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange("selfie", e)}
                                />
                                {files.selfie ? (
                                    <>
                                        <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                                        <h3 className="text-lg font-bold text-green-900">Selfie sélectionné</h3>
                                        <p className="text-sm text-green-600 mt-1">{files.selfie.name}</p>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-12 h-12 mx-auto text-teal-400 group-hover:text-teal-600 transition-colors mb-4" />
                                        <h3 className="text-lg font-bold text-teal-900">Cliquez pour télécharger le selfie</h3>
                                        <p className="text-sm text-teal-600 mt-1">Votre visage + la pièce tenue en main</p>
                                    </>
                                )}
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <p className="text-sm text-blue-800 font-medium">Pourquoi cette étape ?</p>
                                <p className="text-xs text-blue-700 mt-1">Cela nous permet de confirmer que vous êtes bien le titulaire de la pièce fournie.</p>
                            </div>
                        </CardContent>
                    </>
                )}

                <CardFooter className="bg-muted/30 p-6 flex justify-between gap-4 border-t">
                    {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                            Précédent
                        </Button>
                    ) : (
                        <Button variant="ghost" onClick={() => router.push("/profile")}>
                            Annuler
                        </Button>
                    )}

                    {step < 3 ? (
                        <Button className="bg-teal-600 hover:bg-teal-700 px-8" onClick={handleNext}>
                            Suivant <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-green-600 hover:bg-green-700 px-8 shadow-lg shadow-green-600/20 font-bold"
                            onClick={submitVerification}
                            disabled={isLoading}
                        >
                            {isLoading ? "Envoi en cours..." : "Soumettre pour vérification"}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                <p className="text-sm font-medium">Vos données sont chiffrées et sécurisées</p>
            </div>
        </div>
    )
}
