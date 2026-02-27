"use client"

import { useState } from "react"
import { MessageList } from "@/components/messaging/message-list"
import { ChatWindow } from "@/components/messaging/chat-window"
import { conversations as mockConversations, messages as mockMessages, users } from "@/lib/mock-data"
import { Message } from "@/lib/types"

export default function MessagesPage() {
    const currentUser = users[4] // Using Jean-Baptiste Houessou as current user
    const [activeConversationId, setActiveConversationId] = useState<string | null>(mockConversations[0].id)
    const [messages, setMessages] = useState<Message[]>(mockMessages)

    const activeConversation = mockConversations.find(c => c.id === activeConversationId)

    // Filter messages for the active conversation
    const filteredMessages = messages.filter(m =>
        (m.senderId === currentUser.id && m.receiverId === activeConversation?.participants.find(p => p.id !== currentUser.id)?.id) ||
        (m.receiverId === currentUser.id && m.senderId === activeConversation?.participants.find(p => p.id !== currentUser.id)?.id)
    )

    const handleSendMessage = (content: string) => {
        if (!activeConversation) return

        const otherParticipant = activeConversation.participants.find(p => p.id !== currentUser.id)
        if (!otherParticipant) return

        const newMessage: Message = {
            id: `m${Date.now()}`,
            senderId: currentUser.id,
            receiverId: otherParticipant.id,
            content,
            timestamp: new Date().toISOString(),
            isRead: false
        }

        setMessages([...messages, newMessage])
    }

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-200px)] min-h-[600px]">
            <div className="bg-white rounded-xl shadow-sm border h-full flex overflow-hidden">
                <div className="w-1/3 min-w-[300px]">
                    <MessageList
                        conversations={mockConversations}
                        activeConversationId={activeConversationId}
                        onSelectConversation={setActiveConversationId}
                    />
                </div>
                <div className="flex-1">
                    {activeConversation ? (
                        <ChatWindow
                            conversation={activeConversation}
                            messages={filteredMessages}
                            currentUser={currentUser}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Sélectionnez une conversation pour commencer à discuter
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
