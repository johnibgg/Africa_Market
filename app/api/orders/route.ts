import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const body = await req.json()
        const { items, total, deliveryFee, address, paymentMethod } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ message: "Le panier est vide" }, { status: 400 })
        }

        // 1. Calculate commissions
        // We might have multiple sellers in one cart, but let's simplify for now
        // and assume all items belong to the same seller or we use a global commission
        const firstItemId = items[0].listingId
        const listing = await prisma.listing.findUnique({
            where: { id: firstItemId },
            include: { seller: true }
        })

        const commissionRate = listing?.seller?.commissionRate || 0.05 // 5% default
        const commissionAmount = total * commissionRate

        // 2. Create the order
        const order = await prisma.order.create({
            data: {
                buyerId: session.user.id as string,
                sellerId: listing?.sellerId || "",
                total: total + deliveryFee,
                commissionAmount: commissionAmount,
                status: "PENDING",
                paymentMethod: paymentMethod,
                deliveryAddress: address,
                items: {
                    create: items.map((item: any) => ({
                        listingId: item.listingId,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                }
            }
        })

        // 3. Notify the seller (optional, but good for UX)
        // You could add notification logic here

        return NextResponse.json(order)
    } catch (error) {
        console.error("ORDER_POST_ERROR", error)
        return NextResponse.json({ message: "Erreur lors de la création de la commande" }, { status: 500 })
    }
}
