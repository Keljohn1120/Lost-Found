import { getServerSession } from "next-auth/next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Info, Check } from "lucide-react"

export default async function NotificationsPage() {
  const session = await getServerSession()
  const userId = Number.parseInt(session?.user?.id || "0")

  const notifications = await getUserNotifications(userId)

  async function markAllAsRead() {
    "use server"
    try {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      })

      revalidatePath("/notifications")
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {notifications.some((n) => !n.isRead) && (
          <form action={markAllAsRead}>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </form>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
          <CardDescription>Updates and alerts related to your lost and found items</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg ${notification.isRead ? "bg-white" : "bg-muted/30"}`}
                >
                  <div className={`rounded-full p-2 ${notification.isRead ? "bg-muted" : "bg-[#932e1d]/10"}`}>
                    {notification.isRead ? (
                      <Check className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Info className="h-4 w-4 text-[#932e1d]" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-sm ${!notification.isRead && "font-medium"}`}>{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                You don't have any notifications yet. When you get notifications about your lost or found items, they
                will appear here.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

async function getUserNotifications(userId: number) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return notifications
  } catch (error) {
    console.error("Error fetching user notifications:", error)
    return []
  }
}
