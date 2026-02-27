"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl prose dark:prose-invert">
                <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>

                <p className="text-muted-foreground mb-8">Votre vie privée est importante pour nous.</p>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">1. Collecte des données</h2>
                    <p className="mb-4">
                        Nous collectons les informations que vous nous fournissez lors de votre inscription (nom, email, téléphone) ainsi que les données relatives à vos transactions et navigation sur le site.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">2. Utilisation des données</h2>
                    <p className="mb-4">
                        Vos données sont utilisées pour :
                        <ul className="list-disc pl-5 mt-2">
                            <li>Gérer votre compte et vos commandes</li>
                            <li>Améliorer nos services et votre expérience utilisateur</li>
                            <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                            <li>Assurer la sécurité de la plateforme</li>
                        </ul>
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">3. Partage des données</h2>
                    <p className="mb-4">
                        Nous ne vendons pas vos données personnelles. Elles peuvent être partagées avec des prestataires tiers (livreurs, services de paiement) uniquement dans le but d'exécuter les services demandés.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">4. Vos droits</h2>
                    <p className="mb-4">
                        Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez exercer ces droits en nous contactant à privacy@africamarket.bj.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">5. Sécurité</h2>
                    <p className="mb-4">
                        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou altération.
                    </p>
                </section>

            </main>
            <Footer />
        </div>
    )
}
