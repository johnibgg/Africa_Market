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
        const { amount, method, phone, bankInfo } = body

        if (!amount || amount <= 0) {
            return NextResponse.json({ message: "Montant invalide" }, { status: 400 })
        }

        // 1. Check user balance
        const user = await prisma.user.findUnique({
            where: { id: session.user.id as string }
        })

        if (!user || user.balance < amount) {
            return NextResponse.json({ message: "Solde insuffisant" }, { status: 400 })
        }

        // 2. Create withdrawal request and deduct balance
        const withdrawal = await prisma.$transaction([
            prisma.withdrawal.create({
                data: {
                    userId: user.id,
                    amount,
                    method,
                    phone,
                    bankInfo,
                    status: "PENDING"
                }
            }),
            prisma.user.update({
                where: { id: user.id },
                data: {
                    balance: { decrement: amount }
                }
            })
        ])

        return NextResponse.json(withdrawal[0])
    } catch (error) {
        console.error("WITHDRAWAL_POST_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const withdrawals = await prisma.withdrawal.findMany({
            where: { userId: session.user.id as string },
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json(withdrawals)
    } catch (error) {
        console.error("WITHDRAWALS_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
