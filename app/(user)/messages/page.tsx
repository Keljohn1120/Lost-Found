import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getServerSession } from "next-auth/next"
import { MessageList } from "@/components/message-list"
import { ChatBox } from "@/components/chat-box"
import { prisma } from "@/lib/db"
import type { Message, User } from "@/types"

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession()
  const userId = Number.parseInt(session?.user?.id || "0")
  const selectedContactId = searchParams.contact ? Number.parseInt(searchParams.contact as string) : null

  // Get the current user's conversations
  const conversations = await getUserConversations(userId)

  // Get admin users for the user to contact
  const adminUsers = await getAdminUsers()

  // Get the selected contact (if any)
  let selectedContact = null
  if (selectedContactId) {
    selectedContact = (await prisma.user.findUnique({
      where: { id: selectedContactId },
    })) as User | null
  } else if (adminUsers.length > 0) {
    // Default to the first admin
    selectedContact = adminUsers[0]
  }

  // Get messages between the current user and the selected contact
  const messages = selectedContact ? await getMessagesBetweenUsers(userId, selectedContact.id) : []

  return (
    <div className="flex h-screen">
      {/* Contact list */}
      <div className="w-1/4 border-r">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
          {/* Admin contacts */}
          <div className="p-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Admin Support</h3>
            {adminUsers.map((admin) => (
              <a
                key={admin.id}
                href={`/messages?contact=${admin.id}`}
                className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors ${
                  selectedContact?.id === admin.id ? "bg-muted" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#932e1d]/10 flex items-center justify-center text-[#932e1d]">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </a>
            ))}
          </div>

          {/* User conversations */}
          {conversations.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase px-2 py-1">Conversations</h3>
              {conversations.map((convo) => (
                <a
                  key={convo.id}
                  href={`/messages?contact=${convo.id}`}
                  className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors ${
                    selectedContact?.id === convo.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {convo.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{convo.name}</p>
                    <p className="text-xs text-muted-foreground truncate w-40">{convo.lastMessage}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {selectedContact.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{selectedContact.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedContact.role === "admin" ? "Admin Support" : ""}
                </p>
              </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} currentUserId={userId} />

            {/* Chat input */}
            <ChatBox receiverId={selectedContact.id} senderId={userId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-2/3 max-w-md">
              <CardHeader>
                <CardTitle>No conversation selected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Select a contact from the sidebar to start a conversation.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

async function getUserConversations(userId: number) {
  try {
    // Get unique users the current user has exchanged messages with
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ["receiverId"],
    })

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ["senderId"],
    })

    // Combine unique user IDs
    const userIds = [...sentMessages.map((msg) => msg.receiverId), ...receivedMessages.map((msg) => msg.senderId)]

    // Remove duplicates
    const uniqueUserIds = [...new Set(userIds)]

    // Get user details and last message for each conversation
    const conversations = await Promise.all(
      uniqueUserIds.map(async (id) => {
        const user = await prisma.user.findUnique({
          where: { id },
        })

        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: id },
              { senderId: id, receiverId: userId },
            ],
          },
          orderBy: { createdAt: "desc" },
        })

        return {
          id,
          name: user?.name || "Unknown User",
          lastMessage: lastMessage?.content || "",
          lastMessageDate: lastMessage?.createdAt || new Date(),
        }
      }),
    )

    // Sort by last message date
    return conversations.sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime())
  } catch (error) {
    console.error("Error fetching user conversations:", error)
    return []
  }
}

async function getAdminUsers() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
    })

    return admins as User[]
  } catch (error) {
    console.error("Error fetching admin users:", error)
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
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}
