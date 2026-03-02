import { CreateListingForm } from "@/components/listings/create-listing-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Publier une annonce | AfricaMarket",
    description: "Vendez vos produits ou cherchez des services sur AfricaMarket.",
}

export default async function NewListingPage() {
    const session = await auth()

    if (!session) {
        redirect("/auth/login?callbackUrl=/listings/new")
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="container mx-auto py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-teal-950 mb-4 tracking-tight">Partagez votre annonce</h1>
                    <p className="text-teal-700/70 max-w-lg mx-auto font-medium">
                        Rejoignez la communauté et commencez à échanger en quelques minutes.
                    </p>
                </div>
                <CreateListingForm />
            </div>
        </div>
    )
}
