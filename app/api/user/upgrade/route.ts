import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { id: session.user.id as string } })
        if (!user) {
            return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 })
        }

        if (user.role === "SELLER") {
            return NextResponse.json({ message: "Vous êtes déjà vendeur !" })
        }

        const updated = await prisma.user.update({
            where: { id: session.user.id as string },
            data: { role: "SELLER" },
        })

        return NextResponse.json({ message: "Compte mis à jour en Vendeur avec succès !", role: updated.role })
    } catch (error) {
        console.error("UPGRADE_ROLE_ERROR", error)
        return NextResponse.json({ message: "Erreur lors de la mise à jour du rôle" }, { status: 500 })
    }
}
