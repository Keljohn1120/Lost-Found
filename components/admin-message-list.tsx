"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/types"
import { cn } from "@/lib/utils"

interface AdminMessageListProps {
  messages: Message[]
  adminId: number
}

export function AdminMessageList({ messages, adminId }: AdminMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          No messages yet. Start the conversation!
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.senderId === adminId ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                  message.senderId === adminId ? "bg-[#932e1d] text-white rounded-br-none" : "bg-muted rounded-bl-none",
                )}
              >
                <p>{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    message.senderId === adminId ? "text-white/70" : "text-muted-foreground",
                  )}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}
