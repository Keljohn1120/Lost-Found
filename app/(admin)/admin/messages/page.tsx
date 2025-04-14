import { getServerSession } from "next-auth/next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { AdminMessageList } from "@/components/admin-message-list"
import { AdminChatBox } from "@/components/admin-chat-box"
import type { User, Message } from "@/types"

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession()
  const adminId = Number.parseInt(session?.user?.id || "0")
  const selectedUserId = searchParams.user ? Number.parseInt(searchParams.user as string) : null

  // Get users who have conversations with the admin
  const users = await getUsersWithConversations(adminId)

  // Get the selected user (if any)
  let selectedUser = null
  if (selectedUserId) {
    selectedUser = (await prisma.user.findUnique({
      where: { id: selectedUserId },
    })) as User | null
  } else if (users.length > 0) {
    // Default to the first user
    selectedUser = users[0]
  }

  // Get messages between the admin and the selected user
  const messages = selectedUser ? await getMessagesBetweenUsers(adminId, selectedUser.id) : []

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-[#932e1d] text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Link href="/">
          <Button variant="outline" className="text-white border-white hover:bg-[#7a2617] hover:text-white">
            Log out
          </Button>
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* User list */}
        <div className="w-1/4 border-r bg-white overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          <div>
            {users.map((user) => (
              <a
                key={user.id}
                href={`/admin/messages?user=${user.id}`}
                className={`flex items-center gap-2 p-3 hover:bg-muted transition-colors ${
                  selectedUser?.id === user.id ? "bg-muted" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate w-40">{user.lastMessage}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center gap-3 bg-white">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              {/* Messages */}
              <AdminMessageList messages={messages} adminId={adminId} />

              {/* Chat input */}
              <AdminChatBox receiverId={selectedUser.id} senderId={adminId} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/10">
              <Card className="w-2/3 max-w-md">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Select a user from the sidebar to start a conversation.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

async function getUsersWithConversations(adminId: number) {
  try {
    // Get unique users who have exchanged messages with the admin
    const sentMessages = await prisma.message.findMany({
      where: { senderId: adminId },
      select: { receiverId: true },
      distinct: ["receiverId"],
    })

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: adminId },
      select: { senderId: true },
      distinct: ["senderId"],
    })

    // Combine unique user IDs
    const userIds = [...sentMessages.map((msg) => msg.receiverId), ...receivedMessages.map((msg) => msg.senderId)]

    // Remove duplicates
    const uniqueUserIds = [...new Set(userIds)]

    // Get user details and last message for each conversation
    const users = await Promise.all(
      uniqueUserIds.map(async (id) => {
        const user = await prisma.user.findUnique({
          where: { id },
        })

        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: adminId, receiverId: id },
              { senderId: id, receiverId: adminId },
            ],
          },
          orderBy: { createdAt: "desc" },
        })

        return {
          id,
          name: user?.name || "Unknown User",
          email: user?.email || "",
          lastMessage: lastMessage?.content || "",
          lastMessageDate: lastMessage?.createdAt || new Date(),
        }
      }),
    )

    // Sort by last message date
    return users.sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime())
  } catch (error: any) {
    console.error("Error fetching users with conversations:", error)
    return []
  }
}

async function getMessagesBetweenUsers(userId1: number, userId2: number) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: true,
        receiver: true,
      },
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId2,
        receiverId: userId1,
        isRead: false,
      },
      data: { isRead: true },
    })

    return messages as Message[]
  } catch (error: any) {
    console.error("Error fetching messages:", error)
    return []
  }
}
