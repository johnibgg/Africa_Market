import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
        }

        const userId = session.user.id as string

        // Fetch messages where the user is either sender or receiver
        // We want to get the unique other participants
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            orderBy: { createdAt: "desc" },
            include: {
                sender: {
                    select: { id: true, name: true, image: true, isVerified: true }
                },
                receiver: {
                    select: { id: true, name: true, image: true, isVerified: true }
                }
            }
        })

        // Group by conversation (the other person)
        const conversationsMap = new Map()

        messages.forEach(msg => {
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender
            if (!conversationsMap.has(otherUser.id)) {
                conversationsMap.set(otherUser.id, {
                    id: otherUser.id,
                    participants: [
                        { id: userId, name: session.user?.name, avatar: session.user?.image },
                        { id: otherUser.id, name: otherUser.name, avatar: otherUser.image, isVerified: otherUser.isVerified }
                    ],
                    lastMessage: {
                        content: msg.content,
                        timestamp: msg.createdAt,
                    },
                    unreadCount: 0 // Simplification for now
                })
            }
        })

        return NextResponse.json(Array.from(conversationsMap.values()))
    } catch (error) {
        console.error("CONVERSATIONS_GET_ERROR", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
    }
}
