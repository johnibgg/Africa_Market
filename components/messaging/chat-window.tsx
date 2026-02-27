"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Image, MoreVertical, Phone, Info } from "lucide-react"
import { Conversation, Message, User } from "@/lib/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ChatWindowProps {
    conversation: Conversation
    messages: Message[]
    currentUser: User
    onSendMessage: (content: string) => void
}

export function ChatWindow({ conversation, messages, currentUser, onSendMessage }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[1]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage)
            setNewMessage("")
        }
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
                        <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">{otherParticipant?.name}</h3>
                        {conversation.listingTitle && (
                            <p className="text-xs text-teal-600 font-medium truncate max-w-[200px]">
                                {conversation.listingTitle}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Info className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    <div className="text-center my-4">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            Aujourd'hui
                        </span>
                    </div>

                    {messages.map((msg) => {
                        const isMe = msg.senderId === currentUser.id
                        const timestamp = new Date(msg.timestamp)

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${isMe
                                        ? "bg-teal-600 text-white rounded-tr-none"
                                        : "bg-muted text-foreground rounded-tl-none"
                                        }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                    <div
                                        className={`text-[10px] mt-1 ${isMe ? "text-teal-100 text-right" : "text-muted-foreground"
                                            }`}
                                    >
                                        {format(timestamp, "HH:mm")}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                    className="flex items-center gap-2"
                >
                    <Button variant="ghost" size="icon" type="button" className="text-muted-foreground">
                        <Image className="h-5 w-5" />
                    </Button>
                    <Input
                        placeholder="Écrivez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 rounded-full"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full bg-teal-600 hover:bg-teal-700 h-10 w-10 shrink-0"
                        disabled={!newMessage.trim()}
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
