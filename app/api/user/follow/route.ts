import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const { sellerId } = await req.json()
        const followerId = session.user.id

        if (!sellerId || sellerId === followerId) {
            return NextResponse.json({ message: "ID invalide" }, { status: 400 })
        }

        // Check if already following
        const existing = await prisma.follower.findUnique({
            where: {
                sellerId_followerId: {
                    sellerId,
                    followerId: followerId as string,
                }
            }
        })

        if (existing) {
            // Unfollow
            await prisma.follower.delete({
                where: { id: existing.id }
            })

            return NextResponse.json({ message: "Désabonné avec succès", isFollowing: false })
        } else {
            // Follow
            await prisma.follower.create({
                data: {
                    sellerId,
                    followerId: followerId as string,
                }
            })

            // Create a notification for the seller
            await prisma.notification.create({
                data: {
                    userId: sellerId,
                    type: "NEW_FOLLOWER",
                    content: `${session.user.name || 'Un utilisateur'} s'est abonné à votre profil.`,
                }
            })

            return NextResponse.json({ message: "Abonné avec succès", isFollowing: true })
        }
    } catch (error) {
        console.error("FOLLOW_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
