import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const formData = await req.formData()
        const type = formData.get("type") as string
        const idNumber = formData.get("idNumber") as string
        // Les fichiers idFront et selfie sont présents dans le formData mais non stockés
        // dans cet exemple (simulant une réussite d'upload).
        const userId = session.user.id as string

        // Update user's verification status
        await prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: false,
                verificationStatus: "PENDING",
                // Remove the incorrect role assignment: role: type as any,
            }
        })

        return NextResponse.json({
            message: "Demande soumise avec succès. Votre compte sera vérifié sous 24-48h.",
        })
    } catch (error) {
        console.error("VERIFICATION_SUBMIT_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
