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

        // Get active shipments
        const activeShipments = await prisma.order.findMany({
            where: { partnerId, status: { in: ["OUT_FOR_DELIVERY"] } },
            include: { seller: { select: { shopName: true, location: true } } },
            orderBy: { createdAt: "desc" }
        })

        // Get available orders (if partner is verified)
        const availableOrders = await prisma.order.findMany({
            where: { status: "PAID", partnerId: null },
            include: { seller: { select: { shopName: true, location: true } } },
            orderBy: { createdAt: "desc" },
            take: 20
        })

        const completedDeliveries = await prisma.order.count({
            where: { partnerId, status: "DELIVERED" }
        })

        const totalEarnings = await prisma.order.aggregate({
            where: { partnerId, status: "DELIVERED" },
            _sum: { deliveryFee: true }
        })

        const stats = {
            completedDeliveries,
            totalEarnings: totalEarnings._sum.deliveryFee || 0,
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
