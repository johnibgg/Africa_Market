import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session || !session.user || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        // Get total counts
        const totalUsers = await prisma.user.count()
        const totalListings = await prisma.user.aggregate({
            _count: { id: true } // This is a placeholder, usually we'd count listings
        })
        const listingsCount = await prisma.listing.count()
        const ordersCount = await prisma.order.count()

        const totalRevenue = await prisma.order.aggregate({
            where: { status: "DELIVERED" },
            _sum: { total: true }
        })

        // New users today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const newUsersToday = await prisma.user.count({
            where: {
                createdAt: { gte: today }
            }
        })

        // New listings today
        const newListingsToday = await prisma.listing.count({
            where: {
                createdAt: { gte: today }
            }
        })

        // Users for the table
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 10
        })

        return NextResponse.json({
            stats: {
                totalUsers,
                totalListings: listingsCount,
                totalOrders: ordersCount,
                totalRevenue: totalRevenue._sum.total || 0,
                newUsersToday,
                newListingsToday,
                pendingModeration: 0 // Mock for now
            },
            users,
            // Add monthly data mock for charts since we don't have historical aggregation yet
            monthlyData: [
                { month: "Jan", users: 400, listings: 240, revenue: 2400 },
                { month: "Feb", users: 300, listings: 139, revenue: 2210 },
                { month: "Mar", users: 200, listings: 980, revenue: 2290 },
                { month: "Apr", users: 278, listings: 390, revenue: 2000 },
                { month: "May", users: 189, listings: 480, revenue: 2181 },
                { month: "Jun", users: 239, listings: 380, revenue: 2500 },
            ]
        })
    } catch (error) {
        console.error("DASHBOARD_ADMIN_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
