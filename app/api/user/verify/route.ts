import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const { idType, idNumber, idFront, selfie } = await req.json()

        if (!idNumber) {
            return NextResponse.json({ message: "Numéro de pièce manquant" }, { status: 400 })
        }

        // Update user status
        await prisma.user.update({
            where: { id: session.user.id as string },
            data: {
                verificationStatus: "PENDING",
                // In a real app, we would save file paths for idFront and selfie here
            }
        })

        // Create a notification for the user
        await prisma.notification.create({
            data: {
                userId: session.user.id as string,
                type: "SYSTEM",
                content: "Votre demande de vérification a été reçue et est en cours de traitement.",
            }
        })

        return NextResponse.json({ message: "Demande soumise avec succès" })
    } catch (error) {
        console.error("VERIFY_SUBMIT_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
