import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                category: true,
                seller: {
                    select: {
                        id: true,
                        name: true,
                        shopName: true,
                        image: true,
                        isVerified: true,
                        location: true,
                        bio: true,
                        joinedAt: true,
                        _count: { select: { listings: true, followers: true } }
                    }
                },
                reviews: {
                    orderBy: { createdAt: "desc" },
                    take: 10
                }
            }
        })

        if (!listing) {
            return NextResponse.json({ message: "Annonce introuvable" }, { status: 404 })
        }

        return NextResponse.json(listing)
    } catch (error) {
        console.error("LISTING_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
