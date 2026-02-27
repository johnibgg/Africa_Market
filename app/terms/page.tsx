"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function TermsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl prose dark:prose-invert">
                <h1 className="text-3xl font-bold mb-6">Conditions Générales d'Utilisation (CGU)</h1>

                <p className="text-muted-foreground mb-8">Dernière mise à jour : 20 Février 2026</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                    <p className="mb-4">
                        Bienvenue sur AfricaMarket. En accédant à notre site web et en utilisant nos services, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Veuillez les lire attentivement.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">2. Compte Utilisateur</h2>
                    <p className="mb-4">
                        Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de votre compte et mot de passe. Toutes les informations fournies doivent être exactes et à jour.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">3. Ventes et Achats</h2>
                    <p className="mb-4">
                        Les vendeurs s'engagent à ne proposer que des produits licites et conformes à la réglementation locale. Les acheteurs s'engagent à régler les produits commandés. AfricaMarket agit en tant qu'intermédiaire et tiers de confiance.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">4. Contenu Interdit</h2>
                    <p className="mb-4">
                        Il est strictement interdit de publier du contenu offensant, diffamatoire, illégal ou frauduleux. AfricaMarket se réserve le droit de supprimer tout contenu ne respectant pas ces règles sans préavis.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">5. Responsabilité</h2>
                    <p className="mb-4">
                        AfricaMarket met tout en œuvre pour assurer la disponibilité du service mais ne peut garantir un fonctionnement ininterrompu. Nous ne sommes pas responsables des litiges directs entre acheteurs et vendeurs, bien que nous proposions un service de médiation.
                    </p>
                </section>

            </main>
            <Footer />
        </div>
    )
}
