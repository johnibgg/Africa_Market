"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/context/auth-context"
import { useLanguage } from "@/lib/context/language-context"
import { toast } from "sonner"

export default function LoginPage() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Success and Error messages from verification
  const success = searchParams.get("success")
  const error = searchParams.get("error")

  useEffect(() => {
    if (success === "EmailVerified") {
      toast.success("Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.")
    }
    if (error) {
      const errorMessages: Record<string, string> = {
        MissingToken: "Le lien de vérification est manquant.",
        InvalidToken: "Le lien de vérification est invalide ou a déjà été utilisé.",
        TokenExpired: "Le lien de vérification a expiré.",
        EmailNotFound: "L'utilisateur associé à ce lien n'existe plus.",
        ServerError: "Une erreur est survenue lors de la vérification."
      }
      toast.error(errorMessages[error] || "Une erreur est survenue.")
    }
  }, [success, error])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, password })
      toast.success("Connexion réussie !")
      router.push("/")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Email ou mot de passe incorrect")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            AfricaMarket
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.login_subtitle")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("auth.login")}</CardTitle>
            <CardDescription>{t("auth.login_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("auth.password")}</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    {t("auth.forgot_password")}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : t("auth.login")}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <Separator className="my-6" />

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("auth.no_account")}{" "}
              <Link href="/auth/register" className="font-medium text-primary hover:underline">
                {t("auth.register")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
