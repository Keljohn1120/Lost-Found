"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface AdminChatBoxProps {
  senderId: number
  receiverId: number
}

export function AdminChatBox({ senderId, receiverId }: AdminChatBoxProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setIsSending(true)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
          receiverId,
          senderId,
        }),
      })

      if (response.ok) {
        setMessage("")
        // Force refresh to show new message
        window.location.reload()
      } else {
        console.error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="p-4 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSending || !message.trim()}
          className="bg-[#932e1d] hover:bg-[#7a2617]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
