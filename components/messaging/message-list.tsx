"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Conversation } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface MessageListProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
}

export function MessageList({ conversations, activeConversationId, onSelectConversation }: MessageListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredConversations = conversations.filter((conv) => {
    const otherParticipant = conv.participants[1] // Assuming logged in user is first
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           conv.listingTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {filteredConversations.map((conv) => {
            const otherParticipant = conv.participants[1]
            const isActive = activeConversationId === conv.id
            const date = new Date(conv.lastMessage.timestamp)

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 ${
                  isActive ? "bg-muted" : ""
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={otherParticipant?.avatar} alt={otherParticipant?.name} />
                    <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {otherParticipant?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-0.5 border-2 border-background">
                      <div className="w-2 h-2" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold truncate">{otherParticipant?.name}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(date, { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  {conv.listingTitle && (
                    <div className="text-xs text-teal-600 font-medium truncate mb-1">
                      {conv.listingTitle}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage.content}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="ml-2 bg-teal-600 hover:bg-teal-700 rounded-full h-5 w-5 flex items-center justify-center p-0">
                    {conv.unreadCount}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
