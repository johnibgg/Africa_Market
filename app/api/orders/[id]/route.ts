import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const body = await req.json()
        const { status } = body

        const order = await prisma.order.findUnique({
            where: { id },
            include: { 
                items: {
                    include: {
                        listing: {
                            include: { seller: true }
                        }
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json({ message: "Commande non trouvée" }, { status: 404 })
        }

        // Logic to update balance when status becomes DELIVERED
        if (status === "DELIVERED" && order.status !== "DELIVERED") {
            // Group items by seller and update their balance
            const sellerCredits: Record<string, number> = {}
            
            for (const item of order.items) {
                const sellerId = item.listing.sellerId
                const commissionRate = item.listing.seller.commissionRate || 0.05
                const netAmount = (item.price * item.quantity) * (1 - commissionRate)
                
                sellerCredits[sellerId] = (sellerCredits[sellerId] || 0) + netAmount
            }

            // Perform transaction: update order status and update seller balances
            await prisma.$transaction([
                prisma.order.update({
                    where: { id },
                    data: { status: "DELIVERED" }
                }),
                ...Object.entries(sellerCredits).map(([sellerId, amount]) => (
                    prisma.user.update({
                        where: { id: sellerId },
                        data: {
                            balance: { increment: amount }
                        }
                    })
                ))
            ])
            
            return NextResponse.json({ message: "Commande livrée et soldes mis à jour" })
        }

        // Default status update
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(updatedOrder)
    } catch (error) {
        console.error("ORDER_PATCH_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
