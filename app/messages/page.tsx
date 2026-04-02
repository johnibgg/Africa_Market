"use client"

import { useState, useEffect } from "react"
import { MessageList } from "@/components/messaging/message-list"
import { ChatWindow } from "@/components/messaging/chat-window"
import { useAuth } from "@/lib/context/auth-context"
import { Loader2 } from "lucide-react"
import { Message, Conversation } from "@/lib/types"

export default function MessagesPage() {
    const { user: currentUser, isAuthenticated } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch("/api/conversations")
                if (res.ok) {
                    const data = await res.json()
                    const safeData = Array.isArray(data) ? data : []
                    setConversations(safeData)
                    if (safeData.length > 0 && !activeConversationId) {
                        setActiveConversationId(safeData[0].id)
                    }
                }
            } catch (err) {
                console.error("Error fetching conversations", err)
            } finally {
                setIsLoading(false)
            }
        }

        if (isAuthenticated) {
            fetchConversations()
        }
    }, [isAuthenticated])

    // Fetch messages for active conversation
    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeConversationId) return
            try {
                const res = await fetch(`/api/messages?userId=${activeConversationId}`)
                if (res.ok) {
                    const data = await res.json()
                    const safeData = Array.isArray(data) ? data : []
                    setMessages(safeData)
                }
            } catch (err) {
                console.error("Error fetching messages", err)
            }
        }

        if (isAuthenticated && activeConversationId) {
            fetchMessages()
        }
    }, [activeConversationId, isAuthenticated])

    const activeConversation = conversations.find(c => c.id === activeConversationId)

    const handleSendMessage = async (content: string) => {
        if (!activeConversation || !currentUser) return

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: activeConversation.id,
                    content
                })
            })

            if (res.ok) {
                const newMessage = await res.json()
                // Update local messages
                setMessages(prev => [...prev, {
                    ...newMessage,
                    timestamp: newMessage.createdAt
                }])

                // Update conversation's last message
                setConversations(prev => prev.map(c => {
                    if (c.id === activeConversation.id) {
                        return {
                            ...c,
                            lastMessage: {
                                id: newMessage.id,
                                senderId: newMessage.senderId,
                                receiverId: newMessage.receiverId,
                                content: content,
                                timestamp: new Date().toISOString(),
                                isRead: false
                            }
                        }
                    }
                    return c
                }))
            }
        } catch (err) {
            console.error("Failed to send message", err)
        }
    }

    if (!isAuthenticated || !currentUser) {
        return (
            <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                Veuillez vous connecter pour voir vos messages.
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-200px)] min-h-[600px]">
            <div className="bg-white rounded-xl shadow-sm border h-full flex overflow-hidden">
                <div className="w-1/3 min-w-[300px]">
                    <MessageList
                        conversations={conversations}
                        activeConversationId={activeConversationId}
                        onSelectConversation={setActiveConversationId}
                    />
                </div>
                <div className="flex-1">
                    {activeConversation ? (
                        <ChatWindow
                            conversation={activeConversation}
                            messages={messages}
                            currentUser={currentUser}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
                            Vous n'avez pas encore de conversation. <br />
                            Contactez un vendeur pour commencer !
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
