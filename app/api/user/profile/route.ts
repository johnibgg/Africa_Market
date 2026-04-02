import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const userId = session.user.id as string

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: {
                    select: {
                        listings: true,
                        followers: true,
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
        }

        const stats = {
            listingsCount: user._count.listings,
            followersCount: user._count.followers,
            // Add more stats as needed
        }

        return NextResponse.json({ user, stats })
    } catch (error) {
        console.error("PROFILE_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const body = await req.json()
        const { name, shopName, shopSlug, shopDescription, bio, location, quartier, phone } = body

        if (shopSlug) {
            const existing = await prisma.user.findFirst({
                where: { shopSlug, NOT: { id: session.user.id as string } }
            })
            if (existing) {
                return NextResponse.json({ message: "Ce lien de boutique est déjà pris." }, { status: 400 })
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id as string },
            data: {
                name,
                shopName,
                shopSlug: shopSlug || undefined,
                shopDescription,
                bio,
                location,
                quartier,
                phone,
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error("PROFILE_PATCH_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
