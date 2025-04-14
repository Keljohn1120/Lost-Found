import { getServerSession } from "next-auth/next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import type { Item } from "@/types"
import { prisma } from "@/lib/db"

export default async function MyReportsPage() {
  const session = await getServerSession()
  const userId = Number.parseInt(session?.user?.id || "0")

  const lostItems = await getUserItems(userId, "lost")
  const foundItems = await getUserItems(userId, "found")

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Reports</h1>
        <Link href="/report-item">
          <Button className="bg-[#932e1d] hover:bg-[#7a2617]">Report New Item</Button>
        </Link>
      </div>

      <Tabs defaultValue="lost" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
        </TabsList>

        <TabsContent value="lost">
          <Card>
            <CardHeader>
              <CardTitle>Lost Items</CardTitle>
              <CardDescription>Items you have reported as lost</CardDescription>
            </CardHeader>
            <CardContent>
              {lostItems.length > 0 ? (
                <div className="space-y-4">
                  {lostItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={
                            item.imageUrl ||
                            `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.title.charAt(0))}`
                          }
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{item.title}</p>
                          <Badge
                            className={
                              item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : item.status === "claimed"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-green-100 text-green-800 hover:bg-green-100"
                            }
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.location && `${item.location} • `}
                          Reported on {new Date(item.dateReported).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/items/${item.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">You haven't reported any lost items yet.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="found">
          <Card>
            <CardHeader>
              <CardTitle>Found Items</CardTitle>
              <CardDescription>Items you have reported as found</CardDescription>
            </CardHeader>
            <CardContent>
              {foundItems.length > 0 ? (
                <div className="space-y-4">
                  {foundItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={
                            item.imageUrl ||
                            `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.title.charAt(0))}`
                          }
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{item.title}</p>
                          <Badge
                            className={
                              item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : item.status === "claimed"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-green-100 text-green-800 hover:bg-green-100"
                            }
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.location && `${item.location} • `}
                          Found on {new Date(item.dateReported).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/items/${item.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">You haven't reported any found items yet.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function getUserItems(userId: number, type: string) {
  try {
    const items = await prisma.item.findMany({
      where: { userId, type },
      orderBy: { dateReported: "desc" },
      include: { category: true },
    })

    return items as Item[]
  } catch (error) {
    console.error(`Error fetching user ${type} items:`, error)
    return []
  }
}
