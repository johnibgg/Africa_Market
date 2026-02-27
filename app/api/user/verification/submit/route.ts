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

        // In a real production app, we would process file uploads to S3/Cloudinary here.
        // For this implementation, we assume the data contains URLs or identifiers for documents.

        const verification = await prisma.verificationRequest.create({
            data: {
                userId,
                type, // "SELLER" or "DELIVERY"
                status: "PENDING",
                data: data, // Store submitted fields (ID number, address, etc.)
            }
        })

        // Update user status
        await prisma.user.update({
            where: { id: userId },
            data: {
                isVerified: false, // Still false until approved
                role: type // Set requested role (even if not verified yet, UI handles view)
            }
        })

        return NextResponse.json({
            message: "Demande soumise avec succès",
            id: verification.id
        })
    } catch (error) {
        console.error("VERIFICATION_SUBMIT_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
