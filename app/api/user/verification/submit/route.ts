import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const { type, ...data } = await req.json()
        const userId = session.user.id as string

        // Update user's verification status and requested role
        await prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: false,
                verificationStatus: "PENDING",
                role: type as any,
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
