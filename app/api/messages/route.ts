import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const otherUserId = searchParams.get("userId")

        if (!otherUserId) {
            return NextResponse.json({ message: "UserId manquant" }, { status: 400 })
        }

        const userId = session.user.id as string

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: "asc" }
        })

        return NextResponse.json(messages.map(m => ({
            id: m.id,
            senderId: m.senderId,
            receiverId: m.receiverId,
            content: m.content,
            timestamp: m.createdAt,
            isRead: m.isRead
        })))
    } catch (error) {
        console.error("MESSAGES_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const { receiverId, content } = await req.json()

        if (!receiverId || !content) {
            return NextResponse.json({ message: "Contenu ou destinataire manquant" }, { status: 400 })
        }

        const userId = session.user.id as string

        const message = await prisma.message.create({
            data: {
                senderId: userId,
                receiverId,
                content
            }
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error("MESSAGE_SEND_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
