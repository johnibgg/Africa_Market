"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/lib/context/language-context"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
    const { t } = useLanguage()

    const tiers = [
        {
            name: "Basic",
            price: "Gratuit",
            description: "Pour commencer a vendre sur AfricaMarket.",
            features: [
                "5 annonces actives",
                "Photos standard",
                "Messagerie basique",
                "Support par email",
            ],
            cta: "Commencer gratuitement",
            popular: false,
        },
        {
            name: "Pro",
            price: "5 000 FCFA",
            period: "/mois",
            description: "Pour les vendeurs reguliers qui veulent plus de visibilite.",
            features: [
                "50 annonces actives",
                "Photos HD (jusqu'a 10)",
                "Statistiques detaillees",
                "Badge 'Vendeur Pro'",
                "Support prioritaire",
            ],
            cta: "Devenir Pro",
            popular: true,
        },
        {
            name: "VIP",
            price: "15 000 FCFA",
            period: "/mois",
            description: "La solution complete pour les entreprises et gros vendeurs.",
            features: [
                "Annonces illimitees",
                "Photos HD illimitees",
                "Badge 'Vendeur Certifie'",
                "3 annonces sponsorisees / mois",
                "Support dedie 24/7",
                "Tableau de bord avance",
            ],
            cta: "Passer au VIP",
            popular: false,
        },
    ]

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-muted/30">
                <div className="container mx-auto px-4 py-16">
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                            Des plans adaptes a vos besoins
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Choisissez le plan qui correspond le mieux a votre activite et commencez a vendre des aujourd'hui.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3 lg:gap-8">
                        {tiers.map((tier) => (
                            <Card
                                key={tier.name}
                                className={`flex flex-col relative ${tier.popular ? "border-primary shadow-lg scale-105 z-10" : ""}`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm">
                                            Le plus populaire
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                                    <CardDescription>{tier.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="mb-6 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">{tier.price}</span>
                                        {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                                    </div>
                                    <ul className="space-y-3">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-primary" />
                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                                        {tier.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
