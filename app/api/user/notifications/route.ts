import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id as string },
            orderBy: { createdAt: "desc" },
            take: 20
        })

        return NextResponse.json(notifications)
    } catch (error) {
        console.error("NOTIFICATIONS_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const { id } = await req.json()

        if (id) {
            await prisma.notification.update({
                where: { id, userId: session.user.id as string },
                data: { isRead: true }
            })
        } else {
            // Mark all as read
            await prisma.notification.updateMany({
                where: { userId: session.user.id as string, isRead: false },
                data: { isRead: true }
            })
        }

        return NextResponse.json({ message: "Succès" })
    } catch (error) {
        console.error("NOTIFICATIONS_PATCH_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
