import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, receiverId, senderId } = await request.json()

    // Basic validation
    if (!content || !receiverId || !senderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content,
        receiverId,
        senderId,
        isRead: false,
      },
    })

    // Create notification for the receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        message: `New message from ${session.user.name}`,
        isRead: false,
      },
    })

    return NextResponse.json(
      {
        message: "Message sent successfully",
        data: message,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
