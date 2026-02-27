"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/context/language-context"

export default function ForgotPasswordPage() {
    const { t } = useLanguage()
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock password reset request
        setSubmitted(true)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        AfricaMarket
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("auth.forgot_password")}</CardTitle>
                        <CardDescription>
                            {submitted
                                ? "Si un compte existe pour cet email, vous recevrez un lien de réinitialisation."
                                : "Entrez votre email pour recevoir un lien de réinitialisation de votre mot de passe."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
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

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                    {t("footer.subscribe")}
                                    <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <Button variant="outline" className="w-full" onClick={() => router.push("/auth/login")}>
                                Retour à la connexion
                            </Button>
                        )}

                        <div className="mt-6 text-center">
                            <Link href="/auth/login" className="flex items-center justify-center text-sm font-medium text-primary hover:underline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t("common.back")}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
