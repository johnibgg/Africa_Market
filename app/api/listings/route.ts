import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user || (session.user as any).role !== "SELLER") {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const body = await req.json()
        const { title, description, price, categoryId, images, type, location, quartier } = body

        if (!title || !price || !categoryId) {
            return NextResponse.json({ message: "Champs obligatoires manquants" }, { status: 400 })
        }

        // Create the listing
        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                categoryId,
                sellerId: session.user.id as string,
                images: images || [],
                type: type || "PRODUCT",
                location: location || "Cotonou",
                quartier: quartier,
                status: "active",
            },
            include: {
                seller: true
            }
        })

        // Notify followers
        const followers = await prisma.follower.findMany({
            where: { sellerId: session.user.id as string },
            select: { followerId: true }
        })

        if (followers.length > 0) {
            const notifications = followers.map((f: { followerId: string }) => ({
                userId: f.followerId,
                type: "NEW_LISTING",
                content: `Le vendeur ${listing.seller.shopName || listing.seller.name} a publié un nouvel article : ${listing.title}`,
                link: `/listings/${listing.id}`,
            }))

            await prisma.notification.createMany({
                data: notifications as any
            })
        }

        return NextResponse.json(listing, { status: 201 })
    } catch (error) {
        console.error("LISTING_CREATE_ERROR", error)
        return NextResponse.json({ message: "Erreur lors de la création de l'article" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const category = searchParams.get("category")
        const type = searchParams.get("type")
        const query = searchParams.get("q")

        const where: any = { status: "active" }
        if (category) where.categoryId = category
        if (type) where.type = type
        if (query) {
            where.OR = [
                { title: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ]
        }

        const listings = await prisma.listing.findMany({
            where,
            include: {
                category: true,
                seller: {
                    select: {
                        id: true,
                        name: true,
                        shopName: true,
                        image: true,
                        isVerified: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(listings)
    } catch (error) {
        console.error("LISTINGS_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur lors de la récupération des articles" }, { status: 500 })
    }
}
