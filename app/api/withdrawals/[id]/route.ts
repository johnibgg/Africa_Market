import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await auth()
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const body = await req.json()
        const { status } = body

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id }
        })

        if (!withdrawal) {
            return NextResponse.json({ message: "Retrait non trouvé" }, { status: 404 })
        }

        // If rejected, refund the user balance
        if (status === "REJECTED" && withdrawal.status !== "REJECTED") {
            await prisma.$transaction([
                prisma.withdrawal.update({
                    where: { id },
                    data: { status: "REJECTED" }
                }),
                prisma.user.update({
                    where: { id: withdrawal.userId },
                    data: {
                        balance: { increment: withdrawal.amount }
                    }
                })
            ])
            return NextResponse.json({ message: "Retrait rejeté et montant remboursé" })
        }

        const updatedWithdrawal = await prisma.withdrawal.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json(updatedWithdrawal)
    } catch (error) {
        console.error("WITHDRAWAL_PATCH_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
