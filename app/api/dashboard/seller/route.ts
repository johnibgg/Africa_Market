import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session || !session.user || (session.user as any).role !== "SELLER") {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const sellerId = session.user.id as string

        // Get listings
        const listings = await prisma.listing.findMany({
            where: { sellerId },
            include: { category: true },
            orderBy: { createdAt: "desc" }
        })

        // Get orders
        const orders = await prisma.order.findMany({
            where: { sellerId },
            orderBy: { createdAt: "desc" },
            take: 10
        })

        // Calculate stats
        const totalOrders = await prisma.order.count({ where: { sellerId } })
        const totalRevenue = await prisma.order.aggregate({
            where: { sellerId, status: "DELIVERED" },
            _sum: { total: true }
        })

        const views = listings.reduce((acc: number, curr: { views: number | null }) => acc + (curr.views || 0), 0)

        // In a real app, we would have a table for daily/monthly revenue
        // For now, we'll return a simplified structure
        const stats = {
            revenue: totalRevenue._sum.total || 0,
            totalOrders,
            views,
            averageRating: 4.5, // Mock for now as review system isn't fully implemented
        }

        return NextResponse.json({
            listings,
            orders,
            stats,
        })
    } catch (error) {
        console.error("DASHBOARD_SELLER_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
