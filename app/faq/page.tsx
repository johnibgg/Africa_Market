"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function FAQPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Questions Fréquentes (FAQ)</h1>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Comment créer un compte vendeur ?</AccordionTrigger>
                        <AccordionContent>
                            Pour devenir vendeur, cliquez sur "Vendre" dans le menu principal ou lors de votre inscription, choisissez le rôle "Vendeur". Vous pourrez ensuite configurer votre boutique et ajouter vos annonces.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>Quels sont les moyens de paiement acceptés ?</AccordionTrigger>
                        <AccordionContent>
                            Nous acceptons les paiements par Mobile Money (MTN, Moov) ainsi que les cartes bancaires (Visa, Mastercard). Le paiement à la livraison est disponible pour certains vendeurs vérifiés.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Comment fonctionne la livraison ?</AccordionTrigger>
                        <AccordionContent>
                            AfricaMarket travaille avec un réseau de livreurs locaux. Lors de la commande, choisissez votre adresse et les frais seront calculés automatiquement. Vous pouvez suivre votre livraison depuis votre tableau de bord.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Est-ce que je peux retourner un produit ?</AccordionTrigger>
                        <AccordionContent>
                            La politique de retour dépend de chaque vendeur. Vérifiez les conditions sur la page du produit. En cas de produit non-conforme ou défectueux, AfricaMarket intervient pour garantir votre remboursement.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>Comment contacter le support client ?</AccordionTrigger>
                        <AccordionContent>
                            Vous pouvez nous contacter via le formulaire de contact en bas de page, par email à support@africamarket.bj ou directement par WhatsApp au +229 00 00 00 00.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </main>
            <Footer />
        </div>
    )
}
