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

        // Get orders
        const orders = await prisma.order.findMany({
            where: { buyerId: userId },
            include: { seller: { select: { shopName: true, name: true } } },
            orderBy: { createdAt: "desc" },
            take: 10
        })

        // Get followed sellers
        const followedSellers = await prisma.follower.findMany({
            where: { followerId: userId },
            include: {
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
            take: 5
        })

        const totalSpent = await prisma.order.aggregate({
            where: { buyerId: userId, status: "DELIVERED" },
            _sum: { total: true }
        })

        const stats = {
            orderCount: await prisma.order.count({ where: { buyerId: userId } }),
            totalSpent: totalSpent._sum.total || 0,
            followingCount: await prisma.follower.count({ where: { followerId: userId } }),
        }

        return NextResponse.json({
            orders,
            followedSellers,
            stats,
        })
    } catch (error) {
        console.error("DASHBOARD_BUYER_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
