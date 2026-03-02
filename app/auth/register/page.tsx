"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/context/auth-context"
import { useLanguage } from "@/lib/context/language-context"

import { toast } from "sonner"

export default function RegisterPage() {
    const { login } = useAuth()
    const { t } = useLanguage()
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState<"BUYER" | "SELLER" | "DELIVERY">("BUYER")
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Une erreur est survenue")
            }

            toast.success("Compte créé avec succès !")

            // Auto login after registration
            await login({ email, password })
            router.push("/")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        AfricaMarket
                    </Link>
                    <p className="mt-2 text-sm text-muted-foreground">Rejoignez la plus grande marketplace du Bénin</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("auth.register")}</CardTitle>
                        <CardDescription>Créez votre compte pour commencer à acheter ou vendre</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("auth.name")}</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="Jean Dupont"
                                        className="pl-10"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">{t("auth.email")}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">{t("auth.password")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        className="pl-10"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label>{t("auth.role")}</Label>
                                <RadioGroup
                                    defaultValue="BUYER"
                                    onValueChange={(value) => setRole(value as any)}
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                >
                                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <RadioGroupItem value="BUYER" id="buyer" />
                                        <Label htmlFor="buyer" className="font-normal cursor-pointer flex-1">{t("auth.role_buyer")}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <RadioGroupItem value="SELLER" id="seller" />
                                        <Label htmlFor="seller" className="font-normal cursor-pointer flex-1">{t("auth.role_seller")}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <RadioGroupItem value="DELIVERY" id="delivery" />
                                        <Label htmlFor="delivery" className="font-normal cursor-pointer flex-1">{t("auth.role_delivery")}</Label>
                                    </div>
                                </RadioGroup>

                                {role !== "BUYER" && (
                                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 mt-2">
                                        {role === "SELLER"
                                            ? "En tant que vendeur, vous devrez valider votre identité avant de publier vos produits."
                                            : "En tant que livreur, une vérification de vos documents de transport sera nécessaire."}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                                {isLoading ? "Création en cours..." : t("auth.register_btn")}
                                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">{t("auth.has_account")} </span>
                            <Link href="/auth/login" className="font-medium text-primary hover:underline">
                                {t("auth.login")}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
