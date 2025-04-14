import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth/next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Item } from "@/types"
import { prisma } from "@/lib/db"
import { Info } from "lucide-react"
import type { Notification as PrismaNotification } from "@prisma/client";

export default async function Dashboard() {
  const session = await getServerSession()
  const userId = Number.parseInt(session?.user?.id || "0")

  const recentLostItems = await getRecentItems("lost", 3)
  const recentFoundItems = await getRecentItems("found", 3)
  const userStats = await getUserStats(userId)
  const notifications = await getRecentNotifications(userId)

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div>
            <p className="font-medium">{session?.user?.name}</p>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* User stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.totalReports}</div>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.lostItems}</div>
              <p className="text-xs text-muted-foreground">Lost Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.foundItems}</div>
              <p className="text-xs text-muted-foreground">Found Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.resolvedItems}</div>
              <p className="text-xs text-muted-foreground">Resolved Items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Your latest activity updates</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification: PrismaNotification) => (
                <div key={notification.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="bg-muted rounded-full p-2">
                    <Info className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}

            </div> 
          ) : (
            <Alert>
              <AlertTitle>No recent notifications</AlertTitle>
              <AlertDescription>
                You don't have any notifications yet. When you get notifications, they will appear here.
              </AlertDescription>
            </Alert>
          )}
          {notifications.length > 0 && (
            <div className="mt-4 text-center">
              <Link href="/notifications">
                <Button variant="outline" size="sm">
                  View All Notifications
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lost items */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Lost Items</CardTitle>
            <CardDescription>Recently reported lost items</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLostItems.length > 0 ? (
              <div className="space-y-4">
                {recentLostItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={
                          item.imageUrl ||
                          `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.title.charAt(0)) || "/placeholder.svg"}`
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{item.title}</p>
                        <Badge variant="outline" className="ml-2 text-red-500 border-red-200">
                          Lost
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.location && `${item.location} • `}
                        {item.dateLostOrFound ? new Date(item.dateLostOrFound).toLocaleDateString() : "Unknown date"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No lost items found</div>
            )}
          </CardContent>
        </Card>

        {/* Found items */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Found Items</CardTitle>
            <CardDescription>Recently reported found items</CardDescription>
          </CardHeader>
          <CardContent>
            {recentFoundItems.length > 0 ? (
              <div className="space-y-4">
                {recentFoundItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={
                          item.imageUrl ||
                          `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.title.charAt(0)) || "/placeholder.svg"}`
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{item.title}</p>
                        <Badge variant="outline" className="ml-2 text-green-500 border-green-200">
                          Found
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.location && `${item.location} • `}
                        {item.dateLostOrFound ? new Date(item.dateLostOrFound).toLocaleDateString() : "Unknown date"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No found items found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function getRecentItems(type: string, limit: number) {
  try {
    const items = await prisma.item.findMany({
      where: { type },
      take: limit,
      orderBy: { dateReported: "desc" },
      include: { category: true },
    })

    return items as Item[]
  } catch (error: any) {
    console.error(`Error fetching recent ${type} items:`, error)
    return []
  }
}

async function getUserStats(userId: number) {
  try {
    const totalReports = await prisma.item.count({
      where: { userId },
    })

    const lostItems = await prisma.item.count({
      where: { userId, type: "lost" },
    })

    const foundItems = await prisma.item.count({
      where: { userId, type: "found" },
    })

    const resolvedItems = await prisma.item.count({
      where: { userId, status: "resolved" },
    })

    return { totalReports, lostItems, foundItems, resolvedItems }
  } catch (error: any) {
    console.error("Error fetching user stats:", error)
    return { totalReports: 0, lostItems: 0, foundItems: 0, resolvedItems: 0 }
  }
}

async function getRecentNotifications(userId: number) {
  try {
    const notifications = await prisma.notification.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
      })

    return notifications
  } catch (error: any) {
    console.error("Error fetching recent notifications:", error)
    return []
  }
}