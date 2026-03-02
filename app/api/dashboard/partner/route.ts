import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session || !session.user || (session.user as any).role !== "DELIVERY") {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const partnerId = session.user.id as string

        // Get active orders assigned to this delivery partner
        const activeShipments = await (prisma.order as any).findMany({
            where: { deliveryId: partnerId, status: "SHIPPED" },
            include: { seller: { select: { shopName: true, location: true } } },
            orderBy: { createdAt: "desc" }
        }).catch(() => [])

        // Get available orders (unassigned, paid)
        const availableOrders = await (prisma.order as any).findMany({
            where: { status: "PAID", deliveryId: null },
            include: { seller: { select: { shopName: true, location: true } } },
            orderBy: { createdAt: "desc" },
            take: 20
        }).catch(() => [])

        const completedDeliveries = await (prisma.order as any).count({
            where: { deliveryId: partnerId, status: "DELIVERED" }
        }).catch(() => 0)

        const totalEarnings = await prisma.order.aggregate({
            where: { status: "DELIVERED" },
            _sum: { total: true }
        }).catch(() => ({ _sum: { total: 0 } }))

        const stats = {
            completedDeliveries,
            totalEarnings: totalEarnings?._sum?.total || 0,
            availableCount: availableOrders.length,
        }

        return NextResponse.json({
            activeShipments,
            availableOrders,
            stats,
        })
    } catch (error) {
        console.error("DASHBOARD_PARTNER_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
